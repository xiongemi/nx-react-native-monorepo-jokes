import { render } from '@testing-library/react';

import Jokes from './jokes';

describe('Jokes', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Jokes />);
    expect(baseElement).toBeTruthy();
  });
});
