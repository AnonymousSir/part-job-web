<template>
  <div class="index">
    <!-- 工作类型 -->
    <header class="container">
      <div class="position">
        <span>职位: </span>
        <div class="type_menu not_user_select">
          <div class="type_menu_item">
            <div class="type_menu_title">
              <span
                :class="[
                  'type_menu_all',
                  activeJob[0] == 'all' && 'active_lable',
                  activeJobTypeTitle == 'all' && 'over_lable'
                ]"
                @click="clickAllLable"
              >全部</span>
            </div>
          </div>
          <div class="type_menu_item"
            v-for="(item, index) in jobTypeList.level0"
            :key="index"
            @mouseover="menuMouseover(item)"
            @mouseout="menuMouseout"
          >
            <div class='type_menu_title'>
              <span
                :class="[
                  'hover_lable',
                  activeJob[0] == index && 'active_lable',
                  activeJobTypeTitle == item && 'over_lable'
                ]"
              >{{item}}</span>
            </div>
            <div
              class="type_list"
              v-show="activeJobTypeTitle == item"
            >
              <div
                :class="[
                  'type_item',
                  'hover_lable',
                  activeJob[1] == lable.title && 'active_lable'
                ]"
                v-for="(lable, lableIndex) in jobTypeList.level1[[index]]"
                :key="lableIndex"
                v-show="activeJobTypeTitle == item"
                @click="selectLable(lable.pid, lable.title)"
              >
                {{lable.title}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="order_container not_user_select container">
      <!-- 结算方式 -->
      <el-dropdown class="settlement_time">
        <div class="el-dropdown-link">
          {{activeSett_type == '不限' ? '结算方式' : activeSett_type}}
          <span class="iconfont icon-sanjiaoxiangxiajiantou"></span>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="index_downmenu">
            <el-dropdown-item
              v-for="(item, index) in settlementTimeList"
              :key="index"
              :class="[item == activeSett_type && 'active']"
              @click="selectSettType(item)"
            >{{item}}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 排序方式 -->
      <div class="order">
        <div
          v-for="(item, index) in orderList"
          :key="index"
          @click="selectOrder(item, index)"
          :class="[
            'order_item',
            activeOrder.value == item.value && 'active_order'
          ]"
        >
          {{item.value}}
        </div>
      </div>
    </div>
    <!-- 招聘信息列表 -->
    <main class="container">
      <div class="information" v-show="jobList.length">
        <recruitment-information
          v-for="(item, index) in jobList"
          :key="item.id" :data="item"
          :index="index"
          @success="succParticipate"
        />
      </div>
      <div v-show="!jobList.length" class="not_data">
        <h3>暂无数据</h3>
      </div>
      <footer v-show="jobTotal">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="pageIndex"
          :page-size="limit"
          :total="jobTotal"
          @current-change="changePage"
        />
      </footer>
    </main>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, toRefs, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import RecruitmentInformation from '../../components/RecruitmentInformation.vue'
import jobType from '../../utils/jobType.json'

