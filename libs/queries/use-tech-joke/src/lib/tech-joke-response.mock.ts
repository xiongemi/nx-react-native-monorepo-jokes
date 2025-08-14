import { TechJokeResponse } from './tech-joke-response.interface';

export const mockTechJokeResponse: TechJokeResponse = {
  error: false,
  category: 'Programming',
  type: 'single',
  joke: 'joke',
  flags: {
    nsfw: false,
    religious: false,
    political: false,
    racist: false,
    sexist: false,
    explicit: false,
  },
  id: 12,
  safe: true,
  lang: 'en',
};
