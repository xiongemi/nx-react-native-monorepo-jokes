import { TechJokeResponse } from './tech-joke-response.interface';

export const mockTechJokeResponse: TechJokeResponse = {
  error: false,
  category: 'Programming',
  type: 'single',
  joke: "// This line doesn't actually do anything, but the code stops working when I delete it.",
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
