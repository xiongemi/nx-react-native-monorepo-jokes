import React from 'react';
import { render } from '@testing-library/react';

import TestWrapper from './test-wrapper';

describe('TestWrapper', () => {
  it('should render successfully', () => {
    const { getByText } = render(
      <TestWrapper>
        <div>test</div>
      </TestWrapper>
    );
    expect(getByText('test')).toBeTruthy();
  });
});
