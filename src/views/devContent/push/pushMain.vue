<template>
  <section>
    <div class="device_border">
      <el-row>
        <el-col :span="2" style="font-size: 16px;color: #343434">设备统计</el-col>
        <el-col :span="2" :offset="20">
          <router-link :to="{ path: '/deviceCounts'}">
            <el-button type="text" style="width: 100%">查看所有设备</el-button>
          </router-link>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="bg-gray">
            <span>{{newDevice}}</span>
            <p>新增设备</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="bg-gray">
            <span>{{allDevice}}</span>
            <p>累计设备</p></div>
        </el-col>
        <el-col :span="6">
          <div class="bg-gray">
            <span>{{activeDevice}}</span>
            <p>今日活跃</p></div>
        </el-col>
        <el-col :span="6">
          <div class="bg-gray">
            <span>{{currentActiveDevice}}</span>
            <p>当前在线</p></div>
        </el-col>
      </el-row>
    </div>
    <div class="push_border">
      <el-row>
        <el-col :span="2" style="font-size: 16px;color: #343434">推送记录</el-col>
        <el-col :span="2" :offset="20">
          <router-link :to="{ path: '/addPush'}">
            <el-button type="primary" style="width: 100%">创建推送</el-button>
          </router-link>
        </el-col>
      </el-row>
    </div>
    <!--列表-->
    <el-table :data="pushRecord" highlight-current-row v-loading="listLoading"
              @selection-change="selsChange" :span="24">
      <el-table-column prop="sendTime" label="创建时间" width="250" align="center"></el-table-column>
      <el-table-column prop="type" label="类型" width="200"
                       :formatter="formatType" align="center"></el-table-column>
      <el-table-column prop="title" label="标题/内容" sortable min-width="350"
                       align="center" :formatter="formatTitle"></el-table-column>
      <el-table-column label="目标平台" width="200" align="center">
        <template scope="scope">
          <img v-if="scope.row.supportIos" src="../../../assets/images/ios_1.png"
               style="margin-right: 10px">
          <img v-else src="../../../assets/images/ios_2.png" style="margin-right: 10px">
          <img v-if="scope.row.supprotAndroid" src="../../../assets/images/android_1.png"
               style="margin-right: 10px">
          <img v-else src="../../../assets/images/android_2.png" style="margin-right: 10px">
          <img v-if="scope.row.supportWinphone" src="../../../assets/images/wp_1.png">
          <img v-else src="../../../assets/images/wp_2.png">
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="150"
                       :formatter="formatStatus" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template scope="scope">
          <el-button v-if="scope.row.status != 'SendComplete'" type="success" size="small">立即发送
          </el-button>
          <el-button v-if="scope.row.status != 'SendComplete'" type="danger" size="small">撤销
          </el-button>
          <router-link :to="{ path: '/pushDetail',query:{pushId:scope.row.id}}">
            <el-button type="info" size="small">查看</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="check-more" v-if="pushRecord.length > 0">
      <router-link :to="{ path: '/pushList'}">
        <el-button type="text" style="width: 100%">查看更多</el-button>
      </router-link>
    </el-col>
  </section>
</template>

<script>
  import util from '../../../common/js/util'
  import {globalAxios, JSONParse, globalValidImg, globalValidP12} from '../../../common/js/api';

  export default {
    data() {
      return {
        pushRecord: [],
        listLoading: false,
        sels: [],
        appId: sessionStorage.appId,
        newDevice: 0,
        activeDevice: 0,
        allDevice: 0,
        currentActiveDevice: 0
      }
    },
    methods: {
      formatStatus(row, column) {
        return row.status === 'SendComplete' ? '已发送' : '发送失败';
      },
      formatType(row, column) {
        return row.type === 'message' ? '自定义消息' : row.type === 'notification' ? '通知' : '富文本';
      },
      formatTitle(row, column) {
        return row.title || row.content || '--';
      },
      getPushList() {
        let para = {};
        para.page = 1;
        para.size = 5;
        para.appId = this.appId;
        this.listLoading = true;
        globalAxios('push/query/pushhistory', para).then((res) => {
          let data = res.data;
          if (data.code === '000000') {
            let obj = data.data;
            this.pushRecord = obj.list;
            this.listLoading = false;
          } else {
            this.$message(data.msg);
          }
        }).catch(() => {
        });
      },
      getDiviceCounts() {
        globalAxios('device/count/current/' + this.appId, {}).then((res) => {
          if (res.status === 200) {
            let response = JSON.parse(res.request.response);
            if (response.code === '000000') {
              this.newDevice = response.data.new;
              this.activeDevice = response.data.active;
              this.allDevice = response.data.all;
              this.currentActiveDevice = response.data.currentActive;
            } else {
              this.$message.error(response.msg);
            }
          } else {
            this.$message.error(res.status);
          }
        }).catch(() => {
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      }
    },
    mounted() {
      this.appId = sessionStorage.appId;
      this.getPushList();
      this.getDiviceCounts();
    }
  }
</script>

<style scope lang="scss">
  .device_border {
    border: 1px solid #DFECEC;
    border-radius: 5px;
    padding: 20px 30px;
    margin-bottom: 30px;
  }

  .push_border {
    border-top: 1px solid #DFECEC;
    border-left: 1px solid #DFECEC;
    border-right: 1px solid #DFECEC;
    border-bottom: none;
    border-radius: 5px 5px 0 0;
    padding: 20px 30px;
  }

  .check-more {
    border-top: none;
    border-left: 1px solid #DFECEC;
    border-right: 1px solid #DFECEC;
    border-bottom: 1px solid #DFECEC;
    border-radius: 0 0 5px 5px;
    padding: 5px;
  }

  .bg-gray {
    border-radius: 4px;
    height: 90px;
    text-align: center;
    background: #E4E4E4;
    padding: 70px 30px 30px 30px;
  }

  .bg-gray span {
    font-size: 30px;
    text-align: center;
    color: #666666;
  }

  .bg-gray p {
    text-align: center;
    color: #666666;
    font-size: 16px;
    padding-top: 20px;
  }
</style>