<template>
  <div class="cover">
    <div>
      Person {{GET_USER_LOGIN}}
    </div>
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
  & :not(:first-child) {
    margin-top: rem(15);
  }
}
</style>