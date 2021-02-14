<template>
  <div class="bundle">
    <div class="shelf">
      <div v-for="(product, ind) in GET_PRODUCTS($route.path)"
           :key="ind"
           @click="productDescription(product._id)"
      >
        <product-cart :product="product" class="shelf__cart"/>
      </div>
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
    productDescription(_id: any) {
      this.$router.push(`/${this.$route.params.shelf}/${_id}`)
    }
  },
  created() {
    this.FETCH_PRODUCTS(this.$route.params.shelf)
  }

});
</script>

<style lang="scss">
.bundle {
  width: 100%;

  .shelf {
    width: 100%;
    display: flex;
    box-sizing: border-box;
    margin-top: rem(-10);
    padding: 0 rem(10);
    flex-flow: wrap row;
    justify-content: space-between;

    @media (max-width: 760px) {
      justify-content: space-around;
    }

    &__cart {
      width: rem(260);
      height: rem(400);
      margin: rem(10) rem(1) 0 rem(1);
      cursor: pointer;
    }
  }
}
</style>




