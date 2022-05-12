import { ElMessage, ElLoading } from 'element-plus'
import $axios from '../utils/request'
import { createRouter, createWebHashHistory } from 'vue-router'

import Demo from '../views/demo'
import Home from '../views/home/Home'
// 懒加载
// 主页子路由
const Index = () => import('../views/home/Index')
const RecruitDetails = () => import('../views/publisher/RecruitDetails')
const ReleasePages = () => import('../views/publisher/ReleasePages')
const Personal = () => import('../views/users/Personal')
const UserLetter = () => import('../views/users/UserLetter')
const PublisherDetails = () => import('../views/publisher/PublisherDetails')
// 我要招聘的子路由
const PersonalCenter = () => import('../views/publisher/PersonalCenter')
const BindCompany = () => import('../views/publisher/BindCompany')
const ReleasePosition = () => import('../views/publisher/ReleasePosition')
const ReleaseManagement = () => import('../views/publisher/ReleaseManagement')
const ReleaseLetter = () => import('../views/publisher/ReleaseLetter')
const ChangeJobInfo = () => import('../views/publisher/ChangeJobInfo')
const ExamineParticipate = () => import('../views/publisher/ExamineParticipate')
// 用户个人中心
const ChangeUserDetails = () => import('../views/users/ChangeUserDetails')
const MyParticipate = () => import('../views/users/MyParticipate')
// 单独的登录和注册
const Login = () => import('../views/users/login/Login')
const Register = () => import('../views/users/login/Register')
const ChangePassword = () => import('../views/users/login/ChangePassword')
// 其他
const Page404 = () => import('../views/Page404/Page404')

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      // /index/s0o0
      // :type  ->  sx:结算方式 ox:排序方式 x数字
      // 城市从localStorage中取
      // 工作分类从?lable中取  ->  pid-xxx
      { path: '/', redirect: '/index' },
      { path: '/index', component: Index },
      { path: '/index/:type', name: 'index_type', component: Index },
      // 招聘管理
      {
        path: 'release_pages',
        component: ReleasePages,
        meta: { isLogin: true, isRelease: true },
        children: [
          { path: '', name: 'personal_center', component: PersonalCenter },
          { path: 'bind_company', name: 'bind_company', component: BindCompany },
          { path: 'release_position', name: 'release_position', component: ReleasePosition },
          { path: 'examine_participate', name: 'examine_participate', component: ExamineParticipate },
          { path: 'release_management', name: 'release_management', component: ReleaseManagement },
          { path: '/release_pages/release_management/change_job_info', name: 'change_job_info', component: ChangeJobInfo },
          { path: 'release_letter', name: 'release_letter', component: ReleaseLetter },
        ],
      },
      // 普通用户个人中心
      {
        path: 'personal',
        name: 'personal',
        component: Personal,
        meta: { isLogin: true },
        children: [
          { path: '', name: 'change_user_details', component: ChangeUserDetails },
          { path: 'my_participate', name: 'my_participate', component: MyParticipate }
        ]
      },
      { path: 'user_letter', name: 'user_letter', component: UserLetter },
      // 不在顶部导航栏上的
      { path: '/recruit_details', name: 'recruit_details', component: RecruitDetails },
      { path: '/publisher_details', name: 'publisher_details', component: PublisherDetails },
    ]
  },

  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/change_password', name: 'change_password', component: ChangePassword },
  { path: '/demo', name: 'demo', component: Demo },

  // 404
  { path: '/404', name: '404', component: Page404 },
  // vue-router 4.x写法
  { path: '/:pathMatch(.*)', redirect: '/404' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

let loadingInstance = null
// 路由拦截，进行登录判断
router.beforeEach(async (to, from, next) => {
  // 加载动画
  loadingInstance = ElLoading.service({ fullscreen: true })
  const { isLogin, isRelease } = to.meta
  // 需要登录的页面
  if (isLogin) {
    // 验证token
    const res = await $axios.post('/users/verifyToken')
    if (res.code !== 200) {
      ElMessage.error('登录信息错误，请重新登录!')
      return next('/login')
    }
    if (to.path === '/release_pages/bind_company') return next()
    // 是否是需要完善公司信息
    if (isRelease && res.data.usertype == '1') {
      // 通过用户类型来判断用户是否填写过公司信息
      // 1普通用户  5可以发布信息(填写过公司信息)  9管理员
      ElMessage.error('发布招聘信息，需要先完善公司资料')
      return next('/release_pages/bind_company')
    }
  }
  next()
})
// 页面加载后关闭加载动画
router.afterEach((to, from) => {
  loadingInstance.close()
})

export default router
