import { useEffect, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Separator, YStack } from "tamagui";
import { useScreenDimensions } from "../../dimensions/UseScreenDimensions";

type ListItem = { id: string };

type DraggableListProps<T extends ListItem> = {
  items: T[];
  itemsOrder: string[];
  setItemsOrder: (itemsOrder: string[]) => void;
  renderItem: (id: string) => React.ReactNode;
};

export const DraggableList = <T extends ListItem>({
  items,
  itemsOrder,
  setItemsOrder,
  renderItem,
}: DraggableListProps<T>) => {
  const itemHeight = 55;
  const { panGesture, movingItemsOrder, movingItemId, dragY, pointerIndex } =
    useDraggableList(itemHeight, itemsOrder, setItemsOrder);
  return (
    <YStack>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          collapsable={false}
          style={[
            {
              flexDirection: "column",
            },
          ]}
        >
          {items.map((task) => {
            return (
              <MovableItem
                key={task.id}
                id={task.id}
                itemHeight={itemHeight}
                itemsOrder={movingItemsOrder}
                renderItem={renderItem}
              />
            );
          })}
        </Animated.View>
      </GestureDetector>
      <MovingItem
        dragY={dragY}
        id={movingItemId}
        renderItem={renderItem}
        itemHeight={itemHeight}
      />
      <MovingItemPointer
        itemHeight={itemHeight}
        visible={!!movingItemId}
        pointerIndex={pointerIndex}
      />
    </YStack>
  );
};

function unsetItemOrderWorklet(
  indexToRemove: number,
  movingTasksOrder: SharedValue<string[]>
) {
  "worklet";
  const prev = movingTasksOrder.value;
  const newList = [...prev];
  newList.splice(indexToRemove, 1);
  console.log("unsetItemOrderWorklet: prev: ", prev, "newList: ", newList);
  movingTasksOrder.value = newList;
}

function setItemOrderWorklet(
  indexToAdd: number,
  itemId: string,
  movingTasksOrder: SharedValue<string[]>
) {
  "worklet";
  const prev = movingTasksOrder.value;
  const newList = [...prev];
  newList.splice(indexToAdd, 0, itemId);
  console.log("setItemOrderWorklet: prev: ", prev, "newList: ", newList);
  movingTasksOrder.value = newList;
}

export const useDraggableList = (
  itemHeight: number,
  itemsOrder: string[],
  setItemsOrder: (itemsOrder: string[]) => void
) => {
  const { headerHeight } = useScreenDimensions();
  const dragY = useSharedValue<number>(0);
  const pointerIndex = useSharedValue<number | null>(null);
  const movingItemsOrder = useSharedValue<string[]>(itemsOrder);
  const movingItemId = useSharedValue<string | null>(null);
  const [movingItemIdState, setMovingItemIdState] = useState<string | null>(
    null
  );

  useEffect(() => {
    console.log("use effect, itemsOrder changed,", itemsOrder);
    movingItemsOrder.value = itemsOrder;
  }, [JSON.stringify(itemsOrder)]);

  useAnimatedReaction(
    () => movingItemId.value,
    (current, prev) => {
      if (prev !== current) {
        runOnJS(setMovingItemIdState)(current);
      }
    }
  );

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      dragY.value = e.absoluteY - headerHeight;
      const pressedItemIndex = Math.floor(e.y / itemHeight);
      const pressedItemId = movingItemsOrder.value[pressedItemIndex];
      if (!pressedItemId) {
        return;
      }
      console.log(`pressed item id: `, pressedItemId);
      pointerIndex.value = pressedItemIndex;
      movingItemId.value = pressedItemId;
      unsetItemOrderWorklet(pressedItemIndex, movingItemsOrder);
    })
    .onChange((e) => {
      if (!movingItemId.value) {
        return;
      }
      dragY.value = e.absoluteY - headerHeight;
      const newPointer = Math.min(
        movingItemsOrder.value.length,
        Math.max(0, Math.floor(dragY.value / itemHeight))
      );
      if (pointerIndex.value === newPointer) {
        return;
      }
      pointerIndex.value = newPointer;
    })
    .onEnd(() => {
      if (!movingItemId.value || pointerIndex.value === null) {
        return;
      }
      console.log(`press released`);
      dragY.value = withTiming(pointerIndex.value * itemHeight);
      setItemOrderWorklet(
        pointerIndex.value,
        movingItemId.value,
        movingItemsOrder
      );
      movingItemId.value = null;
      pointerIndex.value = null;
      runOnJS(setItemsOrder)(movingItemsOrder.value);
    });
  return {
    panGesture,
    movingItemsOrder,
    movingItemId: movingItemIdState,
    dragY,
    pointerIndex,
  };
};

export const MovableItem = (props: {
  id: string;
  itemHeight: number;
  itemsOrder: SharedValue<string[]>;
  renderItem: (id: string) => React.ReactNode;
}) => {
  const { id, itemHeight, itemsOrder, renderItem } = props;
  const style = useAnimatedStyle(() => {
    const index = itemsOrder.value.findIndex((currentId) => currentId === id);
    if (index === -1) {
      return {
        display: "none",
      };
    }
    return {
      display: "flex",
      top: withTiming(index * itemHeight, { duration: 100 }),
    };
  });

  return (
    <Animated.View
      style={[
        { position: "absolute", width: "100%", height: itemHeight },
        style,
      ]}
    >
      {renderItem(id)}
    </Animated.View>
  );
};

export const MovingItem = (props: {
  id: string | null;
  itemHeight: number;
  dragY: SharedValue<number>;
  renderItem: (id: string) => React.ReactNode;
}) => {
  const { dragY, id, itemHeight, renderItem } = props;

  const style = useAnimatedStyle(() => {
    return {
      top: dragY.value - itemHeight / 2,
    };
  });

  if (!id) {
    return null;
  }

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: "100%",
          height: itemHeight
        },
        style,
      ]}
    >
      {renderItem(id)}
    </Animated.View>
  );
};

export const AnimatedSeparator = Animated.createAnimatedComponent(Separator);

type MovingItemPointerProps = {
  visible: boolean;
  pointerIndex: SharedValue<number | null>;
  itemHeight: number;
};

export const MovingItemPointer = ({
  visible,
  pointerIndex,
  itemHeight,
}: MovingItemPointerProps) => {
  const separatorStyle = useAnimatedStyle(() => ({
    top: withTiming((pointerIndex.value || 0) * itemHeight, { duration: 50 }),
    display: pointerIndex.value === null ? "none" : "flex",
  }));
  if (!visible) {
    return null;
  }
  return (
    <AnimatedSeparator
      position={"absolute"}
      borderBottomWidth={2}
      width={"100%"}
      borderColor={"red"}
      style={[separatorStyle]}
    />
  );
};
