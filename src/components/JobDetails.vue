<template>
  <div class='job_details'>
    <div class="job_container">
      <div class="job_title">
        <strong class="title">
          <router-link class="title" :to="'/recruit_details?id='+ data.id">{{data.job_name}}</router-link>
        </strong>
        <span class="time">发布时间: {{timer(data.time)}}</span>
      </div>
      <div class="job_info">
        <div class="info_column">
          <span>工作时间: {{data.job_date}}</span>
          <span>工作类型: {{data.job_type}}</span>
        </div>
        <div class="info_column">
          <span>城市: {{data.city}}</span>
          <span>招聘人数: {{data.people_num}}人</span>
        </div>
        <div class="info_column">
          <span>薪资: {{data.salary}}/{{data.salary_type}}</span>
          <span>结算方式: {{data.settlement_time}}</span>
        </div>
      </div>
      <div class="tags">
        <el-tag class="tag">{{data.sex}}</el-tag>
        <el-tag class="tag">{{data.age}}</el-tag>
        <el-tag class="tag">{{data.education}}</el-tag>
      </div>
    </div>
    <slot name="right"></slot>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
  name: 'job_details',
  props: ["data"],
  setup(props, context) {
    const dataState = reactive({
      
    })
    
    function timer(time) {
      const d = new Date(Number(time))
      let year = d.getFullYear()
      let month = d.getMonth()
      let day = d.getDate()
      return `${year}年${month}月${day}日`
    }
    return {
      ...toRefs(dataState),
      timer
    }
  }
}
</script>

<style lang="less">
  .job_details {
    min-width: 1000px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    margin: 10px 0;
    padding: 20px;
    .job_container {
      flex: 1;
      margin-right: 50px;
      .job_title {
        // max-width: 778px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 20px 20px 0;
      }
      .job_info {
        display: flex;
        
        .info_column {
          margin-right: 20px;
          display: flex;
          flex-direction: column;
          font-size: 12px;
          color: #999;
          span {
            width: 200px;
            margin: 5px 0;
          }
        }
      }
      .tags {
        margin: 10px 0;
        .tag {
          margin: 0 5px;
        }
      }
    }
  }
  
</style>