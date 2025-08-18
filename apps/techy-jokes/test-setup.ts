jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist');
  return {
    ...real,
    persistReducer: jest.fn().mockImplementation((config, reducers) => reducers),
    persistStore: jest.fn().mockImplementation(store => store),
  };
});

jest.mock('react-native-paper', () => {
  const RealModule = jest.requireActual('react-native-paper');
  const MockedModule = {
    ...RealModule,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Icon: require('react-native-vector-icons/MaterialCommunityIcons').default,
  };
  return MockedModule;
});
