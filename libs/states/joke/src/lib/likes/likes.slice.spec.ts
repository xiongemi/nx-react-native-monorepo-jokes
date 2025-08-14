import {
  likesAdapter,
  likesReducer,
  likesActions,
  initialLikesState,
  likesSelectors,
} from './likes.slice';

describe('likes slice', () => {
  describe('reducer', () => {
    it('should handle initial state', () => {
      const expected = likesAdapter.getInitialState();
      expect(likesReducer(undefined, { type: '' })).toEqual(expected);
    });

    it('should handle like', () => {
      const action = likesActions.like({
        id: 1,
        lines: ['joke'],
        dateAdded: 1,
      });
      const state = likesReducer(initialLikesState, action);
      expect(state.entities[1]).toEqual({
        id: 1,
        lines: ['joke'],
        dateAdded: 1,
      });
    });

    it('should handle remove', () => {
      const action = likesActions.like({
        id: 1,
        lines: ['joke'],
        dateAdded: 1,
      });
      let state = likesReducer(initialLikesState, action);
      const removeAction = likesActions.remove(1);
      state = likesReducer(state, removeAction);
      expect(state.entities[1]).toBeUndefined();
    });

    it('should handle clear', () => {
      const action = likesActions.like({
        id: 1,
        lines: ['joke'],
        dateAdded: 1,
      });
      let state = likesReducer(initialLikesState, action);
      const clearAction = likesActions.clear();
      state = likesReducer(state, clearAction);
      expect(state.ids.length).toBe(0);
    });
  });

  describe('selectors', () => {
    const rootState = {
      likes: {
        ids: [1],
        entities: {
          1: { id: 1, lines: ['joke'], dateAdded: 1 },
        },
      },
    };

    it('should select all likes', () => {
      const result = likesSelectors.selectAllLikes(rootState);
      expect(result.length).toBe(1);
    });

    it('should select like by id', () => {
      const result = likesSelectors.getLikeById(1)(rootState);
      expect(result).toEqual({ id: 1, lines: ['joke'], dateAdded: 1 });
    });

    it('should check if liked', () => {
      const result = likesSelectors.isLiked(1)(rootState);
      expect(result).toBe(true);
    });
  });
});
