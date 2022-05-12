<template>
  <div class='my_participate'>
    <el-breadcrumb>
      <el-breadcrumb-item to="/index">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>我的报名</el-breadcrumb-item>
    </el-breadcrumb>
    <h3>我的报名</h3>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
  name: 'my_participate',
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