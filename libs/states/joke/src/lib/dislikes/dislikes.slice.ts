import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';

export const DISLIKES_FEATURE_KEY = 'dislikes';

export interface DislikesEntity<ID_TYPE = number> {
  id: ID_TYPE;
  lines: string[];
  dateAdded: number;
}

export type DislikesState<ID_TYPE = number> = EntityState<DislikesEntity<ID_TYPE>>;

export const dislikesAdapter = createEntityAdapter<DislikesEntity>({
  selectId: (dislikes) => dislikes.id,
});

export const initialDislikesState: DislikesState = dislikesAdapter.getInitialState();

export const dislikesSlice = createSlice({
  name: DISLIKES_FEATURE_KEY,
  initialState: initialDislikesState,
  reducers: {
    dislike: dislikesAdapter.addOne,
    remove: dislikesAdapter.removeOne,
    clear: dislikesAdapter.removeAll,
  },
});

/*
 * Export reducer for store configuration.
 */
export const dislikesReducer = dislikesSlice.reducer;

export const dislikesActions = dislikesSlice.actions;

const { selectAll, selectById } = dislikesAdapter.getSelectors();

const getDislikesState = <ROOT extends { dislikes: DislikesState }>(
  rootState: ROOT
): DislikesState => rootState[DISLIKES_FEATURE_KEY];

const selectAllDislikes = createSelector(getDislikesState, selectAll);

const getDisikeById = (id: number) =>
  createSelector(getDislikesState, (state) => selectById(state, id));

const isDisliked = (id: number) =>
  createSelector(getDisikeById(id), (entity): boolean => !!entity);

export const dislikesSelectors = {
  selectAllDislikes,
  getDisikeById,
  isDisliked
};
