<template>
  <div class="cart">
    <div class="cart__img" :style="{backgroundImage: `url(${product.img})`}"></div>
    <div class="cart__name">{{product.name}}</div>
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
      let [a, b, c, ...rest] = val.toString().split('').reverse()
      return [rest.reverse().join(''), ' ', c, b, a].join('')
    }
  }
  
})
</script>

<style scoped lang="scss">
$basketCartMediaPoint_1: 850px;
$basketCartMediaPoint_2: 720px;

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
  
  @media (max-width: $basketCartMediaPoint_2) {
    grid-template-columns: 1fr rem(100);
    grid-auto-rows:  rem(25);
  }
  
  &__img {
    grid-area: 1/1/span 6/1;
    width: 100%;
    height: rem(140);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    
    @media (max-width: $basketCartMediaPoint_2) {
      grid-area: 1/1/sapn 6/span 2;
    }
  }
  
  &__name {
    grid-area: 2/2/2/span 2;
    font-size: rem(18);
    font-weight: 600;
    line-height: rem(25);
    color: $black;
    
    @media (max-width: $basketCartMediaPoint_1) {
      grid-area: 2/2/2/span 3;
    }
    @media (max-width: $basketCartMediaPoint_2) {
      grid-area: 8/1/8/span 2;
    }
  }
  
  &__description {
    grid-area: 3/2/span 4/2;
    font-size: rem(16);
    font-weight: 300;
    line-height: rem(16);
    color: $grey;
    
    @media (max-width: $basketCartMediaPoint_1) {
      grid-area: 3/2/span 2/span 3;
    }
    @media (max-width: $basketCartMediaPoint_2) {
      grid-area: 9/1/span 2/span 2;
    }
  }
  
  &__counter {
    max-width: rem(90);
    grid-area: 3/3/3/3;
    align-self: center;
    
    @media (max-width: $basketCartMediaPoint_1) {
      grid-area: 5/2/5/4;
    }
    @media (max-width: $basketCartMediaPoint_2) {
      grid-area: 11/1/11/1;
    }
  }
  
  &__price {
    grid-area: 3/4/3/4;
    @extend .price;
    line-height: rem(25);
    
    @media (max-width: $basketCartMediaPoint_1) {
      grid-area: 5/4/5/span 1;
    }
    @media (max-width: $basketCartMediaPoint_2) {
      grid-area: 11/2/11/2;
    }
  }
  
}
</style>