export default {
  name: 'index',
  components: { RecruitmentInformation },
  setup() {
    const { proxy: {$axios} } = getCurrentInstance()
    const router = useRouter()
    const route = useRoute()
    const { title, lable } = route.query
    const initData = {
      city: '北京',
      activeJob: ['all', ''],
      activeSett_type: '不限',
      activeOrder: {
        type: 'time',
        value: '最新发布',
        index: 0
      }
    }
    const dataState = reactive({
      activeJob: initData.activeJob,
      activeSett_type: initData.activeSett_type,
      settlementTimeList: ['不限', '日结', '周结', '月结', '完工结', '按件结'],
      activeOrder: initData.activeOrder,
      orderList: [
        { type: 'time', value: '最新发布', index: 0 },
        { type: 'salary', value: '工资最高', index: 1 }
      ],
      jobList: [],
      jobTotal: 0,
      pageIndex: 1,
      limit: 20,
      jobTypeList: [],
      activeJobTypeTitle: ''
    })
    
    // 对信息按要求排序、获取
    function analyzeUrl () {
      const { activeJob, activeSett_type, activeOrder } = initData
      // 工作类型
      if (route.query.lable) {
        const lables = route.query.lable.split('-')
        if (lables.length == 2) {
          dataState.activeJob = lables
        } else {
          dataState.activeJob = activeJob
        }
      } else {
        dataState.activeJob = activeJob
      }

      if (route.params.type) {
        const type = route.params.type
        // 结算方式
        const sett_type = type.match(/s\d/i)
        if (sett_type) {
          const { settlementTimeList } = dataState
          if (sett_type[0][1] >= 0 && sett_type[0][1] < settlementTimeList.length) {
            dataState.activeSett_type = settlementTimeList[sett_type[0][1]]
          } else {
            dataState.activeSett_type = activeSett_type
          }
        } else {
          dataState.activeSett_type = activeSett_type
        }

        // 排序方式
        const order = type.match(/o\d/i)
        if (order) {
          const { orderList } = dataState
          if (order[0][1] >= 0 && order[0][1] < orderList.length) {
            dataState.activeOrder = orderList[order[0][1]]
          } else {
            dataState.activeOrder = activeOrder
          }
        } else {
          dataState.activeOrder = activeOrder
        }
      }
    }
    // 获取初始化数据
    async function getInitData(resetPage=true) {
      // 每次获取数据时添加loading动画增加反馈
      const loadingInstance = ElLoading.service({ fullscreen: true })
      analyzeUrl()
      // 不是分页触发的获取数据就会从第一条开始获取，并重置pageIndex
      if (resetPage) dataState.pageIndex = 1
      const { activeJob, activeSett_type, activeOrder, pageIndex, limit } = dataState
      let userInfo = localStorage.getItem('userInfo') || ''
      let user_id = userInfo ? JSON.parse(userInfo).id : ''
      let settlement_time = activeSett_type == '不限' ? '' : activeSett_type
      let order = activeOrder.type
      const city = route.query.city || ''
      // 获取招聘信息
      const res = await $axios({
        method: 'GET',
        url: '/company/getJobInfoList',
        params: {
          user_id,
          city,
          job_type: activeJob[1],
          settlement_time,
          order,
          skip: (pageIndex-1) * limit,
          limit
        }
      })
      if (res.code !== 200) return ElMessage.error(res.msg || '服务器无响应!')
      dataState.jobList = res.data
      dataState.jobTotal = res.total
      // 获取工作分类标签
      dataState.jobTypeList = jobType
      // 关闭loading
      loadingInstance.close()
    }
    getInitData()
    // 获取排序方式
    function getOrder() {
      const { activeSett_type, settlementTimeList, activeOrder } = dataState
      let s = settlementTimeList.indexOf(activeSett_type)
      let o = activeOrder.index
      return { s, o }
    }
    // 切换条件刷新主页的内容
    async function refreshIndexData (pid, title) {
      const { activeSett_type, settlementTimeList, activeOrder } = dataState
      let s = settlementTimeList.indexOf(activeSett_type)
      let o = activeOrder.index
      let lable = route.query.lable ? `?lable=${route.query.lable}` : ''
      if (pid) lable = title ? `?lable=${pid}-${title}` : lable
      if (pid == 'all') lable = ''
      await router.push(`/index/s${s}o${o}${lable}`)
      // 直接通过url获取改变的数据然后刷新页面数据
      getInitData()
      // 刷新页面可以更方便的获取初始化数据
      // router.go(0)
    }

    // 鼠标移动到标签
    const menuMouseover = (title) => {
      dataState.activeJobTypeTitle = title
    }
    const menuMouseout = () => {
      dataState.activeJobTypeTitle = ''
    }
    // 点击类型标签
    const selectLable = async (pid, title) => {
      if (title === dataState.activeJob[1]) return
      // && 等同于 if (xx) xx()
      pid && refreshIndexData(pid, title)
    }
    // 点击全部标签
    const clickAllLable = async () => {
      route.query.lable && refreshIndexData('all')
    }
    // 选择结算方式
    const selectSettType = async (item) => {
      if ( dataState.activeSett_type === item ) return
      dataState.activeSett_type = item
      refreshIndexData()
    }
    // 排序方式
    const selectOrder = async (item, index) => {
      if (dataState.activeOrder.value === item.value) return
      dataState.activeOrder = {...item, index}

      const { settlementTimeList, activeSett_type } = dataState
      let s = settlementTimeList.indexOf(activeSett_type)
      let lable = route.query.lable ? `?lable=${route.query.lable}` : ''
      await router.push(`/index/s${s}o${index}${lable}`)

      getInitData()
    }
    // 报名按钮
    const succParticipate = ({ state, index }) => {
      dataState.jobList[index].ex_state = state
    }

    // 分页
    const changePage = (pageNum) => {
      dataState.pageIndex = pageNum
      getInitData(false)
    }
    return {
      ...toRefs(dataState),
      menuMouseover,
      menuMouseout,
      selectLable,
      clickAllLable,
      selectSettType,
      selectOrder,
      succParticipate,
      changePage
    }
  }
}
</script>

