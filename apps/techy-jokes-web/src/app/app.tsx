import React, { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import {
  createRootStore,
  transformEntityStateToPersist,
} from '@nx-react-native-monorepo-jokes/states/joke';
import { Provider as StoreProvider } from 'react-redux';
import {
  BrowserRouter,
  Link as RouterLink,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MovieIcon from '@mui/icons-material/Movie';

import Jokes from './jokes/jokes';
import { AppRoutes } from './app-routes';
import { Loading } from '@nx-react-native-monorepo-jokes/web-ui';

export const App = () => {
  const persistConfig = {
    key: 'root',
    storage: storage,
    transforms: [transformEntityStateToPersist],
  };
  const isDevelopment = process.env.NODE_ENV === 'development';
  const { store, persistor } = createRootStore(persistConfig);

  const queryClient = new QueryClient();
  return (
    <Suspense fallback={<Loading />}>
      <PersistGate persistor={persistor}>
        <StoreProvider store={store}>
          <QueryClientProvider client={queryClient}>
            {isDevelopment && <ReactQueryDevtools />}

            <AppBar>
              <Toolbar>
                <Link
                  variant="h6"
                  underline="none"
                  component={RouterLink}
                  to={AppRoutes.jokes}
                  color="inherit"
                  sx={{ flexGrow: 1 }}
                >
                  Techy Jokes
                </Link>
                {/* <IconButton
                  size="large"
                  edge="end"
                  component={RouterLink}
                  to={AppRoutes.jokes}
                  color="inherit"
                  aria-label="all films"
                >
                  <MovieIcon />
                </IconButton> */}
              </Toolbar>
            </AppBar>
            <Toolbar />
            <Container maxWidth="lg">
              <Routes>
                <Route path={AppRoutes.jokes} element={<Jokes />} />
                <Route
                  index
                  element={<Navigate replace to={AppRoutes.jokes} />}
                />
              </Routes>
            </Container>
          </QueryClientProvider>
        </StoreProvider>
      </PersistGate>
    </Suspense>
  );
};

export default App;
