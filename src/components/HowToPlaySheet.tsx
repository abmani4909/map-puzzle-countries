import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import assets from '../assets';
import theme from '../constants/theme';
import BottomSheet from './BottomSheet';
import PrimaryButton from './PrimaryButton';

type Props = {
  visible: boolean;
  reducedMotion: boolean;
  onClose: () => void;
};

const STEPS = [
  { art: assets.sprite1, title: 'Pick up the piece', body: 'One country waits in the dock.' },
  { art: assets.sprite2, title: 'Match its place', body: 'Drop it onto its outline on the map.' },
  { art: assets.sprite5, title: 'Learn the name', body: 'Its name and capital appear.' },
];

export function HowToPlaySheet({ visible, reducedMotion, onClose }: Props) {
  return (
    <BottomSheet
      visible={visible}
      onScrimPress={onClose}
      reducedMotion={reducedMotion}
      minHeight={300}>
      <Text style={styles.title} accessibilityRole="header">
        How to play
      </Text>
      <View style={styles.steps}>
        {STEPS.map((step, i) => (
          <View key={step.title} style={styles.step}>
            <View style={styles.artWrap}>
              <Image source={step.art} style={styles.art} resizeMode="contain" />
            </View>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>
                {i + 1}. {step.title}
              </Text>
              <Text style={styles.stepBody}>{step.body}</Text>
            </View>
          </View>
        ))}
      </View>
      <PrimaryButton label="GOT IT" onPress={onClose} />
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
  steps: { marginTop: theme.spacing.lg, marginBottom: theme.spacing.xl, gap: theme.spacing.md },
  step: { flexDirection: 'row', alignItems: 'center' },
  artWrap: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg.accent,
  },
  art: { width: 32, height: 32 },
  stepText: { flex: 1, marginLeft: theme.spacing.md },
  stepTitle: {
    fontSize: theme.typography.cardLabel.fontSize,
    lineHeight: theme.typography.cardLabel.lineHeight,
    fontWeight: theme.typography.cardLabel.fontWeight,
    color: theme.colors.text.primary,
  },
  stepBody: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: theme.typography.caption.fontWeight,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
});

export default HowToPlaySheet;
