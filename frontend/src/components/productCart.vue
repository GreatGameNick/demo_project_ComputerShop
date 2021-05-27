<template>
  <div class="cart">
    <div class="cart__img" :style="{backgroundImage: `url(${product.img})`}"></div>
    <div class="cart__name">{{product.name}}</div>
    <stars :starsCount="product.starsCount"/>
    <div class="cart__description">{{product.description}}</div>
    <div class="cart__price">{{product.price | splitPrice}} <span>₽</span></div>
    <div @click.stop="onAlertRun" class="cart__btn">Купить</div>
  
    <alert :slogan="'are you sure'"
           :suffix="alertSuffix"
           :yesFunction="MOVE_THE_BASKET_PRODUCT"
           :functionArgument = "basketArgument"
           v-if="alertUp"
           @alertDown="alertDown"
    />
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {mapActions} from 'vuex'
import {Product} from '@/types/shop'
import {BasketMovement} from '@/types/user'
import Stars from '@/components/stars.vue'
import Alert from "@/components/alert.vue"

export default Vue.extend({
  components: {
    Stars,
    Alert
  },
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  data: () => ({
    alertUp: false as boolean
  }),
  computed: {
    alertSuffix(): string {
      return `to buy ${this.product.name}`
    },
    basketArgument(): BasketMovement {
      return {shelf: this.product.shelf, _id: this.product._id, vector: 1}
    }
  },
  methods: {
    ...mapActions([
      'MOVE_THE_BASKET_PRODUCT'
    ]),
    onAlertRun(): void {
      this.alertUp = true
    },
    alertDown() {
      this.alertUp = false
    },
  },
  filters: {
    splitPrice: function (val: number): string {
      let [a, b, c, ...rest] = val.toString().split('').reverse()
      return [rest.reverse().join(''), ' ', c, b, a].join('')
    }
  },
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
