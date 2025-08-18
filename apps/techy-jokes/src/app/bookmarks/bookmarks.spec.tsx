import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { RootState, initialRootState } from '@nx-react-native-monorepo-jokes/states/joke';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Bookmarks from './bookmarks';

describe('Bookmarks', () => {
  const mockStore = configureStore<RootState>([]);
  const Stack = createNativeStackNavigator();

  let store: MockStoreEnhanced<RootState>;

  beforeEach(() => {
    store = mockStore(initialRootState);
    store.dispatch = jest.fn();
  });

  it('should render successfully', () => {
    const { root } = render(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Bookmarks" component={Bookmarks} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
    expect(root).toBeTruthy();
  });
});
