<template>
  <div class="cover">
    <h2>Entrance in to your privat space</h2>
    <div class="forms">
      <h2 v-if="registration" class="forms__registration">Enter your registration data</h2>
      
      <div v-for="(field, key, ind) in forms" :key="ind" class="forms__field">
        <h2 v-if="(field.name !== 'password confirm') || registration"
            :class="{'error': $v.forms[key].value.$error || forms[key].isDirty, 'valid': !$v.forms[key].value.$invalid && forms[key].value.length > 0}"
        >
          {{field.name}}
        </h2>
        <input type="text"
               v-model="field.value"
               :placeholder="field.placeholder"
               v-mask="field.mask ? field.mask : ''"
               @blur="$v.forms[key].value.$touch()"
               v-if="(field.name !== 'password confirm') || registration"
        >
      </div>
      
      <div v-if="!registration"
           @click="onLogin"
           class="forms__btn_login"
      >
        Take it
      </div>
      
      <div v-if="!registration" class="forms__signature">
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
import {LoginForms} from "@/types/auth"
// @ts-ignore
import AwesomeMask from 'awesome-mask'
import {minLength, required, sameAs} from 'vuelidate/lib/validators'
import {isPhone, isPassword} from '@/utils/validation.ts'
// import { validationMixin } from 'vuelidate';


export default Vue.extend({
  // mixins: [validationMixin],
  data: () => ({
    forms: {
      login: {
        name: 'login',
        value: '',
        placeholder: '(906) 075-19-75',
        mask: '(999) 999-99-99',
        isDirty: false
      },
      password: {
        name: 'password',
        value: '',
        placeholder: 'at least 5 signs',
        isDirty: false
      },
      passwordConfirm: {
        name: 'password confirm',
        value: '',
        placeholder: 'it must be the same as the password',
        isDirty: false
      }
    } as LoginForms,
    registration: false as boolean,
  }),
  validations: {
    forms: {
      login: {
        value: {isPhone, required}
      },
      password: {
        value: {minLength: minLength(5), required, isPassword}
      },
      passwordConfirm: {
        value: {
          sameAs: sameAs(function (): string {
            return this.forms.password.value
          })
        }
      }
    }
  },
  methods: {
    onLogin(): void {
      //Если пытаемся отправить, но поле - пустое, то отмечаем незаполненное поле красным.
      for (let formValue of Object.values(this.forms)) {
        if (!formValue.value.length)
          formValue.isDirty = true
      }
      
      //устраняем влияние незадействованного поля passwordConfirm, иначе this.$v.forms.$anyError будет давать false.
      this.forms.passwordConfirm.value = this.forms.password.value
      
      //посылаем запрос на аутентификацию
      let isNoError = !this.$v.forms.$anyError
      if (isNoError && !this.forms.login.isDirty && !this.forms.password.isDirty) {
        // this.AUTH({
        //   login: this.forms.login.value,
        //   password: this.forms.password.value,       //шифрование password'a для упрощения кода - опускаем.
        // })
        //   .then(res => {
        //     //действия после получения ответа с сервера
        //
        //   })
      }
    },
    onSwitchToTheRegistrationInterface(): void {
      //обнуляем результаты предыдущей возможной попытки валидации (если были попытки заполнить форму на первом этапе login'a)
      for (let formValue of Object.values(this.forms)) {
        if (!formValue.value.length)
          formValue.isDirty = false
          formValue.value = ''
      }
      
      // @ts-ignore
      this.$v.$reset()
      this.forms.passwordConfirm.isDirty = false   //его надо присудить ПОСЛЕ this.$v.$reset(), т.к. после резета проходит сравнение, и passwordConfirm.isDirty становиться true вновь.
      
      //включаем интерфейс для регистрации
      this.registration = true
    },
    onRegistrationIsDone(): void {
      //Если пытаемся отправить, но поле - пустое, то отмечаем незаполненное поле красным.
      for (let formValue of Object.values(this.forms)) {
        if (!formValue.value.length)
          formValue.isDirty = true
      }
      
      //посылаем запрос на регистрацию
      let isNoError = !this.$v.forms.$anyError
      if (isNoError && this.forms.login.isDirty && this.forms.password.isDirty) {
      
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