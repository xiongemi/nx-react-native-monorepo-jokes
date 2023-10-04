import { LIKES_FEATURE_KEY, LikesState } from '../likes/likes.slice';
import { VIEWED_JOKES_FEATURE_KEY, ViewedJokesState } from '../viewed-jokes/viewed-jokes.slice';

export interface RootState {
  [LIKES_FEATURE_KEY]: LikesState;
  [VIEWED_JOKES_FEATURE_KEY]: ViewedJokesState;
}
