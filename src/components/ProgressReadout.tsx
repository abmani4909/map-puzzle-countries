import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import type { PlayMode } from '../game/types';
import { formatStopwatch } from '../utils/formatTime';

type Props = {
  placed: number;
  total: number;
  errors: number;
  mode: PlayMode;
  elapsedMs: number;
  assisted: boolean;
};

/**
 * Textual progress band. Zero errors are shown explicitly - nothing here is an
 * empty placeholder tile.
 */
export function ProgressReadout({
  placed,
  total,
  errors,
  mode,
  elapsedMs,
  assisted,
}: Props) {
  return (
    <View style={styles.root}>
      <Text style={styles.strong} numberOfLines={1}>
        Placed {placed} of {total}
      </Text>
      <View style={styles.divider} />
      <Text style={styles.muted} numberOfLines={1}>
        Errors {errors}
      </Text>
      <View style={styles.spacer} />
      {assisted ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Assisted</Text>
        </View>
      ) : null}
      {mode === 'timed' ? (
        <Text style={styles.clock} numberOfLines={1}>
          {formatStopwatch(elapsedMs)}
        </Text>
      ) : (
        <Text style={styles.muted} numberOfLines={1}>
          Take your time
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  strong: {
    fontSize: theme.typography.instruction.fontSize,
    lineHeight: theme.typography.instruction.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  muted: {
    fontSize: theme.typography.instruction.fontSize,
    lineHeight: theme.typography.instruction.lineHeight,
    fontWeight: theme.typography.instruction.fontWeight,
    color: theme.colors.text.muted,
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: theme.colors.ui.border,
    marginHorizontal: theme.spacing.md,
  },
  spacer: { flex: 1 },
  badge: {
    height: 22,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.ui.berrySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  badgeText: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: 16,
    fontWeight: '700',
    color: theme.colors.brand.berry,
  },
  clock: {
    fontSize: theme.typography.clock.fontSize,
    lineHeight: theme.typography.clock.lineHeight,
    fontWeight: theme.typography.clock.fontWeight,
    letterSpacing: theme.typography.clock.letterSpacing,
    color: theme.colors.brand.berry,
    fontVariant: ['tabular-nums'],
  },
});

export default ProgressReadout;
