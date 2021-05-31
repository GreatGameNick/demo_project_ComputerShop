export interface ProductPoint {
  shelf: string,
  _id: string
}

export interface BasketMovement extends ProductPoint {
  vector: number
}

export interface AxiosConfig {
  headers: {
    accesstoken: string
  },
  params: {
    _id: string
  }
}

export interface UserState {
  clientBasket: ProductPoint[],
  isBasketProductsInTheStore: boolean,
  isBasketPointsInTheStore: boolean,
  privatUserData: {}       //if you'll need for future
}

