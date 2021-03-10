<template>
  <div class="cover">
    <h2>Entrance in to your privat space</h2>
    <div class="forms">
      <h2 v-if="isRegistrationInterface" class="forms__registration">Enter your registration data</h2>
      
      <div v-for="(field, key, ind) in forms" :key="ind" class="forms__field">
        <h2 v-if="(field.name !== 'password confirm') || isRegistrationInterface"
            :class="{
              'error': $v.forms[key].value.$error,
              'valid': !$v.forms[key].value.$invalid && forms[key].value
            }"
        >
          {{field.name}}
        </h2>
        <input :type="field.inputType"
               v-model="field.value"
               :placeholder="field.placeholder"
               v-mask="field.mask ? field.mask : ''"
               @blur="$v.forms[key].value.$touch()"
               v-if="(field.name !== 'password confirm') || isRegistrationInterface"
        >
      </div>
      
      <div v-if="!isRegistrationInterface"
           @click="onLogin"
           class="forms__btn_login"
      >
        Take it
      </div>
      
      <div v-if="!isRegistrationInterface" class="forms__signature">
        If you are't resident take a
        <span @click="onSwitchToTheRegistrationInterface">
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
// @ts-ignore
import AwesomeMask from 'awesome-mask'
import axios from 'axios'
import {LoginForms} from "@/types/auth"
import {minLength, required, sameAs} from 'vuelidate/lib/validators'
import {isPhone, isPassword} from '@/utils/validation.ts'


export default Vue.extend({
  data: () => ({
    forms: {
      login: {
        name: 'login',
        value: '',
        placeholder: '(906) 075-19-75',
        mask: '(999) 999-99-99',
        inputType: 'text'
      },
      password: {
        name: 'password',
        value: '',
        placeholder: 'at least 5 signs',
        inputType: 'password'
      },
      passwordConfirm: {
        name: 'password confirm',
        value: '',
        placeholder: 'it must be the same as the password',
        inputType: 'password'
      }
    } as LoginForms,
    isRegistrationInterface: false as boolean,
  }),
  validations: {
    forms: {
      login: {
        value: {
          required,
          isPhone,
          async isUnique(value: string): Promise<any> | boolean {
            //заменитель директивы .lezy у v-modal
            //...
            
            if (value === '' && !this.isRegistrationInterface)
              return true
            return axios.get(`api/checkOutAuthData/${value}`)
          }
        }
      },
      password: {
        value: {minLength: minLength(5), required, isPassword}
      },
      passwordConfirm: {
        value: {
          // @ts-ignore
          sameAs: sameAs(function (): string {
          // @ts-ignore
            return this.forms.password.value
          })
        }
      }
    }
  },
  methods: {
    onLogin(): void {
      //Если пытаемся отправить, но поле - не заполнялось, то незаполненное поле отметится красным.
      this.$v.$touch()
      
      //устраняем влияние незадействованного поля passwordConfirm, иначе this.$v.forms.$anyError будет давать false.
      this.forms.passwordConfirm.value = this.forms.password.value
      
      //посылаем запрос на аутентификацию
      if (!this.$v.forms.$anyError) {
      
      
      }
      
      
      
      
      
      
    },
    onSwitchToTheRegistrationInterface(): void {
      //обнуляем результаты предыдущей возможной попытки валидации (если были попытки заполнить форму на первом этапе login'a)
      for (let formValue of Object.values(this.forms)) {
        formValue.value = ''
      }
      // @ts-ignore
      this.$v.$reset()
      //включаем интерфейс для регистрации
      this.isRegistrationInterface = true
    },
    onRegistrationIsDone(): void {
      console.log('onRegistrationIsDone ======')
      //Если пытаемся отправить, но поле - пустое, то отмечаем незаполненное поле красным.
      //...
      
      //посылаем запрос на регистрацию
      if (!this.$v.forms.$anyError) {
      
      }
      
      
    }
  },
  directives: {
    'mask': AwesomeMask
  }
})
</script>

<style scoped lang="scss">
.error {
  color: $error;
}

.valid {
  color: $valid;
}

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