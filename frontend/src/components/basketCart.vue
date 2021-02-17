<template>
  <div class="cart">
    <div class="cart__img" :style="{backgroundImage: `url(${product.img})`}"></div>
    <div class="cart__name">{{product.name}}  </div>
    <div class="cart__description">{{product.description}}</div>
    <counter :productPoint="productPoint" class="cart__counter"/>
    <div class="cart__price">{{product.price | splitPrice}} <span>₽</span></div>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {Product, ProductPoint} from '@/types'
import counter from '@/components/counter.vue'

export default Vue.extend({
  components: {
    counter
  },
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  computed: {
    productPoint(): ProductPoint {
      return {shelf: this.product.shelf, _id: this.product._id}
    }
  },
  filters: {
    splitPrice: function (val: number): string {
      let [a, b, c,...rest] = val.toString().split('').reverse()
      return [rest.reverse().join(''), ' ', c, b, a].join('')
    }
  }

})
</script>

<style scoped lang="scss">
.cart {
  display: grid;
  grid-template-columns: rem(160) 1fr rem(100) rem(100);
  grid-column-gap: rem(20);
  grid-auto-rows: rem(25);
  width: 100%;
  box-sizing: border-box;
  padding: rem(20);
  background: $white;
  background-origin: padding-box;

  &__img {
    grid-area: 1/1/7/1;
    width: 100%;
    height: rem(140);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  &__name {
    grid-area: 2/2/2/2;
    font-size: rem(18);
    font-weight: 600;
    line-height: rem(25);
    color: $black;
  }
  
  &__description {
    grid-area: 3/2/5/2;
    font-size: rem(16);
    font-weight: 300;
    line-height: rem(16);
    color: $grey;
  }
  
  &__counter{
    max-width: rem(90);
    grid-area: 3/3/3/3;
    align-self: center;

    @media (max-width: 700px) {
      grid-area: 5/2/5/4;
    }
  }
  &__price {
    grid-area: 3/4/3/4;
    @extend .price;
    line-height: rem(25);

    @media (max-width: 700px) {
      grid-area: 6/2/6/4;
    }
  }

}
</style>
