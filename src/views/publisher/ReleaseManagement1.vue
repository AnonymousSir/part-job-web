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
        <div class="job_container">
          <div class="job_title">
            <strong class="title">
              <router-link class="title" :to="'/recruit_details?id='+ item.id">{{item.job_name}}</router-link>
            </strong>
            <span class="time">发布时间: {{timer(item.time)}}</span>
          </div>
          <div class="job_info">
            <div class="info_column">
              <span>工作时间: {{item.job_date}}</span>
              <span>工作类型: {{item.job_type}}</span>
            </div>
            <div class="info_column">
              <span>城市: {{item.city}}</span>
              <span>招聘人数: {{item.people_num}}人</span>
            </div>
            <div class="info_column">
              <span>薪资: {{item.salary}}/{{item.salary_type}}</span>
              <span>结算方式: {{item.settlement_time}}</span>
            </div>
          </div>
          <div class="tags">
            <el-tag class="tag">{{item.sex}}</el-tag>
            <el-tag class="tag">{{item.age}}</el-tag>
            <el-tag class="tag">{{item.education}}</el-tag>
          </div>
        </div>
        <div class="btns">
          <el-button type="primary" @click="tochangeJobInfo(item.id)">修改</el-button>
          <el-button type="danger" @click="delateJobInfo(item.id, index)">删除</el-button>
          <el-button type="warning" @click="toExamineParticipate(item.id, item.job_name)">审核</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

export default {
  name: 'release_management',
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
  .release_management {
    .job_list {
      .job_item {
        min-width: 1000px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        margin: 10px 0;
        padding: 20px;
        .job_container {
          flex: 1;
          margin-right: 50px;
          .job_title {
            // max-width: 778px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 20px 20px 0;
          }
          .job_info {
            display: flex;
            
            .info_column {
              margin-right: 20px;
              display: flex;
              flex-direction: column;
              font-size: 12px;
              color: #999;
              span {
                width: 200px;
                margin: 5px 0;
              }
            }
          }
          .tags {
            margin: 10px 0;
            .tag {
              margin: 0 5px;
            }
          }
        }
      }
    }
  }
</style>