<style lang="less">
  .index_downmenu {
    li.active {
      color: #FFAA00;
    }
  }
  .index {
    .active_lable {
      color: #FFAA00 !important;
      font-weight: bold;
    }
    .over_lable {
      color: #FFAA00;
      background-color: #FFAA001A;
    }
    .hover_lable:hover {
      color: #FFAA00 !important;
      background-color: #FFAA001A !important;
    }

    .not_data {
      width: 100%;
      // background-color: #fff;
      display: flex;
      justify-content: center;
    }

    & > header {
      background-color: #fff;
      .position {
        font-size: 12px;
        color: #4b4b4b;
        display: flex;
        align-items: center;
        padding: 10px 20px;
        .type_menu {
          position: relative;
          display: flex;
          .type_menu_all {
            padding: 3px 6px;
            position: relative;
            cursor: pointer;
          }
          .type_menu_item {
            margin: 0 10px;
            padding: 10px 0;
            .type_menu_title {
              span {
                padding: 3px 6px;
                position: relative;
                cursor: pointer;
              }
              .over_lable::after {
                content: '';
                position: absolute;
                left: 50%;
                bottom: -11px;
                width: 8px;
                height: 8px;
                background-color: #fff;
                border-top: 1px solid #e4e4e4;
                border-right: 1px solid #e4e4e4;
                transform: translate(-4px, 0px) rotate(-45deg);
                z-index: 20;
              }
            }
            .type_list {
              position: absolute;
              top: 35px;
              left: 0;
              width: 960px;
              background-color: #fff;
              border: 1px solid #e4e4e4;
              box-shadow: 0 2px 2px 0 rgb(0 0 0 / 6%);
              padding: 15px 20px;
              display: flex;
              flex-wrap: wrap;
              box-sizing: border-box;
              z-index: 10;
              .type_item {
                padding: 3px 6px;
                margin: 5px 10px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
    .order_container {
      font-size: 12px;
      height: 46px;
      line-height: 46px;
      color: #4b4b4b;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      margin: 10px auto;
      padding: 10px 20px;
      box-sizing: border-box;
      .settlement_time {
        cursor: pointer;
      }
      .order {
        display: flex;
        .active_order {
          color: #FFAA00;
        }
        .order_item {
          cursor: pointer;
          margin: 0 6px;
        }
      }
    }
    & > main {
      footer {
        width: 100%;
        margin: 10px 0 20px 0;
        padding: 20px;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }
    }
  }
</style>