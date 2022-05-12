<template>
  <div class='release_pages'>
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
            <el-menu-item index="/release_pages"><span class="iconfont icon-zhiweiguanli"></span>个人中心</el-menu-item>
            <el-menu-item index="/release_pages/release_position"><span class="iconfont icon-tianjia"></span>发布职位</el-menu-item>
            <el-menu-item index="/release_pages/release_management"><span class="iconfont icon-zhiweiguanli"></span>职位管理</el-menu-item>
            <el-menu-item index="/release_pages/release_letter"><span class="iconfont icon-xiaoxi"></span>消息</el-menu-item>
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
  name: 'release_pages',
  setup(props, context) {
    const route = useRoute()

    const selectIndexArr = ['/release_pages', '/release_pages/release_position', '/release_pages/release_management', '/release_pages/release_letter']
    const activeIndex = computed(() => {
      let old = activeIndex
      // 获取path地址
      let path = route.path
      if (path == '/release_pages') return '/release_pages'
      // if (path == '/release_pages/release_management/change_job_info' || path == '/release_pages/examine_participate') return '/release_pages/release_management'
      // 判断path地址是否是以/xxx开头的(/xxx 为对应显示的一级路由的导航的路由地址)
      const index = selectIndexArr.findIndex(i => path.startsWith('/release_pages'+i))
      // const index = selectIndexArr.findIndex(i => path.includes(i))
      if (index !== -1) {
        // 如果是则返回一级路由的导航的路由地址
        return selectIndexArr[index]
      }
      return old
    })
    
    return {
      activeIndex
    }
  }
}
</script>

<style lang="less">
  .release_pages {
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
    // .el-main {
    //   min-width: 1000px;
    // }
    .el-menu-vertical-demo {
      border-right: none;
      .iconfont {
        // margin-right: 10px;
        padding-right: 10px;
      }
    }
  }
</style>