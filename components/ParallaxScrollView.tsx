import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  mode: string; // Add mode prop
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  mode, // Destructure mode prop
}: Props) {

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
      opacity: interpolate(
        scrollOffset.value,
        [0, HEADER_HEIGHT],
        [1, 0.4]
      ),
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: mode === 'light' ? "#FFFAFA" : "#121212" }]}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.header,
            headerAnimatedStyle,
          ]}>
          {headerImage}
        </Animated.View>
        <View style={styles.content}>{children}</View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 250,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 22,
    gap: 16,
    overflow: 'hidden',
  },
});
