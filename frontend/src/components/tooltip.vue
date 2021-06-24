<template>
  <div class="tooltip"
       @mouseenter="makeAlive(true)"
       @mouseleave="makeAlive(false)"
  >
    <h1>
      {{ tooltip }}
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
  data: () => ({
    keepAlive: false,
    timeOut: null
  }),
  methods: {
    ...mapMutations([
      'SET_CLARIFICATION'
    ]),
    makeAlive(vector) {
      if(this.timeOut) {
        clearTimeout(this.timeOut)
        this.timeOut = null
      }
      this.keepAlive = vector
      
      if(!vector) {
        this.SET_CLARIFICATION('')   //устранение tooltip
      }
    }
  },
  mounted() {
    this.timeOut = setTimeout(() => {        //самоустранение tooltip
      this.SET_CLARIFICATION('')
    }, 3000)
  }
}
</script>

<style lang="scss" scoped>
.tooltip {
  position: absolute;
  left: 10%;
  top: 10%;
  
  width: 50%;
  max-width: 250px;
  height: 30%;
  max-height: 100px;
  
  padding: 8%;
  background-color: $white-opasity;
  border: $grey-opasity 1px solid;
  
  color: $valid;
  text-align: center;
  transition: all 1s ease;
  cursor: pointer;
}
</style>