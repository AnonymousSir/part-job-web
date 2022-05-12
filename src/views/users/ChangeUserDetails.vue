<template>
  <div class='change_user_details'>
    <el-breadcrumb>
      <el-breadcrumb-item to="/index">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>资料修改</el-breadcrumb-item>
    </el-breadcrumb>
    <h3>资料修改</h3>
    <div class="main">
       <el-form
        ref="userRef"
        :model="user"
        :rules="rules"
        :inline="true"
        label-width="90px"
        class="user_form"
        size="large"
      >
        <el-row>
          <el-col :span="6">
            <!-- 修改头像 -->
            <el-form-item label="头像">
              <el-upload
                class="uploader"
                method="post"
                name="pic"
                ref="uploadRef"
                :action="baseURL+'/users/changePortrait'"
                with-credentials
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :on-error="handleError"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                <el-icon v-else class="uploader-icon"><Plus /></el-icon>
                <div class="bc"></div>
                <span class="pic_tip">更换头像</span>
              </el-upload>
            </el-form-item>
            <el-form-item label="性别" prop="esx">
              <el-radio-group v-model="user.sex">
                <el-radio value="男" label="男" />
                <el-radio value="女" label="女" />
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="18">
            <el-row>
              <el-col :span="12">
                <el-form-item label="昵称" prop="nickname">
                  <el-input v-model="user.nickname" maxlength="20" />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="user.phone" maxlength="11" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="user.email" maxlength="45" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学历" prop="education">
                  <el-input v-model="user.education" maxlength="10" />
                </el-form-item>
                <el-form-item label="职业" prop="occupation">
                  <el-input v-model="user.occupation" maxlength="20" />
                </el-form-item>
                <el-form-item label="出生日期" prop="age">
                  <el-date-picker
                    v-model="user.age"
                    type="date"
                    placeholder="出生日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- 描述 -->
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="个人描述"
              prop="details"
              class="textarea">
              <el-input
                minlength="400px"
                v-model="user.details"
                type="textarea"
                maxlength="1000"
                show-word-limit
                :autosize="{ minRows: 4, maxRows: 9 }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="工作需求"
              prop="demand"
              class="textarea">
              <el-input
                v-model="user.demand"
                type="textarea"
                maxlength="1000"
                show-word-limit
                :autosize="{ minRows: 4, maxRows: 9 }"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item class="sub_item">
              <!-- @click="subForm(userRef)" -->
              <el-button
                type="primary"
                class="sub_btn"
                v-mythrottle="'click', [subForm, userRef], 1000"
              >提交修改</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="sub_item">
              <el-button class="sub_btn" @click="resetForm ">取消修改</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

    </div>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, nextTick } from 'vue'
import config from '../../config'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'change_user_details',
  components: { Plus },
  setup(props, context) {
    const { proxy: {$axios} } = getCurrentInstance()
    const dataState = reactive({
      baseURL: config.requestConfig.baseURL,
      imgUrl: '',
      uploadRef: null,
      userRef: null,
      user: {
        sex: '男',
        nickname: '',
        phone: '',
        email: '',
        education: '',
        occupation: '',
        age: '',
        details: '',
        demand: '',
      },
      rules: {
        nickname: [
          { required: true, message: '昵称不能为空', trigger: 'blur' },
        ]
      }
    })
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || ''
    let userData = {}
    async function getInitData () {
      const user = await $axios.get('/users/getUserDetails?id='+userInfo.id)
      dataState.imgUrl = user.data[0].pic_url
      userData = user.data[0]
      dataState.user = {...user.data[0]}
      console.log('user:',dataState.user)
    }
    getInitData()

    const handleAvatarSuccess = (response, uploadFile) => {
      dataState.imgUrl = URL.createObjectURL(uploadFile.raw)
      ElMessage.success('更换头像成功!')
    }
    const handleError = () => {
      ElMessage.error('更换头像失败!')
    }

    const beforeAvatarUpload = (rawFile) => {
      console.log(rawFile);
      const idJPG = (rawFile.type==='image/jpeg') || (rawFile.type==='image/jpg') || (rawFile.type==='image/png');
      //上传文件的大小
      const isLt2M = (rawFile.size / 1024 / 1024 ) < 2;
      if (!idJPG){
        ElMessage.error("上传的图片只能是jpg或png格式")
        return false;
      }
      if (!isLt2M){
        ElMessage.error("上传的图片大小不能超过2MB")
        return false;
      }
      return true;
    }
    // 提交修改
    const subForm = async (formEl) => {
      if (!formEl) return
      await formEl.validate(async (valid, fields) => {
        if (!valid) return
        const { nickname, sex, phone, email, education, occupation, age, details, demand } = dataState.user
        const id = userInfo.id
        const res = await $axios.post('users/changeUserDetails', {
          id, nickname, sex, phone, email, education, occupation, age, details, demand
        })
        console.log(res);
        ElMessage.success('修改成功')
      })
    }
    // 取消修改
    const resetForm = () => {
      dataState.user = {...userData}
    }

    return {
      ...toRefs(dataState),
      handleAvatarSuccess,
      handleError,
      beforeAvatarUpload,
      subForm,
      resetForm
    }
  }
}
</script>

<style lang="less">
  .change_user_details {
    .uploader .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .uploader .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .uploader .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
    .main {
      margin-top: 20px;
      box-sizing: border-box;
      .user_form {
        box-sizing: border-box;
        .uploader {
          img {
            width: 100px;
            height: 100px;
          }
          .bc {
            width: 100%;
            height: 26px;
            position: absolute;
            bottom: 0;
            background-color: #fff;
            z-index: 99;
            opacity: 0.3;
          }
          .pic_tip {
            position: absolute;
            bottom: 3px;
            color: #ddd;
            z-index: 9;
            font-size: 12px;
          }
        }
        .textarea {
          width: 90%;
          min-width: 400px;
        }
        .el-textarea {
          width: 100% !important;
          min-width: 100% !important;
        }
        .el-textarea__inner {
          width: 100% !important;
          min-width: 100% !important;
        }
      }
      .sub_item {
        margin-top: 50px;
        display: flex;
        align-items: center;
        .sub_btn {
          margin: 0 auto;
        }
      }
    }

  }
</style>