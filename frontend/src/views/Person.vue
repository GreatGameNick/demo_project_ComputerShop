<template>
  <div class="cover">
    Person
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {mapActions, mapGetters} from 'vuex';

export default Vue.extend({
  name: "Person"
})
</script>

<style scoped lang="scss">

.cover {
  @extend .wrapper_common;
  
}
</style>