<template>
  <div class="wrapper">
    <div v-for="(product, ind) in GET_PRODUCTS($route.params.shelf)"
         :key="ind"
         @click.exact="onGoToProductDescription(product._id)"
    >
      <product-cart :product="product" class="cart"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ProductCart from "@/components/productCart.vue";
import {mapActions, mapGetters} from "vuex";

export default Vue.extend({
  components: {
    ProductCart
  },
  computed: {
    ...mapGetters([
      'GET_PRODUCTS'
    ])
  },
  methods: {
    ...mapActions([
      'FETCH_PRODUCTS'
    ]),
    onGoToProductDescription(_id: any) {
      this.$router.push(`/${this.$route.params.shelf}/${_id}`)
    }
  },
  created() {
    this.FETCH_PRODUCTS(this.$route.params.shelf)
  }
});
</script>

<style lang="scss">
.wrapper {
  @extend .wrapper_common;
  
  width: 100%;
  display: flex;
  margin-top: rem(-10);
  flex-flow: wrap row;
  justify-content: space-between;
  
  @media (max-width: 760px) {
    justify-content: space-around;
  }
  
  .cart {
    width: rem(260);
    height: rem(400);
    margin: rem(10) rem(1) 0 rem(1);
    cursor: pointer;
  }
}
</style>




