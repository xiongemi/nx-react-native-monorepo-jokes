export interface TechJokeResponse extends SingleJokeResponse{
  error: boolean;
  amount?: number;
  jokes?: SingleJokeResponse[];
}

export interface SingleJokeResponse {
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
