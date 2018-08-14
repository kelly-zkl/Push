<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters" name="filters" ref="filters">
        <el-form-item :span="4">
          <el-input v-model="filters.groupName" placeholder="用户组名称" icon="search"
                    :on-icon-click="getList"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 30px">
          <el-col>
            <el-button type="primary" @click="getList">搜索</el-button>
            <el-button @click="clearText" style="margin-left: 10px">清除</el-button>
          </el-col>
        </el-form-item>
        <el-form-item class="f-right">
          <router-link :to="{ path: '/addUserGroup', query: { appId: this.appId }}">
            <el-button type="primary" @click="getList">新建用户组</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading"
              @selection-change="selsChange">
      <el-table-column type="selection" width="65" align="center">
      </el-table-column>
      <el-table-column prop="groupName" label="名称" width="150" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="groupId" label="ID" width="300" sortable align="center"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" sortable align="center"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="groupDesc" label="描述" align="center" min-width="400"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template scope="scope">
          <router-link :to="{ path: '/updateUserGroup', query: { groupId: scope.row.groupId }}">
            <el-button size="small">编辑</el-button>
          </router-link>
          <el-button size="small" type="danger" @click="delInfo(scope.row.groupId,1)">删除</el-button>
          <router-link :to="{ path: '/addPush',query: { person: 4, groupId: [scope.row.groupId]}}">
            <el-button size="small" type="info">创建推送</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="primary" style="width: 80px;margin-left: 30px" @click="delInfo('2',2)"
                 :disabled="this.sels.length===0">删除
      </el-button>
      <el-button type="primary" @click="gotoPush" :disabled="this.sels.length===0">创建推送</el-button>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
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
  import {globalAxios, JSONParse} from '../../../common/js/api';

  export default {
    data() {
      return {
        filters: {
          groupName: ''
        },
        users: [],
        total: 0,
        page: 1,
        size: 10,
        currentPage: 1,
        listLoading: false,
        sels: [],//列表选中列
        userId: '',
        appId: this.$route.query.appId || sessionStorage.appId
      }
    },
    methods: {
      gotoPush() {
        let ids = [];
        for (let item of this.sels) {
          ids.push(item.groupId)
        }
        if (ids.length > 10) {
          this.$message.error('推送用户组最多为10个');
          return;
        }
        this.$router.push({path: '/addPush', query: {person: 4, groupId: ids}});
      },
      handleSizeChange(val) {
        this.size = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getList();
      },
      clearText() {
        this.filters.groupName = '';
        this.getList();
      },
      delInfo(id, type) {
        let ids = [];
        if (type === 1) {
          ids.push(id);
        } else {
          for (let item of this.sels) {
            ids.push(item.groupId)
          }
        }
        this.$confirm('您确定要删除用户组吗？', '提示', {
          type: 'warning'
        }).then(() => {
          globalAxios('group/delete', {ids: ids}).then((res) => {
            let data = res.data;
            if (data.code === '000000') {
              this.$notify({
                title: '成功',
                message: data.msg,
                type: 'success'
              });
              this.getList();
            } else {
              this.$message.error(data.msg);
            }
          }).catch(() => {
          });
        }).catch(() => {
        });
      },
      //获取用户组列表
      getList() {
        let para = this.filters;
        para.pageNumber = this.page;
        para.pageSize = this.size;
        para.appId = this.appId;
        this.listLoading = true;
        globalAxios('group/query', para).then((res) => {
          let data = res.data;
          if (data.code === '000000') {
            let obj = data.data;
            this.users = obj.content;
            this.total = obj.rowCount;
            this.currentPage = obj.currentPage;
            this.listLoading = false;
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
  .toolbar {
    background: #f2f2f2;
    padding: 10px;
    margin: 0 0 10px 0;
  }
</style>