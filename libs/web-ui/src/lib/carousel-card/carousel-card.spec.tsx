import { render } from '@testing-library/react';

import CarouselCard from './carousel-card';

describe('CarouselCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CarouselCard />);
    expect(baseElement).toBeTruthy();
  });
});
