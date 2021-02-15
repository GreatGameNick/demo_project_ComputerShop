<template>
  <div class="counter">
    <div @click="PUT_PRODUCT_TO_BASKET(-id)"> - </div>
    <div>{{GET_PRODUCT_AMOUNT(id)}}</div>
    <div @click="PUT_PRODUCT_TO_BASKET(id)"> + </div>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from "vue";
import {mapMutations, mapGetters} from "vuex";

export default Vue.extend({
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'GET_PRODUCT_AMOUNT'
    ])
  },
  methods: {
    ...mapMutations([
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
