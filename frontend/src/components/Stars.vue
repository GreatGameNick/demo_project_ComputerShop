<template>
  <div class="stars">
    <div class="stars__icon">
      <div class="stars__icon-internal"
           :style="{borderBottom: `#F2C94C ${starsCount * 3}px solid`}"
      >
      </div>
    </div>
    <div class="stars__count">
      {{ starsCount }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Stars',
  props: {
    starsCount: {
      type: Number,
      required: true
    }
  }
})
</script>

<style scoped lang="scss">
.stars {
  @extend .flex-center;

  &__icon {
    width: 14px;
    height: 14px;
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    background: $yellow;
    @extend .flex-center;

    &-internal {
      box-sizing: border-box;
      width: 11px;
      height: 11px;
      clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
      background: $white;
    }
  }

  &__count {
    margin-left: rem(3);
    @extend .font_8-bold;
    color: $yellow;
  }
}

</style>
