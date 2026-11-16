import React, { useCallback, useMemo } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, Target, Timer } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import assets from '../assets';
import AppBackground from '../components/AppBackground';
import ContinentCard from '../components/ContinentCard';
import IconButton from '../components/IconButton';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import StatCard from '../components/StatCard';
import { BOTTOM_INSET } from '../constants/config';
import theme from '../constants/theme';
import { CONTINENTS, continentById, countriesOf } from '../data/countries';
import type { ContinentId } from '../data/countries';
import { recordsFor } from '../game/records';
import type { RecordEntry } from '../game/types';
import { formatClock, formatDate } from '../utils/formatTime';

type Props = {
  records: RecordEntry[];
  selectedContinent: ContinentId;
  onSelectContinent: (id: ContinentId) => void;
  onStart: () => void;
  onBack: () => void;
};

const ROW_H = 56;

function RecordRow({ rank, record }: { rank: number; record: RecordEntry }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rank}>{rank}</Text>
      <Text style={styles.time}>{formatClock(record.elapsedMs)}</Text>
      <Text style={styles.errors}>{record.errors} err</Text>
      <Text style={styles.date}>{formatDate(record.completedAt)}</Text>
    </View>
  );
}

export function BestTimesScreen({
  records,
  selectedContinent,
  onSelectContinent,
  onStart,
  onBack,
}: Props) {
  const mine = useMemo(
    () => recordsFor(records, selectedContinent),
    [records, selectedContinent],
  );
  const continent = continentById(selectedContinent);

  const renderRow = useCallback(
    ({ item, index }: { item: RecordEntry; index: number }) => (
      <RecordRow rank={index + 1} record={item} />
    ),
    [],
  );

  const keyExtractor = useCallback((item: RecordEntry) => item.runId, []);
  const getItemLayout = useCallback(
    (_data: ArrayLike<RecordEntry> | null | undefined, index: number) => ({
      length: ROW_H,
      offset: ROW_H * index,
      index,
    }),
    [],
  );

  return (
    <AppBackground variant="records">
      <ScreenHeader
        title="Best Times"
        subtitle="Timed - no hints"
        leftSlot={
          <IconButton accessibilityLabel="Back to continents" onPress={onBack}>
            <ArrowLeft size={24} color={theme.colors.brand.berry} strokeWidth={2.2} />
          </IconButton>
        }
      />

      <View style={styles.body}>
        <View style={styles.grid}>
          {[0, 1, 2].map(row => (
            <View key={'row-' + row} style={styles.gridRow}>
              {CONTINENTS.slice(row * 2, row * 2 + 2).map(item => (
                <ContinentCard
                  key={item.id}
                  continent={item}
                  count={countriesOf(item.id).length}
                  selected={selectedContinent === item.id}
                  completed={false}
                  compact
                  onSelect={onSelectContinent}
                />
              ))}
            </View>
          ))}
        </View>

        {mine.length > 0 ? (
          <View style={styles.statsRow}>
            <View style={styles.statSlot}>
              <StatCard
                Icon={Timer}
                value={formatClock(mine[0].elapsedMs)}
                label="best time"
                valueColor={theme.colors.brand.berry}
              />
            </View>
            <View style={styles.statSlot}>
              <StatCard
                Icon={Target}
                value={String(mine.length)}
                label="runs kept"
                valueColor="#5E8F1C"
              />
            </View>
          </View>
        ) : null}

        <View style={styles.surface}>
          {mine.length > 0 ? (
            <FlatList
              data={mine}
              renderItem={renderRow}
              keyExtractor={keyExtractor}
              getItemLayout={getItemLayout}
              windowSize={5}
              ItemSeparatorComponent={Separator}
            />
          ) : (
            <View style={styles.empty}>
              <View style={styles.emptyArt}>
                <Svg width={72} height={72} viewBox="0 0 100 100">
                  <Path
                    d={continent.silhouette}
                    fill={theme.colors.bg.accent}
                    stroke={theme.colors.ui.border}
                    strokeWidth={2.2}
                    strokeLinejoin="round"
                  />
                </Svg>
                <Image
                  source={assets.sprite3}
                  style={styles.emptySprite}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.emptyTitle}>Your first record is waiting</Text>
              <Text style={styles.emptyBody}>
                Finish this continent in Timed mode without hints
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.footer}>Records stay on this device</Text>
        <PrimaryButton
          label={mine.length > 0 ? 'PLAY TIMED' : 'START PUZZLE'}
          Icon={Timer}
          onPress={onStart}
          accessibilityLabel={'Start ' + continent.name + ' in Timed mode'}
        />
      </View>
    </AppBackground>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: BOTTOM_INSET,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  grid: { gap: theme.spacing.sm },
  gridRow: { flexDirection: 'row', gap: theme.spacing.md },
  statsRow: { flexDirection: 'row', gap: theme.spacing.md },
  statSlot: { flex: 1 },
  surface: {
    flex: 1,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.shadows.card,
  },
  row: {
    height: ROW_H,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rank: {
    width: 24,
    fontSize: theme.typography.cardLabel.fontSize,
    lineHeight: 20,
    fontWeight: '800',
    color: theme.colors.text.secondary,
  },
  time: {
    flex: 1,
    fontSize: theme.typography.section.fontSize,
    lineHeight: theme.typography.section.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  errors: {
    width: 64,
    fontSize: theme.typography.caption.fontSize,
    lineHeight: 16,
    fontWeight: '500',
    color: theme.colors.text.muted,
  },
  date: {
    width: 96,
    textAlign: 'right',
    fontSize: theme.typography.caption.fontSize,
    lineHeight: 16,
    fontWeight: '500',
    color: theme.colors.text.muted,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.ui.divider,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyArt: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySprite: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 22,
    height: 22,
    opacity: 0.9,
  },
  emptyTitle: {
    fontSize: theme.typography.section.fontSize,
    lineHeight: theme.typography.section.lineHeight,
    fontWeight: theme.typography.section.fontWeight,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: theme.typography.instruction.fontSize,
    lineHeight: theme.typography.instruction.lineHeight,
    fontWeight: theme.typography.instruction.fontWeight,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  footer: {
    fontSize: theme.typography.instruction.fontSize,
    lineHeight: theme.typography.instruction.lineHeight,
    fontWeight: theme.typography.instruction.fontWeight,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
});

export default BestTimesScreen;
