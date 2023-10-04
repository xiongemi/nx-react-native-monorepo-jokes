import { AppRoutes } from './app-routes';

export type RootStackParamList = {
  [AppRoutes.jokes]: {id?: number};
  [AppRoutes.bookmarks]: undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamList {}
  }
}
