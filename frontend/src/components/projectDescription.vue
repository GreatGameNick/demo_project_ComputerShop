<template>
  <div class="cover">
    <div v-html="GET_DESCRIPTION.projectPurpose">
    </div>
    
    
    
    
    
    
    
    
    <div>
      <h1>Technologies</h1>
      <p v-for="(technology, ind) in GET_DESCRIPTION.technologies" :key="ind + 'technology'" :data-section="technology.includes(') ')">
        {{ technology }}
      </p>
    </div>
    
    <div>
      <h1>Methodologies</h1>
      <p v-for="(methodology, ind) in GET_DESCRIPTION.methodologies" :key="ind + 'methodology'">
        {{ methodology }}
      </p>
    </div>
    
    <div>
      <h1>Functionalities</h1>
      <p v-for="(functionality, ind) in GET_DESCRIPTION.functionalities" :key="ind + 'functionality'">
        {{ functionality }}
      </p>
    </div>
    
    
    
    <div>
      <p>{{GET_DESCRIPTION.contacts.name}}</p>
      <p>{{GET_DESCRIPTION.contacts.email}}</p>
      <p>{{GET_DESCRIPTION.contacts.phone}}</p>
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
    clarificationArray() {
      for(let key in this.GET_DESCRIPTION) {
        if(typeof this.GET_DESCRIPTION[key] !== 'string') {
        
        }
      }
    }
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
  padding: rem(10);
  
  display: grid;
  grid-template-columns: repeat(5, 20%);
  grid-auto-rows: rem(60);
  color: #333333;
  text-align: left;
  
  border: #269a09 1px solid;
  
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
    }
    
    & > p {
      margin-top: rem(3);
    }
    
    & > p[data-section="true"] {
      color: $purple;
      margin-top: rem(20);
    }
    
    & > p[data-section="true"]:first-of-type {
      margin-top: 0;
    }
  }
  
  &  > :first-child {
    grid-area: 1/1/span 1/span 5;
    text-align: center;
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