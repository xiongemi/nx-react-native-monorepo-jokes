import { useTechJoke } from '@nx-react-native-monorepo-jokes/queries/use-tech-joke';
import { ActionButton, CarouselPage } from '@nx-react-native-monorepo-jokes/ui';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MD3Colors } from 'react-native-paper';
import { connect } from 'react-redux';
import { JokesProps, mapDispatchToProps, mapStateToProps } from './jokes.props';
import { RouteProp, useRoute } from '@react-navigation/native';

export function Jokes({
  like,
  getJokeById,
  viewed,
  getLastViewedJoke,
  removeFromViewed,
}: JokesProps) {
  const route = useRoute<RouteProp<{ params: { id: number } }>>();
  const id = useRef<number | undefined>(route.params?.id);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [joke, setJoke] = useState<string[] | undefined>(undefined);

  const { refetch } = useTechJoke();

  const onFetchJoke = useCallback(() => {
    refetch().then((queryResult) => {
      if (queryResult.data) {
        setJoke([
          queryResult.data.joke,
          queryResult.data.setup,
          queryResult.data.delivery,
        ]);
        viewed({
          id: queryResult.data.id,
          lines: [
            queryResult.data.joke,
            queryResult.data.setup,
            queryResult.data.delivery,
          ],
        });
      }
      setIsLoading(queryResult.isLoading || queryResult.isFetching);
      setIsSuccess(queryResult.isSuccess);
      setIsError(queryResult.isError);
    });
  }, [refetch, viewed]);

  const onLikePress = useCallback(() => {
    if (!joke) return;
    like({ lines: joke, id: id.current });
    onFetchJoke();
  }, [joke, like, onFetchJoke]);

  const onBackPress = useCallback(() => {
    if (!getLastViewedJoke?.lines) return;
    setJoke(getLastViewedJoke?.lines);
    removeFromViewed(getLastViewedJoke?.id);
  }, [removeFromViewed, getLastViewedJoke]);

  useEffect(() => {
    if (id.current && getJokeById && viewed) {
      const lines = getJokeById(id.current)?.lines;
      if (lines && lines.length) {
        setJoke(lines);
        viewed({ id: id.current, lines: lines });
        id.current = undefined;
        setIsLoading(false);
        setIsSuccess(true);
        setIsError(false);
        return;
      }
    }
    if (!id.current && onFetchJoke) {
      onFetchJoke();
    }
  }, [id, onFetchJoke]);

  return (
    <CarouselPage
      testID="jokes-page"
      lines={joke}
      isLoading={isLoading}
      isSuccess={isSuccess}
      isError={isError}
      onReload={onFetchJoke}
    >
      <>
        <ActionButton
          testID="back-button"
          icon="arrow-left"
          containerColor={MD3Colors.secondary80}
          iconColor={MD3Colors.secondary50}
          disabled={!getLastViewedJoke?.id}
          onPress={onBackPress}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
        />
        <ActionButton
          testID="like-button"
          icon="lightbulb"
          containerColor={MD3Colors.error80}
          iconColor={MD3Colors.error50}
          onPress={onLikePress}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
        />
        <ActionButton
          testID="next-button"
          icon="close"
          containerColor={MD3Colors.primary80}
          iconColor={MD3Colors.primary50}
          onPress={onFetchJoke}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
        />
      </>
    </CarouselPage>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Jokes);
