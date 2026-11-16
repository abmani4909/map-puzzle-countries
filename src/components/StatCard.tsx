import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import type { IconComponent } from './icon';

type Props = {
  Icon: IconComponent;
  value: string;
  label: string;
  valueColor: string;
};

/**
 * Raised metric tile. Every tile in a row has identical geometry - the icon
 * canvas is fixed by the vector library and only colour carries the semantics.
 */
export function StatCard({ Icon, value, label, valueColor }: Props) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View style={[styles.iconWrap, { backgroundColor: valueColor + '1A' }]}>
        <Icon size={22} color={valueColor} strokeWidth={2.5} />
      </View>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    backgroundColor: theme.colors.bg.secondary,
    ...theme.shadows.card,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  value: {
    fontSize: theme.typography.value.fontSize,
    lineHeight: theme.typography.value.lineHeight,
    fontWeight: theme.typography.value.fontWeight,
  },
  label: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    marginTop: 2,
  },
});

export default React.memo(StatCard);
