<template>
  <div class="register">
    <div class="goback-home">
    <router-link to='/login'><el-button round type="danger">登录</el-button></router-link>
    <router-link to='/'><el-button round type="danger">返回首页</el-button></router-link>
    </div>
    <h1>账号注册</h1>
    <div class="main-container">
      <el-form
        class="demo-ruleForm"
        size="large"
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item class="form_label" label="昵称" prop="nickname">
          <el-input v-model.trim="ruleForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item class="form_label" label="用户名" prop="username">
          <el-input v-model.trim="ruleForm.username" placeholder="用户名(用于登录，注册后无法修改)" />
        </el-form-item>
        <el-form-item class="form_label" label="密码" prop="password">
          <el-input v-model.trim="ruleForm.password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item class="form_label" label="确认密码" prop="confirmPassword">
          <el-input v-model.trim="ruleForm.confirmPassword" show-password placeholder="请确认密码" />
        </el-form-item>
        <el-form-item class="form_label" label="手机号" prop="phone">
          <el-input v-model.trim="ruleForm.phone" placeholder="请输入手机号(选填)" />
        </el-form-item>
        <el-form-item class="form_label" label="邮箱" prop="email">
          <el-input v-model.trim="ruleForm.email" placeholder="请输入邮箱(选填)" />
        </el-form-item>
        <el-form-item label-width="0">
          <div class="btns">
            <el-button
              class="btn"
              type="primary"
              @click="register(ruleFormRef)"
            >注册</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { deleteCookie } from '../../../utils/myCookie'

export default {
  name: 'login',
  setup() {
    const { proxy: { $axios } } = getCurrentInstance()
    const router = useRouter()
    // 自定义表单验证
    const validateConfirmPassword = (rule, value, callback) => {
      if (!value) return callback('请确认密码')
      if (value !== dataState.ruleForm.password) {
        callback(new Error("两次输入密码不一致"))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      let regTest = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!value) return callback()
      if (!regTest.test(value)) {
        return callback(new Error("手机号码格式不正确"))
      }
      callback()
    }
    const validateEmail = (rule, value, callback) => {
      let regTest = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (!value) return callback()
      if (!regTest.test(value)) {
        return callback(new Error("电子邮箱格式不正确"))
      }
      callback()
    }

    const dataState = reactive({
      ruleFormRef: null,
      ruleForm: {
        nickname: '',
        username: '',
        password: '',
        confirmPassword: '',
        phone: '',
        email: ''
      },
      rules: {
        nickname: [
          { required: true, message: '昵称不能为空', trigger: 'blur' },
          { min: 2, max: 16, message: '昵称长度为2~16位', trigger: 'blur' },
        ],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 8, max: 16, message: '用户名长度为8~16位', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 8, max: 16, message: '密码长度为8~16位', trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, validator: validateConfirmPassword, trigger: 'blur' }
        ],
        phone: [{ validator: validatePhone, trigger: 'blur' }],
        email: [{ validator: validateEmail, trigger: 'blur' }]
      }
    })

    // 注册(节流)
    let isProhibit = false
    const register = (formRef) => {
      if (!formRef || isProhibit) return
      isProhibit = true
      formRef.validate(async (valid, fields) => {
        if (!valid) return

        const { nickname, username, password, phone, email } = dataState.ruleForm
        const result = await $axios.post('/users/create', {
          nickname, username, password, phone, email
        })

        if (result.code !== 200) {
          ElMessage.error(result.msg)
          return
        }

        // 创建成功
        ElMessage.success(result.msg)
        deleteCookie('token')
        router.push('/index')
      })
      setTimeout(() => isProhibit = false, 1000)
    }
    return {
      ...toRefs(dataState),
      register
    }
  }
}
</script>

<style lang="less">
  .register {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
    .goback-home {
      position: absolute;
      top: 10px;
      right: 20px;
      .el-button {
        margin: 0 10px;
        background-color: transparent;
      }
    }
    h1 {
      color: #fff;
    }
    .main-container {
      width: 500px;
      height: 500px;
      padding: 50px 80px;
      border-radius: 50px;
      box-sizing: border-box;
      z-index: 10;
      position: relative;
      .remember-labels {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-content: center;
        .retrieve-password {
          color: #606266;
          cursor: pointer;
        }
      }
      .btns {
        width: 100%;
        display: flex;
        .btn {
          flex: 1;
          height: 40px;
        }
      }
    }
    // 毛玻璃效果
    .main-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 500px;
      height: 500px;
      border-radius: 50px;
      z-index: -1;
      background-color: rgba(255, 255, 255, 0.35);
      backdrop-filter: blur(59px);
    }
  }
</style>