<template>
  <section>
    <el-row style="margin-bottom: 10px">
      <el-col :span="2" :offset="22">
        <el-button type="primary" @click="addInfo" style="width: 100%">新建</el-button>
      </el-col>
    </el-row>
    <!--列表-->
    <el-table :data="list" highlight-current-row v-loading="listLoading"
              @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="index" width="80" label="序号" align="center">
      </el-table-column>
      <el-table-column prop="type" label="类型" width="130" align="center" sortable
                       :formatter="formatType">
      </el-table-column>
      <el-table-column prop="opSys" label="编程语言" width="130" align="center" sortable>
      </el-table-column>
      <el-table-column prop="sdkVersion" label="版本" width="100" align="center" sortable>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新日期" width="200" sortable align="center">
      </el-table-column>
      <el-table-column prop="info" label="描述" min-width="300" align="center">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120" sortable :formatter="formatStatus"
                       align="center">
      </el-table-column>
      <el-table-column label="操作" width="240" align="center">
        <template scope="scope">
          <router-link :to="{ path: '/SDKInfo', query: { sdkId: scope.row.sdkId}}">
            <el-button size="small" style="margin-right: 10px">查看</el-button>
          </router-link>
          <el-button v-if="scope.row.status==1" size="small" type="warning"
                     @click="qitClick('disable',scope.row)">停用
          </el-button>
          <el-button v-if="scope.row.status==2" size="small" type="success"
                     @click="qitClick('enable',scope.row)">启用
          </el-button>
          <el-button size="small" type="info" @click="updateInfo(scope.row)"
                     style="margin-left: 10px">更新SDK包
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新增界面-->
    <el-dialog title="" v-model="addFormVisible" :close-on-click-modal="false" class="updateUser">
      <h3>{{addFormTitle}}</h3>
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm"
               style="padding-right: 30px">
        <el-form-item label="类型：" required>
          <el-select placeholder="请选择类型" v-model="addForm.type">
            <el-option label="客户端SDK" value="1"></el-option>
            <el-option label="服务器端SDK" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编程语言：" required>
          <el-select placeholder="请选择编程语言" v-model="addForm.opSys">
            <el-option label="ANDROID" value="ANDROID"></el-option>
            <el-option label="IOS" value="IOS"></el-option>
            <el-option label="WINDOWS" value="WINDOWS"></el-option>
            <el-option label="JAVA" value="JAVA"></el-option>
            <el-option label="PHP" value="PHP"></el-option>
            <el-option label="PYTHON" value="PYTHON"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SDK文件：" prop="sdkPath">
          <el-input v-model="addForm.sdkPath" disabled>
            <el-upload
                class="avatar-uploader upload" slot="append"
                :action="uploadSdkUrl"
                :show-file-list="false"
                :on-success="handleSdkSuccess"
                :before-upload="beforeSdkUpload" name="attachFile">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <span v-else>上传</span>
            </el-upload>
          </el-input>
        </el-form-item>
        <el-form-item label="SDK文档：" prop="docUrl">
          <el-input v-model="addForm.docUrl" disabled>
            <el-upload
                class="avatar-uploader upload" slot="append"
                :action="uploadDocUrl"
                :show-file-list="false"
                :on-success="handleDocSuccess"
                :before-upload="beforeDocUpload" name="attachFile">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <span v-else>上传</span>
            </el-upload>
          </el-input>
        </el-form-item>
        <el-form-item label="版本：" prop="sdkVersion">
          <el-input v-model="addForm.sdkVersion"></el-input>
        </el-form-item>
        <el-form-item label="内容：" class="textarea-min-height">
          <el-input type="textarea" v-model="addForm.info" :maxlength="100"
                    placeholder="请输入100字以内的备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelSubmit(addFormTitle)">取消</el-button>
        <el-button type="primary" @click.native="addSubmit('addForm',addFormTitle)"
                   :loading="addLoading">提交
        </el-button>
      </div>
    </el-dialog>
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
          isAuthentication: '',
          search: ''
        },
        list: [],
        uploadSdkUrl: baseUrl + 'upload/file/sdk',
        uploadDocUrl: baseUrl + 'upload/file/doc',
        listLoading: false,
        sels: [],//列表选中列
        userId: '',
        // 新增
        addFormTitle: '新增SDK',
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        imageUrl: '',
        addFormRules: {
          docUrl: [
            {required: true, message: '请上传文档', trigger: 'blur'}
          ],
          sdkPath: [
            {required: true, message: '请上传SDK', trigger: 'blur'}
          ],
          sdkVersion: [
            {required: true, message: '请填写版本号', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addForm: {
          opSys: 'ANDROID',
          sdkVersion: 'v',
          info: '',
          seq: '',
          sdkPath: '',
          docPath: '',
          docUrl: '',
          sdkId: '',
          type: '1'
        },
        opSys: '',
        sdkVersion: '',
        info: '',
        seq: '',
        sdkPath: '',
        docPath: '',
        docUrl: '',
        sdkId: '',
        type: '1'
      }
    },
    methods: {
      addInfo() {
        this.addForm = {
          opSys: 'ANDROID',
          sdkVersion: 'v',
          info: '',
          seq: '',
          sdkPath: '',
          docPath: '',
          docUrl: '',
          sdkId: '',
          type: '1'
        };
        this.addFormVisible = true;
        this.addFormTitle = '新增SDK';
      },
      updateInfo(row) {
        this.addForm = row;
        this.sdkPath = row.sdkPath;
        this.docPath = row.docPath;
        this.docUrl = row.docUrl;
        this.opSys = row.opSys;
        this.sdkVersion = row.sdkVersion;
        this.info = row.info;
        this.seq = row.seq;
        this.sdkId = row.sdkId;
        this.type = row.type;
        this.addFormVisible = true;
        this.addFormTitle = '更新SDK包';
      },
      qitClick(url, row) {
        let confirmMsg = '确认停用这条记录吗?';
        if (url === 'enable') {
          confirmMsg = '确认启用这条记录吗?';
        }
        this.$confirm(confirmMsg, '提示', {
          type: 'warning'
        }).then(() => {
          globalAxios('sdk/' + url + '/' + row.opSys, {}).then((res) => {
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
      formatType(row, column) {
        return row.type === '1' ? '客户端SDK' : '服务器端SDK';
      },
      handleSdkSuccess(res, file) {
        if (res.code === '000000') {
          const data = res.data;
          this.addForm.sdkPath = data.fileUrl;
        }
        else {
          this.$message.error(res.msg);
        }
      },
      beforeSdkUpload(file) {
        // console.log(file)
      },
      handleDocSuccess(res, file) {
        if (res.code === '000000') {
          const data = res.data;
          this.addForm.docPath = data.filePath;
          this.addForm.docUrl = data.fileUrl;
        }
        else {
          this.$message.error(res.msg);
        }
      },
      beforeDocUpload(file) {
        // console.log(file)
      },
      cancelSubmit(title) {
        this.addFormVisible = false;
        if (title === '更新SDK包') {
          this.addForm.sdkPath = this.sdkPath;
          this.addForm.docPath = this.docPath;
          this.addForm.docUrl = this.docUrl;
          this.addForm.opSys = this.opSys;
          this.addForm.sdkVersion = this.sdkVersion;
          this.addForm.info = this.info;
          this.addForm.seq = this.seq;
          this.addForm.sdkId = this.sdkId;
          this.addForm.type = this.type;
        }
      },
      addSubmit(formName, title) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let para = Object.assign({}, this.addForm);
            let url = 'sdk/create';
            if (title === '更新SDK包') {
              url = 'sdk/update';
            }
            para.accountId = this.userId;
            globalAxios(url, para).then((res) => {
              let data = res.data;
              this.addFormVisible = false;
              if (data.code === '000000') {
                this.$notify({
                  title: '成功',
                  message: data.msg,
                  type: 'success'
                });
                this.addForm = {
                  opSys: 'ANDROID',
                  sdkVersion: 'v',
                  info: '',
                  seq: '',
                  sdkPath: '',
                  docPath: '',
                  docUrl: '',
                  sdkId: '',
                  type: '1'
                };
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
        return row.status === 1 ? '启用' : row.status === 2 ? '禁用' : '审核被拒';
      },
      //获取SDk列表
      getList() {
        this.listLoading = true;
        globalAxios('sdk/list/latest', {}).then((res) => {
          let data = res.data;
          this.listLoading = false;
          if (data.code === '000000') {
            let obj = data.data;
            this.list = obj;
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
      this.getList();
    }
  }
</script>

<style lang="scss" scoped>
</style>