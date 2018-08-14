<template>
  <section>
    <el-row class="toolbar">
      <el-col :span="4">
        <el-input placeholder="用户名/邮箱/手机号" icon="search" v-model="searckKey"
                  :on-icon-click="getUsers">
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="getUsers" class="f-right">搜索</el-button>
      </el-col>
      <el-col :span="2">
        <el-button @click="clearForm" style="margin-left: 10px">清除</el-button>
      </el-col>
      <el-col :span="2" :offset="14">
        <el-button type="primary" @click="addInfo" style="width: 100%">新建用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="users" highlight-current-row v-loading="listLoading"
              @selection-change="selsChange">
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column type="index" width="65" label="序号" align="center"></el-table-column>
      <el-table-column prop="userId" label="用户ID" min-width="300" sortable align="center">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="250" sortable align="center">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="300" sortable align="center"
                       :formatter="formatEmail">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" width="200" sortable align="center">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120" sortable align="center"
                       :formatter="formatStatus">
      </el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template scope="scope">
          <el-button type="info" size="small" @click="updateInfo(scope.row)">修改</el-button>
          <el-button type="danger" size="small" style="margin-left: 10px"
                     @click="deleteUser(scope.row.userId,1)">删除
          </el-button>
          <el-button v-if="scope.row.status == 0" type="warning" size="small"
                     style="margin-left: 10px" @click="changeStatus(scope.row.userId,1)">停用
          </el-button>
          <el-button v-if="scope.row.status == 1" type="success" size="small"
                     style="margin-left: 10px" @click="changeStatus(scope.row.userId,0)">启用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新增用户和修改用户界面-->
    <el-dialog title="" v-model="addFormVisible" :close-on-click-modal="false" class="updateUser">
      <h3>{{addFormTitle}}</h3>
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm"
               style="margin: 0 8%">
        <el-form-item label=" 用户名：" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入6-16由字母、数字或下划线组成的用户名"
                    :maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input type="password" v-model="addForm.password" placeholder="请输入6-18由字母+数字组成的密码"
                    :maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="addForm.mobile" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="角色：" required>
          <el-select placeholder="请选择角色" v-model="addForm.roleIdList">
            <el-option v-for="item in options" :key="item.roleId" :label="item.roleName"
                       :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="addForm.status">
            <el-radio :label="1">禁用</el-radio>
            <el-radio :label="0">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelInfo(addFormTitle)">取消</el-button>
        <el-button type="primary" @click.native="addSubmit('addForm',addFormTitle)"
                   :loading="addLoading">保存
        </el-button>
      </div>
    </el-dialog>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="primary" @click="deleteUser('2',2)" :disabled="this.sels.length===0">删除
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
      let usernameValidator = (rule, value, callback) => {
        if (!/^[a-zA-Z0-9_]{6,16}$/.test(value)) {
          callback(new Error("请输入6-16由字母、数字或下划线组成的用户名"));
        } else {
          callback();
        }
      };
      let pwdValidator = (rule, value, callback) => {
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(value)) {
          callback(new Error("请输入6-18由字母+数字组成的密码"));
        } else {
          callback();
        }
      };
      let emailValidator = (rule, value, callback) => {
        if (!/^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/.test(value)) {
          callback(new Error("请输入正确的邮箱"));
        } else {
          callback();
        }
      };
      let phoneValidator = (rule, value, callback) => {
        if (!/^1(3|4|5|7|8)\d{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号码"));
        } else {
          callback();
        }
      };
      return {
        searckKey: '',
        listLoading: false,
        sels: [],//列表选中列
        users: [],
        total: 0,
        page: 1,
        size: 10,
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        userId: '',
        //新增界面数据
        addFormTitle: '新建用户',
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: '',
          roleIdList: '',
          status: 0
        },
        addFormRules: {
          username: [
            {required: true, message: '请输入登录账号', trigger: 'blur'},
            {validator: usernameValidator, trigger: "change,blur"}
          ],
          password: [
            {required: true, message: '请输入登录密码', trigger: 'blur'},
            {validator: pwdValidator, trigger: "change,blur"}
          ],
          mobile: [
            {required: true, message: '输入手机号码', trigger: 'blur'},
            {validator: phoneValidator, trigger: "change,blur"}
          ],
          email: [
            {validator: emailValidator, trigger: "change,blur"}
          ]
        },
        options: [],
        username: '',
        password: '',
        email: '',
        mobile: '',
        roleIdList: '',
        status: 0
      }
    },
    methods: {
      formatEmail(row, column) {
        return row.email || '--';
      },
      formatStatus(row, column) {
        return row.status === 0 ? '正常' : '禁用';
      },
      clearForm() {
        this.searckKey = '';
        this.getUsers();
      },
      addInfo() {
        this.addForm = {
          username: '',
          password: '',
          email: '',
          mobile: '',
          roleIdList: '',
          status: 0
        };
        this.addFormVisible = true;
        this.addFormTitle = '新建用户';
      },
      updateInfo(row) {
        this.addForm = row;
        this.username = row.username;
        this.password = row.password;
        this.email = row.email;
        this.mobile = row.mobile;
        this.roleIdList = row.roleIdList;
        this.status = row.status;
        this.addFormVisible = true;
        this.addFormTitle = '修改用户';
      },
      cancelInfo(title) {
        if (title === '修改用户') {
          this.addForm.username = this.username;
          this.addForm.password = this.password;
          this.addForm.email = this.email;
          this.addForm.mobile = this.mobile;
          this.addForm.roleIdList = this.roleIdList;
          this.addForm.status = this.status;
        }
        this.addFormVisible = false;
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getUsers();
      },
      handleSizeChange(val) {
        this.size = val;
        this.getUsers();
      },
      changeStatus(id, status) {
        let para = {};
        para.userId = id;
        para.status = status;
        let msg = '';
        if (status === 0) {
          msg = '确定启用该用户吗？';
        } else {
          msg = '确定停用该用户吗？';
        }
        this.$confirm(msg, '提示', {
          type: 'warning'
        }).then(() => {
          authorityAxios('sysUser/update', para).then((res) => {
            let data = res.data;
            if (data.code === '000000') {
              this.$notify({
                title: '成功',
                message: data.msg,
                type: 'success'
              });
              this.getUsers();
            } else {
              this.$message.error(data.msg);
            }
          }).catch(() => {
          });
        }).catch(() => {
        });
      },
      deleteUser(id, type) {
        let ids = [];
        if (type === 1) {
          ids.push(id);
        } else {
          for (let item of this.sels) {
            ids.push(item.userId)
          }
        }
        let para = {"userId": ids};
        this.$confirm("确认删除该用户？", '提示', {
          type: 'warning'
        }).then(() => {
          authorityAxios('sysUser/delete', para).then((res) => {
            let data = res.data;
            if (data.code === '000000') {
              this.$message({
                message: data.msg,
                type: 'success'
              });
              this.getUsers();
            } else {
              this.$message(data.msg);
            }
          }).catch(() => {
          });
        }).catch(() => {
        });
      },
      addSubmit(formName, title) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let para = Object.assign({}, this.addForm);
            let url = 'sysUser/save';
            if (title === '修改用户') {
              url = 'sysUser/update';
            }
            para.roleIdList = [];
            para.roleIdList.push(this.addForm.roleIdList);
            authorityAxios(url, para).then((res) => {
              let data = res.data;
              this.addFormVisible = false;
              if (data.code === '000000') {
                this.$notify({
                  title: '成功',
                  message: data.msg,
                  type: 'success'
                });
                this.addForm = {
                  username: '',
                  password: '',
                  email: '',
                  mobile: '',
                  roleIdList: '',
                  status: 0
                };
                this.getUsers();
              } else {
                this.$message.error(data.msg);
              }
            }).catch(() => {
            });
          }
        });
      },
      getRoleList() {
        authorityAxios('sysRole/list', {page: 1, size: 1000}).then((res) => {
          let data = res.data;
          if (data.code === '000000') {
            let obj = data.data;
            this.options = obj.list;
          } else {
            this.$message(data.msg);
          }
        }).catch(() => {
        });
      },
      getUsers() {
        let para = {};
        para.page = this.page;
        para.size = this.size;
        para.keyword = this.searckKey;
        this.listLoading = true;
        authorityAxios('sysUser/list', para).then((res) => {
          let data = res.data;
          this.listLoading = false;
          if (data.code === '000000') {
            let obj = data.data;
            this.users = obj.list;
            for (let i = 0; i < obj.list.length; i++) {
              this.users[i].roleIdList = obj.list[i].roleIdList[0];
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
      this.getUsers();
      this.getRoleList();
    }
  }
</script>

<style>
  .toolbar {
    background: #f2f2f2;
    padding: 10px;
    margin: 0 0 10px 0;
  }
</style>