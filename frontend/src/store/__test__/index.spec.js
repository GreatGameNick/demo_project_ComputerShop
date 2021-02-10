import {getters} from '../index.ts'
import products from '~/static/API_data/data.json'

describe('getters', () => {
  it('GET_PRODUCT is working', () => {
    let state = {    //исходное, аргументы для гетттера.
      products: products
    }

    let dd = {   //ожидаемый результат
        "id": 22134646,
        "name": "Book",
        "description": "fine",
        "price": 33000,
        "img": "/API_data/imgs/nout2.jpeg",
        "specification": {
          "guarantee": 24,
          "release": 2005,
          "color": "желтый",
          "screenDiagonal": 16
        }
      }

    expect(getters.GET_PRODUCT(state)(22134646).name).toEqual(dd.name)
  })
})



