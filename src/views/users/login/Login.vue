<template>
  <div class="login">
    <router-link to='/' class="goback-home"><el-button round type="danger">返回首页</el-button></router-link>
    <h1>账号密码登录</h1>
    <div class="main-container">
      <el-form
        class="demo-ruleForm"
        size="large"
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
      >
        <el-form-item
          class="form_label"
          label="账号"
          prop="username"
        >
          <el-input
            v-model.trim="ruleForm.username"
            placeholder="请输入账号"
          />
        </el-form-item>
        <el-form-item
          class="form_label"
          label="密码"
          prop="password"
        >
          <el-input
            v-model.trim="ruleForm.password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <div class="remember-labels">
            <el-checkbox v-model="isToken">7天免登录</el-checkbox>
            <span class="retrieve-password" @click="toChangePassword">修改密码</span>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="btns">
            <el-button
              class="btn"
              type="primary"
              @click="login(ruleFormRef)"
            >登录</el-button>
            <el-button
              class="btn"
              @click="register"
            >注册</el-button>
          </div>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { reactive, toRefs, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'login',
  setup(props, context) {
    const { proxy: { $axios } } = getCurrentInstance()
    const router = useRouter()
    const dataState = reactive({
      isToken: true,
      ruleFormRef: null,
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { min: 8, max: 16, message: '账号长度为8~16位', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 8, max: 16, message: '密码长度为8~16位', trigger: 'blur' },
        ]
      }
    })

    // 登录
    const login = async (formRef) => {
      if (!formRef) return
      // 验证表单
      formRef.validate(async (valid, fields) => {
        // 表单错误就return
        if (!valid) return ElMessage.error('账号或密码格式错误')

        const { username, password } = dataState.ruleForm
        const { isToken } = dataState

        const result = await $axios.post('/users/login', { username, password, isToken })
        console.log(result);
        
        if (result.code !== 200) return ElMessage.error(result.msg)
        localStorage.setItem('userInfo', JSON.stringify(result.data))
        ElMessage.success('登录成功!')
        router.push('/index')
      })
    }
    // 注册页面
    const register = () => {
      router.push('/register')
    }
    // 修改密码页面
    const toChangePassword = () => {
      router.push('/change_password')
    }
    
    return {
      ...toRefs(dataState),
      login,
      register,
      toChangePassword
    }
  }
}
</script>

<style lang="less">
  .login {
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
        background: transparent;
      }
    }
    h1 {
      color: #fff;
    }
    .main-container {
      width: 500px;
      height: 300px;
      padding: 50px 80px;
      border-radius: 50px;
      // background-color: pink;
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
          // width: 50%;
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
      height: 300px;
      border-radius: 50px;
      z-index: -1;
      background-color: rgba(255, 255, 255, 0.35);
      backdrop-filter: blur(59px);
    }
  }
</style>