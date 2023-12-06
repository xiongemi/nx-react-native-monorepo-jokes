import { useTechJoke } from '@nx-react-native-monorepo-jokes/queries/use-tech-joke';
import { ActionButton, CarouselPage } from '@nx-react-native-monorepo-jokes/ui';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from 'react-native-paper';
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
  const theme = useTheme();
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
        setJoke(
          [
            queryResult.data.joke,
            queryResult.data.setup,
            queryResult.data.delivery,
          ].filter(Boolean) as string[]
        );
      }
      setIsLoading(queryResult.isLoading || queryResult.isFetching);
      setIsSuccess(queryResult.isSuccess);
      setIsError(queryResult.isError);
    });
  }, [refetch]);

  const onLikePress = useCallback(() => {
    if (!joke) return;
    like({ lines: joke, id: id.current });
    viewed({ lines: joke, id: id.current });
    onFetchJoke();
  }, [joke, like, onFetchJoke, viewed]);

  const onBackPress = useCallback(() => {
    if (!getLastViewedJoke?.lines) return;
    setJoke(getLastViewedJoke?.lines);
    removeFromViewed(getLastViewedJoke?.id);
  }, [removeFromViewed, getLastViewedJoke]);

  const onNextPress = useCallback(() => {
    if (!joke) {
      return;
    }
    viewed({
      lines: joke,
      id: id.current,
    });
    onFetchJoke();
  }, [onFetchJoke, viewed, joke]);

  useEffect(() => {
    if (id.current && getJokeById) {
      const lines = getJokeById(id.current)?.lines;
      if (lines && lines.length) {
        setJoke(lines);
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
          containerColor={theme.colors.primaryContainer}
          iconColor={theme.colors.primary}
          disabled={getLastViewedJoke?.id === undefined}
          onPress={onBackPress}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
        />
        <ActionButton
          testID="like-button"
          icon="lightbulb"
          containerColor={theme.colors.errorContainer}
          iconColor={theme.colors.error}
          onPress={onLikePress}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
        />
        <ActionButton
          testID="next-button"
          icon="close"
          containerColor={theme.colors.tertiaryContainer}
          iconColor={theme.colors.tertiary}
          onPress={onNextPress}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
        />
      </>
    </CarouselPage>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Jokes);
