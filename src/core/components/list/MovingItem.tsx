import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";

export const MovingItem = (props: {
    id: string | null;
    itemHeight: number;
    movingItemWindowTop: SharedValue<number>;
    renderItem: (id: string) => React.ReactNode;
  }) => {
    const { movingItemWindowTop, id, itemHeight, renderItem } = props;
  
    const style = useAnimatedStyle(() => {
      return {
        top: movingItemWindowTop.value - itemHeight / 2,
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
            height: itemHeight,
          },
          style,
        ]}
      >
        {renderItem(id)}
      </Animated.View>
    );
  };