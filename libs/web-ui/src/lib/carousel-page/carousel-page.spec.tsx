import { render } from '@testing-library/react';

import CarouselPage from './carousel-page';

describe('CarouselPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CarouselPage />);
    expect(baseElement).toBeTruthy();
  });
});
