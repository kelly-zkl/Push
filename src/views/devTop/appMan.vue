<template>
  <section class="app-man">
    <div class="main-content">
      <!--工具条-->
      <el-form :inline="true" :model="form" name="form" ref="form" class="el-form--label-top">
        <el-form-item>
          <el-input placeholder="请输入应用名称" icon="search" v-model="form.appName"
                    :on-icon-click="handleIconClick"></el-input>
        </el-form-item>
        <el-form-item class="f-right">
          <router-link :to="{ path: '/addApp'}">
            <el-button type="primary" size="large" @click="">添加应用</el-button>
          </router-link>
        </el-form-item>
      </el-form>
      <el-row :gutter="21" class="mc-col">
        <el-col :span="8" v-for="app in appList" :key="app.appId">
          <div class="grid-content bg-purple">
            <div class="gc-top">
              <div class="f-right">
                <i class="el-icon-setting" @click="jumpAppMan(app)" style="cursor: pointer"></i>
                <div class="fr-btn" v-if="app.appStatus==1" @click="jumpAddPush(app)"
                     style="cursor: pointer">
                  <el-button :plain="true" type="success" size="small">创建推送</el-button>
                </div>
              </div>
              <div class="gt-left" @click="jumpMain(app)" style="cursor: pointer">
                <div class="gt-img"><img :src="app.appIcon" width="60" height="60"
                                         style="border: 0"></div>
                <div class="gtl-right">
                  <h3 class="ellipsis"><span
                      class="text-danger">{{app.appStatus == 2 ? '[已停用]'
                      : ''}}</span>{{app.appName}}
                  </h3>
                  <div class="">
                    <img v-if="app.isSupportIos==1" src="../../assets/images/ios_1.png"
                         style="border: 0">
                    <img v-else src="../../assets/images/ios_2.png" style="border: 0">
                    <img v-if="app.isSupprotAndroid==1" src="../../assets/images/android_1.png"
                         style="border: 0">
                    <img v-else src="../../assets/images/android_2.png" style="border: 0">
                    <img v-if="app.isSupportWinphone==1" src="../../assets/images/wp_1.png"
                         style="border: 0">
                    <img v-else src="../../assets/images/wp_2.png" style="border: 0">
                  </div>
                </div>
              </div>
            </div>
            <el-row :gutter="21" class="gc-bottom">
              <el-col :span="8">
                <div class="bg-purple">
                  <label class="mcg-label">{{app.countMap.new}}</label>
                  <div class="mcg-value t-999">新增设备</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple">
                  <label class="mcg-label">{{app.countMap.active}}</label>
                  <div class="mcg-value t-999">今日活跃</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="bg-purple">
                  <label class="mcg-label">{{app.countMap.all}}</label>
                  <div class="mcg-value t-999">累计设备</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-col :span="24" v-if="rowCount == 0" style="height: 100%">
        <p style="width: 100% !important; height:100% !important;text-align: center;
            font-size: 16px;color: #999;margin-top: 200px">
          暂无数据</p>
      </el-col>
    </div>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  import {globalAxios, JSONParse} from '../../common/js/api';

  export default {
    data() {
      return {
        ios: 2,
        form: {
          appName: ''
        },
        userId: '',
        appList: [],
        rowCount: 0
      }
    },
    methods: {
      jumpAppMan(app) {
        sessionStorage.appId = app.appId;
        sessionStorage.appName = app.appName;
        sessionStorage.appIcon = app.appIcon;
        this.$router.push({path: '/showApp'});
      },
      jumpAddPush(app) {
        sessionStorage.appId = app.appId;
        sessionStorage.appName = app.appName;
        sessionStorage.appIcon = app.appIcon;
        this.$router.push({path: '/addPush'});
      },
      jumpMain(app) {
        sessionStorage.appId = app.appId;
        sessionStorage.appName = app.appName;
        sessionStorage.appIcon = app.appIcon;
        this.$router.push({path: '/pushMain'});
      },
      handleIconClick() {
        this.getListByUserId(this.form.appName);
      },
      getListByUserId(name) {
        let data = {userId: this.userId, pageNumber: 1, pageSize: 1000};
        !!name ? data.appName = this.form.appName : '';
        globalAxios('appinfo/query', data).then((res) => {
          let data = res.data;
          if (data.code === '000000') {
            this.appList = data.data.content;
            this.rowCount = data.data.rowCount;
          } else {
            this.$message.error(data.msg);
          }
        }).catch(() => {
        });
      }
    },
    mounted() {
      this.userId = JSONParse(sessionStorage.userInfo).userId;
      this.getListByUserId();
    }
  }
</script>

<style scoped lang="scss">
  * {
    text-decoration: none;
  }

  .app-man {
    width: 100%;
    overflow-y: scroll;
    .main-content {
      margin-left: 60px;
      margin-right: 60px;
      margin-top: 30px;
    }
    .f-right {
      margin-right: 0;
      .el-icon-setting {
        float: right;
        font-size: 16px;
        cursor: pointer;
        width: 30px;
        height: 30px;
        text-align: right;
        margin-top: -5px;
        line-height: 30px;
      }
      .el-icon-setting:hover {
        background: #fff;
        font-size: 0;
        position: relative;
      }
      .el-icon-setting:hover:before {
        position: absolute;
        content: '设置';
        font-size: 12px;
        left: 3px;
        color: #6cc;
      }
      .fr-btn {
        padding-top: 35px;
        .el-button--success.is-plain {
          border: 1px solid #6cc;
          color: #6cc;
        }
        .el-button--success.is-plain:hover {
          color: #fff;
          background: #6cc;
        }
      }
    }
    .mc-col {
      .grid-content {
        border: 1px solid rgb(204, 204, 204);
        border-radius: 5px;
        margin-bottom: 30px;
      }
    }
    .gc-top {
      border-bottom: 1px solid rgb(204, 204, 204);
      margin: 15px 20px;
      height: 75px;
      .gt-left {
        margin-right: 85px;
        .gt-img {
          float: left;
          img {
            border-radius: 5px;
          }
        }
        .gtl-right {
          margin-left: 75px;

          h3 {
            margin: 0 0 15px 0;
            padding-top: 2px;
            font-weight: normal;
            color: #343434;
          }
          img {
            margin-right: 8px;
          }
        }
      }
    }
    .gc-bottom {
      padding: 5px 20px 20px 20px;
      line-height: 35px;
      text-align: center;
    }
    .text-danger {
      color: #FF4949
    }
  }
</style>