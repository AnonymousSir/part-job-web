<template>
  <div class='examine_participate'>
    <el-breadcrumb>
      <el-breadcrumb-item to="/index">首页</el-breadcrumb-item>
      <el-breadcrumb-item>招聘管理</el-breadcrumb-item>
      <el-breadcrumb-item>岗位审核</el-breadcrumb-item>
      <el-breadcrumb-item>{{job_name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <h1>{{job_name}}</h1> -->
  <el-tabs v-model="activeName" class="tabs" @tab-change="changeTab">
    <!-- 待审核 -->
    <el-tab-pane label="待审核" name="待审核">
      <examine-user :data="examineList" @removeItem="examineList.splice(index, 1)"></examine-user>
    </el-tab-pane>
    <el-tab-pane label="已同意" name="已同意">
      <examine-user :data="succList" type="1" @removeItem="succList.splice(index, 1)"></examine-user>
    </el-tab-pane>
    <el-tab-pane label="已拒绝" name="已拒绝">
      <examine-user :data="failList" type="2" @removeItem="failList.splice(index, 1)"></examine-user>
    </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ExamineUser from '../../components/ExamineUser'

export default {
  name: 'examine_participate',
  components: { ExamineUser },
  setup(props, context) {
    const { proxy: {$axios} } = getCurrentInstance()
    const router = useRouter()
    const route = useRoute()
    if (!route.query.id) {
      router.push('/index')
    }

    const dataState = reactive({
      job_name: '岗位审核',
      activeName: '待审核',
      examineList: [],
      succList: [],
      failList: []
    })
    dataState.job_name = route.query.job_name || '岗位审核'
    const id = route.query.id
    // 获取待审核的信息
    getExPartData(id)

    const changeTab = (name) => {
      console.log(name);
      switch (name) {
        case '待审核':
          getExPartData(id)
          break;
        case '已同意':
          getSuccData(id)
          break;
        case '已拒绝':
          getFailData(id)
          break;
        default:
          break;
      }
    }
    // 审核按钮
    const examine = async (ex_id, index, type=1) => {
      const res = await $axios.post('/communicate/examine', { ex_id, type })
      console.log(res);
      if (res.code !== 200) return ElMessage.error(res.msg || '服务器错误!')
      dataState.examineList.splice(index, 1)
    }

    // 获取数据方法
    async function getExPartData (id) {
      const examineList = await $axios({
        methods: 'get',
        url: '/communicate/getExParticipateList',
        params: { id, }
      })
      dataState.examineList = examineList.data
    }
    async function getSuccData (id) {
      const approvedList = await $axios({
        methods: 'get',
        url: '/communicate/getParticipateList',
        params: { id, state: 1 }
      })
      dataState.succList = approvedList.data
    }
    async function getFailData (id) {
      const failList = await $axios({
        methods: 'get',
        url: '/communicate/getParticipateList',
        params: { id, state: 2 }
      })
      dataState.failList = failList.data
    }

    return {
      ...toRefs(dataState),
      changeTab,
      examine,
    }
  }
}
</script>

<style lang="less">
  .examine_participate {
    .el-tabs__item {
      user-select: none;
    }
    .tabs {
      margin-top: 20px;
    }
  }
</style>