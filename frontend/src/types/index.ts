export interface Product {
    "shelf": string,
    "code": number,
    "name": string,
    "description": string,
    "price": number,
    "img": string,
    "starsCount": number,
    "manufactureNotes": {
      "sectionName": string,
      "country": string,
      "release": string,
      "warranty": string
    },
    "specification": {
      "sectionName": string,
      "screenSize": string,
      "color": string,
      "processor":string,
      "mass": string,
    },
    "additionalInformation": {
      "sectionName": string,
      "delay": string
    }
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

