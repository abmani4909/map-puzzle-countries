import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { GestureResponderHandlers } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Hand, Lightbulb, Move } from 'lucide-react-native';
import { BOTTOM_INSET, DOCK_CONTENT_H } from '../constants/config';
import theme from '../constants/theme';
import type { Piece, PlacementStyle } from '../game/types';
import PieceTray from './PieceTray';
import SecondaryButton from './SecondaryButton';

type Props = {
  piece: Piece | null;
  placement: PlacementStyle;
  selected: boolean;
  dragging: boolean;
  disabled: boolean;
  panHandlers: GestureResponderHandlers;
  onHint: () => void;
  onSelectPiece: () => void;
  onPlacementChange: (style: PlacementStyle) => void;
};

/** Bottom dock: instruction, piece tray, then hint and placement controls. */
export function GameDock({
  piece,
  placement,
  selected,
  dragging,
  disabled,
  panHandlers,
  onHint,
  onSelectPiece,
  onPlacementChange,
}: Props) {
  const togglePlacement = useCallback(() => {
    onPlacementChange(placement === 'drag' ? 'tap' : 'drag');
  }, [onPlacementChange, placement]);

  const instruction =
    placement === 'drag'
      ? 'Drag this country into place'
      : selected
      ? 'Now tap its place on the map'
      : 'Tap the piece, then tap the map';

  return (
    <LinearGradient
      colors={theme.gradients.dock}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.dock}>
      <Text style={styles.instruction} numberOfLines={1}>
        {instruction}
      </Text>
      <PieceTray
        piece={piece}
        placement={placement}
        selected={selected}
        hidden={dragging}
        panHandlers={panHandlers}
        onPress={onSelectPiece}
      />
      <View style={styles.row}>
        <SecondaryButton
          label="Hint"
          Icon={Lightbulb}
          onPress={onHint}
          disabled={disabled}
          flex
          accessibilityLabel="Show a hint outline for this country"
        />
        <SecondaryButton
          label={placement === 'drag' ? 'Drag mode' : 'Tap mode'}
          Icon={placement === 'drag' ? Move : Hand}
          onPress={togglePlacement}
          flex
          accessibilityLabel={'Placement style, currently ' + placement + ' mode'}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  dock: {
    height: DOCK_CONTENT_H + BOTTOM_INSET + 8,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: BOTTOM_INSET + 8,
    paddingTop: theme.spacing.md,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.border,
    ...theme.shadows.dock,
  },
  instruction: {
    height: 24,
    fontSize: theme.typography.instruction.fontSize,
    lineHeight: 24,
    fontWeight: theme.typography.instruction.fontWeight,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
});

export default GameDock;
