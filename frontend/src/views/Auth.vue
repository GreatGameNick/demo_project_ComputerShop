<template>
  <div class="cover">
    <h2>Entrance in to your privat space</h2>
    <div class="forms">
      <h2 v-if="registration" class="forms__registration">Enter your registration data</h2>
      
      <div v-for="(field, ind) in forms" :key="ind" class="forms__field">
        <h2>{{field.name}}</h2>
        <input type="text"
               v-model="field.value"
               :placeholder="field.placeholder"
               v-mask="field.mask ? field.mask : ''"
        >
      </div>
      
      <div v-if="!registration" class="forms__btn_login">Take it</div>
      
      <div v-if="!registration" class="forms__signature">
        If you are't resident take a
        <span @click="onPushToTheRegistration">
          registration
        </span>
        !
      </div>
      <div v-else @click="onRegistrationIsDone" class="forms__signature">
        <span>
           You are welcome!
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import {Login} from "@/types"
// @ts-ignore
import AwesomeMask from 'awesome-mask'

export default Vue.extend({
  data: () => ({
    forms: {
      login: {
        name: 'login',
        value: '',
        placeholder: 'hit your phone',
        mask: '(999) 999-99-99'
      },
      password: {
        name: 'password',
        value: '',
        placeholder: 'hit your password'
      }
    } as Login,
    registration: false as boolean
  }),
  methods: {
    onPushToTheRegistration(): void {
      this.registration = true
    },
    onRegistrationIsDone(): void {
      this.registration = false
    }
  },
  directives: {
    'mask': AwesomeMask
  }
})
</script>

<style scoped lang="scss">
.cover {
  @extend .wrapper_common;
  
  .forms {
    display: block;
    width: 100%;
    
    > h2 {
      width: 50%;
      margin-right: auto;
      text-align: right;
      text-decoration: underline;
    }
    
    &__field {
      width: 100%;
      height: fit-content;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      justify-content: flex-start;
      margin: rem(20) auto 0;
      
      & h2 {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 50%;
        box-sizing: border-box;
        padding-right: rem(20);
        
        background: $grey-light;
        
        @media (max-width: 800px) {
          width: rem(300);
        }
      }
      
      input {
        width: rem(300);
        height: rem(40);
        box-sizing: border-box;
        padding-left: rem(7);
        border: none;
        border-bottom: $grey-middle 1px solid;
      }
      
    }
    
    &__btn_login {
      width: 100%;
      margin: rem(30) auto 0 50%;
      @extend .btn_common;
    }
    
    &__signature {
      width: 50%;
      margin-left: auto;
      margin-top: rem(40);
      text-align: left;
      color: $grey;
      
      span {
        color: $valid;
        text-decoration: underline;
        
        &:hover {
          color: $green;
          cursor: pointer;
        }
      }
    }
  }
  
  
}

</style>