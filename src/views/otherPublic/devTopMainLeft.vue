<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <router-link :to="{ path: '/appMan'}">
        <el-col :span="8" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
          <img src="../../assets/images/logo.png"
               style="cursor: pointer; width:40px;height: 40px;border: 0">
          <span style="color: #fff">{{collapsed ? '' : sysName}}</span>
        </el-col>
      </router-link>
      <el-col :span="8">
        <ul class="top-main">
          <li :class="{active:this.active==1}" @click="jumpAddList(1,'/appMan')">应用管理</li>
          <li :class="{active:this.active==2}" @click="jumpAddList(2,'/sdkAll')">SDK管理</li>
        </ul>
      </el-col>
      <div class="userinfo">
        <img src="../../assets/images/headPortrait.png" class="head-pic">
        <span class="ui-name" @click="jumpUser">{{sysUserName}}</span>
        <div @click="logout" class="login-out">退出</div>
      </div>
    </el-col>
    <!-- 判断是否是 <router-view></router-view>-->
    <el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <el-row :span="24" :gutter="10" style="padding: 10px 0 10px 10px ;background-color: #fff">
          <el-col :span="6">
            <img :src="logourl" @mouseover="hoverLogo(true)" @mouseout="hoverLogo(false)"
                 style="width: 40px;height: 40px; cursor: pointer;border-radius: 4px"
                 @click="$router.push({path: 'pushMain'})"/>
          </el-col>
          <el-col :span="18" style="margin-top: 4px">
            <el-select placeholder="请选择应用" v-model="appName" @change="handleApp">
              <el-option v-for="item in options" :key="item.appId"
                         :label="item.appName" :value="item.appId">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <!--导航菜单-->
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen"
                 @close="handleclose" @select="handleselect"
                 unique-opened router v-show="!collapsed">
          <template v-for="(item,index) in $router.options.routes"
                    v-if="!item.hidden&&item.isDev==true">
            <el-submenu :index="index+''" v-if="!item.leaf">
              <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
              <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path"
                            @click="menuJump(child.path)" v-if="!child.hidden">{{child.name}}
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"
                          @click="menuJump(item.children[0].path)">
              <i :class="item.iconCls"></i>{{item.children[0].name}}
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
                 style=";height: 56px;line-height: 56px;padding: 0 20px;"
                 :class="$route.path==item.children[0].path?'is-active':''"
                 @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
          </li>
</template>
</li>
</ul>
</aside>
<section class="content-container">
  <div class="">
    <el-col :span="24" class="breadcrumb-container" style="height: 40px;padding-top: 5px">
      <!-- <strong class="title">{{$route.name}}</strong> -->
      <el-breadcrumb separator="/" class="breadcrumb-inner">
        <el-breadcrumb-item :to="{ path: '/pushMain'}">应用管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/pushMain'}">{{appName}}</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in $route.matched" v-if="!!item.name" :key="item.path">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="content-wrapper">
      <div class="div-phone">
        <div class="div-img">
          <img src="../../assets/images/phone.png"
               style="height: 40px;width: 42px;margin: 10px;"/>
        </div>
        <div class="phone-number">0755-4589678</div>
      </div>
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
  import util from '../../common/js/util'
  import {globalAxios, JSONParse} from '../../common/js/api';

  export default {
    data() {
      return {
        sysName: '消息推送',
        collapsed: false,
        sysUserName: '',
        sysUserAvatar: '',
        active: 1,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        userId: '',
        options: [],
        urls: [],
        ids: [],
        names: [],
        appName: sessionStorage.appName,
        logourl: sessionStorage.appIcon,
        isSave: true
      }
    },
    methods: {
      handleApp(val) {
        if (this.isSave) {
          this.isSave = false;
          let name = this.names[this.ids.indexOf(val)];
          let icon = this.urls[this.ids.indexOf(val)];
          if (val) {
            sessionStorage.appId = val;
          }
          if (name) {
            sessionStorage.appName = name;
            this.appName = name;
          }
          if (icon) {
            sessionStorage.appIcon = icon;
            this.logourl = icon;
          }
          this.$router.go(0);
        }
      },
      menuJump(jumpPath) {
        this.$router.push(jumpPath);
      },
      hoverLogo(enter) {
        if (enter)
          this.logourl = 'http://xdb.p2n.com:7000/fileStore/temp/logo-hover.png';
        else
          this.logourl = sessionStorage.appIcon;
      },
      getListByUserId() {
        let data = {userId: this.userId, pageNumber: 1, pageSize: 1000};
        globalAxios('appinfo/query', data).then((res) => {
          let data = res.data;
          if (data.code === '000000') {
            this.options = data.data.content;
            for (let i = 0; i < data.data.content.length; i++) {
              let item = data.data.content[i];
              this.urls.push(item.appIcon);
              this.ids.push(item.appId);
              this.names.push(item.appName);
            }
          }
        }).catch(() => {
        });
      },
      jumpAddList(index, url) {
        this.active = index;
        this.$router.push({path: url});
      },
      jumpUser() {
        this.$router.push({path: 'updateUser'});
      },
      handleopen() {
        //console.log('handleopen');
      },
      handleclose() {
        //console.log('handleclose');
      },
      handleselect(a, b) {
      },
      //退出登录
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
      this.userId = JSONParse(sessionStorage.userInfo).userId;
      this.getListByUserId();
    }
  }
