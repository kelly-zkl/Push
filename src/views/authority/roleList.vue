<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" :model="filters" name="filters" ref="filters">
        <el-form-item>
          <el-input v-model="filters.keyword" placeholder="角色名称" icon="search"
                    :on-icon-click="getList"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clearForm">清除</el-button>
        </el-form-item>
        <el-form-item style="position: absolute;right: 40px">
          <el-button type="primary" @click="addInfo" style="width: 120px">新建角色</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--新增界面-->
    <el-dialog title="" v-model="addFormVisible" :close-on-click-modal="false" class="updateUser">
      <h3>{{addFormTitle}}</h3>
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm"
               style="margin-right: 5%">
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="addForm.roleName" :maxlength="10"
                    placeholder="请输入10字以内的名称"></el-input>
        </el-form-item>
        <el-form-item label="备注：" class="textarea-min-height">
          <el-input type="textarea" v-model="addForm.remark" :maxlength="100"
                    placeholder="请输入100字以内的备注"></el-input>
        </el-form-item>
        <el-form-item label="授权：" required>
          <el-tree :data="options" show-checkbox default-expand-all highlight-current
                   node-key="menuId" :props="defaultProps" ref="tree">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelSubmit(addFormTitle)">取消</el-button>
        <el-button type="primary" @click.native="addSubmit('addForm',addFormTitle)"
                   :loading="addLoading">保存
        </el-button>
      </div>
    </el-dialog>
    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading"
              @selection-change="selsChange">
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column type="index" width="65" label="序号" align="center"></el-table-column>
      <el-table-column prop="roleId" label="角色ID" width="300" sortable align="center">
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200" align="center"></el-table-column>
      <el-table-column prop="remark" label="备注" min-width="300" align="center"
                       :formatter="formatDesc"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200" sortable align="center">
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template scope="scope">
          <el-button type="info" size="small" @click="updateInfo(scope.row)">修改</el-button>
          <el-button type="danger" size="small" style="margin-left: 10px"
                     @click="deleteRole(scope.row.roleId,1)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="primary" @click="deleteRole('2',2)" :disabled="this.sels.length===0">删除
      </el-button>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNumber"
          :page-sizes="[10, 15, 20, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  import {authorityAxios, JSONParse} from '../../common/js/api';

  export default {
    data() {
      return {
        filters: {
          keyword: ''
        },
        users: [],
        total: 0,
        pageNumber: 1,
        pageSize: 10,
        listLoading: false,
        sels: [],//列表选中列
        userId: '',
        // 新增
        addFormTitle: '新建角色',
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          roleName: [
            {required: true, message: '请填写角色名称', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addForm: {
          roleName: '',
          remark: '',
          menuIdList: [],
        },
        roleName: '',
        remark: '',
        menuIdList: [],
        options: [],
        defaultProps: {
          children: 'childs',
          label: 'name'
        }
      }
    },
    methods: {
      // 清除form
      clearForm() {
        this.filters.keyword = '';
        this.getList();
      },
      addInfo() {
        this.addFormVisible = true;
        this.addFormTitle = '新建角色';
        this.addForm = {
          roleName: '',
          remark: '',
          menuIdList: [],
        };
        this.$refs.tree.setCheckedKeys([]);
      },
      updateInfo(row) {
        this.addFormVisible = true;
        this.addFormTitle = '修改角色';
        this.addForm = row;
        this.roleName = row.roleName;
        this.remark = row.remark;
        this.menuIdList = row.menuIdList;
        this.$refs.tree.setCheckedKeys(this.addForm.menuIdList);
      },
      formatDesc(row, column) {
        return row.remark || '--';
      },
      handleCurrentChange(val) {
        this.pageNumber = val;
        this.getList();
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getList();
      },
      deleteRole(id, type) {
        let ids = [];
        if (type === 1) {
          ids.push(id);
        } else {
          for (let item of this.sels) {
            ids.push(item.roleId)
          }
        }
        let para = {"roleId": ids};
        this.$confirm("确认删除该角色？", '提示', {
          type: 'warning'
        }).then(() => {
          authorityAxios('sysRole/delete', para).then((res) => {
            let data = res.data;
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
      cancelSubmit(title) {
        if (title === '修改角色') {
          this.addForm.roleName = this.roleName;
          this.addForm.remark = this.remark;
          this.addForm.menuIdList = this.menuIdList;
        }
        this.addFormVisible = false;
      },
      addSubmit(formName, title) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addForm.menuIdList = this.$refs.tree.getCheckedKeys();
            let para = Object.assign({}, this.addForm);
            let url = 'sysRole/save';
            if (title === '修改角色') {
              url = 'sysRole/update';
            }
            this.addFormVisible = false;
            authorityAxios(url, para).then((res) => {
              let data = res.data;
              if (data.code === '000000') {
                this.$notify({
                  title: '成功',
                  message: data.msg,
                  type: 'success'
                });
                this.addForm = {
                  roleName: '',
                  remark: '',
                  menuIdList: [],
                };
                this.$refs.tree.setCheckedKeys([]);
                this.getList();
              } else {
                this.$message.error(data.msg);
              }
            }).catch(() => {
            });
          }
        });
      },
      getAllMenu() {
        authorityAxios('sysMenu/all', {"hasBtn": true}).then((res) => {
          let data = res.data;
          this.listLoading = false;
          if (data.code === '000000') {
            this.options = data.data;
          } else {
            this.$message(data.msg);
          }
        }).catch(() => {
        });
      },
      //获取用户应用列表
      getList() {
        let para = this.filters;
        para.page = this.pageNumber;
        para.size = this.pageSize;
        this.listLoading = true;
        authorityAxios('sysRole/list', para).then((res) => {
          let data = res.data;
          this.listLoading = false;
          if (data.code === '000000') {
            let obj = data.data;
            this.users = obj.list;
            this.total = obj.totalSize;
          } else {
            this.$message.error(data.msg);
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
      this.getAllMenu();
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