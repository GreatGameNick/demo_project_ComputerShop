export interface Product {
  shelf: string,
  id: number,
  name: string,
  description: string,
  price: number,
  img: string,
  starsCount: number
  specification: Specification
}

interface Specification {
  guarantee: number
  release?: number
  color: string
  screenDiagonal?: number
}

export interface Shelf {
  shelf: string,
  shelfName: string
}

export interface RootState {
  laptops: Product[],
  mouses: Product[],
  accessories: Product[],
  clientBasket: number[]
}

