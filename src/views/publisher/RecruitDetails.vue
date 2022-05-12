<template>
  <div class='recruit_details container'>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>岗位信息</el-breadcrumb-item>
      <el-breadcrumb-item>{{information.job_name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container>
      <!-- 左侧信息 -->
      <el-aside>
        <div class="company box_container">
          <img src="../../assets/images/company_default.png">
          <h3>{{company.company_name}}</h3>
          <router-link class="link" to="/publisher_details">
            查看更多信息
            <span class="iconfont icon-youjiantou2"></span>
          </router-link>
        </div>
        <div class="more_post box_container">
          <header>
            <h3>其他岗位</h3>
            <router-link class="more" to="/">
              更多职位
              <span class="iconfont icon-youjiantou2"></span>
            </router-link>
          </header>
          <div class="info">
            <div class="null" v-if="moreInformation.length == 0">暂无其他信息</div>
            <div v-else>
              <div class="job_item" v-for="(item, index) in moreInformation" :key="index">
                <p @click="toDetails(item.id)" class="more_job_name">{{item.job_name}}</p>
                <div class="job_salary">
                  <div>
                    <span class="salary">{{item.salary}}</span>
                    <span>元/{{item.salary_type}}</span>
                  </div>
                  <p>{{item.settlement_time}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-aside>

      <!-- 右侧详情 -->
      <el-main>
        <div class="header box_container">
          <div class="user">
            <div class="user_info">
              <img src="../../assets/images/woman_portrait_default.png" v-if="user.sex == '女'">
              <img src="../../assets/images/man_portrait_default.png" v-else>
              <h3 class="user_name">{{user.nickname}}</h3>
            </div>
            <el-button
              type="success"
              class="btn"
              v-if="!isMyInformation"
            >立即沟通</el-button>
          </div>
          <h4 class="job_name title_color">{{information.job_name}}</h4>
          <div class="info">
            <div class="salary">
              <strong class="salary_num">{{information.salary}}</strong>
              <span>元/{{information.salary_type}}</span>
            </div>
            <span>{{information.settlement_time}}</span>
            <span class="separate">|</span>
            <span>{{information.job_type}}</span>
            <span class="separate">|</span>
            <span>{{information.people_num}}人</span>
          </div>
          <join-button
            v-if="!isMyInformation"
            :info="information"
            @success="successHandler"
            class="sign_up"
          ></join-button>
        </div>
        <div class="details box_container">
          <h4 class="title_color">职位详情</h4>
          <div class="tags">
            <div class="tag">{{information.sex}}</div>
            <div class="tag">{{information.age}}</div>
            <div class="tag">{{information.education}}</div>
          </div>
          <div class="content">
            {{information.details}}
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCookie } from '../../utils/myCookie'
import joinButton from '../../components/JoinButton.vue'

export default {
  name: 'recruit_details',
  components: { joinButton },
  setup(props, context) {
    const { proxy: {$axios} } = getCurrentInstance()
    const route = useRoute()
    const router = useRouter()
    // 没有传入id
    if (!route.query.id) {
      router.push('/')
    }
    const dataState = reactive({
      information: {},
      user: {},
      company: {},
      moreInformation: []
    })
    
    // 获取初始化的数据
    async function getInitData() {
      const city = localStorage.getItem('city') || '北京'
      const userInfo = JSON.parse(localStorage.getItem('userInfo')) || ''
      // 获取招聘信息
      const informationData = await $axios({
        methods: 'get',
        url: '/company/getJobInfo',
        params: {
          id: route.query.id,
          user_id: userInfo.id || ''
        }
      })
      console.log(informationData);
      dataState.information = informationData.data[0]

      // 获取用户信息
      const userData = await $axios.get(`/users/getUser?id=${informationData.data[0].user_id}`)
      dataState.user = userData.data[0]

      // 获取发布该的招聘信息的用户信息
      const companyData = await $axios.get(`/company/getCompany?id=${informationData.data[0].company_id}`)
      dataState.company = companyData.data[0]
      
      // 获取该用户发布的其他信息
      const moreInformationData = await $axios({
        methods: 'get',
        url: '/company/getJobInfoList',
        params: {
          publisher_id: informationData.data[0].user_id,
          limit: 5
        }
      })
      console.log(moreInformationData);
      dataState.moreInformation = moreInformationData.data.filter(i => i.id != route.query.id)
    }
    getInitData()
    const toDetails = async (id) => {
      await router.push('/recruit_details?id=' + id)
      router.go(0)
    }

    const userSex = computed(() => {
      return dataState.user.sex == '男' ? '/assets/images/man_portrait_default.png' : '../../assets/images/woman_portrait_default.png'
    })
    // 是否是自己发布的招聘信息
    const isMyInformation = computed(() => {
      const token = getCookie('token')
      const userInfo = JSON.parse(localStorage.getItem('userInfo')) || ''

      if (!token || !userInfo) return false
      if (dataState.user.id === userInfo.id) return true
      return false
    })

    // 报名成功的回调
    const successHandler = (state) => {
      dataState.information.ex_state = state
    }
    return {
      ...toRefs(dataState),
      toDetails,
      userSex,
      isMyInformation,
      successHandler
    }
  }
}
</script>

<style lang="less">
  .recruit_details {
    color: #707077;

    .title_color {
      color: #4B4B4B;
    }
    .box_container {
      width: 100%;
      background-color: #fff;
      box-sizing: border-box;
      margin: 20px 0;
    }
    .el-aside .box_container {
      width: 280px;
    }
    .el-main .box_container {
      width: 750px;
    }

    .el-breadcrumb {
      margin: 20px;
    }
    .el-container {
      display: flex;
      justify-content: space-between;
      // margin-top: 30px;
      .el-aside {
        width: 280px;
        .company {
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img {
            width: 100px;
            height: 100px;
          }
          h3 {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .link {
            width: 100%;
            color: #4b4b4b;
            border-top: 1px dashed #ccc;
            text-align: center;
            padding-top: 20px;
          }
        }
        .more_post {
          padding: 20px;
          box-sizing: border-box;
          header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            h3 {
              font-size: 16px;
              &::before {
                content: '';
                display: inline-block;
                width: 5px;
                height: 15px;
                margin-right: 10px;
                background-color: #06c962;
              }
            }
            .more {
              font-size: 14px;
              .iconfont {
                font-size: 14px;
              }
            }
          }
          .info {
            .null {
              text-align: center;
            }
            .job_item {
              width: 100%;
              border-bottom: 1px dashed #ccc;
              &:nth-last-child(1) {
                border-bottom: none;
              }
              .more_job_name {
                width: 240px;
                font-size: 16px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                cursor: pointer;
              }
              .job_salary {
                font-size: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .salary {
                  color:#FD8000;
                  font-size: 14px;
                  margin-right: 3px;
                }
              }
            }
          }
        }
      }
      .el-main {
        flex: 0 0 auto;
        padding-top: 0;
        .header {
          padding: 30px 40px;
          .user {
            display: flex;
            justify-content: space-between;
            align-items: center;
            // padding: 10px 20px;
            margin-bottom: 10px;
            .user_info {
              flex: 1;
              img {
                float: left;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin-right: 10px;
              }
              // .user_name {
              //   float: right;
              // }
            }
          }
          .job_name {
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 28px;
          }
          .info {
            display: flex;
            align-items: center;
            font-size: 14px;
            .salary {
              margin-right: 40px;
              .salary_num {
                font-size: 18px;
                color: #FD8000;
                margin-right: 5px;
              }
            }
          }
          .sign_up {
            height: 45px;
            width: 130px;
            margin-top: 30px;
          }
        }
        .details {
          padding: 30px 40px;
          & > h4 {
            font-size: 20px;
          }
          .tags {
            display: flex;
            .tag {
              font-size: 14px;
              padding: 4px 10px;
              margin: 0 10px;
              background: #fafafa;
              border-radius: 5px;
            }
          }
        }
        .content {
          white-space: pre-line;
          font-size: 16px;
          color: #707070;
          line-height: 28px;
          word-break: break-all;
          word-wrap: break-word;
          margin-top: 20px;
        }
      }
    }
    
  }
</style>