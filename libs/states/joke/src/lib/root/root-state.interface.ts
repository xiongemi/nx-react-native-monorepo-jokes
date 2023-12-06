import { DISLIKES_FEATURE_KEY, DislikesState } from '../dislikes/dislikes.slice';
import { LIKES_FEATURE_KEY, LikesState } from '../likes/likes.slice';
import { VIEWED_JOKES_FEATURE_KEY, ViewedJokesState } from '../viewed-jokes/viewed-jokes.slice';

export interface RootState<ID_TYPE = number> {
  [DISLIKES_FEATURE_KEY]: DislikesState<ID_TYPE>;
  [LIKES_FEATURE_KEY]: LikesState<ID_TYPE>;
  [VIEWED_JOKES_FEATURE_KEY]: ViewedJokesState<ID_TYPE>;
}
