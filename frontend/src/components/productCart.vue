<template>
  <div class="cart">
    <div class="cart__img" :style="{backgroundImage: `url(${product.img})`}"></div>
    <div class="cart__name">{{product.name}}</div>
    <stars :starsCount="product.starsCount"/>
    <div class="cart__description">{{product.description}}</div>
    <div class="cart__price">{{product.price | splitPrice}} <span>₽</span></div>
    <div @click.stop="onPutProductToBasket(product.id)" class="cart__btn">Купить</div>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {mapMutations} from 'vuex'
import {Product} from '@/types';
import Stars from '@/components/Stars.vue';

export default Vue.extend({
  components: {
    Stars
  },
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
      let shelf = this.$route.path       // "/laptops"
      console.log('==== this.$route.path', this.$route.path)

      this.PUT_PRODUCT_TO_BASKET({shelf, id})
      this.$router.push('/Basket')
    }
  }

})
</script>

<style scoped lang="scss">
.cart {
  display: grid;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: rem(20);
  background: $white;
  grid-auto-rows: rem(20);
  grid-template-columns: 4fr 1fr;

  &__img {
    width: 100%;
    height: rem(200);
    grid-area: 1/1/span 11/span 2;
    grid-auto-flow: row;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  &__name, &__description {
    color: $grey;
    font-size: rem(16);
    line-height: rem(20);

  }

  &__description {
    grid-column: span 2;
    grid-row: span 2;
  }

  &__price {
    @extend .price;
    grid-column: span 2;
  }

  &__btn {
    width: 100%;
    grid-column: span 2;
    grid-row: span 3;
    margin: rem(20) auto 0;
    @extend .btn_common;
  }
}


</style>
