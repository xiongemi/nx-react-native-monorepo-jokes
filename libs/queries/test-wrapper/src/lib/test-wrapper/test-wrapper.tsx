import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      gcTime: 0, // important: no long-running GC timers
    },
  },
});
export interface TestWrapperProps {
  children: React.ReactNode;
}

export function TestWrapper({ children }: TestWrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default TestWrapper;
