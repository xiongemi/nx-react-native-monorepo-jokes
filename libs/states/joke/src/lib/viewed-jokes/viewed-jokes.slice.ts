import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';

export const VIEWED_JOKES_FEATURE_KEY = 'viewedJokes';

export interface ViewedJokesEntity {
  id: number;
  lines: string[];
}

export type ViewedJokesState = EntityState<ViewedJokesEntity>;

export const viewedJokesAdapter = createEntityAdapter<ViewedJokesEntity>();

export const initialViewedJokesState: ViewedJokesState =
  viewedJokesAdapter.getInitialState();

export const viewedJokesSlice = createSlice({
  name: VIEWED_JOKES_FEATURE_KEY,
  initialState: initialViewedJokesState,
  reducers: {
    add: viewedJokesAdapter.addOne,
    remove: viewedJokesAdapter.removeOne,
  },
});

/*
 * Export reducer for store configuration.
 */
export const viewedJokesReducer = viewedJokesSlice.reducer;

export const viewedJokesActions = viewedJokesSlice.actions;

const { selectAll } = viewedJokesAdapter.getSelectors();

const getViewedJokesState = (rootState: {
  [VIEWED_JOKES_FEATURE_KEY]: ViewedJokesState;
}): ViewedJokesState => rootState[VIEWED_JOKES_FEATURE_KEY];

const getViewedJokes = createSelector(getViewedJokesState, selectAll);

const getLastViewedJoke = createSelector(getViewedJokes, (viewedJokes) => {
  if (viewedJokes.length > 2) {
    return viewedJokes[viewedJokes.length - 2];
  }
  return undefined;
});

export const viewJokesSelectors = {
  getLastViewedJoke,
};
