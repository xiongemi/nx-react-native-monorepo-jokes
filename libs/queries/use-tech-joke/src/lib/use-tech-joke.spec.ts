import { TestWrapper } from '@nx-react-native-monorepo-jokes/queries/test-wrapper';
import { renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'jest-fetch-mock';
import { useTechJoke } from './use-tech-joke';
import { mockTechJokeResponse } from './tech-joke-response.mock';

describe('useTechJoke', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('status should be success', async () => {
    // simulating a server response
    fetchMock.mockResponseOnce(JSON.stringify(mockTechJokeResponse));

    const { result } = renderHook(() => useTechJoke(), {
      wrapper: TestWrapper,
    });

    result.current.refetch(); // refetching the query
    expect(result.current.isLoading).toBeTruthy();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual('random cat fact');
  });

  it('status should be error', async () => {
    const response = new Response(null, {
      status: 401,
    });
    fetchMock.mockReturnValueOnce(Promise.resolve(response));

    const { result } = renderHook(() => useTechJoke(), {
      wrapper: TestWrapper,
    });

    try {
      result.current.refetch();
    } catch (actual) {
      expect(actual).toEqual(response);
    }
  });
});
