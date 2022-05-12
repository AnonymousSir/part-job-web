<template>
  <!-- 报名按钮 -->
  <el-button
    @click="participate"
    :type="btnType"
    :disabled="!info.state || !!info.ex_state || !!info.post_state || isMyInformation"
  >{{btnContent}}</el-button>
</template>

<script>
import { reactive, toRefs, computed, getCurrentInstance } from 'vue'
import { getCookie } from '../utils/myCookie'
import { ElMessage } from 'element-plus'

export default {
  props: ["info"],
  emits: ["success"],
  setup(props, context) {
    const { proxy: {$axios} } = getCurrentInstance()
    const dataState = reactive({

    })
    
    const participate = async () => {
      const { info } = props
      // 验证是否登录
      const token = getCookie('token')
      let userInfo = JSON.parse(localStorage.getItem('userInfo')) || ''
      // 用户信息为空就清除登录信息，并跳转到登录页
      if (!userInfo || !token) {
        router.push('/login')
        deleteCookie('token')
        localStorage.removeItem('userInfo')
        return
      }

      if (userInfo.id === info.user_id) {
        return ElMessage.error('不能参加自己发布的招聘!')
      }
      
      const res = await $axios.post('/communicate/exParticipate', {
        user_id: userInfo.id,
        information_id: info.id,
        publisher_id: info.user_id
      })
      if (res.code !== 200) return ElMessage.error(res.msg)

      context.emit('success', 1)
      ElMessage.success('报名成功!')
    }

    // 报名按钮显示的文字
    const btnContent = computed(() => {
      let content = '报名参加'
      const { info } = props
      if (info.ex_state) {
        content = '审核中'
      }
      if (info.post_state == '1') {
        content = '已报名'
      }
      if (info.post_state == '2') {
        content = '未通过'
      }
      if (!info.state) {
        content = '截止报名'
      }
      return content
    })
    //:type="info.state ? info.ex_state ? 'warning' : 'success' : 'info'"
    const btnType = computed(() => {
      const { info: {ex_state, post_state, state} } = props
      let type = 'success'
      if (ex_state) type = 'warning'
      if (post_state == '1') type = 'success'
      if (post_state == '2') type = 'danger'
      if (!state) type = 'info'
      return type
    })

    // 是否是自己发布的信息
    const isMyInformation = computed(() => {
      const token = getCookie('token')
      const userInfo = JSON.parse(localStorage.getItem('userInfo')) || ''

      if (!token || !userInfo) return false
      if (props.info.user_id === userInfo.id) return true
      return false
    })
    return {
      ...toRefs(dataState),
      participate,
      btnContent,
      btnType,
      isMyInformation
    }
  }
}
</script>

<style lang="less">
  
</style>