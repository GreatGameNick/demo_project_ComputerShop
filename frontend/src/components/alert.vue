<template>
  <div class="alert-fon">
    <div class="alert">
      <div class="alert__title">
        <div>A YOU SURE</div>
        <div>{{slogan}} "{{item.name}}" ?</div>
      </div>

      <div class="alert__btns">
        <button @mouseup="onChoice('yes')" class="alert__btn">YES</button>
        <button @mouseup="onChoice('abort')" class="alert__btn">abort</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    yesFunction: {
      type: Function,
      required: true
    },
    slogan: {
      type: String,
      required: true
    }
  },
  methods: {
    onChoice(type) {
      if (type === 'yes')
        this.yesFunction({shelf: this.item.shelf, _id: this.item._id, vector: 1})
      this.$emit('alertDown')
    }
  }
}
</script>

<style lang="scss" scoped>
.alert-fon {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: transparent;

  .alert {
    position: absolute;
    width: 50vw;
    max-width: 250px;
    height: 30vh;
    max-height: 100px;
    left: 10%;
    top: 10%;
    padding: 8%;
    background-color: $white;
    border: $grey 1px solid;
    opacity: 1;
    transition: all 1s ease;
    margin-left: 0;

    &__title {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      font-size: 18px;

      :first-child {
        color: $valid;
        margin-bottom: 5px;
      }
    }

    &__btns {
      display: flex;
      flex-flow: row wrap;
      width: 100%;
      align-self: flex-end;
      justify-content: space-between;
      margin: 60px 0 0;

      .alert__btn {
        width: 44%;
        min-width: 70px;
        min-height: 20px;
        height: fit-content;
      }

      .alert__btn:hover {
        background-color: $grey;
        color: white;
        transition: all ease .1s;
        cursor: pointer;
      }
    }
  }
}
</style>