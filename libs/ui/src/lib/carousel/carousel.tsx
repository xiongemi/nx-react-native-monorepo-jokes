import { AsyncComponentProps } from '@nx-react-native-monorepo-jokes/models';
import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { Card, Title, Text, Button, useTheme } from 'react-native-paper';

export interface CarouselProps extends AsyncComponentProps {
  imageUri?: string;
  title?: string;
  lines?: string[];
  onReload: () => void;
  testID?: string;
}

export function Carousel({
  imageUri,
  title,
  lines,
  isSuccess,
  isError,
  isLoading,
  onReload,
}: CarouselProps) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    carouselCard: {
      height: '100%',
      padding: 16,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.secondaryContainer,
      color: theme.colors.secondary,
    },
    error: {
      color: theme.colors.error,
    },
    marginTop: {
      marginTop: 8,
    },
  });
  return (
    <Card mode="elevated" testID="carousel-card" style={styles.carouselCard}>
      {isSuccess && (
        <>
          {imageUri && <Card.Cover source={{ uri: imageUri }} />}
          <Card.Content testID="carousel-card-content">
            {title && <Title testID="carousel-title">{title}</Title>}
            {lines?.map((line, index) => (
              <Text
                variant="titleLarge"
                testID="carousel-text"
                key={index}
                style={styles.marginTop}
              >
                {line}
              </Text>
            ))}
          </Card.Content>
        </>
      )}
      {isLoading && (
        <ActivityIndicator
          testID="carousel-loading"
          animating={true}
          size="large"
          color={theme.colors.tertiary}
        />
      )}
      {isError && (
        <>
          <Text
            style={styles.error}
            variant="headlineMedium"
            testID="carousel-failed"
          >
            Failed to load.
            Please make sure you are connected to network.
          </Text>
          <Button
            icon="alert"
            mode="contained"
            onPress={onReload}
            style={styles.marginTop}
          >
            Reload
          </Button>
        </>
      )}
    </Card>
  );
}

export default Carousel;
