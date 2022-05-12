<template>
  <!-- 全局设置element-plus的语言 -->
  <el-config-provider :locale="locale">
    <div class="app">
      <router-view class="views" />
    </div>
  </el-config-provider>
</template>

<script>
import { ElConfigProvider  } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default {
  name: 'app',
  components: { ElConfigProvider  },
  setup() {
    return {
      locale: zhCn
    }
  }
}
</script>

<style lang="less">
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  #app {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
  }
  .app {
    width: 100%;
    height: 100%;
    .views {
      width: 100%;
      height: 100%;
    }
  }
</style>
