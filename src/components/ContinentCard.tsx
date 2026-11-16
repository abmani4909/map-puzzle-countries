import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import theme from '../constants/theme';
import type { Continent, ContinentId } from '../data/countries';
import usePressScale from '../hooks/usePressScale';

type Props = {
  continent: Continent;
  count: number;
  selected: boolean;
  completed: boolean;
  compact?: boolean;
  onSelect: (id: ContinentId) => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export function ContinentCard({
  continent,
  count,
  selected,
  completed,
  compact = false,
  onSelect,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);
  const height = compact ? 48 : 72;
  const glyph = compact ? 26 : 32;

  const handlePress = React.useCallback(() => {
    onSelect(continent.id);
  }, [onSelect, continent.id]);

  return (
    <Pressable
      style={[styles.press, { height }]}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={continent.name + ', ' + count + ' countries'}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.card,
          { height },
          selected ? styles.selected : null,
          { transform: [{ scale }] },
        ]}>
        <View style={[styles.glyphWrap, { width: glyph, height: glyph }]}>
          <Svg width={glyph} height={glyph} viewBox="0 0 100 100">
            <Path
              d={continent.silhouette}
              fill={selected ? theme.colors.brand.berry : theme.colors.brand.paper}
              stroke={selected ? theme.colors.brand.berry : theme.colors.ui.border}
              strokeWidth={2}
              strokeLinejoin="round"
            />
          </Svg>
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.name} numberOfLines={1}>
            {continent.name}
          </Text>
          {compact ? null : (
            <Text style={styles.count} numberOfLines={1}>
              {count} countries
            </Text>
          )}
        </View>
        {selected ? (
          <View style={styles.check}>
            <Check size={16} color={theme.colors.brand.berry} strokeWidth={3} />
          </View>
        ) : null}
        {completed ? <View style={styles.doneDot} /> : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { flex: 1 },
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    ...theme.shadows.card,
  },
  selected: {
    borderWidth: 2,
    borderColor: theme.colors.brand.berry,
    backgroundColor: theme.colors.bg.accent,
    paddingHorizontal: 9,
    paddingVertical: 9,
  },
  glyphWrap: { alignItems: 'center', justifyContent: 'center' },
  textWrap: { flex: 1, marginLeft: theme.spacing.sm },
  name: {
    fontSize: theme.typography.cardLabel.fontSize,
    lineHeight: theme.typography.cardLabel.lineHeight,
    fontWeight: theme.typography.cardLabel.fontWeight,
    color: theme.colors.text.primary,
  },
  count: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: theme.typography.caption.fontWeight,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  check: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneDot: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.brand.lime,
  },
});

export default React.memo(ContinentCard);
