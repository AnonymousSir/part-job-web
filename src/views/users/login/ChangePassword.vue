<template>
  <div class="change_password">
    <router-link to='/index' class="backhome"><el-button round type="danger">返回首页</el-button></router-link>
    <h1>修改密码</h1>
    <div class="main_container">
      <el-form
        class="rule_form"
        size="large"
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
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
          label="旧密码"
          prop="oldPassword"
        >
          <el-input
            v-model.trim="ruleForm.oldPassword"
            placeholder="请输入旧的密码"
            show-password
          />
        </el-form-item>
        <el-form-item
          class="form_label"
          label="新密码"
          prop="newPassword"
        >
          <el-input
            v-model.trim="ruleForm.newPassword"
            placeholder="请输入新的密码"
            show-password
          />
        </el-form-item>
        <el-form-item
          class="form_label"
          label="确认密码"
          prop="confirmPassword"
        >
          <el-input
            v-model.trim="ruleForm.confirmPassword"
            placeholder="确认密码"
            show-password
          />
        </el-form-item>
        <el-form-item label-width="0">
          <div class="btns">
            <el-button
              class="btn"
              type="primary"
              @click="submit(ruleFormRef)"
            >修改密码</el-button>
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
import { deleteCookie } from '../../../utils/myCookie'

export default {
  name: 'change_password',
  setup(props, context) {
    const { proxy: { $axios } } = getCurrentInstance()
    const router = useRouter()
    // 确认密码验证规则
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '')  return callback(new Error('密码不能为空'))
      if (value !== dataState.ruleForm.newPassword) return callback(new Error("两次密码不相同"))
      callback()
    }
    const dataState = reactive({
      ruleFormRef: null,
      ruleForm: {
        username: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { min: 8, max: 16, message: '账号长度为8~16位', trigger: 'blur' },
        ],
        oldPassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 8, max: 16, message: '密码长度为8~16位', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 8, max: 16, message: '密码长度为8~16位', trigger: 'blur' },
        ],
        confirmPassword: [
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    })

    // 登录
    const submit = async (formRef) => {
      if (!formRef) return
      // 验证表单
      formRef.validate(async (valid, fields) => {
        // 表单错误就return
        if (!valid) return ElMessage.error('填写错误!')

        const { username, oldPassword, newPassword, confirmPassword } = dataState.ruleForm

        const result = await $axios.post('/users/changePassword', { username, oldPassword, newPassword, confirmPassword })
        console.log(result);
        
        if (result.code !== 200) return ElMessage.error(result.msg)
        ElMessage.success('修改成功!')
        deleteCookie('token')
        localStorage.removeItem('userInfo')
        router.push('/login')
      })
    }
    
    return {
      ...toRefs(dataState),
      submit
    }
  }
}
</script>

<style lang="less">
  .change_password {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
    .backhome {
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
    .main_container {
      width: 500px;
      height: 400px;
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
    .main_container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 500px;
      height: 400px;
      border-radius: 50px;
      z-index: -1;
      background-color: rgba(255, 255, 255, 0.35);
      backdrop-filter: blur(59px);
    }
  }
</style>