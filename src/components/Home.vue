<template>
  <el-container class="home_container">
    <!-- 头部部分 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>后台管理系统</span>
      </div>

      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体部分 -->
    <el-container>
      <el-aside :width="isTrue? '64px' :'200px' ">
        <div class="toggle-button" @click="toggleCollaps">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isTrue"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + '' " v-for="item of menuList" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem of item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容部分 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconObj: {
        125: 'iconfont icon-geren',
        103: 'iconfont icon-volumemeasurement',
        101: 'iconfont icon-shangpinguanli',
        102: 'iconfont icon-ico_yaokuguanli_danjuchaxun',
        145: 'iconfont icon-baobiaoguanli',
      },
      // 是否折叠
      isTrue: false,
      // 被激活的连接地址
      activePath: '',
    }
  },
  created() {
    //   左侧菜单数据
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    //   home页面点击退出 清除token保存的数据
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取到左侧菜单栏数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(res)
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollaps() {
      this.isTrue = !this.isTrue
    },
    //
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
  },
}
</script>

<style scoped lang="less">
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
  }
  img {
    height: 50px;
    width: 50px;
    border: 1px solid #ccc;
    border-radius: 50%;
  }
}
.el-aside {
  background: #333744;
}
.el-main {
  background: #eaedf1;
}
.home_container {
  height: 100%;
}
.iconfont {
  margin: 0 10px;
}
.el-menu {
  border-right: none;
}
.toggle-button {
  color: #fff;
  background: #4a5064;
  text-align: center;
  /**三条杠间距 */
  letter-spacing: 1px;
  /**变小手 */
  cursor: pointer;
}
</style>
