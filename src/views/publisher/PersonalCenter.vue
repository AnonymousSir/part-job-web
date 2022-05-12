<template>
  <div class='personal_center'>
    <el-breadcrumb>
      <el-breadcrumb-item to="/index">首页</el-breadcrumb-item>
      <el-breadcrumb-item>招聘管理</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>个人中心</h1>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance } from 'vue'


export default {
  name: 'personal_center',
  setup(props, context) {
    const { proxy: { $axios }} = getCurrentInstance()
    const dataState = reactive({})

    return {
      ...toRefs(dataState),
    }
  }
}
</script>

<style lang="less">
  
</style>