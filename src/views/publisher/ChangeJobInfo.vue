<template>
  <div class='change_job_info'>
    <el-breadcrumb>
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>招聘管理</el-breadcrumb-item>
      <el-breadcrumb-item>职位管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改招聘信息</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>修改招聘信息</h1>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="ruleForm"
      size="large"
    >
      <el-form-item label="岗位名称" prop="job_name">
        <el-input
          v-model="ruleForm.job_name"
          placeholder="岗位名称"
        />
      </el-form-item>
      <el-form-item label="招聘人数" prop="people_num">
        <el-input
          v-model.number="ruleForm.people_num"
          placeholder="招聘人数"
        />
      </el-form-item>
      <el-form-item label="工作日期" prop="job_date">
        <div class="job_date">
          <el-checkbox v-model="ruleForm.longTerm" label="长期可做" size="large" />
          <el-date-picker
            v-model="ruleForm.jobDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :disabled="ruleForm.longTerm"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
        </div>
      </el-form-item>
      <el-form-item label="薪资" prop="salary">
        <el-input
          v-model.number="ruleForm.salary"
          placeholder="薪资"
        >
          <template #append>
            <el-select v-model="ruleForm.salary_type" placeholder="元 / 天" style="width: 110px">
              <el-option
                v-for="item in salary_typeArr"
                :key="item"
                :label="'元 / ' + item"
                :value="item"
              ></el-option>
            </el-select>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="结算方式" prop="settlement_time" style="width: 100%">
        <el-select v-model="ruleForm.settlement_time" placeholder="日结">
          <el-option
            v-for="item in settlementMet_modArr"
            :key="item"
            :label='item'
            :value='item'
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别">
        <el-select
          v-model="ruleForm.sex"
          class="sex_select"
          placeholder="性别不限"
          size="large"
        >
          <el-option
            v-for="(item, index) in sexArr"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄">
        <div class="age_slider">
          <el-checkbox v-model="ruleForm.ageUnlimited" label="年龄不限" size="large" />
          <span>{{ruleForm.ageArr[0]}}岁</span>
          <el-slider
            v-model="ruleForm.ageArr"
            :max="100"
            :disabled="ruleForm.ageUnlimited"
            range
          />
          <span>{{ruleForm.ageArr[1]}}岁</span>
        </div>
      </el-form-item>
      <el-form-item label="学历要求">
        <el-select
          v-model="ruleForm.education"
          class="education_select"
          placeholder="学历不限"
          size="large"
        >
          <el-option
            v-for="(item, index) in educationArr"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所在城市">
        <!-- el-select-v2 是数据量大时的优化版，能提高性能 -->
        <el-select-v2
          v-model="ruleForm.city"
          :options="cityArr"
          placeholder="北京"
          size="large"
          filterable
        />
      </el-form-item>
      <el-form-item label="工作类型">
        <el-select-v2
          v-model="ruleForm.job_type"
          :options="postLabelsArr"
          placeholder="其他"
          size="large"
          filterable
        />
      </el-form-item>
      <el-form-item label="工作地址" prop="address">
        <el-input
          v-model="ruleForm.address"
          placeholder="工作地址"
        />
      </el-form-item>
      <el-form-item label="岗位描述" prop="details">
        <el-input
          type="textarea"
          v-model="ruleForm.details"
          placeholder="岗位描述"
          :show-word-limit="true"
          clearable
          :autosize="{ minRows: 2, maxRows: 6 }"
          resize="none"
          maxlength="1500"
        />
      </el-form-item>
      <el-form-item>
        <!-- 自定义指令-节流 [type [fn, args], time, immediate] -->
        <el-button type="primary" v-mythrottle="['click', [subForm, ruleFormRef], 1000]">修改信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import city_type from '../../utils/city.json'
import postLabels from '../../utils/jobType.json'

