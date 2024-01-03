import Animated, { SharedValue, useDerivedValue, useSharedValue } from "react-native-reanimated";

interface AreaBoundries {
  top: number;
  bottom: number;
}

type ScrollDirection = "up" | "down" | null;

export const useDragScrollArea = (
  viewTop: SharedValue<number>,
  viewHeight: SharedValue<number>,
  scrollViewContentHeight: number,
  scrollOffset: SharedValue<number>
) => {
  const areaHeight = viewHeight.value * 0.15;
  const upAreaBaseBoundries = {
    top: viewTop.value,
    bottom: viewTop.value + areaHeight,
  } as AreaBoundries;
  const downAreaBaseBoundries = {
    top: viewTop.value + viewHeight.value - areaHeight,
    bottom: viewTop.value + viewHeight.value,
  } as AreaBoundries;

  const SCROLL_ACTIVATION_THRESHOLD_MS = 300; 
  const currentScrollDirection = useSharedValue<ScrollDirection>(null);
  const activeScrollDirection = useSharedValue<ScrollDirection>(null);
  const scrollActivationTimestamp = useSharedValue<number>(0);
  const scrollVelocity = 300; //px/s
  const scrollTargetY = useSharedValue<number | null>(scrollOffset.value);
  const scrollDuration = useSharedValue(0);
  const isScrollActive = useDerivedValue(() => activeScrollDirection.value !== null)

  function isTaskTooLarge(itemPosition: { top: number; bottom: number }) {
    "worklet";
    const itemHeight = itemPosition.top - itemPosition.bottom;
    return itemHeight > viewHeight.value - 2 * areaHeight;
  }

  function isInsideArea(position: number, areaBoundries: AreaBoundries) {
    "worklet";
    return position >= areaBoundries.top && position <= areaBoundries.bottom;
  }

  function getScrollTargetPosition(
    activeScrollDirection: ScrollDirection,
    scrollOffset: number,
    scrollViewContentHeight: number
  ) {
    "worklet";
    if (activeScrollDirection === "up") {
      return { targetPosition: 0, distance: scrollOffset };
    }
    if (activeScrollDirection === "down") {
      const targetPosition = scrollViewContentHeight - viewHeight.value;
      return { targetPosition, distance: targetPosition - scrollOffset };
    }
    return { targetPosition: 0, distance: 0 };
  }

  function cancelScroll() {
    "worklet";
    currentScrollDirection.value = null;
    activeScrollDirection.value = null;
    scrollTargetY.value = null;
  }

  function activateScroll() {
    "worklet";
    console.log(`activate scroll!`);
    activeScrollDirection.value = currentScrollDirection.value;
    const { targetPosition, distance } = getScrollTargetPosition(
      activeScrollDirection.value,
      scrollOffset.value,
      scrollViewContentHeight
    );
    scrollDuration.value = (distance / scrollVelocity) * 1000;
    scrollTargetY.value = targetPosition;
    console.log("isScrollActive", isScrollActive.value)
  }

  function activateScrollIfItemInsideScrollArea(
    itemPosition: { top: number; bottom: number }
  ) {
    "worklet";
    if (isTaskTooLarge(itemPosition)) {
      return;
    }
    const isInsideUpArea = isInsideArea(itemPosition.top, upAreaBaseBoundries);
    const isInsideDownArea = isInsideArea(
      itemPosition.bottom,
      downAreaBaseBoundries
    );
    if (!isInsideUpArea && !isInsideDownArea && currentScrollDirection.value) {
      cancelScroll();
    }
    if (isInsideUpArea && currentScrollDirection.value !== "up") {
      currentScrollDirection.value = "up";
      activeScrollDirection.value = null;
      scrollActivationTimestamp.value = Date.now();
    }
    if (isInsideDownArea && currentScrollDirection.value !== "down") {
      currentScrollDirection.value = "down";
      activeScrollDirection.value = null;
      scrollActivationTimestamp.value = Date.now();
    }
    if (
      currentScrollDirection.value !== null &&
      currentScrollDirection.value !== activeScrollDirection.value &&
      Date.now() - scrollActivationTimestamp.value > SCROLL_ACTIVATION_THRESHOLD_MS
    ) {
      activateScroll();
    }
  }

  return {
    activateScrollIfItemInsideScrollArea,
    cancelScroll,
    scrollTargetY,
    scrollDuration,
    isScrollActive,
  };
};
