import {
  viewedJokesAdapter,
  viewedJokesReducer,
  viewedJokesActions,
  initialViewedJokesState,
  viewJokesSelectors,
} from './viewed-jokes.slice';

describe('viewedJokes slice', () => {
  describe('reducer', () => {
    it('should handle initial state', () => {
      const expected = viewedJokesAdapter.getInitialState();
      expect(viewedJokesReducer(undefined, { type: '' })).toEqual(expected);
    });

    it('should handle add', () => {
      const action = viewedJokesActions.add({ id: 1, lines: ['joke'] });
      const state = viewedJokesReducer(initialViewedJokesState, action);
      expect(state.entities[1]).toEqual({ id: 1, lines: ['joke'] });
    });

    it('should handle remove', () => {
      const action = viewedJokesActions.add({ id: 1, lines: ['joke'] });
      let state = viewedJokesReducer(initialViewedJokesState, action);
      const removeAction = viewedJokesActions.remove(1);
      state = viewedJokesReducer(state, removeAction);
      expect(state.entities[1]).toBeUndefined();
    });
  });

  describe('selectors', () => {
    const rootState = {
      viewedJokes: {
        ids: [1, 2],
        entities: {
          1: { id: 1, lines: ['joke 1'] },
          2: { id: 2, lines: ['joke 2'] },
        },
      },
    };

    it('should select last viewed joke', () => {
      const result = viewJokesSelectors.getLastViewedJoke(rootState);
      expect(result).toEqual({ id: 2, lines: ['joke 2'] });
    });
  });
});
