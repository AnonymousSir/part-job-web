<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="header-container not_user_select container">
          <div class="logo_box">
            <h3 class="logo">logo</h3>
            <span>全部<span class="iconfont icon-jiantou"></span></span>
          </div>
          <div>
            <el-menu
              :default-active="activeIndex"
              class="el-menu-demo"
              mode="horizontal"
              background-color="#ffffff"
              router
              :ellipsis="false"
            >
              <el-menu-item index="/index">首页</el-menu-item>
              <el-menu-item index="/release_pages">招聘管理</el-menu-item>
              <el-menu-item index="/personal">个人中心</el-menu-item>
              <el-menu-item index="/user_letter">消息</el-menu-item>
              <el-menu-item index="/login">登录</el-menu-item>
              <el-menu-item index="/register">注册</el-menu-item>
            </el-menu>
          </div>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'home',
  setup() {
    const route = useRoute()

    const selectIndexArr = ['/index', '/release_pages', '/personal', '/letter']
    const activeIndex = computed(() => {
      // 获取path地址
      let path = route.path
      
      // 判断path地址是否是以/xxx开头的(/xxx 为对应显示的一级路由的导航的路由地址)
      const index = selectIndexArr.findIndex(i => path.startsWith(i))
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
  .home {
    & > .el-container {
      .el-header {
        width: 100%;
        height: 56px;
        background-color: #fff;
        border-bottom: 2px solid #eee;
        box-shadow: 0 3px 12px rgb(98 107 181 / 25%);
        .header-container {
          height: 56px;
          // font-size: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          // padding: 0 40px;
          box-sizing: border-box;
          .logo_box {
            display: flex;
            justify-content: center;
            align-items: center;
            .logo {
              margin-right: 10px;
            }
          }
          .el-menu-demo {
            height: 56px;
            background-color: transparent;
            user-select:none;
            .el-menu-item {
              font-size: 16px;
            }
          }
          .el-menu--horizontal {
            border-bottom: none;
          }
        }
      }
    }
    & > .el-container > .el-main {
      padding: 0;
      width: 100%;
      height: calc(100vh - 56px);
      box-sizing: border-box;
    }
    overflow-x: hidden;
    overflow-y: hidden;
  }
</style>