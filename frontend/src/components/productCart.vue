<template>
  <div class="cart">
    <div class="cart__img" :style="{backgroundImage: `url(${product.img})`}"></div>
    <div class="cart__name">{{product.name}}</div>
    <div class="cart__description">{{product.description}}</div>
    <div class="cart__description">{{product.description}}</div>
    <stars :starsCount="product.starsCount"/>
    <div class="cart__price">{{product.price | splitPrice}} <span>₽</span></div>
    <div @click.stop="onPutProductToBasket(product.id)" class="cart__btn">Купить</div>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {mapMutations} from 'vuex'
import {Product} from '~/types';
import Stars from '@/components/Stars.vue';

export default Vue.extend({
  components: {
    Stars
  },
  // data: () => ({
  //   product: {
  //     "id": 1135341,
  //     "name": "Noutbook",
  //     "description": "nice",
  //     "price": 20000,
  //     "img": "/API_data/imgs/nout1.jpeg",
  //     "starsCount": 4,
  //     "specification": {
  //       "guarantee": 12,
  //       "release": 2005,
  //       "color": "желтый",
  //       "screenDiagonal": 27
  //     }
  //   }
  // }),
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  filters: {
    splitPrice: function (val: number): string {
      let [a, b, c, ...rest] = val.toString().split('').reverse()
      return [rest.reverse().join(''), ' ', c, b, a].join('')
    }
  },
  methods: {
    ...mapMutations([
      'PUT_PRODUCT_TO_BASKET'
    ]),
    onPutProductToBasket(id: number): void {
      this.PUT_PRODUCT_TO_BASKET(id)
      this.$router.push('/Basket')
    }
  }

})
</script>

<style scoped lang="scss">
.cart {
  width: rem(270);
  height: fit-content;
  box-sizing: border-box;
  padding: rem(20);
  background: $white;

  &__img {
    width: 100%;
    height: rem(200);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  &__name, &__description {
    color: $grey;
    font-size: rem(16);
    line-height: rem(20);

  }

  &__name {
    margin-top: rem(20);
  }

  &__price {
    @extend .price;
    margin-top: rem(10);
  }

  &__btn {
    width: 100%;
    margin: 0 auto;
    @extend .btn_common;
    margin-top: rem(20);
  }

}


</style>
