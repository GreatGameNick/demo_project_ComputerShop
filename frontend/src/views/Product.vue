<template>
  <div class="cover">
    <div v-if="product !=null">
      <h3>{{product.name}}</h3>
      <div class="anons">
        <div class="anons__img" :style="{backgroundImage: `url(${product.img})`}"></div>
        <div class="anons__price">{{product.price | splitPrice}} <span>₽</span></div>
        <div @click="onAlertRun(product)" class="anons__btn">Купить</div>
      </div>

      <h3>Характеристики</h3>
      <div class="specification">
        <div v-for="(group, ind) of featuresGroups"
             :key="ind + 'group'"
        >
          <div v-for="(feature, ind) of product[group]"
               :key="ind + 'feature'"
               class="specification__feature"
          >
            <div :class="{'specification__feature-title': !feature.includes('=')}"
                 v-if="feature.includes(' ') || (!feature.includes(' ') && feature.length < 22)"
            >
              {{feature | takeField(0)}}
            </div>
            <div v-if="feature.includes(' ') || (!feature.includes(' ') && feature.length < 22)">
              {{feature | takeField(1)}}
            </div>
          </div>
        </div>
      </div>
    </div>

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
import Vue from "vue";
import {mapActions, mapGetters} from "vuex";
import {Product} from '@/types/shop'
import {BasketMovement, ProductPoint} from '@/types/user'
import Alert from "@/components/alert.vue";

export default Vue.extend({
  components: {
    Alert,
  },
  data: () => ({
    product: {} as Product,
    productPoint: {} as ProductPoint,
    alertUp: false as boolean
  }),
  computed: {
    ...mapGetters([
      'GET_PRODUCT'
    ]),
    featuresGroups() {   //группы характеристик в описании продукта
      let featuresGroup = []

      for (let field in this.product) {
        if (this.product.hasOwnProperty(field)) {
          // @ts-ignore
          if (typeof this.product[field] === 'object') {
            featuresGroup.push(field)
          }
        }
      }
      return featuresGroup
    },
    alertSuffix(): string {
      return `to buy ${this.product.name}`
    },
    basketArgument(): BasketMovement {
      return {shelf: this.product.shelf, _id: this.product._id, vector: 1}
    }
  },
  methods: {
    ...mapActions([
      'MOVE_THE_BASKET_PRODUCT',
      'FETCH_PRODUCT'
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
    },
    takeField: function (val: string, position: number): string {
      return val.split('=')[position]
    },
  },
  created() {
    this.productPoint = {shelf: this.$route.params.shelf, _id: this.$route.params.productId}
    this.product = this.GET_PRODUCT(this.productPoint)

    if (this.product == null)
        // @ts-ignore
      this.FETCH_PRODUCT(this.productPoint)   // Почему TS дает ошибку?? In Basket - work!!
          .then((product: Product) => {
            this.product = product
          })
  }
})
</script>

<style scoped lang="scss">
.cover {
  @extend .wrapper_common;

  .loading {
    width: 100%;
    margin-top: rem(100);
    text-align: center;
    color: $valid;
  }

  .anons {
    @extend .information-place;
    width: 100%;
    height: rem(180);

    &__img {
      width: 100%;
      height: rem(160);
      grid-area: 1 / 1 / span 8 / 1;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    &__price {
      grid-area: 1 / 2 / span 4 / 3;
      align-self: center;
      font-size: rem(20);
      font-weight: 700;
      line-height: rem(30);

      & :last-child {
        color: $grey;
        font-weight: 400;
      }
    }

    &__btn {
      grid-area: 5 / 2 / span 4 / 3;
      align-self: start;
      width: 100%;
      @extend .btn_common;
      background: $orange;
      border-color: $orange;
      color: $white;
    }

  }

  .specification {
    box-sizing: border-box;
    padding: rem(10) rem(10) rem(40) rem(40);

    background: $white;
    background-origin: padding-box;

    &__feature {
      display: grid;
      grid-template-columns: rem(260) 1fr;
      grid-column-gap: rem(60);
      grid-auto-rows: rem(20);

      &-title {
        font-weight: 900;
        grid-row: span 3;
        align-self: end;
        margin-bottom: rem(10);
      }
    }
  }

}

</style>
