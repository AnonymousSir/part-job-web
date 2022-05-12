<template>
  <div class='user_letter'>
    <h1>user_letter</h1>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
  name: 'user_letter',
  setup(props, context) {
    const dataState = reactive({})
    return { ...toRefs(dataState) }
  }
}
</script>

<style lang="less">
  
</style>