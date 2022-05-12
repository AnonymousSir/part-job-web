<template>
  <div
    class="examine_user"
    v-for="(item, index) in data"
    :key="item.id"
    v-if="data.length"
  >
    <div class="info">
      <h3 class="nickname">{{item.nickname}}</h3>
      <el-tag v-if="item.sex">性别: {{item.sex || '未填写'}}</el-tag>
      <el-tag>出生日期: {{item.age || '未填写'}}</el-tag>
      <el-tag>学历: {{item.education || '未填写'}}</el-tag>
    </div>
    <div class="btns">
      <el-button
        type="success"
        @click="examine(item.ex_id, item.part_id, index, 1)"
        v-if="type == 1 ? false : true"
      >同意</el-button>
      <el-button
        type="danger"
        @click="examine(item.ex_id, item.part_id, index, 2)"
        v-if="type == 2 ? false : true"
      >拒绝</el-button>
    </div>
  </div>
  <h3 v-else>暂无数据</h3>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'examine_user',
  props: {
    data: {
      type: Array
    },
    type: {
      type: [String, Number],
      default: 0
    }
  },
  emits: ["removeItem"],
  setup(props, context) {
    const { proxy: {$axios} } = getCurrentInstance()
    const router = useRouter()
    const route = useRoute()
    if (!route.query.id) {
      router.push('/index')
    }

    const dataState = reactive({
      data: []
    })

    const changeHandleClick = (name) => {
      console.log(name)
    }
    // 审核按钮
    const examine = async (ex_id, part_id, index, type) => {
      // props传入type表示是已经审核过的，需要修改state
      let url = props.type ? '/communicate/updateState' : '/communicate/examine'

      const res = await $axios.post(url, { ex_id, part_id, type })
      console.log(res);
      if (res.code !== 200) return ElMessage.error(res.msg || '服务器错误!')
      // dataState.data.splice(index, 1)
      context.emit('removeItem', { index })
    }

    return {
      ...toRefs(dataState),
      changeHandleClick,
      examine
    }
  }
}
</script>

<style lang="less">
  .examine_user {
    background-color: #fff;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0;
    .info {
      display: flex;
      align-items: center;
      .nickname {
        color: #68c5b8;
        margin-right: 20px;
      }
      .el-tag {
        margin: 0 5px;
      }
    }
  }
</style>