import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LogOut, Play, RotateCcw } from 'lucide-react-native';
import theme from '../constants/theme';
import BottomSheet from './BottomSheet';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

type Props = {
  visible: boolean;
  summary: string;
  reducedMotion: boolean;
  onResume: () => void;
  onRestart: () => void;
  onSaveExit: () => void;
};

export function PauseSheet({
  visible,
  summary,
  reducedMotion,
  onResume,
  onRestart,
  onSaveExit,
}: Props) {
  return (
    <BottomSheet
      visible={visible}
      onScrimPress={onResume}
      reducedMotion={reducedMotion}
      minHeight={280}>
      <Text style={styles.title} accessibilityRole="header">
        Puzzle paused
      </Text>
      <Text style={styles.body}>{summary}</Text>
      <View style={styles.actions}>
        <PrimaryButton label="RESUME" Icon={Play} onPress={onResume} />
        <View style={styles.row}>
          <SecondaryButton
            label="RESTART AGAIN"
            Icon={RotateCcw}
            onPress={onRestart}
            flex
          />
          <SecondaryButton
            label="SAVE AND EXIT"
            Icon={LogOut}
            onPress={onSaveExit}
            flex
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: theme.typography.titleCompact.fontSize,
    lineHeight: theme.typography.titleCompact.lineHeight,
    fontWeight: theme.typography.titleCompact.fontWeight,
    color: theme.colors.text.primary,
  },
  body: {
    fontSize: theme.typography.instruction.fontSize,
    lineHeight: theme.typography.instruction.lineHeight,
    fontWeight: theme.typography.instruction.fontWeight,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.sm,
  },
  actions: { marginTop: theme.spacing.xl, gap: theme.spacing.md },
  row: { flexDirection: 'row', gap: theme.spacing.sm },
});

export default PauseSheet;
