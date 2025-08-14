import {
  dislikesAdapter,
  dislikesReducer,
  dislikesActions,
  initialDislikesState,
  dislikesSelectors,
} from './dislikes.slice';

describe('dislikes slice', () => {
  describe('reducer', () => {
    it('should handle initial state', () => {
      const expected = dislikesAdapter.getInitialState();
      expect(dislikesReducer(undefined, { type: '' })).toEqual(expected);
    });

    it('should handle dislike', () => {
      const action = dislikesActions.dislike({
        id: 1,
        lines: ['joke'],
        dateAdded: 1,
      });
      const state = dislikesReducer(initialDislikesState, action);
      expect(state.entities[1]).toEqual({
        id: 1,
        lines: ['joke'],
        dateAdded: 1,
      });
    });

    it('should handle remove', () => {
      const action = dislikesActions.dislike({
        id: 1,
        lines: ['joke'],
        dateAdded: 1,
      });
      let state = dislikesReducer(initialDislikesState, action);
      const removeAction = dislikesActions.remove(1);
      state = dislikesReducer(state, removeAction);
      expect(state.entities[1]).toBeUndefined();
    });

    it('should handle clear', () => {
      const action = dislikesActions.dislike({
        id: 1,
        lines: ['joke'],
        dateAdded: 1,
      });
      let state = dislikesReducer(initialDislikesState, action);
      const clearAction = dislikesActions.clear();
      state = dislikesReducer(state, clearAction);
      expect(state.ids.length).toBe(0);
    });
  });

  describe('selectors', () => {
    const rootState = {
      dislikes: {
        ids: [1],
        entities: {
          1: { id: 1, lines: ['joke'], dateAdded: 1 },
        },
      },
    };

    it('should select all dislikes', () => {
      const result = dislikesSelectors.selectAllDislikes(rootState);
      expect(result.length).toBe(1);
    });

    it('should select dislike by id', () => {
      const result = dislikesSelectors.getDisikeById(1)(rootState);
      expect(result).toEqual({ id: 1, lines: ['joke'], dateAdded: 1 });
    });

    it('should check if disliked', () => {
      const result = dislikesSelectors.isDisliked(1)(rootState);
      expect(result).toBe(true);
    });
  });
});
