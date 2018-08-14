<template>
  <section>
    <el-row style="margin-bottom: 10px">
      <el-col :span="2" :offset="22">
        <el-button type="primary" @click="addInfo" style="width: 100%">新增菜单</el-button>
      </el-col>
    </el-row>
    <!--列表-->
    <el-table :data="list" highlight-current-row v-loading="listLoading"
              @selection-change="selsChange">
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column type="index" width="65" label="序号" align="center"></el-table-column>
      <el-table-column prop="menuId" label="菜单ID" min-width="290" align="center">
      </el-table-column>
      <el-table-column prop="name" label="菜单名称" width="200" align="center">
      </el-table-column>
      <el-table-column prop="parentName" label="上级菜单" width="200" align="center"
                       :formatter="formatPartent">
      </el-table-column>
      <el-table-column prop="url" label="菜单URL" width="200" align="center"
                       :formatter="formatUrl">
      </el-table-column>
      <el-table-column prop="funcCode" label="授权标识" min-width="250" sortable
                       align="center" :formatter="formatPerms"></el-table-column>
      <el-table-column prop="type" :formatter="formatStatus" width="90" label="类型"
                       align="center"></el-table-column>
      <el-table-column prop="orderNum" width="90" label="排序号" align="center">
      </el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template scope="scope">
          <el-button type="info" size="small" @click="updateInfo(scope.row)"
                     style="margin-right: 10px">修改
          </el-button>
          <el-button size="small" type="danger" @click="deleteMenu(scope.row.menuId,1)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新增界面-->
    <el-dialog title="" v-model="addFormVisible" :close-on-click-modal="false" class="updateUser">
      <h3>{{addFormTitle}}</h3>
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm"
               style="padding-right: 30px">
        <el-form-item label="菜单类型：" required>
          <el-select placeholder="请选择菜单类型" v-model="addForm.type">
            <el-option label="目录" value="0"></el-option>
            <el-option label="菜单" value="1"></el-option>
            <el-option label="按钮" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称：" prop="name">
          <el-input v-model="addForm.name" :maxlength="10" placeholder="请输入10字以内的菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单：">
          <el-cascader :options="options" change-on-select :props="defaultProps"
                       placeholder="请选择上级菜单"
                       @change="handleChange" :show-all-levels="false">
          </el-cascader>
        </el-form-item>
        <el-form-item label="菜单URL：" prop="url" v-if="addForm.type == 1">
          <el-input v-model="addForm.url" :maxlength="20" placeholder="菜单URL"></el-input>
        </el-form-item>
        <el-form-item label="授权标识：" prop="perms" v-if="addForm.type != 0">
          <el-input v-model="addForm.perms" :maxlength="20"
                    placeholder="多个用逗号隔开，如：user:list,user:create"></el-input>
        </el-form-item>
        <el-form-item label="排序号：" v-if="addForm.type != 2">
          <el-input-number v-model="addForm.orderNum" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelInfo(addFormTitle)">取消</el-button>
        <el-button type="primary" @click.native="addSubmit('addForm',addFormTitle)"
                   :loading="addLoading">提交
        </el-button>
      </div>
    </el-dialog>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="primary" @click="deleteMenu('2',2)" :disabled="this.sels.length===0">删除
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
  import util from '../../common/js/util'
  import {authorityAxios, JSONParse} from '../../common/js/api';

  export default {
    data() {
      return {
        filters: {
          developerType: '',
          isAuthentication: '',
          search: ''
        },
        list: [],
        listLoading: false,
        sels: [],//列表选中列
        userId: '',
        total: 0,
        size: 10,
        page: 1,
        // 新增
        addFormTitle: '新增菜单',
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            {required: true, message: '请填写菜单名称', trigger: 'blur'}],
          url: [
            {required: true, message: '请填写菜单URL', trigger: 'blur'}],
          perms: [
            {required: true, message: '请填写菜单标识', trigger: 'blur'}]
        },
        //新增界面数据
        addForm: {
          name: '',
          orderNum: 1,
          parentId: '',
          perms: '',
          url: '',
          menuId: '',
          type: '1'
        },
        defaultProps: {
          children: 'childs',
          label: 'name',
          value: 'menuId'
        },
        name: '',
        orderNum: 1,
        parentId: '',
        url: '',
        perms: '',
        type: '1',
        options: []
      }
    },
    methods: {
      handleChange(value) {
        this.addForm.parentId = value[value.length - 1];
      },
      addInfo() {
        this.addForm = {
          name: '',
          orderNum: 1,
          parentId: '',
          perms: '',
          url: '',
          type: '1'
        };
        this.addFormVisible = true;
        this.addFormTitle = '新增菜单';
      },
      cancelInfo(title) {
        if (title === '修改菜单') {
          this.addForm.name = this.name;
          this.addForm.orderNum = this.orderNum;
          this.addForm.parentId = this.parentId;
          this.addForm.url = this.url;
          this.addForm.perms = this.perms;
          this.addForm.type = this.type;
        }
        this.addFormVisible = false;
      },
      updateInfo(row) {
        this.addForm = row;
        this.name = row.name;
        this.orderNum = row.orderNum;
        this.parentId = row.parentId;
        this.url = row.url;
        this.perms = row.perms;
        this.type = row.type;
        this.addFormVisible = true;
        this.addFormTitle = '修改菜单';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getList();
      },
      handleSizeChange(val) {
        this.size = val;
        this.getList();
      },
      addSubmit(formName, title) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let para = Object.assign({}, this.addForm);
            let url = 'sysMenu/save';
            if (title === '修改菜单') {
              url = 'sysMenu/update';
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
                  name: '',
                  orderNum: 1,
                  parentId: '',
                  perms: '',
                  url: '',
                  type: '1'
                };
                this.getAllMenu();
                this.getList();
              } else {
                this.$message.error(data.msg);
              }
            }).catch(() => {
            });
          }
        });
      },
      formatStatus(row, column) {
        return row.type === '0' ? '目录' : row.type === '1' ? '菜单' : '按钮';
      },
      formatPerms(row, column) {
        return row.perms || '--';
      },
      formatUrl(row, column) {
        return row.url || '--';
      },
      formatPartent(row, column) {
        return row.parentName || '--';
      },
      deleteMenu(id, type) {
        let ids = [];
        if (type === 1) {
          ids.push(id);
        } else {
          for (let item of this.sels) {
            ids.push(item.menuId)
          }
        }
        let para = {"menuId": ids};
        this.$confirm('确认删除该菜单？', '提示', {
          type: 'warning'
        }).then(() => {
          authorityAxios('sysMenu/delete', para).then((res) => {
            let data = res.data;
            this.listLoading = false;
            if (data.code === '000000') {
              this.$notify({
                title: '成功',
                message: data.msg,
                type: 'success'
              });
              this.getAllMenu();
              this.getList();
            } else {
              this.$message(data.msg);
            }
          }).catch(() => {
          });
        }).catch(() => {
        });
      },
      getAllMenu() {
        authorityAxios('sysMenu/all', {"hasBtn": false}).then((res) => {
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
      //获取菜单列表
      getList() {
        let para = {};
        para.page = this.page;
        para.size = this.size;
        this.listLoading = true;
        authorityAxios('sysMenu/list', para).then((res) => {
          let data = res.data;
          this.listLoading = false;
          if (data.code === '000000') {
            let obj = data.data;
            this.list = obj.list;
            for (let i = 0; i < obj.list.length; i++) {
              this.list[i].type = "" + obj.list[i].type;
            }
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

<style lang="scss" scoped>
</style>