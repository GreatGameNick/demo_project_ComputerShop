<template>
  <div class="alert-fon">
    <h1 class="alert">
        {{tooltip}}
    </h1>
  </div>
</template>

<script>
import {mapMutations} from "vuex"

export default {
  props: {
    tooltip: {
      type: String,
      required: true
    },
  },
  methods: {
    ...mapMutations([
      'SET_CLARIFICATION'
    ]),
  },
  mounted() {
    setTimeout(() => this.SET_CLARIFICATION(''), 6000)   //самоустранение алерта
  }
}
</script>

<style lang="scss" scoped>
.alert-fon {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  
  .alert {
    position: absolute;
    width: 50vw;
    max-width: 250px;
    height: 30vh;
    max-height: 100px;
    left: 10%;
    top: 10%;
    padding: 8%;
    background-color: $white-opasity;
    border: $grey-opasity 1px solid;
    margin-left: 0;
    
    color: $valid;
    text-align: center;
    transition: all 1s ease;
  }
}
</style>