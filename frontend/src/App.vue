<template>
  <div class="wrapper">
    <header>
      <h1 @click="$router.push('/')" class="logo">
        Computer shop
      </h1>
      <div @click="onBasketAppear" class="basket">
        <div>
          7
          <!--          {{ GET_PRODUCTS_FROM_BASKET.length }}-->
        </div>
      </div>
    </header>
    <main>
      <aside>
        <h2>Каталог</h2>
        <div v-for="(shelf, ind) of shelves" :key="ind"
             :class="{'text_current-page': shelf.shelf === $route.params.shelf}"
        >
          {{shelf.shelfName}}
        </div>
      </aside>
      <router-view/>
    </main>


  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {mapActions, mapMutations, mapGetters} from 'vuex';

export default Vue.extend({
  data: () => ({
    shelves: [
      {
        shelf: 'laptops',
        shelfName: 'Ноутбуки'
      },
      {
        shelf: 'mouses',
        shelfName: 'Компьютерная мышь'
      },
      {
        shelf: 'accessories',
        shelfName: 'Аксессуары'
      },
    ],
    isBasketAppear: false
  }),
  computed: {
    ...mapGetters([
      // 'GET_PRODUCTS_FROM_BASKET'
    ]),
  },
  methods: {
    ...mapActions([
      // 'FETCH_PRODUCTS'
    ]),
    ...mapMutations([
      // 'REBUILD_THE_BASKET_FROM_LOCALSTORAGE'
    ]),
    onBasketAppear() {
      this.isBasketAppear = true
    },
  },
})
</script>

<style lang="scss">
body {
  background: $liteGrey;
}
.text_current-page {
  text-decoration: underline;
}
.wrapper {
  max-width: $maxDesktopWidth;
  margin: rem(10) auto;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: rem(40);
    border-top: $black 1px solid;
    border-bottom: $black 1px solid;

    h1 {
      cursor: pointer;

      &:hover {
        color: $grey;
      }
    }

    .basket {
      position: relative;
      width: rem(34);
      height: rem(34);
      margin-right: rem(20);

      background: url('assets/imgs/basket.jpg') center center no-repeat;
      background-size: rem(24) rem(26);
      cursor: pointer;

      &:hover {
        background: url('assets/imgs/basket_grey.jpg') center center no-repeat;
        background-size: rem(24) rem(26);
      }

      & :first-child {
        position: absolute;
        right: 0;
        top: 0;
        width: rem(18);
        height: rem(18);
        background: $green;
        border-radius: 50%;
        @extend .flex-center;
        @extend .font_16_bold;
        color: $white;
      }
    }
  }

  main {
    display: flex;
    margin-top: rem(10);

    aside {
      min-width: rem(160);
      padding-right: rem(20);
      border-right: $black 1px solid;

      & div {
        @extend .font_16_height;
        color: $black;
        cursor: pointer;

        &:hover {
          color: $grey;
        }
      }
    }

  }
}
</style>
