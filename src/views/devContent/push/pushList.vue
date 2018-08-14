<template>
  <section>
    <el-row class="toolbar" :span="24">
      <el-col :span="5">
        <el-input placeholder="标题/内容" icon="search" v-model="conten"
                  :on-icon-click="getPushList">
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-date-picker v-model="startTime" type="datetime" placeholder="开始时间"
                        style="width: 100%;margin-left: 10px">
        </el-date-picker>
      </el-col>
      <el-col :span="4">
        <el-date-picker v-model="endTime" type="datetime" placeholder="结束时间"
                        style="width: 100%;margin-left: 20px">
        </el-date-picker>
      </el-col>
      <el-col :span="2" :offset="7">
        <el-button type="primary" @click="getPushList" class="f-right">搜索</el-button>
      </el-col>
      <el-col :span="2">
        <el-button @click="clearAll" style="margin-left: 10px">清除</el-button>
      </el-col>
    </el-row>
    <!--列表-->
    <el-table :data="pushRecord" highlight-current-row v-loading="listLoading"
              @selection-change="selsChange">
      <el-table-column type="selection" width="40" align="center">
      </el-table-column>
      <el-table-column prop="sendTime" label="创建时间" width="200" sortable
                       align="center"></el-table-column>
      <el-table-column prop="type" label="类型" width="150"
                       sortable sortable align="center" :formatter="formatType"></el-table-column>
      <el-table-column prop="title" label="标题/内容" sortable min-width="300"
                       align="center" :formatter="formatTitle"></el-table-column>
      <el-table-column prop="os" label="目标平台" width="200" sortable sortable align="center">
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
      <el-table-column prop="status" label="状态" width="150" sortable
                       align="center" :formatter="formatStatus"></el-table-column>
      <el-table-column label="操作" width="150" sortable align="center">
        <template scope="scope">
          <router-link :to="{ path: '/pushDetail',query:{pushId:scope.row.id}}">
            <el-button type="primary" size="small">查看</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="primary" style="width: 80px;margin-left: 30px" @click="deletePush"
                 :disabled="this.sels.length===0">删除
      </el-button>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 15, 20, 30]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  import util from '../../../common/js/util'
  import {formatDate} from '../../../common/js/date'
  import {globalAxios, JSONParse, globalValidImg, globalValidP12} from '../../../common/js/api';

  export default {
    data() {
      return {
        conten: '',
        startTime: '',
        endTime: '',
        listLoading: false,
        pushRecord: [],
        sels: [],
        appId: sessionStorage.appId,
        total: 0,
        page: 1,
        size: 10
      }
    },
    methods: {
      formatStatus(row, column) {
        return row.status === 'SendComplete' ? '已发送' : '发送失败';
      },
      formatType(row, column) {
        return row.type === 'message' ? '自定义消息' : row.type === 'notification' ? '通知' : '富媒体';
      },
      formatTitle(row, column) {
        return row.title || row.content || '--';
      },
      getPushList() {
        let para = {};
        para.page = this.page;
        para.size = this.size;
        para.appId = this.appId;
        para.content = this.conten;
        para.qStartTime = this.startTime ? formatDate(new Date(this.startTime),
            "yyyy-MM-dd hh:mm:ss") : '';
        para.qEndTime = this.endTime ? formatDate(new Date(this.endTime),
            "yyyy-MM-dd hh:mm:ss") : '';
        if (para.qStartTime && para.qEndTime) {
          let start = new Date(para.qStartTime).getTime();
          let end = new Date(para.qEndTime).getTime();
          if (start - end > 0) {
            this.$message.error('结束时间必须大于开始时间');
            return;
          }
        }
        this.listLoading = true;
        globalAxios('push/query/pushhistory', para).then((res) => {
          let data = res.data;
          this.listLoading = false;
          if (data.code === '000000') {
            let obj = data.data;
            this.pushRecord = obj.list;
            this.total = obj.count;
            this.page = obj.page;
            this.size = obj.size;
          } else {
            this.$message(data.msg);
          }
        }).catch(() => {
        });
      },
      deletePush() {
        let ids = [];
        for (let item of this.sels) {
          ids.push(item.id)
        }
        this.$confirm('确定要删除这些消息记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          globalAxios('push/batchdelete/pushhistory', ids).then((res) => {
            let data = res.data;
            this.listLoading = false;
            if (data.code === '000000') {
              this.$notify({
                title: '成功',
                message: data.msg,
                type: 'success'
              });
              this.getPushList();
            } else {
              this.$message(data.msg);
            }
          }).catch(() => {
          });
        }).catch(() => {
        });
      },
      clearAll() {//清除
        this.conten = '';
        this.startTime = '';
        this.endTime = '';
        this.getPushList();
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getPushList();
      },
      handleSizeChange(val) {
        this.size = val;
        this.getPushList();
      }
    },
    mounted() {
      this.appId = sessionStorage.appId;
      this.getPushList();
    }
  }
</script>

<style scoped>
  .toolbar {
    background: #f2f2f2;
    padding: 10px;
    margin: 0 0 10px 0;
  }
</style>