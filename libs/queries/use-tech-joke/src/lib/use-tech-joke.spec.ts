import {
  queryClient,
  TestWrapper,
} from '@nx-react-native-monorepo-jokes/queries/test-wrapper';
import { act, renderHook, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import { useTechJoke } from './use-tech-joke';
import { mockTechJokeResponse } from './tech-joke-response.mock';

describe('useTechJoke', () => {
  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(() => {
    jest.resetAllMocks();
    queryClient.clear();
  });

  afterAll(() => {
    fetchMock.disableMocks();
  });

  it('status should be success', async () => {
    fetchMock.mockResolvedValue({
      json: () => Promise.resolve(mockTechJokeResponse),
      ok: true,
    } as Response);

    const { result } = renderHook(() => useTechJoke(1, { enabled: true }), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockTechJokeResponse);
    });
  });

  it('status should be error', async () => {
    fetchMock.mockRejectOnce(new Error('Network Error'));

    const { result } = renderHook(() => useTechJoke(1, { enabled: true }), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});
