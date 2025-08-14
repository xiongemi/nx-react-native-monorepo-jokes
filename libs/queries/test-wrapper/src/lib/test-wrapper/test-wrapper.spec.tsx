import React from 'react';
import { render } from '@testing-library/react-native';

import TestWrapper from './test-wrapper';
import { Text } from 'react-native';

describe('TestWrapper', () => {
  it('should render successfully', () => {
    const { getByText } = render(
      <TestWrapper>
        <Text>test</Text>
      </TestWrapper>
    );
    expect(getByText('test')).toBeTruthy();
  });
});
