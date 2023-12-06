import {
  likesActions,
  LikesEntity,
  likesSelectors,
  dislikesActions,
  dislikesSelectors,
  RootState,
} from '@nx-react-native-monorepo-jokes/states/joke';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

const mapStateToProps = (state: RootState<number>) => {
  return {
    isLiked: (id: number) => likesSelectors.isLiked(id)(state),
    isDisliked: (id: number) => dislikesSelectors.isDisliked(id)(state),
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState<number>, void, AnyAction>
) => {
  return {
    like(data: { lines: string[]; id?: number }) {
      dispatch(
        likesActions.like({
          id: data.id ?? new Date().getTime(),
          lines: data.lines,
          dateAdded: Date.now(),
        } as LikesEntity<number>)
      );
    },
    cancelLike(id: number) {
      dispatch(likesActions.remove(id));
    },
    dislike(data: { lines: string[]; id?: number }) {
      dispatch(
        dislikesActions.dislike({
          id: data.id ?? new Date().getTime(),
          lines: data.lines,
          dateAdded: Date.now(),
        } as LikesEntity<number>)
      );
    },
    cancelDislike(id: number) {
      dispatch(dislikesActions.remove(id));
    }
  };
};

type mapStateToPropsType = ReturnType<typeof mapStateToProps>;
type mapDispatchToPropsType = ReturnType<typeof mapDispatchToProps>;

type JokesProps = mapStateToPropsType & mapDispatchToPropsType;

export { mapStateToProps, mapDispatchToProps };
export type { JokesProps };
