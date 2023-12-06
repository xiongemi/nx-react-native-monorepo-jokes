import { useQuery } from '@tanstack/react-query';
import { TechJokeResponse } from './tech-joke-response.interface';

export const fetchTechJoke = async (amount = 1): Promise<TechJokeResponse> => {
  const response = await fetch(
    `https://v2.jokeapi.dev/joke/Programming?amount=${amount}`
  );
  const data: TechJokeResponse = await response.json();
  return data;
};

export const useTechJoke = (amount = 1) => {
  return useQuery<TechJokeResponse, string | number>({
    queryKey: ['tech-joke', amount],
    queryFn: () => fetchTechJoke(amount),
    enabled: false,
  });
};
