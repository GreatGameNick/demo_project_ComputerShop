<template>
  <div class="wrapper">
    <header>
      <h1 @click="onThrowToShop" class="logo">
        Computer shop
      </h1>
      <div @click="onThrowToBasket" class="basket">
        <div>
          {{GET_BASKET_POINTS.length}}
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
import Vue from 'vue'
import {mapActions, mapGetters} from 'vuex';

export default Vue.extend({
  data: () => ({
    shelves: [         //сделать из запроса о количестве библиотек
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
    ]
  }),
  computed: {
    ...mapGetters([
      'GET_BASKET_POINTS',
      'GET_IS_BASKET_POINTS'
    ]),
  },
  methods: {
    ...mapActions([
      'FETCH_BASKET_POINTS'
    ]),
    onThrowToShop(): void {
      if (this.$route.query.startPath) {
        this.$router.push(`${this.$route.query.startPath}`)  //переход из корзины to prevision root shelf.
      } else {
        let pathChunks = this.$route.path.split('/')
        if (pathChunks.length > 2)
          this.$router.push('/' + pathChunks[1])   //переход на корень того shelf'a, где клиент до того находился.
      }
    },
    onThrowToBasket(): void {
      let startPath = this.$route.path.split('/')[1]
      if (startPath === 'basket')    //если мы уже находимся в Корзине, то пресекаем редирект на себя самого.
        return
      this.$router.push({path: '/basket', query: {startPath}})
    },
  },
  async created() {
    if (!this.GET_IS_BASKET_POINTS)
      await this.FETCH_BASKET_POINTS()
  }
})
</script>

<style lang="scss">
$appMediaPoint_1: 530px;

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
      
      @media (max-width: $appMediaPoint_1) {
        display: none; //доделать @медиа надо на оч малых размерах
      }
    }
  }
}
</style>
