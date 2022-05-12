<template>
  <div class="release_management">
    <el-breadcrumb>
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>招聘管理</el-breadcrumb-item>
      <el-breadcrumb-item>职位管理</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>职位管理</h1>
    <!-- 信息列表 -->
    <div class="job_list">
      <div
        class="job_item"
        v-for="(item, index) in postList"
        :key="item.id"
      >
        <job-details :data="item">
          <template #right>
            <div class="btns">
              <el-button type="primary" @click="tochangeJobInfo(item.id)">修改</el-button>
              <el-button type="danger" @click="delateJobInfo(item.id, index)">删除</el-button>
              <el-button type="warning" @click="toExamineParticipate(item.id, item.job_name)">审核</el-button>
            </div>
          </template>
        </job-details>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import JobDetails from '../../components/JobDetails.vue'

export default {
  name: 'release_management',
  components: { JobDetails },
  setup() {
    const { proxy: {$axios} } = getCurrentInstance()
    const router = useRouter()
    const dataState = reactive({
      postList: []
    })
    
    async function getInitData() {
      const userInfo = JSON.parse(localStorage.getItem('userInfo')) || ''
      const res = await $axios({
        methods: 'get',
        url: '/company/getJobInfoList',
        params: {
          publisher_id: userInfo.id
        }
      })
      if (res.code !== 200) return ElMessage.error(res.msg || '服务器错误!')
      dataState.postList = res.data
    }
    getInitData()

    const tochangeJobInfo = (id) => {
      router.push('/release_pages/release_management/change_job_info?id='+id)
    }
    const delateJobInfo = async (id, index) => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo')) || ''
      const res = await $axios.post('/company/delateInformation', { id , user_id: userInfo.id})
      console.log(res);
      if (res.code !== 200) return ElMessage.error(res.msg)

      ElMessage.success(res.msg)
      dataState.postList.splice(index, 1)
    }
    const toExamineParticipate = (id, job_name) => {
      router.push(`/release_pages/examine_participate?id=${id}&job_name=${job_name}`)
    }

    function timer(time) {
      const d = new Date(Number(time))
      let year = d.getFullYear()
      let month = d.getMonth()
      let day = d.getDate()
      return `${year}年${month}月${day}日`
    }
    return {
      ...toRefs(dataState),
      tochangeJobInfo,
      delateJobInfo,
      toExamineParticipate,
      timer
    }
  }
}
</script>

<style lang="less">
  // .release_management {

  // }
</style>