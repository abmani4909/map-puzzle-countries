import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TOP_INSET } from '../constants/config';
import theme from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  variant?: 'plain' | 'band';
  align?: 'left' | 'center';
};

/**
 * The one header used by every screen. Screens differ by their slots and
 * variant, never by re-implementing the markup.
 */
export function ScreenHeader({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  variant = 'plain',
  align = 'left',
}: Props) {
  const centred = align === 'center';
  return (
    <View style={[styles.root, variant === 'band' ? styles.band : null]}>
      <View style={styles.row}>
        <View style={styles.slot}>{leftSlot}</View>
        <View style={[styles.titleWrap, centred ? styles.titleCentred : null]}>
          <Text
            style={[styles.title, centred ? styles.textCentred : null]}
            numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[styles.subtitle, centred ? styles.textCentred : null]}
              numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={styles.slot}>{rightSlot}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: TOP_INSET,
    paddingHorizontal: theme.spacing.lg,
  },
  band: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.border,
    paddingBottom: theme.spacing.sm,
  },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  slot: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    paddingHorizontal: theme.spacing.sm,
  },
  titleCentred: { alignItems: 'center' },
  title: {
    fontSize: theme.typography.titleCompact.fontSize,
    lineHeight: theme.typography.titleCompact.lineHeight,
    fontWeight: theme.typography.titleCompact.fontWeight,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  textCentred: { textAlign: 'center' },
});

export default ScreenHeader;
