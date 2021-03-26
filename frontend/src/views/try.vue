<template>
  <div class="cover">
    <div class="forms">
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
               @blur="$v.forms[key].value.$touch()"
        >
      </div>

      <div @click="onLogin" class="forms__btn_login" >LOGIN</div>
    </div>
  </div>
</template>

<script>
import {minLength, required} from 'vuelidate/lib/validators'

export default {
  data: () => ({
    forms: {
      login: {
        name: 'login',
        value: '',
        placeholder: '(906) 075-19-75',
      }
    },
    isRegistrationInterface: false,
  }),
  validations() {
    return {
      forms: {
        login: {
          value: {
            required,
            minLength: minLength(3)
          }
        }
      }
    }
  },
  methods: {
    onLogin() {
      this.$v.$touch()
      console.log('onLogin ===========')

      if(this.$v.forms.$dirty && !this.$v.forms.$anyError) {
        console.log('YES ===========')
      }
    },
  }
}
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

      &_link, span {
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
