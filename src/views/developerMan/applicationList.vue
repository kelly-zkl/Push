<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" :model="filters" name="filters" ref="filters"
               class="el-form--label-top">
        <el-form-item label="类型">
          <el-select placeholder="请选择类型" v-model="filters.developerType" class="w-120">
            <el-option label="全部" value=""></el-option>
            <el-option label="个人" value="3"></el-option>
            <el-option label="公司" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker type="datetime" placeholder="开始时间" v-model="filters.createTimeStart"
                          class="w-250"></el-date-picker>
          <el-date-picker type="datetime" placeholder="结束时间" v-model="filters.createTimeEnd"
                          class="w-250"></el-date-picker>
        </el-form-item>
        <el-form-item label="应用名称">
          <el-input v-model="filters.appName" placeholder="应用名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList" class="mrg-top-24">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clearForm" class="mrg-top-24">清除</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading"
              @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="index" width="80" label="序号" align="center">
      </el-table-column>
      <el-table-column prop="appIcon" label="图标" width="100" align="center">
        <template scope="scope">
          <img :src="scope.row.appIcon" width="55" height="55" class="radius-5 mrg-top-8">
        </template>
      </el-table-column>
      <el-table-column prop="appName" label="应用名称" min-width="150" sortable align="center">
      </el-table-column>
      <el-table-column prop="developerType" label="平台" width="150" align="center">
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
      <el-table-column prop="deviceCount" label="总用户" width="200" sortable align="center">
      </el-table-column>
      <el-table-column prop="accounts" label="开发者帐号" min-width="200" align="center"
                       :formatter="formatAccount">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="170" sortable align="center">
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template scope="scope">
          <router-link :to="{ path: '/dInfo', query: { userId: scope.row.userId }}">
            <el-button size="small">查看开发者</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
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
  import util from '../../common/js/util'
  import {formatDate} from '../../common/js/date'
  import {globalAxios, JSONParse} from '../../common/js/api';

  export default {
    data() {
      return {
        filters: {
          developerType: '',
          appName: '',
          createTimeStart: '',
          createTimeEnd: ''
        },
        users: [],
        total: 0,
        page: 1,
        size: 10,
        listLoading: false,
        sels: [],//列表选中列
        userId: '',
      }
    },
    methods: {
      // 清除form
      clearForm() {
        this.filters = {
          developerType: '',
          appName: '',
          createTimeStart: '',
          createTimeEnd: ''
        };
        this.getList();
      },
      //开发者类型
      formatAccount(row, column) {
        return row.accounts[0].loginName;
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getList();
      },
      handleSizeChange(val) {
        this.size = val;
        this.getList();
      },
      //获取用户应用列表
      getList() {
        let para = this.filters;
        para.page = this.page;
        para.size = this.size;
        para.createTimeEnd = this.filters.createTimeEnd ? formatDate(
            new Date(this.filters.createTimeEnd),
            "yyyy-MM-dd hh:mm:ss") : '';
        para.createTimeStart = this.filters.createTimeStart ? formatDate(
            new Date(this.filters.createTimeStart),
            "yyyy-MM-dd hh:mm:ss") : '';
        if (para.createTimeStart && para.createTimeEnd) {
          let start = new Date(para.createTimeStart).getTime();
          let end = new Date(para.createTimeEnd).getTime();
          if (start - end > 0) {
            this.$message.error('结束时间必须大于开始时间');
            return;
          }
        }
        this.listLoading = true;
        globalAxios('appinfo/query', para).then((res) => {
          let data = res.data;
          this.listLoading = false;
          if (data.code === '000000') {
            let obj = data.data;
            this.users = obj.content;
            this.total = obj.rowCount;
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
      this.userId = JSONParse(sessionStorage.userInfo).userId;
      this.getList();
    }
  }
</script>

<style scoped>
  .mrg-right-8 {
    margin-right: 8px;
  }

  .toolbar {
    background: #f2f2f2;
    padding: 10px;
    margin: 0 0 10px 0;
  }
</style>