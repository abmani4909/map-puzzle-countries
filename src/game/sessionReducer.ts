export type Phase =
  | 'ready'
  | 'dragging'
  | 'returning'
  | 'fact'
  | 'reviewing'
  | 'paused'
  | 'completed';

export type SessionState = {
  /** Country codes already placed, in placement order. */
  placed: string[];
  /** Index of the piece currently in the tray. */
  index: number;
  errors: number;
  hints: number;
  assisted: boolean;
  phase: Phase;
  /** Piece index whose fact sheet is open, -1 when none. */
  factIndex: number;
  /** Country code opened in review mode, null when none. */
  reviewCode: string | null;
  hintActive: boolean;
  toast: string | null;
};

export type SessionAction =
  | { type: 'pickup' }
  | { type: 'cancel' }
  | { type: 'miss' }
  | { type: 'place'; code: string }
  | { type: 'next'; total: number }
  | { type: 'review'; code: string }
  | { type: 'closeReview' }
  | { type: 'hint' }
  | { type: 'hintEnd' }
  | { type: 'toastEnd' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'reset' };

export const initialSession: SessionState = {
  placed: [],
  index: 0,
  errors: 0,
  hints: 0,
  assisted: false,
  phase: 'ready',
  factIndex: -1,
  reviewCode: null,
  hintActive: false,
  toast: null,
};

export function sessionReducer(
  state: SessionState,
  action: SessionAction,
): SessionState {
  switch (action.type) {
    case 'pickup':
      if (state.phase !== 'ready') return state;
      return { ...state, phase: 'dragging', toast: null };

    case 'cancel':
      if (state.phase !== 'dragging' && state.phase !== 'returning') return state;
      return { ...state, phase: 'ready' };

    case 'miss':
      if (state.phase !== 'dragging') return state;
      return {
        ...state,
        phase: 'returning',
        errors: state.errors + 1,
        toast: 'Try a little closer',
      };

    case 'place':
      if (state.phase !== 'dragging') return state;
      if (state.placed.indexOf(action.code) !== -1) return state;
      return {
        ...state,
        phase: 'fact',
        placed: state.placed.concat(action.code),
        factIndex: state.index,
        hintActive: false,
        toast: null,
      };

    case 'next': {
      const nextIndex = state.index + 1;
      if (nextIndex >= action.total) {
        return { ...state, phase: 'completed', factIndex: -1 };
      }
      return { ...state, phase: 'ready', index: nextIndex, factIndex: -1 };
    }

    case 'review':
      if (state.phase !== 'ready') return state;
      return { ...state, phase: 'reviewing', reviewCode: action.code };

    case 'closeReview':
      if (state.phase !== 'reviewing') return state;
      return { ...state, phase: 'ready', reviewCode: null };

    case 'hint':
      if (state.phase !== 'ready' && state.phase !== 'dragging') return state;
      return {
        ...state,
        hints: state.hints + 1,
        assisted: true,
        hintActive: true,
      };

    case 'hintEnd':
      return state.hintActive ? { ...state, hintActive: false } : state;

    case 'toastEnd':
      return state.toast === null ? state : { ...state, toast: null };

    case 'pause':
      if (state.phase === 'completed' || state.phase === 'paused') return state;
      return { ...state, phase: 'paused', toast: null };

    case 'resume':
      if (state.phase !== 'paused') return state;
      return { ...state, phase: 'ready' };

    case 'reset':
      return initialSession;

    default:
      return state;
  }
}
