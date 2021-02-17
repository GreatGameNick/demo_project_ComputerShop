<template>
  <div>
    <h3>Корзина: <span>{{GET_BASKET.length | productCounterDeclension}}</span></h3>
    <div v-if="GET_BASKET.length > 0" class="basket">
      <div class="basket__list">
        <basket-cart v-for="(product, ind) of noRedundantProduct"
                     :key="ind"
                     :product="product"
        />
      </div>
      <div class="basket__underline">
        <div class="basket__outcome">
          Итого: {{GET_BASKET.length | productCounterDeclension}} на {{price | splitPrice}} ₽
        </div>
        <div @click="onByProduct" class="basket__btn_orange">Купить</div>
      </div>
    </div>

    <div @click="$router.push('/')" class="control">Продолжить выбор</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import basketCart from "@/components/basketCart.vue";
import {Product} from '@/types'
import {mapGetters, mapMutations} from "vuex";

export default Vue.extend({
  components: {
    basketCart
  },
  computed: {
    ...mapGetters([
      'GET_BASKET'
    ]),
    noRedundantProduct()  {
      return [...new Set(this.GET_BASKET)]
    },
    price(): number {
      let sum = null
      for(let item of this.GET_BASKET) {
        sum = sum + item.price
      }
      return sum
    }
  },
  methods: {
    ...mapMutations([
      'CLEAR_BASKET'
    ]),
    onByProduct(this: any): void {
      this.CLEAR_BASKET()
      this.$router.push('/')
    }
  },
  filters: {
    productCounterDeclension (val: number): string {
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
  }
})

</script>

<style scoped lang="scss">
h3 span {
  color: $grey;
}

.basket {
  display: flex;
  justify-content: space-between;

  @media (max-width: 1000px) {
    flex-flow: wrap column;

  }


  .basket__list {
    display: block;
    width: calc(100% - 320px);

    & * {
      margin-top: rem(20);
    }

    @media (max-width: 1000px) {
      width: 100%;
    }
  }

  &__underline {
    margin-top: rem(20);
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

.control {
  margin-top: rem(20);
  @extend .btn_common;
  background: $white;
  border: none;
}

</style>
