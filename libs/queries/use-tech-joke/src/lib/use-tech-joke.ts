import { useQuery } from '@tanstack/react-query';
import { TechJokeResponse } from './tech-joke-response.interface';

export const fetchTechJoke = async (): Promise<TechJokeResponse> => {
  const response = await fetch('https://v2.jokeapi.dev/joke/Programming');
  const data: TechJokeResponse = await response.json();
  return data;
};

export const useTechJoke = () => {
  return useQuery({
    queryKey: ['tech-joke'],
    queryFn: fetchTechJoke,
    enabled: false,
  });
};
