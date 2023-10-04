import { initialLikesState } from '../likes/likes.slice';
import { initialViewedJokesState } from '../viewed-jokes/viewed-jokes.slice';

import { RootState } from './root-state.interface';

export const initialRootState: RootState = {
  likes: initialLikesState,
  viewedJokes: initialViewedJokesState,
};
