<template>
  <div class="cover">
    <div class="title">
      Enter your login end password
    </div>
    <div v-for="(field, ind) in forms" :key="ind" class="field">
      {{field.name}}
      <input type="text"
             v-model="field.value"
             :placeholder="field.placeholder"
      >
    </div>
    <div>= {{forms.phone.value}}</div>
    <div>= {{forms.password.value}}</div>
    <div>if you is't resident take registration!</div>
  </div>
</template>

<script>
export default {
  data: () => ({
    forms: {
      phone: {
        name: 'phone',
        value: '',
        placeholder: 'hit your phone',
        mask: '(999) 999-99-99'
      },
      password: {
        name: 'password',
        value: '',
        placeholder: 'hit your password'
      },
    }
  })
}
</script>

<style scoped lang="scss">
.cover {
  @extend .wrapper_common;
  
  .forms {
    margin: rem(20) auto 0;
  }
  
}

</style>