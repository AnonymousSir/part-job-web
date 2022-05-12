<template>
  <div class='publisher_details'>
    <h1>publisher_details</h1>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
  name: 'publisher_details',
  setup(props, context) {
    const dataState = reactive({
      
    })
    return {
      ...toRefs(dataState)
    }
  }
}
</script>

<style lang="less">
  
</style>