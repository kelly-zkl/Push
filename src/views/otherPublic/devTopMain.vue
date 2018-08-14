<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
        <img src="../../assets/images/logo.png" @click="gotoMain"
             style="cursor: pointer; width:40px;height: 40px;border: 0">
        <span style="color: #fff;cursor: pointer;" @click="gotoMain">{{collapsed ? ''
            : sysName}}</span>
      </el-col>
      <el-col :span="10">
        <ul class="top-main">
          <li :class="{active:this.path=='/appMan'}" @click="jumpAddList(1,'/appMan')">应用管理</li>
          <li :class="{active:this.path=='/sdkAll'}" @click="jumpAddList(2,'/sdkAll')">SDK管理</li>
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
      <div class="div-phone">
        <div class="div-img">
          <img src="../../assets/images/phone.png"
               style="height: 40px;width: 42px;margin: 10px;"/>
        </div>
        <div class="phone-number">0755-4589678</div>
      </div>
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<script>
  import {JSONParse} from '../../common/js/api';

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
          desc: '',
        },
        path: this.$route.path
      }
    },
    methods: {
      gotoMain() {
        this.jumpAddList(1, '/appMan')
      },
      jumpAddList(index, url) {
        this.path = url;
        this.$router.push({path: url});
      },
      jumpUser() {
        this.$router.push({path: '/updateUser'});
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
        cursor: hand;
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