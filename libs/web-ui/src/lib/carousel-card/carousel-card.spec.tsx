import { render } from '@testing-library/react';

import CarouselCard, { CarouselCardProps } from './carousel-card';

describe('CarouselCard', () => {
  it('should render successfully', () => {
    const mockProps: CarouselCardProps<number> = {
      id: 1,
      lines: ['this is a joke'],
      like: jest.fn(),
      cancelLike: jest.fn(),
      dislike: jest.fn(),
      cancelDislike: jest.fn(),
    };
    const { baseElement } = render(<CarouselCard {...mockProps} />);
    expect(baseElement).toBeTruthy();
  });
});
