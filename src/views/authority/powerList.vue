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
          <el-date-picker type="date" placeholder="开始时间" v-model="filters.createTimeStart"
                          format="yyyy-MM-dd" class="w-120"></el-date-picker>
          <el-date-picker type="date" placeholder="结束时间" v-model="filters.createTimeEnd"
                          format="yyyy-MM-dd" class="w-120"></el-date-picker>
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
      <el-table-column type="index" width="65" label="序号">
      </el-table-column>
      <el-table-column prop="appIcon" label="图标" width="80">
        <template scope="scope">
          <img :src="scope.row.appIcon" width="60" height="60" class="mrg-top-8 radius-5">
        </template>
      </el-table-column>
      <el-table-column prop="appName" label="应用名称" width="120" sortable>
      </el-table-column>
      <el-table-column prop="developerType" label="平台" width="120">
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
      <el-table-column prop="deviceCount" label="总用户" width="100" sortable>
      </el-table-column>
      <el-table-column prop="" label="开发者帐号" min-width="170" sortable>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="170" sortable>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template scope="scope">
          <router-link :to="{ path: '/dInfo', query: { userId: scope.row.userId }}">
            <el-button size="small">查看开发者</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
                     :page-size="20" :total="total" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  import util from '../../common/js/util'
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
        userId: ''
      }
    },
    methods: {
      // 清除form
      clearForm() {
        this.$refs['filters'].resetFields();
      },
      //开发者类型
      formatType(row, column) {
        return row.developerType === 2 ? '公司' : row.developerType === 3 ? '个人' : '未知';
      },
      formatStatus(row, column) {
        return row.status === 1 ? '待审核' : row.status === 2 ? '审核通过' : '审核被拒';
      },
      formatIsAuthentication(row) {
        return row.isAuthentication === 2 ? '通过' : row.isAuthentication === 3 ? '未通过' : '未知';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getList();
      },
      //获取用户应用列表
      getList() {
        let para = this.filters;
        para.page = this.page;
        para.size = this.size;
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
</style>