export default {
  name: 'change_job_info',
  setup(props, context) {
    const { proxy: {$axios} } = getCurrentInstance()
    const router = useRouter()
    const route = useRoute()
    if (!route.query.id) {
      router.push('/')
    }
    const validateJobDate = (rule, value, callback) => {
      const length = dataState.ruleForm.jobDate || false
      if (!dataState.ruleForm.longTerm && !length) {
        callback(new Error('请选择工作日期'))
        return
      }
      callback()
    }
    const dataState = reactive({
      ruleFormRef: null,
      sexArr: ['性别不限', '男', '女'],
      educationArr: ['学历不限', '技校/中专', '高中', '专科', '本科', '硕士', '博士'],
      salary_typeArr: ['小时', '天', '周', '月', '件'],
      settlementMet_modArr: ['日结', '周结', '月结', '完工结', '按件结'],
      cityArr: [],
      postLabelsArr: [],
      ruleForm: {
        job_name: '',
        people_num: '',
        working_date: '长期可做',
        longTerm: false,
        jobDate: null,
        salary: 0,
        salary_type: '天',
        settlement_time: '日结',
        sex: '性别不限',
        ageUnlimited: false,
        ageArr: [18, 60],
        education: '学历不限',
        city: '北京',
        job_type: '其他',
        address: '',
        details: '',
      },
      rules: {
        job_name: [
          { required: true, message: '请填写岗位名称', trigger: 'blur' },
        ],
        people_num: [
          { required: true, message: '请填写招聘人数', trigger: 'blur' },
          { message: '只能填写数字', type: 'number', trigger: 'blur' },
        ],
        job_date: [
          { validator: validateJobDate, trigger: 'change' }
        ],
        salary: [
          { required: true, message: '请填写工作薪资', trigger: 'blur' },
          { message: '只能填写数字', type: 'number', trigger: 'blur' },
        ],
        city: [
          { required: true, message: '请选择所在工作地点', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '请填写工作地址', trigger: 'blur' },
        ],
        details: [
          { required: true, message: '请填写岗位相关信息', trigger: 'blur' },
        ]
      }
    })
    // 初始化数据
    async function getInitData() {
      // 获取城市列表数据
      dataState.cityArr = Array.from(city_type.city.map(item => {
        return {
          value: item.title,
          label: item.title,
          options: item.list.map(city => ({
            value: city,
            label: city
          }))
        }
      }))
      // 获取职位标签
      dataState.postLabelsArr = Array.from(postLabels.level1.map((item, index) => {
        return {
          label: postLabels.level0[index],
          value: postLabels.level0[index],
          options: Array.from(item.map(i => {
            return {
              label: i.title,
              value: i.title
            }
          }))
        }
      }))

      // 获取招聘信息
      const jobInfoData = await $axios.get('/company/getJobInfo?id='+route.query.id)
      console.log(jobInfoData);
      if (jobInfoData.code !== 200) return
      const { job_name, people_num, job_date, salary, salary_type, settlement_time, sex, age, education, city, job_type, address, details } = jobInfoData.data[0]
      let longTerm, jobDate, ageUnlimited, ageArr
      longTerm = (job_date == '长期可做')
      jobDate = longTerm ? null : job_date.split('~')
      ageUnlimited = (age == '年龄不限')
      ageArr = ageUnlimited ? [18, 60] : age.replace('岁', '').split('~').map(i => Number(i))

      dataState.ruleForm = {
        ...{job_name, salary, salary_type, settlement_time, sex, age, education, city, job_type, address, details},
        longTerm, jobDate, ageUnlimited, ageArr,
        people_num: Number(people_num)
      }
    }
    getInitData()
    // 修改
    const subForm = (formEl) => {
      if (!formEl) return
      formEl.validate(async (valid, fields) => {
        if (!valid) return ElMessage.error('请将信息填写完整!')

        const { job_name, people_num, salary, salary_type, settlement_time, sex, ageUnlimited, ageArr, education, city, job_type, address, details, longTerm, jobDate } = dataState.ruleForm
        const job_date = longTerm ? '长期可做' : `${jobDate[0]}~${jobDate[1]}`
        const age = ageUnlimited ? '年龄不限' : ageArr[0] == ageArr[1] ? `${ageArr[0]}岁` : `${ageArr[0]}~${ageArr[1]}岁`

        const res = await $axios.post('/company/changeInformation', {
          id: route.query.id,
          job_name, people_num, salary, salary_type, settlement_time, sex, age, education, city, job_type, address, details, job_date
        })
        console.log(res)
        if (res.code !== 200) return ElMessage.error(res.msg)
        ElMessage.success(res.msg)
        formEl.resetFields()
        router.push('/release_pages/release_management')
      })
    }
    return {
      ...toRefs(dataState),
      subForm
    }
  }
}
</script>

<style lang="less">
  .change_job_info {
    .ruleForm {
      width: 600px;
      .job_date {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .age_slider {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-checkbox {
          margin-right: 20px;
        }
        .el-slider {
          // flex: 1;
          width: 300px;
          margin-top: 0;
          margin-left: 12px;
        }
      }
    }
  }
</style>