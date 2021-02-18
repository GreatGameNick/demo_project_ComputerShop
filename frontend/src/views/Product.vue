<template>
  <div class="wrapper">
    <div>
      <h3>{{product.name}}</h3>
      <div class="anons">
        <div class="anons__img" :style="{backgroundImage: `url(${product.img})`}"></div>
        <div class="anons__price">{{product.price | splitPrice}} <span>₽</span></div>
        <div @click="MOVE_THE_BASKET_PRODUCT(BasketMovement)" class="anons__btn">Купить</div>
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {mapGetters, mapMutations} from "vuex";
import {BasketMovement} from '@/types'

export default Vue.extend({
  data: () => ({
    product: {}
  }),
  computed: {
    ...mapGetters([
      'GET_PRODUCT'
    ]),
    BasketMovement(): BasketMovement {
      return {shelf: this.$route.params.shelf, _id: this.$route.params.productId, vector: 1}
    },
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
  methods: {
    ...mapMutations([
      'MOVE_THE_BASKET_PRODUCT'
    ])
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
    this.product = this.GET_PRODUCT({shelf: this.$route.params.shelf, _id: this.$route.params.productId})
  }
})
</script>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  box-sizing: border-box;
  padding-left: rem(20);
  
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
