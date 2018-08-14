<template>
  <section class="app-man">
    <div class="main-content">
      <h2>客户端SDK</h2>
      <el-row :gutter="24" class="mc-col" style="margin-bottom: 10px">
        <el-col :span="8" v-for="sdk in SDKList" :key="sdk.opSys"
                v-if="sdk.status == 1 && sdk.type == 1">
          <div class="grid-content bg-purple">
            <div class="gc-top">
              <div class="f-right">
                <div><span class="t-999">版本</span>{{sdk.sdkVersion}}</div>
                <div><span class="t-999">更新日期</span>{{sdk.updateTime.split(' ')[0]}}</div>
              </div>
              <div class="gt-left">
                <h3 class="ellipsis">{{sdk.opSys}}</h3>
              </div>
            </div>
            <div class="div-info">
              {{sdk.info}}
            </div>
            <div class="gc-bottom">
              <a :href="sdk.sdkPath">下载SDK包</a>
              <a :href="sdk.docUrl">下载接口文档</a>
            </div>
          </div>
        </el-col>
        <el-col v-if="SDKList.length == 0" :span="4" style="color: #888;text-align: center;margin: 10px">暂无数据
        </el-col>
      </el-row>
      <h2 style="border-top: solid rgb(204, 204, 204) 1px;padding-top: 30px">服务器端SDK</h2>
      <el-row :gutter="24" class="mc-col">
        <el-col :span="8" v-for="sdk in SDKList" :key="sdk.opSys"
                v-if="sdk.status == 1 && sdk.type == 2">
          <div class="grid-content bg-purple">
            <div class="gc-top">
              <div class="f-right">
                <div><span class="t-999">版本</span>{{sdk.sdkVersion}}</div>
                <div><span class="t-999">更新日期</span>{{sdk.updateTime.split(' ')[0]}}</div>
              </div>
              <div class="gt-left">
                <h3 class="ellipsis">{{sdk.opSys}}</h3>
              </div>
            </div>
            <div class="div-info">
              {{sdk.info}}
            </div>
            <div class="gc-bottom">
              <a :href="sdk.sdkPath">下载SDK包</a>
              <a :href="sdk.docUrl">下载接口文档</a>
            </div>
          </div>
        </el-col>
        <el-col v-if="SDKList.length == 0" :span="4" style="color: #888;text-align: center;margin: 10px">暂无数据
        </el-col>
      </el-row>
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
          name: ''
        },
        userId: '',
        SDKList: []
      }
    },
    methods: {
      handleIconClick() {

      },
      getSDKList() {
        globalAxios('sdk/list/latest', {}).then((res) => {
          let data = res.data;
          if (data.code === '000000') {
            this.SDKList = data.data;
          } else {
            this.$message.error(data.msg);
          }
        }).catch(() => {
        });
      }
    },
    mounted() {
      this.userId = JSONParse(sessionStorage.userInfo).userId;
      this.getSDKList();
    }
  }
</script>

<style scoped lang="scss">
  .div-info {
    border-bottom: 1px dashed rgb(204, 204, 204);
    padding: 10px 20px;
    color: #999;
    max-width: 100%;
    height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .app-man {
    width: 100%;
    .main-content {
      margin-left: 60px;
      margin-right: 60px;
      margin-top: 40px;
      h2 {
        font-size: 28px;
        margin: 0 0 20px 0;
        padding: 0;
        color: #999;
      }
    }
    .f-right {
      margin-right: 0;
      text-align: right;
      line-height: 25px;
      span {
        margin-right: 8px;
      }
    }
    .mc-col {
      .grid-content {
        border: 1px solid rgb(204, 204, 204);
        border-radius: 5px;
        margin-bottom: 30px;
        position: relative;
      }
      .grid-content:before {
        position: absolute;
        content: '';
        width: 10px;
        height: 20px;
        border: 1px solid rgb(204, 204, 204);
        bottom: 40px;
        left: -1px;
        border-radius: 0 10px 10px 0;
        background: #fff;
        border-left: 0;
      }
      .grid-content:after {
        position: absolute;
        content: '';
        width: 10px;
        height: 20px;
        border: 1px solid rgb(204, 204, 204);
        bottom: 40px;
        right: -1px;
        border-radius: 10px 0 0 10px;
        background: #fff;
        border-right: 0;
      }
    }
    .gc-top {
      border-bottom: 1px solid rgb(204, 204, 204);
      margin: 15px 20px 0 20px;
      height: 50px;
      padding-bottom: 15px;
      .gt-left {
        margin-right: 85px;
        h3 {
          margin: 0;
          padding-top: 6px;
          font-size: 34px;
          font-weight: normal;
        }
      }
    }
    .gc-content {
      border-bottom: 1px dashed rgb(204, 204, 204);
      padding-bottom: 15px;
      margin-top: 15px;
      margin-bottom: 0;
      padding-left: 20px;
      padding-right: 20px;
    }
    .gc-bottom {
      height: 50px;
      line-height: 50px;
      font-size: 0;
      position: relative;
      a {
        display: inline-block;
        width: 50%;
        font-size: 16px;
        text-align: center;
        color: #000;
        text-decoration: none;
      }
      a:hover {
        color: #6cc;
      }
    }
    .gc-bottom:after {
      content: '';
      position: absolute;
      border-right: 1px dashed rgb(204, 204, 204);
      height: 100%;
      left: 50%;
    }
  }
</style>