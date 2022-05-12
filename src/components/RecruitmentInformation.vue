<template>
  <div class='recruitment_information'>
    <div class="info">
      <h3>
        <router-link class="title" :to="'/recruit_details?id='+ data.id">{{data.job_name}}</router-link>
      </h3>
      <div class="info_detail">
        <div class="info_column">
          <span>工作时间: {{data.job_date}}</span>
          <span>工作类型: {{data.job_type}}</span>
        </div>
        <div class="info_column">
          <span>工作地点: {{data.city}}</span>
          <span>招聘人数: {{data.people_num}}人</span>
        </div>
      </div>
    </div>
    <span class="salary"><span style="color: #ff6600;">{{data.salary}}</span> 元/{{data.salary_type}}<span class="salary_type">{{data.settlement_time}}</span></span>
    <!-- 报名按钮 -->
    <join-button
      :info="data"
      @success="successHandler"
      class="participate"
    ></join-button>
  </div>
</template>

<script>
import { toRefs } from 'vue'
import JoinButton from './JoinButton.vue'

export default {
  name: 'recruitment_information',
  props: ["data", "index"],
  emits: ["success"],
  components: { JoinButton },
  setup(props, context) {
    const successHandler = (state) => {
      context.emit('success', { state, index: props.index })
    }
    return {
      successHandler
    }
  }
}
</script>

<style lang="less">
  .recruitment_information {
    width: 100%;
    // height: 140px;
    background-color: #fff;
    padding: 20px;
    margin: 10px 0;
    display: flex;
    // align-items: center;
    justify-content: center;
    box-sizing: border-box;
    .info {
      flex: 1;
      h3 {
        margin-top: 0;
        color: #000;
        font-size: 16px;
      }
      .title {
        color: #000;
      }
      .info_detail {
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
    }
    .salary {
      margin-right: 30px;
      align-self: center;
      .salary_type {
        margin-left: 10px;
      }
    }
    .participate {
      width: 88px;
      align-self: center;
    }
  }
</style>