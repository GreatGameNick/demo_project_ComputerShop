<template>
  <div class="wrapper">
    <h2>Корзина: <span>{{basketProducts.length | productCounterDeclension}}</span></h2>
    <div v-if="basketProducts.length > 0" class="basket">
      <div class="basket__list">
        <basket-cart v-for="(product, ind) of noRedundantProduct"
                     :key="ind"
                     :product="product"
        />
      </div>
      <div class="basket__underline">
        <div class="basket__outcome">
          Итого: <span> {{basketProducts.length | productCounterDeclension}} на {{price | splitPrice}} ₽</span>
        </div>
        <div @click="onByProduct" class="basket__btn_orange">Купить</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import basketCart from "@/components/basketCart.vue";
import {Product} from '@/types'
import {mapActions, mapMutations} from "vuex";

export default Vue.extend({
  components: {
    basketCart
  },
  data: () => ({
    basketProducts: [] as Product[]
  }),
  computed: {
    noRedundantProduct(): Product[] {
      return [...new Set(this.basketProducts)]
    },
    price(): number {
      let sum: number = 0
      for (let item of this.basketProducts) {
        sum = sum + item.price
      }
      return sum
    }
  },
  methods: {
    ...mapMutations([
      'CLEAR_BASKET'
    ]),
    ...mapActions([
      'BASKET_PRODUCTS_REQUEST'
    ]),
    onByProduct(this: any): void {
      this.CLEAR_BASKET()
      this.$router.push('/')
    }
  },
  filters: {
    productCounterDeclension(val: number): string {
      if (val === 0)
        return 'пустая'
      if (val === 1)
        return '1 товар'
      if (val < 5)
        return `${val} товара`
      return `${val} товаров`
    },
    splitPrice: function (val: number): string {
      let [a, b, c, ...rest] = val.toString().split('').reverse()
      return [rest.reverse().join(''), ' ', c, b, a].join('')
    }
  },
  async created() {
    this.BASKET_PRODUCTS_REQUEST()
      .then(products => this.basketProducts = products)
  }
})

</script>

<style scoped lang="scss">
$basketMediaPoint: 1200px;

.wrapper {
  width: 100%;
  box-sizing: border-box;
  padding: 0 rem(10);
  
  h2 span {
    color: $grey;
  }
  
  .basket {
    display: flex;
    justify-content: space-between;
    
    @media (max-width: $basketMediaPoint) {
      flex-flow: wrap column;
    }
    
    .basket__list {
      display: block;
      width: calc(100% - 320px);
      
      & * {
        margin-top: rem(20);
      }
      
      @media (max-width: $basketMediaPoint) {
        width: 100%;
      }
    }
    
    &__underline {
      margin: rem(20) 0 0 rem(10);
      width: 300px;
      
      .basket__outcome {
        width: 100%;
        height: rem(60);
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding-left: rem(20);
        
        background: $white;
        font-weight: 700;
        
        span {
          padding-left: rem(7);
          color: $grey;
        }
      }
      
      .basket__btn_orange {
        width: 100%;
        max-width: 500px;
        margin-top: rem(20);
        @extend .btn_common;
        background: $orange;
        border-color: $orange;
        color: $white;
      }
    }
  }
}
</style>
