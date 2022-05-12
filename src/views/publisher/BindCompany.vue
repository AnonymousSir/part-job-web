<template>
  <div class="bind_company">
    <div class="container">
      <h1>完善公司信息</h1>
      <div class="form-contaienr">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          size="large"
        >
          <el-form-item label="公司全称" prop="company_name">
            <el-input v-model="ruleForm.company_name" />
          </el-form-item>
          <el-form-item label="公司规模" prop="company_scale">
            <el-input v-model="ruleForm.company_scale" />
          </el-form-item>
          <el-form-item label="所属行业" prop="industry">
            <el-input v-model="ruleForm.industry" />
          </el-form-item>
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="ruleForm.contacts" />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="ruleForm.phone" />
          </el-form-item>
          <el-form-item label="公司地址" prop="company_address">
            <el-input v-model="ruleForm.company_address" />
          </el-form-item>
          <el-form-item label="公司简介">
            <el-input
              v-model="ruleForm.company_profile"
              type="textarea"
              placeholder="公司简介"
              :show-word-limit="true"
              clearable
              :autosize="{ minRows: 2, maxRows: 6 }"
              resize="none"
              maxlength="500"
            />
          </el-form-item>
          <el-form-item>
            <el-button class="submit" type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { deleteCookie } from '../../utils/myCookie'

export default {
  name: 'bind_company',
  setup() {
    const { proxy: { $axios } } = getCurrentInstance()
    const router = useRouter()
    const dataState = reactive({
      ruleFormRef: null,
      ruleForm: {
        company_name: '',
        company_scale: '',
        industry: '',
        contacts: '',
        phone: '',
        company_address: '',
        company_profile: ''
      },
      rules: {
        name: [
          { required: true, message: '请填写公司名称', trigger: 'blur' },
          { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
        ],
        company_name: [
          { required: true, message: '请填写公司名称', trigger: 'blur' },
        ],
        company_scale: [
          { required: true, message: '请选择公司规模', trigger: 'blur' },
        ],
        industry: [
          { required: true, message: '请选择所属行业', trigger: 'blur' },
        ],
        contacts: [
          { required: true, message: '请填写联系人', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请填写联系电话', trigger: 'blur' },
        ],
        company_address: [
          { required: true, message: '请填写公司地址', trigger: 'blur' },
        ]
      }
    })

    const submitForm = async (formEl) => {
      if (!formEl) return
      await formEl.validate(async (valid, fields) => {
        if (!valid) return
        const { ruleForm } = dataState
        const res = await $axios.post('/company/create', { ...ruleForm })
        console.log(res);
        if (res.code !== 200) return ElMessage.error(res.msg)
        ElMessage.success('公司信息完善成功，请重新登录')
        formEl.resetFields()
        // 清除cookie，并重新登录
        deleteCookie('token')
        router.push('/login')
      })
    }
    return {
      ...toRefs(dataState),
      submitForm
    }
  }
}
</script>

<style lang="less">
  .bind_company {
    width: 100%;
    height: 100%;
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .form-contaienr {
        width: 500px;
        height: 300px;
        .submit {
          width: 200px;
          margin: 0 auto;
        }
      }
    }
  }
</style>