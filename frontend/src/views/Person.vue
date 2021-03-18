<template>
  <div class="cover">
    <h2>
      Privat space <span>for</span> {{GET_USER_LOGIN}}
    </h2>
    <div>
      There is all stuff regarding exactly this person.
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
      'GET_USER_LOGIN'
    ])
  }
})
</script>

<style scoped lang="scss">

.cover {
  @extend .wrapper_common;

  h2 span {
    text-transform: lowercase;
    font-weight: 700;
  }
}
</style>