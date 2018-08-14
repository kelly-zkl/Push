<template>
  <section class="di-table">
    <el-tabs type="border-card" class="tabs" :active-name="diStep">
      <el-tab-pane label="开发者信息" name="ds_1">
        <h2 class="h2">帐号信息</h2>
        <div class="acount-info">
          <div>
            <label>类型：</label>
            <span>{{form.type}}</span>
          </div>
          <div>
            <label>账号：</label>
            <span>{{form.userId}}</span>
          </div>
          <div>
            <label>用户名：</label>
            <span>{{form.loginName || '-'}}</span>
          </div>
          <div>
            <label>手机号：</label>
            <span>{{form.mobilePhone}}</span>
          </div>
          <div>
            <label>注册日期：</label>
            <span>{{form.createTime}}</span>
          </div>
        </div>
        <h2 class="h2">认证资料</h2>
        <div class="other-info" v-if="!!form.developer">
          <div>
            <label>认证状态：</label>
            <span>{{form.developer.isAuthentication == '2' ? '通过' : '未通过'}}</span>
          </div>
          <div>
            <label>真实姓名：</label>
            <span>{{form.developer.realName}}</span>
          </div>
          <div v-if="form.developer.developerType==2">
            <label>公司名称：</label>
            <span>{{form.developer.companyName || '-'}}</span>
          </div>
          <div>
            <label>证件号码：</label>
            <span v-if="form.developer.developerType==2">{{form.developer.credentialNo
            || '-'}}</span>
            <span v-else>{{form.developer.cardNo || '-'}}</span>
          </div>
          <div>
            <label>证件图片：</label>
            <span v-if="form.developer.developerType==2">
			  			<img v-if="!!form.developer.cardPhoto" :src="form.developer.cardPhoto" width="120">
			  		</span>
            <span v-else>
			  			<img v-if="!!form.developer.idCardFront" :src="form.developer.idCardFront" width="120"
                   class="mrg-right-8">
			  			<img v-if="!!form.developer.idCardBack" :src="form.developer.idCardBack" width="120"
                   class="mrg-right-8">
			  			<img v-if="!!form.developer.idCardHand" :src="form.developer.idCardHand" width="120"
                   class="mrg-right-8">
			  		</span>
          </div>
          <div>
            <label>手机号码：</label>
            <span>{{form.developer.developerMobile}}</span>
          </div>
          <div>
            <label>认证日期：</label>
            <span>{{form.developer.updateTime}}</span>
          </div>
        </div>
        <div v-else class="other-info">
          没有认证资料
        </div>
      </el-tab-pane>
      <el-tab-pane label="应用" name="ds_2">
        <el-table :data="listByUserId" highlight-current-row style="width: 100%;">
          <el-table-column type="index" width="65" label="序号" align="center">
          </el-table-column>
          <el-table-column prop="userId" label="图标" width="100" align="center">
            <template scope="scope">
              <img :src="scope.row.appIcon" width="55" height="55" class="radius-5 mrg-top-8">
            </template>
          </el-table-column>
          <el-table-column prop="appName" label="应用名称" width="200" sortable align="center">
          </el-table-column>
          <el-table-column prop="developerType" label="平台" align="center">
            <template scope="scope">
              <img v-if="scope.row.isSupportIos==1" src="../../assets/images/ios_1.png"
                   class="mrg-top-8 mrg-right-8">
              <img v-else src="../../assets/images/ios_2.png" class="mrg-top-8 mrg-right-8">
              <img v-if="scope.row.isSupprotAndroid==1" src="../../assets/images/android_1.png"
                   class="mrg-top-8 mrg-right-8">
              <img v-else src="../../assets/images/android_2.png" class="mrg-top-8 mrg-right-8">
              <img v-if="scope.row.isSupportWinphone==1" src="../../assets/images/wp_1.png"
                   class="mrg-top-8 mrg-right-8">
              <img v-else src="../../assets/images/wp_2.png" class="mrg-top-8 mrg-right-8">
            </template>
          </el-table-column>
          <el-table-column prop="deviceCount" label="总用户">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script>
  import util from '../../common/js/util'
  import NProgress from 'nprogress'
  import {globalAxios} from '../../common/js/api';

  export default {
    data() {
      return {
        userId: this.$route.query.userId,
        isShowTable: this.$route.query.table,
        form: {},
        listByUserId: [],
        diStep: 'ds_1'
      }
    },
    methods: {
      //获取详情
      getInfoById() {
        NProgress.start();
        globalAxios('user/get/' + this.userId, {}).then((res) => {
          let data = res.data;
          NProgress.done();
          if (data.code === '000000') {
            this.form = data.data;
            this.form.type = (this.form.developer.developerType === 2 ? '公司' : '个人');
          } else {
            this.$message(data.msg);
          }
        }).catch(() => {
        });
      },
      //获取应用列表
      getListByUserId() {
        NProgress.start();
        globalAxios('appinfo/listByUserId/' + this.userId, {}).then((res) => {
          let data = res.data;
          NProgress.done();
          if (data.code === '000000') {
            this.listByUserId = data.data;
          } else {
            this.$message(data.msg);
          }
        }).catch(() => {
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      }
    },
    mounted() {
      this.getInfoById();
      this.getListByUserId();
      if (this.isShowTable === 1) {
        this.diStep = 'ds_2';
      }
    }
  }
</script>

<style scoped lang="scss">
  .tabs {
    .h2 {
      margin: 0;
      padding: 20px;
      font-size: 16px;
      color: #666;
    }
    .acount-info, .other-info {
      line-height: 40px;
      margin-left: 20px;
      color: #666;
      label {
        width: 100px;
        display: inline-block;
        text-align: right;
        margin-right: 10px;
      }
    }
    .other-info {
      padding-bottom: 30px;
    }
    .acount-info {
      border-bottom: 1px solid #ddd;
      padding-bottom: 15px;
    }
    .el-table {
      border: none !important;
    }
    .mrg-right-8 {
      margin-right: 8px;
    }
  }
</style>