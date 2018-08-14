<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" :model="filters" name="filters" ref="filters"
               class="el-form--label-top">
        <el-form-item label="认证状态" :span="3">
          <el-select placeholder="请选择状态" v-model="filters.isAuthentication" class="w-120">
            <el-option label="全部" value=""></el-option>
            <el-option label="未通过" value="3"></el-option>
            <el-option label="已通过" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select placeholder="请选择类型" v-model="filters.developerType" class="w-120">
            <el-option label="全部" value=""></el-option>
            <el-option label="个人" value="3"></el-option>
            <el-option label="公司" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间范围">
          <el-date-picker type="datetime" placeholder="开始时间" v-model="filters.createTimeStart"
          ></el-date-picker>
          <el-date-picker type="datetime" placeholder="结束时间" v-model="filters.createTimeEnd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="filters.search" placeholder="登录账号/用户名/手机号"></el-input>
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
      <el-table-column type="index" width="65" label="序号" align="center">
      </el-table-column>
      <el-table-column prop="username" label="帐号" sortable min-width="200" align="center">
      </el-table-column>
      <el-table-column prop="username" label="用户名" min-width="200" sortable align="center">
      </el-table-column>
      <el-table-column prop="developerType" label="类型" width="100" sortable :formatter="formatType"
                       align="center">
      </el-table-column>
      <el-table-column prop="developerMobile" label="手机" width="180" sortable align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" width="200" sortable align="center">
      </el-table-column>
      <el-table-column prop="addr" label="资质审核" width="130" :formatter="formatStatus"
                       align="center">
      </el-table-column>
      <el-table-column prop="isAuthentication" label="认证" width="130" sortable
                       :formatter="formatIsAuthentication" align="center">
      </el-table-column>
      <el-table-column prop="appCount" label="上传应用" width="150" sortable align="center">
        <template scope="scope">
          <router-link :to="{ path: '/dInfo', query: { userId: scope.row.userId,table:1 }}"
                       class="t-6cc">
            {{scope.row.appCount}}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="userStatus" label="状态" width="110" sortable align="center">
        <template scope="scope">
          {{scope.row.userStatus == 1 ? '正常' : '禁用'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template scope="scope">
          <router-link :to="{ path: '/dInfo', query: { userId: scope.row.userId }}">
            <el-button size="small" style="margin-right: 10px">查看资料</el-button>
          </router-link>
          <el-button type="danger" v-if="scope.row.userStatus==1" size="small"
                     @click="handleCao(scope.row,'disable')">禁用
          </el-button>
          <el-button type="info" v-if="scope.row.userStatus==2" size="small"
                     @click="handleCao(scope.row,'enable')">启用
          </el-button>
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
  import {globalAxios} from '../../common/js/api';

  export default {
    data() {
      return {
        filters: {
          developerType: '',
          isAuthentication: '',
          search: '',
          createTimeEnd: '',
          createTimeStart: ''
        },
        users: [],
        total: 0,
        page: 1,
        size: 10,
        listLoading: false,
        sels: [],//列表选中列
        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ]
        },
        //编辑界面数据
        editForm: {
          id: 0,
          name: '',
          sex: -1,
          age: 0,
          birth: '',
          addr: ''
        },
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addForm: {
          name: '',
          sex: -1,
          age: 0,
          birth: '',
          addr: ''
        }
      }
    },
    methods: {
      handleCao(row, type) {
        let url = 'user/disable', msg = '您确定要禁用这个开发者吗？';
        if (type === 'enable') {
          url = 'user/enable';
          msg = '您确定要启用这个开发者吗？';
        }
        this.$confirm(msg, '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let para = {ids: [row.userId]};
          globalAxios(url, para).then((res) => {
            let data = res.data;
            this.listLoading = false;
            if (data.code === '000000') {
              this.$message({
                message: data.msg,
                type: 'success'
              });
              this.getList();
            } else {
              this.$message(data.msg);
            }
          }).catch(() => {
          });
        }).catch(() => {
        });
      },

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
      handleSizeChange(val) {
        this.size = val;
        this.getList();
      },
      //获取用户列表
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
        globalAxios('developer/query', para).then((res) => {
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
      this.getList();
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