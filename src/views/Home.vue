<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <router-link :to="{ path: '/Main'}">
        <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
          <img src="../assets/images/logo.png"
               style="cursor: pointer; width:40px;height: 40px;border: 0">
          <span style="color: #fff">{{collapsed ? '' : sysName}}</span>
        </el-col>
      </router-link>
      <div class="userinfo">
        <img src="../assets/images/headPortrait.png" class="head-pic">
        <span @click="devInfo" class="ui-name">{{sysUserName}}</span>
        <div @click="logout" class="login-out">退出</div>
      </div>
    </el-col>
    <!-- 判断是否是 <router-view></router-view>-->
    <el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <!--导航菜单-->
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen"
                 @close="handleclose" @select="handleselect"
                 unique-opened router v-show="!collapsed">
          <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden&&!item.isDev">
            <el-submenu :index="index+''" v-if="!item.leaf">
              <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
              <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path"
                            v-if="!child.hidden">{{child.name}}
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i
                :class="item.iconCls"></i>{{item.children[0].name}}
            </el-menu-item>
          </template>
        </el-menu>
        <!--导航菜单-折叠后-->
        <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
          <li v-for="(item,index) in $router.options.routes" v-if="!item.hidden"
              class="el-submenu item">
            <template v-if="!item.leaf">
              <div class="el-submenu__title" style="padding-left: 20px;"
                   @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i
                  :class="item.iconCls"></i></div>
              <ul class="el-menu submenu" :class="'submenu-hook-'+index"
                  @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                <li v-for="child in item.children" v-if="!child.hidden" :key="child.path"
                    class="el-menu-item" style="padding-left: 40px;"
                    :class="$route.path==child.path?'is-active':''"
                    @click="$router.push(child.path)">{{child.name}}
                </li>
              </ul>
            </template>
            <template v-else>
          <li class="el-submenu">
            <div class="el-submenu__title el-menu-item"
                 style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;"
                 :class="$route.path==item.children[0].path?'is-active':''"
                 @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
          </li>
</template>
</li>
</ul>
</aside>
<section class="content-container">
  <div class="grid-content bg-purple-light">
    <el-col :span="24" class="breadcrumb-container" style="height: 40px;padding-top: 5px">
      <!-- <strong class="title">{{$route.name}}</strong> -->
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item :to="{ path: '/Main'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in $route.matched" v-if="!!item.name" :key="item.path">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="content-wrapper">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </el-col>
  </div>
</section>
</el-col>
</el-row>
</template>

<script>
  import {JSONParse} from '../common/js/api';

  export default {
    data() {
      return {
        sysName: '消息推送',
        collapsed: false,
        sysUserName: '',
        sysUserAvatar: '',
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      handleopen() {
        //console.log('handleopen');
      },
      handleclose() {
        //console.log('handleclose');
      },
      handleselect(a, b) {
      },
      //退出登录devInfo
      logout() {
        let _this = this;
        this.$confirm('确认退出吗?', '提示', {
//          type: 'info'
        }).then(() => {
          sessionStorage.removeItem('userInfo');
          // 登出接口
          _this.$router.push('/login');
        }).catch(() => {
        });
      },
      //用户信息
      devInfo() {
        let _this = this;
        _this.$router.push('/updateUserByAdmin');
      },
      //折叠导航栏
      collapse() {
        this.collapsed = !this.collapsed;
      },
      showMenu(i, status) {
        this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'
            + i)[0].style.display = status ? 'block' : 'none';
      }
    },
    mounted() {
      this.sysUserName = JSONParse(sessionStorage.userInfo).username;
    }
  }

</script>

<style scoped lang="scss">
  @import '../assets/styles/vars.scss';

  .container {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    .header {
      height: 60px;
      line-height: 60px;
      background: #3f3f3f;
      color: #fff;
      .userinfo {
        padding-right: 35px;
        float: right;
        .head-pic {
          vertical-align: middle;
          margin-right: 20px;
          margin-top: -5px;
        }
        .ui-name {
          color: $color-primary;
          padding-right: 40px;
          cursor: pointer;
        }
        .login-out {
          float: right;
          position: relative;
          padding-left: 30px;
          color: #ccc;
          cursor: pointer;
        }
        .login-out:before {
          border-left: 1px solid #ddd;
          content: '';
          height: 30px;
          position: absolute;
          top: 15px;
          left: 0
        }
      }
      .logo {
        //width:230px;
        height: 60px;
        font-size: 22px;
        padding-left: 20px;
        padding-right: 20px;
        border-color: rgba(238, 241, 146, 0.3);
        border-right-width: 0;
        border-right-style: solid;
        img {
          width: 36px;
          float: left;
          margin: 12px 12px 12px 18px;
        }
        .txt {
          color: #fff;
        }
      }
      .logo-width {
        width: 230px;
      }
      .logo-collapse-width {
        width: 60px
      }
      .tools {
        padding: 0 23px;
        width: 14px;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
      }
    }
    .main {
      display: flex;
      // background: #324057;
      position: absolute;
      top: 60px;
      bottom: 0;
      overflow: hidden;
      aside {
        flex: 0 0 230px;
        width: 230px;
        // position: absolute;
        // top: 0px;
        // bottom: 0px;
        .el-menu {
          height: 100%;
        }
        .collapsed {
          width: 60px;
          .item {
            position: relative;
          }
          .submenu {
            position: absolute;
            top: 0;
            left: 60px;
            z-index: 99999;
            height: auto;
            display: none;
          }

        }
      }
      .menu-collapsed {
        flex: 0 0 60px;
        width: 60px;
      }
      .menu-expanded {
        flex: 0 0 200px;
        width: 200px;
      }
      .content-container {
        // background: #f1f2f7;
        flex: 1;
        // position: absolute;
        // right: 0px;
        // top: 0px;
        // bottom: 0px;
        // left: 230px;
        overflow-y: scroll;
        padding: 20px;
        .breadcrumb-container {

        }
        .content-wrapper {
          background-color: #fff;
          box-sizing: border-box;
        }
      }
    }
  }

</style>