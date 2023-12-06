import { render } from '@testing-library/react';

import WebUi from './web-ui';

describe('WebUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WebUi />);
    expect(baseElement).toBeTruthy();
  });
});
