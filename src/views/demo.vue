<template>
  <div class='demo'>
    <h1>demo</h1>
    <div>
      <el-image src="http://localhost:3002/pic/1652326639914x.jpeg">
        <template #error>
          <div class="image-slot">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { Picture } from '@element-plus/icons-vue'

export default {
  name: 'demo',
  components: { Picture },
  setup(props, context) {
    const dataState = reactive({
      
    })
    return {
      ...toRefs(dataState)
    }
  }
}
</script>

<style lang="less">
  .demo {
    .demo-image__error .block {
      padding: 30px 0;
      text-align: center;
      border-right: solid 1px var(--el-border-color);
      display: inline-block;
      width: 49%;
      box-sizing: border-box;
      vertical-align: top;
    }
    .demo-image__error .demonstration {
      display: block;
      color: var(--el-text-color-secondary);
      font-size: 14px;
      margin-bottom: 20px;
    }
    .demo-image__error .el-image {
      padding: 0 5px;
      max-width: 300px;
      max-height: 200px;
      width: 100%;
      height: 200px;
    }

    .demo-image__error .image-slot {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: var(--el-fill-color-light);
      color: var(--el-text-color-secondary);
      font-size: 30px;
    }
    .demo-image__error .image-slot .el-icon {
      font-size: 30px;
    }
  }
</style>