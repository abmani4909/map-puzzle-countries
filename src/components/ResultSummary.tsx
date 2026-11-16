import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import type { RoundResult } from '../game/types';
import { formatClock } from '../utils/formatTime';

type Props = {
  result: RoundResult;
};

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/** One raised card holding every round metric, including the zero-valued ones. */
export function ResultSummary({ result }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Metric label="Time" value={formatClock(result.elapsedMs)} />
        <View style={styles.vline} />
        <Metric label="Errors" value={String(result.errors)} />
      </View>
      <View style={styles.hline} />
      <View style={styles.row}>
        <Metric label="Countries" value={result.placed + ' / ' + result.total} />
        <View style={styles.vline} />
        <Metric label="Hints" value={String(result.hints)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.raised,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  metric: { flex: 1, alignItems: 'center', paddingVertical: theme.spacing.sm },
  vline: {
    width: 1,
    height: 36,
    backgroundColor: theme.colors.ui.divider,
  },
  hline: {
    height: 1,
    backgroundColor: theme.colors.ui.divider,
    marginVertical: theme.spacing.sm,
  },
  value: {
    fontSize: theme.typography.value.fontSize,
    lineHeight: theme.typography.value.lineHeight,
    fontWeight: theme.typography.value.fontWeight,
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.text.muted,
    marginTop: 2,
  },
});

export default ResultSummary;
