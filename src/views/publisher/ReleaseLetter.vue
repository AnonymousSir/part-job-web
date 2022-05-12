<template>
  <div class='release_letter'>
    <h1>消息</h1>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
  name: 'release_letter',
  setup(props, context) {
    const dataState = reactive({})
    return { ...toRefs(dataState) }
  }
}
</script>

<style lang="less">
  
</style>