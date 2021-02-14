<template>
  <div class="wrapper">
    <h3>{{product.name}}</h3>
    <div class="anons">
      <div class="anons__img" :style="{backgroundImage: `url(${product.img})`}"></div>
      <div class="anons__price">{{product.price | splitPrice}} <span>₽</span></div>
      <div @click="onPutProductToBasket(product._id)" class="anons__btn">Купить</div>
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
          <div :class="{'specification__feature-title': !feature.includes('=')}">{{feature | takeName}}</div>
          <div>{{feature | takeValue}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {mapGetters, mapMutations} from "vuex";

export default Vue.extend({
  data: () => ({
    product: {}
      // {
      //   "shelf": "laptops",
      //   "code": 1135341,
      //   "name": "Noutbook-7",
      //   "description": "nice",
      //   "price": 20000,
      //   "img": "/api/imgs/laptops/nout1.jpeg",
      //   "starsCount": 5,
      //   "manufactureNotes": {
      //     "sectionName": "Информация производителя",
      //     "country": "Страна производитель=China",
      //     "release": "Год выпуска=2005",
      //     "warranty": "Гарантия=12 мес"
      //   },
      //   "specification": {
      //     "sectionName": "Описание продукта",
      //     "screenSize": "Диагональ экрана=27'",
      //     "color": "Цвет=желтый",
      //     "processor": "Тип процессора=Pentium II",
      //     "mass": "Масса=5кг",
      //   },
      //   "additionalInformation": {
      //     "sectionName": "Дополнительная информация",
      //     "delay": "Срок поставки=в течении 3 недель"
      //   }
      // }
  }),
  computed: {
    ...mapGetters([
      'GET_PRODUCT'
    ]),
    featuresGroups() {
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
    }
  },
  filters: {
    splitPrice: function (val: number): string {
      let [a, b, c, ...rest] = val.toString().split('').reverse()
      return [rest.reverse().join(''), ' ', c, b, a].join('')
    },
    takeName: function (val: string): string {
      return val.split('=')[0]
    },
    takeValue: function (val: string): string {
      return val.split('=')[1]
    }
  },
  methods: {
    ...mapMutations([
      // 'PUT_PRODUCT_TO_BASKET'
    ]),
    onPutProductToBasket(_id: number): void {
      // this.PUT_PRODUCT_TO_BASKET(_id)
      // this.$router.push('/Basket')
    }
  },
  created() {
    this.product = this.GET_PRODUCT({shelf: this.$route.params.shelf, _id: this.$route.params.productId})
  }
})
</script>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  box-sizing: border-box;
  padding-left: rem(20);
  
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
