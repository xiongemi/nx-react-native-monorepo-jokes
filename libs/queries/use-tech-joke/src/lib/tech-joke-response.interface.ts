export interface TechJokeResponse {
  error: boolean;
  category: string;
  type: 'twopart' | 'single';
  setup?: string;
  delivery?: string;
  joke?: string;
  flags: {
    nsfw: boolean;
    religious: boolean;
    political: boolean;
    racist: boolean;
    sexist: boolean;
    explicit: boolean;
  };
  id: number;
  safe: boolean;
  lang: string;
}
