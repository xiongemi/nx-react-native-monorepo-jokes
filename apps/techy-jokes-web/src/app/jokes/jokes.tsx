import { connect } from 'react-redux';
import { JokesProps, mapDispatchToProps, mapStateToProps } from './jokes.props';
import { useTechJoke } from '@nx-react-native-monorepo-jokes/queries/use-tech-joke';
import { useCallback, useEffect, useState } from 'react';
import {
  CarouselCard,
} from '@nx-react-native-monorepo-jokes/web-ui';

export function Jokes({
  isLiked,
  isDisliked,
  like,
  cancelLike,
  dislike,
  cancelDislike,
}: JokesProps) {
  const { refetch } = useTechJoke(10);
  const [jokes, setJokes] = useState<{ id: number; lines: string[] }[]>([]);

  const onFetchJoke = useCallback(() => {
    refetch().then((queryResult) => {
      if (queryResult.data?.jokes) {
        setJokes(
          queryResult.data.jokes.map((joke) => {
            return {
              id: joke.id,
              lines: [joke.joke, joke.setup, joke.delivery].filter(
                Boolean
              ) as string[],
            };
          })
        );
      }
    });
  }, [refetch]);

  useEffect(() => {
    if (onFetchJoke) {
      onFetchJoke();
    }
  }, [onFetchJoke]);

  return (
    <div className="flex flex-col space-y-4">
      {jokes.map((joke, index) => (
        <CarouselCard<number>
          key={index}
          id={joke.id}
          lines={joke.lines}
          isLiked={isLiked(joke.id)}
          isDisliked={isDisliked(joke.id)}
          dislike={dislike}
          like={like}
          cancelDislike={cancelDislike}
          cancelLike={cancelLike}
        ></CarouselCard>
      ))}
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Jokes);
