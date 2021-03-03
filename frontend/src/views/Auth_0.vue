<template>
  <div class="login">
    <div class="title">
      Enter your login end password
    </div>

    <form @submit.prevent="onSubmit" class="form">
      <div class="form__account-title"
           :class="{ 'error': $v.form.login.$error || loginNoDirty, 'valid': !$v.form.login.$invalid }"
      >
        Enter your login
      </div>
      <input v-model="form.login"
             @blur="$v.form.login.$touch()"
             type="text"
             class="form__account"
             :placeholder=placeholder
      >

      <div class="form__password-title"
           :class="{'error': $v.form.password.$error || passwordNoDirty, 'valid': !$v.form.password.$invalid}"
      >
        Enter your password
      </div>
      <input v-model="form.password"
             @blur="$v.form.password.$touch()"
             type="text"
             class="form__password"
             :placeholder=placeholder
      >
      <button class="form__btn">
        Log in
      </button>
    </form>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import {required} from 'vuelidate/lib/validators'

  export default {
    data: () => ({
      form: {
        login: '',
        password: ''
      },
      placeholder: 'It would be enough to enter any word',
      loginNoDirty: false,
      passwordNoDirty: false
    }),
    validations: {
      form: {
        login: {
          required
        },
        password: {
          required
        }
      }
    },
    methods: {
      ...mapActions ([
        'AUTH_FORM'
      ]),
      onSubmit() {
        if(!this.$v.form.login.$dirty)
          this.loginNoDirty = true

        if(!this.$v.form.password.$dirty)
          this.passwordNoDirty = true

        if (this.form.login && this.form.password) {
          this.AUTH_FORM(this.form)
            .then (() => this.$router.push('/'))
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login {
    max-width: 700px;
    margin: 40px auto;
    border: $secondary 1px dashed;

    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      font-size: 18px;
      font-weight: 500;
      line-height: 40px;
      text-transform: uppercase;
    }

    .form {
      margin: 30px auto 0;
      display: grid;
      grid-template: repeat(3, 100px) / 40% 60%;
      align-items: center;
      justify-items: center;

      &__account-title, &__password-title {
        font-size: 16px;
        font-weight: 400;
      }

      &__account, &__password, &__btn {
        width: 90%;
        height: 30px;
        text-indent: 20px;
      }

      &__btn {
        grid-column: span 2;
      }

      &__btn:hover {
        background-color: $secondary;
        color: white;
        transition: all ease .2s;
        cursor: pointer;
      }
    }
  }
  .error {
    color: $orange;
  }
  .valid {
    color: $green;
  }

</style>
