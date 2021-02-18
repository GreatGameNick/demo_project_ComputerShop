<template>
  <div class="counter">
    <div @click="PUT_PRODUCT_TO_BASKET({shelf: productPoint.shelf, _id: productPoint._id, vector: -1})"> - </div>
    <div>{{GET_PRODUCT_BASKET_AMOUNT(productPoint)}}</div>
    <div @click="PUT_PRODUCT_TO_BASKET({shelf: productPoint.shelf, _id: productPoint._id, vector: 1})"> + </div>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from "vue";
import {mapGetters, mapActions} from "vuex";
import {ProductPoint} from "@/types";

export default Vue.extend({
  props: {
    productPoint: {
      type: Object as PropType<ProductPoint>,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'GET_PRODUCT_BASKET_AMOUNT'
    ])
  },
  methods: {
    ...mapActions([
      'PUT_PRODUCT_TO_BASKET'
    ])
  },
})
</script>

<style scoped lang="scss">
.counter {
  display: flex;
  justify-content: space-between;
  border: $grey 1px solid;

  & :first-child, & :last-child {
    width: rem(25);
    cursor: pointer;
  }
  & * {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
