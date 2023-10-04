import { combineReducers } from '@reduxjs/toolkit';

import { likesReducer } from '../likes/likes.slice';
import { RootState } from './root-state.interface';
import { viewedJokesReducer } from '../viewed-jokes/viewed-jokes.slice';

export const createRootReducer = combineReducers<RootState>({
  likes: likesReducer,
  viewedJokes: viewedJokesReducer,
});
