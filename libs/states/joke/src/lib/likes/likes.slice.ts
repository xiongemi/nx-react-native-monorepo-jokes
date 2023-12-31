import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';

export const LIKES_FEATURE_KEY = 'likes';

export interface LikesEntity<ID_TYPE = number> {
  id: ID_TYPE;
  lines: string[];
  dateAdded: number;
}

export type LikesState<ID_TYPE = number> = EntityState<LikesEntity<ID_TYPE>>;

export const likesAdapter = createEntityAdapter<LikesEntity>({
  selectId: (likes) => likes.id,
});

export const initialLikesState: LikesState = likesAdapter.getInitialState();

export const likesSlice = createSlice({
  name: LIKES_FEATURE_KEY,
  initialState: initialLikesState,
  reducers: {
    like: likesAdapter.addOne,
    remove: likesAdapter.removeOne,
    clear: likesAdapter.removeAll,
  },
});

/*
 * Export reducer for store configuration.
 */
export const likesReducer = likesSlice.reducer;

export const likesActions = likesSlice.actions;

const { selectAll, selectById } = likesAdapter.getSelectors();

const getlikesState = <ROOT extends { likes: LikesState }>(
  rootState: ROOT
): LikesState => rootState[LIKES_FEATURE_KEY];

const selectAllLikes = createSelector(getlikesState, selectAll);

const getLikeById = (id: number) =>
  createSelector(getlikesState, (state) => selectById(state, id));

const isLiked = (id: number) =>
  createSelector(getLikeById(id), (entity): boolean => !!entity);

export const likesSelectors = {
  selectAllLikes,
  getLikeById,
  isLiked
};
