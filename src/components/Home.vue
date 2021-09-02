/* eslint-disable vue/no-duplicate-attributes */
<template>
  <el-container class="home-container">
    <!-- 主页头部 -->
    <el-header>
      <div class="home-header-left">
        <img src="../assets/logo.png" alt="vue的logo" />
        <span>vue电商管理后台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主页主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleCollapse">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item of menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem of item.children"
              :key="subitem.id"
              @click="saveNavState('/' + subitem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主要内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false,
      activePath:''
    }
  },
  mounted() {
    this.getMnueList();
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    // 退出
    logout() {
      window.sessionStorage.clear()
      this.$router.push('./login')
    },
    // 获取所有菜单s
    async getMnueList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.message)
      }
      this.menuList = res.data
    },
    // 切换主页左侧菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath',activePath);
      this.activePath = activePath;
    }
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  user-select: none;

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .home-header-left {
      height: 100%;
      display: flex;
      align-items: center;

      img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
      }

      span {
        color: #fff;
        font-size: 20px;
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
    transition: all 0.5s;

    .toggle-btn {
      background-color: #4a5064;
      line-height: 24px;
      color: #fff;
      font-size: 10px;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }

    .el-menu {
      border: none;

      .iconfont {
        vertical-align: sub;
        margin-right: 15px;
        font-size: 18px;
      }

      .el-icon-menu {
        vertical-align: sub;
      }
    }
  }

  .el-main {
    background-color: #eaedf1;
  }
}
</style>