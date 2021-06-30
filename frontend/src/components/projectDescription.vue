<template>
  <div class="cover">
    <div v-for="(volume, key, ind) of GET_DESCRIPTION" :key="ind">
      <h1>{{ key }}</h1>
      <div v-if="typeof volume === 'string'"
           v-html="volume"
      >
      </div>
      <p v-else
         v-for="(row, ind) of volume"
         :key="ind + 'rows'"
         :data-section="row.includes(') ')"
      >
        {{ row }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import {mapActions, mapGetters} from "vuex"

export default {
  computed: {
    ...mapGetters([
      'GET_DESCRIPTION'
    ]),
  },
  methods: {
    ...mapActions([
      'FETCH_DATA_FROM_DISKSTORAGE',
    ])
  },
  async created() {
    // @ts-ignore
    await this.FETCH_DATA_FROM_DISKSTORAGE('projectDescription')
  }
}
</script>

<style scoped lang="scss">
.cover {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  cursor: pointer;
  box-sizing: border-box;
  padding: 0 rem(30) rem(30) rem(30);

  background: rgba(255, 255, 255, 0.8);

  display: grid;
  grid-template-columns: repeat(5, 20%);
  grid-auto-rows: rem(60);
  color: #333333;
  text-align: left;

  &::before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: url("../assets/imgs/allRight.png") right 100px bottom 15% no-repeat;
    background-size: auto 40%;
    filter: opacity(0.2);

  }

  & div {
    height: fit-content;

    & > h1 {
      color: $green-dark;
      box-sizing: border-box;
    }

    & > p {
      margin-top: rem(3);
      border-left: $green-dark 1px solid;
      box-sizing: border-box;
      padding-left: rem(10);
    }

    & > p[data-section="true"] {
      color: $purple;
      margin-top: rem(20);
      border: none;
      padding: 0;
      margin-bottom: rem(7);
    }

    & > p[data-section="true"]:first-of-type {
      margin-top: 0;
    }
  }

  & > :first-child {
    grid-area: 1/1/span 2/span 5;
    text-align: center;
    border: none;
  }

  & :nth-child(4) {
    grid-column: span 3;
  }

  & :last-child {
    grid-column: 4/span 1;
    grid-row: 9/span 1;
  }
}

</style>