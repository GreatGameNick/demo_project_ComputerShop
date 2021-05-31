<template>
  <div class="cover">
    <h2>
      Privat space <span>for</span> {{GET_USER_LOGIN}}
    </h2>
    <div>
      There is all stuff regarding exactly this person.
    </div>
    <div>
      YOU KEEP only <span>{{GET_BASKET_POINTS.length}} {{GET_BASKET_POINTS.length < 2 ? 'product' : 'products' }}</span> in your
      <router-link to="/basket"><u>BASKET</u></router-link>!
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {mapActions, mapGetters} from 'vuex';

export default Vue.extend({
  name: "Person",
  computed: {
    ...mapGetters([
      'GET_USER_LOGIN',
      'GET_BASKET_POINTS'
    ])
  }
})
</script>

<style scoped lang="scss">
.cover {
  @extend .wrapper_common;

  h2 {
    margin-bottom: rem(20);
    color: $green-dark;
  }

  h2 span {
    text-transform: lowercase;
    font-weight: 700;
  }

  & :last-child {
    margin-top: rem(20);

    span {
      color: $green-dark;
    }
  }
  a:hover {
    color: $grey;
  }
}
</style>
