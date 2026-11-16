import React, { useCallback, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { ArrowLeft, Hand, Move, Trash2 } from 'lucide-react-native';
import AppBackground from '../components/AppBackground';
import BottomSheet from '../components/BottomSheet';
import IconButton from '../components/IconButton';
import ModeSelector from '../components/ModeSelector';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import { BOTTOM_INSET } from '../constants/config';
import theme from '../constants/theme';
import { ATTRIBUTION } from '../data/countries';
import type { PlayMode, Settings } from '../game/types';

type Props = {
  settings: Settings;
  onUpdate: (settings: Settings) => void;
  onResetProgress: () => void;
  onBack: () => void;
};

function ToggleRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowBody} numberOfLines={1}>
          {description}
        </Text>
      </View>
      <View style={styles.switchWrap}>
        <Switch
          value={value}
          onValueChange={onChange}
          thumbColor={value ? theme.colors.brand.berry : theme.colors.bg.secondary}
          trackColor={{
            false: theme.colors.ui.border,
            true: theme.colors.bg.accent,
          }}
          accessibilityLabel={label}
        />
      </View>
    </View>
  );
}

export function SettingsScreen({
  settings,
  onUpdate,
  onResetProgress,
  onBack,
}: Props) {
  const [confirm, setConfirm] = useState(false);

  const setMode = useCallback(
    (mode: PlayMode) => onUpdate({ ...settings, mode }),
    [onUpdate, settings],
  );
  const setSound = useCallback(
    (sound: boolean) => onUpdate({ ...settings, sound }),
    [onUpdate, settings],
  );
  const setMotion = useCallback(
    (reducedMotion: boolean) => onUpdate({ ...settings, reducedMotion }),
    [onUpdate, settings],
  );
  const setDrag = useCallback(
    () => onUpdate({ ...settings, placement: 'drag' }),
    [onUpdate, settings],
  );
  const setTap = useCallback(
    () => onUpdate({ ...settings, placement: 'tap' }),
    [onUpdate, settings],
  );

  const openConfirm = useCallback(() => setConfirm(true), []);
  const closeConfirm = useCallback(() => setConfirm(false), []);
  const doReset = useCallback(() => {
    setConfirm(false);
    onResetProgress();
  }, [onResetProgress]);

  return (
    <AppBackground variant="settings">
      <ScreenHeader
        title="Settings"
        leftSlot={
          <IconButton accessibilityLabel="Back to continents" onPress={onBack}>
            <ArrowLeft size={24} color={theme.colors.brand.berry} strokeWidth={2.2} />
          </IconButton>
        }
      />

      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Play mode</Text>
          <ModeSelector value={settings.mode} onChange={setMode} />
          <Text style={styles.rowBody}>
            {settings.mode === 'relaxed'
              ? 'Relaxed: explore at your pace'
              : 'Timed: record your active placing time'}
          </Text>
        </View>

        <View style={styles.card}>
          <ToggleRow
            label="Sound effects"
            description="Quiet success feedback"
            value={settings.sound}
            onChange={setSound}
          />
          <View style={styles.divider} />
          <ToggleRow
            label="Reduced motion"
            description="Fades instead of movement"
            value={settings.reducedMotion}
            onChange={setMotion}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Placement</Text>
          <View style={styles.row}>
            <SecondaryButton
              label="Drag"
              Icon={Move}
              selected={settings.placement === 'drag'}
              onPress={setDrag}
              flex
            />
            <SecondaryButton
              label="Tap"
              Icon={Hand}
              selected={settings.placement === 'tap'}
              onPress={setTap}
              flex
            />
          </View>
        </View>

        <View style={styles.spacer} />

        <Text style={styles.attribution} numberOfLines={3}>
          {ATTRIBUTION}
        </Text>
        <SecondaryButton
          label="Reset local progress"
          Icon={Trash2}
          onPress={openConfirm}
        />
      </View>

      <BottomSheet
        visible={confirm}
        onScrimPress={closeConfirm}
        reducedMotion={settings.reducedMotion}
        minHeight={240}>
        <Text style={styles.cardTitle}>Clear completed continents and best times?</Text>
        <Text style={styles.rowBody}>
          Preferences are kept. Records and completion marks are removed.
        </Text>
        <View style={styles.confirmActions}>
          <PrimaryButton label="KEEP PROGRESS" onPress={closeConfirm} />
          <SecondaryButton label="CLEAR PROGRESS" Icon={Trash2} onPress={doReset} />
        </View>
      </BottomSheet>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: BOTTOM_INSET,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  card: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    ...theme.shadows.card,
  },
  cardTitle: {
    fontSize: theme.typography.cardLabel.fontSize,
    lineHeight: theme.typography.cardLabel.lineHeight,
    fontWeight: theme.typography.cardLabel.fontWeight,
    color: theme.colors.text.primary,
  },
  row: { flexDirection: 'row', gap: theme.spacing.sm },
  toggleRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: { flex: 1 },
  rowLabel: {
    fontSize: theme.typography.cardLabel.fontSize,
    lineHeight: theme.typography.cardLabel.lineHeight,
    fontWeight: theme.typography.cardLabel.fontWeight,
    color: theme.colors.text.primary,
  },
  rowBody: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: theme.typography.caption.fontWeight,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  switchWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: 1, backgroundColor: theme.colors.ui.divider },
  spacer: { flex: 1 },
  attribution: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: theme.typography.caption.fontWeight,
    color: theme.colors.text.faint,
  },
  confirmActions: { marginTop: theme.spacing.xl, gap: theme.spacing.md },
});

export default SettingsScreen;