</script>

<style scoped lang="scss">
  @import '../../assets/styles/vars.scss';

  .div-phone {
    position: absolute;
    right: 15px;
    top: 45%;
    width: 62px;
    height: 60px;
    display: block;
    z-index: 99999;
    border-radius: 4px 0 0 4px;
    -moz-box-shadow: 0 3px 5px rgba(40, 40, 40, .5); /*firefox*/
    -webkit-box-shadow: 0 3px 5px rgba(40, 40, 40, .5); /*webkit*/
    box-shadow: 0 3px 5px rgba(40, 40, 40, .5); /*opera或ie9*/
    -ms-scroll-translation: width 1.5s ease-out;
    -webket-translation: width 1.5s ease-out;
    translation: width 1.5s ease-out;
    .div-img {
      width: 62px;
      height: 60px;
      display: block;
      border-radius: 4px 0 0 4px;
      background-color: #FFCC00;
      float: left;
    }
    .phone-number {
      display: none;
    }
  }

  .div-phone:hover {
    width: 262px;
    height: 60px !important;
    border-radius: 4px;
    display: inline-block;
    text-align: center;
    -ms-scroll-translation: width 1.5s ease-in;
    -webket-translation: width 1.5s ease-in;
    translation: width 1.5s ease-in;
    .phone-number {
      height: 43px;
      width: 198px;
      display: inline-block !important;
      color: #FAC450 !important;
      text-align: center;
      font-size: 26px;
      padding-top: 15px;
      background-color: #fff;
      border-radius: 0 4px 4px 0;
      border: 1px solid #FFCC00;
      float: right;
    }
  }

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
      .top-main {
        margin: 0 20px 0 0;
        padding: 0;
        position: relative;
        li {
          float: left;
          list-style: none;
          width: 140px;
          text-align: center;
          font-size: 16px;
          color: #958d8d;
          cursor: pointer;
        }
        li.active, li:hover {
          color: #fff;
          position: relative;
        }
        li.active:after {
          content: '';
          position: absolute;
          height: 5px;
          background: #6cc;
          left: 15px;
          width: 110px;
          bottom: 0
        }
      }
      .top-main:after {
        content: '';
        position: absolute;
        border-right: 1px solid #958d8d;
        height: 30px;
        top: 15px;
        left: 140px;
      }
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
        // top: 0;
        // bottom: 0;
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
        // right: 0;
        // top: 0;
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