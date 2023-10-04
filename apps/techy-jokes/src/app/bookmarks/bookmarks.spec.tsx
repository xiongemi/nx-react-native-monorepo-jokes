import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { RootState, initialRootState } from '@nx-react-native-monorepo-jokes/states/joke';

import Bookmarks from './bookmarks';

describe('Bookmarks', () => {
  const mockStore = configureStore<RootState>([]);

  let store: MockStoreEnhanced<RootState>;

  beforeEach(() => {
    store = mockStore(initialRootState);
    store.dispatch = jest.fn();
  });

  it('should render successfully', () => {
    const { root } = render(
      <Provider store={store}>
        <Bookmarks />
      </Provider>
    );
    expect(root).toBeTruthy();
  });
});
