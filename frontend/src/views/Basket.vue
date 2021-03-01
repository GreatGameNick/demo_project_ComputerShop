<template>
  <div class="wrapper">
    <h2>В корзине: <span>{{GET_BASKET_POINTS.length | productCounterDeclension}}</span></h2>
    <div v-if="GET_BASKET_PRODUCTS[0] != null" class="basket">
      <div class="basket__list">
        <basket-cart v-for="(product, ind) of GET_BASKET_PRODUCTS"
                     :key="ind"
                     :product="product"
        />
      </div>
      <div class="basket__underline">
        <div class="basket__outcome">
          Итого: <span> {{GET_BASKET_POINTS.length | productCounterDeclension}} на {{price | splitPrice}} ₽</span>
        </div>
        <div @click="onBuyProducts" class="basket__btn_orange">Купить</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import basketCart from "@/components/basketCart.vue";
import {mapActions, mapGetters, mapMutations} from "vuex";

export default Vue.extend({
  components: {
    basketCart,
  },
  computed: {
    ...mapGetters([
      'GET_BASKET_POINTS',
      'GET_IS_BASKET_PRODUCTS',
      'GET_BASKET_PRODUCTS',
      'GET_PRODUCT_BASKET_AMOUNT'
    ]),
    price(): number {
      let sum: number = 0
      for (let product of this.GET_BASKET_PRODUCTS) {
        sum += product.price * this.GET_PRODUCT_BASKET_AMOUNT({shelf: product.shelf, _id: product._id})
      }
      return sum
    }
  },
  methods: {
    ...mapMutations([
      'CLEAR_BASKET'
    ]),
    ...mapActions([
      'FETCH_BASKET_PRODUCTS'
    ]),
    onBuyProducts(this: any): void {
      this.CLEAR_BASKET()
      this.$router.push('/')
      //показать алерт
    }
  },
  filters: {
    productCounterDeclension(val: number): string {
      if (val === 0)
        return 'товаров нет'
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
    if (!this.GET_IS_BASKET_PRODUCTS)
      await this.FETCH_BASKET_PRODUCTS()  //происходит однократно - только при первом посещении корзины.
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
    margin-left: rem(5);
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
        max-width: rem(500);
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
