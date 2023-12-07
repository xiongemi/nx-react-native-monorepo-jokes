import React from 'react';
import { render } from '@testing-library/react-native';

import TestWrapper from './test-wrapper';

describe('TestWrapper', () => {
  it('should render successfully', () => {
    const { root } = render(
      <TestWrapper>
        <>test</>
      </TestWrapper>
    );
    expect(root).toBeTruthy();
  });
});
