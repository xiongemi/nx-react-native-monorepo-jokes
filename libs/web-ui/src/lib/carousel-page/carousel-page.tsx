import CarouselCard, {
  CarouselCardProps,
} from '../carousel-card/carousel-card';

export interface CarouselPageProps<ID_TYPE> {
  cards: CarouselCardProps<ID_TYPE>[];
}

export function CarouselPage<ID_TYPE>({ cards }: CarouselPageProps<ID_TYPE>) {
  return (
    <div className="flex flex-col space-y-4">
      {cards.map((card, index) => {
        return <CarouselCard {...card} key={index}></CarouselCard>;
      })}
    </div>
  );
}

export default CarouselPage;
