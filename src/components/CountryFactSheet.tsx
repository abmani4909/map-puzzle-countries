import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import type { Piece } from '../game/types';
import BottomSheet from './BottomSheet';
import CountryShape from './CountryShape';
import PrimaryButton from './PrimaryButton';

type Props = {
  piece: Piece | null;
  lastPiece: boolean;
  reviewOnly: boolean;
  reducedMotion: boolean;
  onContinue: () => void;
};

/** Name and capital of the country that was just placed. Never auto-dismisses. */
export function CountryFactSheet({
  piece,
  lastPiece,
  reviewOnly,
  reducedMotion,
  onContinue,
}: Props) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!piece) {
      setArmed(false);
      return undefined;
    }
    setArmed(false);
    const id = setTimeout(() => setArmed(true), reducedMotion ? 100 : 180);
    return () => clearTimeout(id);
  }, [piece, reducedMotion]);

  const label = reviewOnly ? 'BACK TO MAP' : lastPiece ? 'SEE RESULTS' : 'NEXT COUNTRY';

  return (
    <BottomSheet
      visible={piece !== null}
      onScrimPress={armed ? onContinue : undefined}
      reducedMotion={reducedMotion}>
      {piece ? (
        <View>
          <View style={styles.head}>
            <View style={styles.shapeWrap}>
              <CountryShape
                region={piece.region}
                width={56}
                height={56}
                fill={theme.colors.bg.accent}
                stroke={theme.colors.brand.berry}
                strokeWidth={1.8}
              />
            </View>
            <View style={styles.headText}>
              <Text style={styles.kicker}>COUNTRY</Text>
              <Text
                style={styles.name}
                accessibilityRole="header"
                numberOfLines={2}>
                {piece.country.name}
              </Text>
            </View>
          </View>

          <View style={styles.capitalBlock}>
            <Text style={styles.capitalLabel}>Capital</Text>
            <Text style={styles.capital} numberOfLines={3}>
              {piece.country.capital}
            </Text>
            {piece.country.note ? (
              <Text style={styles.note}>{piece.country.note}</Text>
            ) : null}
          </View>

          <PrimaryButton
            label={label}
            onPress={onContinue}
            disabled={!armed}
            accessibilityLabel={label}
          />
        </View>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center' },
  shapeWrap: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headText: { flex: 1, marginLeft: theme.spacing.md },
  kicker: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
  name: {
    fontSize: theme.typography.title.fontSize,
    lineHeight: theme.typography.title.lineHeight,
    fontWeight: theme.typography.title.fontWeight,
    color: theme.colors.text.primary,
    marginTop: 2,
  },
  capitalBlock: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  capitalLabel: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: theme.colors.text.secondary,
  },
  capital: {
    fontSize: theme.typography.section.fontSize,
    lineHeight: theme.typography.section.lineHeight,
    fontWeight: theme.typography.section.fontWeight,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
  },
  note: {
    fontSize: theme.typography.instruction.fontSize,
    lineHeight: theme.typography.instruction.lineHeight,
    fontWeight: '400',
    color: theme.colors.text.muted,
    marginTop: theme.spacing.sm,
  },
});

export default CountryFactSheet;
