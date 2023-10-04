import {
  likesActions,
  LikesEntity,
  likesSelectors,
  RootState,
  viewedJokesActions,
  ViewedJokesEntity,
  viewJokesSelectors,
} from '@nx-react-native-monorepo-jokes/states/joke';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

const mapStateToProps = (state: RootState) => {
  return {
    getJokeById: (id: number) => likesSelectors.getLikeById(id)(state),
    getLastViewedJoke: viewJokesSelectors.getLastViewedJoke(state),
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, AnyAction>
) => {
  return {
    like(data: { lines: string[]; id?: number }) {
      dispatch(
        likesActions.like({
          id: data.id ?? new Date().getTime(),
          lines: data.lines,
          dateAdded: Date.now(),
        } as LikesEntity)
      );
    },
    viewed(data: { lines: string[]; id?: number }) {
      dispatch(
        viewedJokesActions.add({
          id: data.id ?? new Date().getTime(),
          lines: data.lines,
        } as ViewedJokesEntity)
      );
    },
    removeFromViewed(id: number) {
      dispatch(viewedJokesActions.remove(id));
    },
  };
};

type mapStateToPropsType = ReturnType<typeof mapStateToProps>;
type mapDispatchToPropsType = ReturnType<typeof mapDispatchToProps>;

type JokesProps = mapStateToPropsType & mapDispatchToPropsType;

export { mapStateToProps, mapDispatchToProps };
export type { JokesProps };
