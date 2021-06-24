<template>
  <div class="cover">
    привет!
  </div>
</template>

<script lang="ts">
export default {

}
</script>

<style scoped lang="scss">
.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 400px;
  cursor: pointer;
  border: #269a09 1px solid;
  
  &::before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(250, 250, 250, 0.7);
    background: url("../assets/imgs/allRight.png") right 100px bottom 15% no-repeat;
    background-size: auto 40%;
    filter: opacity(0.2);
    
  }
}

</style>