import { render } from '@testing-library/react';
import { CarouselCardProps } from '../carousel-card/carousel-card';
import CarouselPage from './carousel-page';

describe('CarouselPage', () => {
  it('should render successfully', () => {
    const mockCards: CarouselCardProps<number>[] = [
      {
        id: 1,
        lines: ['this is a joke'],
        like: jest.fn(),
        cancelLike: jest.fn(),
        dislike: jest.fn(),
        cancelDislike: jest.fn(),
      },
    ];
    const { baseElement } = render(<CarouselPage cards={mockCards} />);
    expect(baseElement).toBeTruthy();
  });
});
