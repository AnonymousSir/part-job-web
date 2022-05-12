<template>
  <div class='personal'>
    <el-container>
      <el-aside width="200px">
        <el-menu
          active-text-color="#ffd04b"
          background-color="#545c64"
          class="el-menu-vertical-demo"
          :default-active="activeIndex"
          text-color="#fff"
          router
        >
            <el-menu-item index="/personal"><span class="iconfont icon-zhiweiguanli"></span>资料修改</el-menu-item>
            <el-menu-item index="/personal/my_participate"><span class="iconfont icon-tianjia"></span>我的报名</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { reactive, toRefs, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'personal',
  setup(props, context) {
    const route = useRoute()

    const selectIndexArr = ['/personal', '/personal/my_participate']
    const activeIndex = computed(() => {
      // 获取path地址
      let path = route.path
      if (path == '/personal') return '/personal'
      // 判断path地址是否是以/xxx开头的(/xxx 为对应显示的一级路由的导航的路由地址)
      const index = selectIndexArr.findIndex(i => path.startsWith('/personal'+i))
      if (index !== -1) {
        // 如果是则返回一级路由的导航的路由地址
        return selectIndexArr[index]
      }
      return path
    })
    
    return {
      activeIndex
    }
  }
}
</script>

<style lang="less">
  .personal {
    width: 100%;
    height: 100%;
    .el-container {
      height: 100%;
    }
    .el-aside {
      height: 100%;
      background-color: #545c64;
      padding: 20px 0;
    }
    .el-main {
      min-width: 1000px;
    }
    .el-menu-vertical-demo {
      border-right: none;
      .iconfont {
        // margin-right: 10px;
        padding-right: 10px;
      }
    }
  }
</style>