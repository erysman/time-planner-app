import Animated, { SharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

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