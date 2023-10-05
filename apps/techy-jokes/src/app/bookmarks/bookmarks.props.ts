import {
  likesActions,
  LikesEntity,
  likesSelectors,
  RootState,
} from '@nx-react-native-monorepo-jokes/states/joke';
import { ListItem } from '@nx-react-native-monorepo-jokes/ui';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

const mapStateToProps = (state: RootState<number>) => {
  return {
    bookmarks: likesSelectors
      .selectAllLikes(state)
      .map((likes: LikesEntity<number>) => {
        return {
          id: likes.id,
          description: likes.lines.join(' '),
          title: new Date(likes.dateAdded).toLocaleDateString()
        } as ListItem<number>;
      }),
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, AnyAction>
) => {
  return {
    removeBookmark(id: number) {
      dispatch(likesActions.remove(id));
    },
  };
};

type mapStateToPropsType = ReturnType<typeof mapStateToProps>;
type mapDispatchToPropsType = ReturnType<typeof mapDispatchToProps>;

type BookmarksProps = mapStateToPropsType & mapDispatchToPropsType;

export { mapStateToProps, mapDispatchToProps };
export type { BookmarksProps };
