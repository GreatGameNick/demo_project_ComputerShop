<template>
  <div class="cover">
    Person {{GET_USER_DATA}}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {mapActions, mapGetters} from 'vuex';

export default Vue.extend({
  name: "Person",
  computed: {
    ...mapGetters([
        'GET_USER_DATA'
    ])
  }
})
</script>

<style scoped lang="scss">

.cover {
  @extend .wrapper_common;
  
}
</style>