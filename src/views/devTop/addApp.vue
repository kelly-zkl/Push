<template>
  <section class="app-man">
    <div class="main-content">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <div class="add-appdiv">
          <div class="f-left">
            <h3>基本信息</h3>
          </div>
          <div class="form-add">
            <el-form-item label="应用名称：" prop="appName">
              <el-input placeholder="请输入应用名称" v-model="form.appName" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="应用图标：" prop="appIcon" class="height-60">
              <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload" accept="image/jpeg,image/png,image/gif"
                  name="attachFile">
                <img v-if="form.appIcon" :src="form.appIcon" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span class="t-999">（仅支持 gif / jpg / png / jpeg 后缀）</span>
            </el-form-item>
          </div>
        </div>
        <div class="add-appdiv">
          <div class="ap-bottom">
            <div class="f-left">
              <h3>Android</h3>
            </div>
            <div class="form-add">
              <el-form-item label="是否支持Android：">
                <el-radio-group v-model="form.isSupprotAndroid">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="应用包名：" v-if="form.isSupprotAndroid==1" prop="androidAppPackage">
                <el-input placeholder="请输入应用包名（添加后不可更改）"
                          v-model="form.androidAppPackage" :maxlength="30"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="ap-bottom">
            <div class="f-left">
              <h3>IOS</h3>
            </div>
            <div class="form-add">
              <el-form-item label="是否支持IOS：">
                <el-radio-group v-model="form.isSupportIos">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <div v-if="form.isSupportIos==1">
                <el-form-item label="ios开发证书：" prop="iosDevCredential">
                  <el-input v-model="form.iosDevCredential" disabled>
                    <el-upload
                        class="upload" slot="append"
                        :action="uploadIosUrl"
                        :show-file-list="false"
                        :on-success="handleIos1Success"
                        :before-upload="beforeIos" name="attachFile">
                      <span>选择文件</span>
                    </el-upload>
                  </el-input>
                </el-form-item>
                <el-form-item label="开发证书密码：" prop="iosDevPwd">
                  <el-input type="password" placeholder="请输入开发证书密码"
                            v-model="form.iosDevPwd" :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="ios生产证书：" prop="iosProductCredential">
                  <el-input v-model="form.iosProductCredential" disabled>
                    <el-upload
                        class="upload" slot="append"
                        :action="uploadIosUrl"
                        :show-file-list="false"
                        :on-success="handleIos2Success"
                        :before-upload="beforeIos" name="attachFile">
                      <span>选择文件</span>
                    </el-upload>
                  </el-input>
                </el-form-item>
                <el-form-item label="生产证书密码：" prop="iosProductPwd">
                  <el-input type="password" placeholder="请输入生产证书密码"
                            v-model="form.iosProductPwd" :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="IOS bundleId：" prop="bundleId">
                  <el-input placeholder="请输入bundleId" v-model="form.bundleId"
                            :maxlength="30"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div>
            <div class="f-left">
              <h3>windows</h3>
            </div>
            <div class="form-add">
              <el-form-item label="启用windows：">
                <el-radio-group v-model="form.isSupportWinphone">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
      <div class="text-right">
        <el-button size="large" @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="onSubmit" size="large">确认创建</el-button>
      </div>
    </div>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  import {globalAxios, JSONParse, globalValidImg, globalValidP12} from '../../common/js/api';

  export default {
    data() {
      return {
        ios: 2,
        form: {
          userId: '',
          appName: '',
          appIcon: '',
          isSupprotAndroid: 1,
          androidAppPackage: '',
          isSupportIos: 1,
          iosDevCredential: '',
          iosDevPwd: '',
          isSupportWinphone: 1,
          iosProductCredential: '',
          iosProductPwd: '',
          bundleId: ''
        },
        rules: {
          appName: [
            {required: true, message: '请输入应用名称', trigger: 'blur'}
          ],
          appIcon: [
            {required: true, message: '请上传应用图标', trigger: 'blur,change'}
          ],
          androidAppPackage: [
            {required: true, message: '请输入Android应用包名', trigger: 'blur'}
          ],
          iosDevCredential: [
            {required: true, message: '请上传ios开发证书', trigger: 'blur'}
          ],
          iosDevPwd: [
            {required: true, message: '请输入ios开发证书密码', trigger: 'blur'}
          ],
          iosProductCredential: [
            {required: true, message: '请上传ios生产证书', trigger: 'blur'}
          ],
          iosProductPwd: [
            {required: true, message: '请输入ios生产证书密码', trigger: 'blur'}
          ],
          bundleId: [
            {required: true, message: '请输入IOS bundleId', trigger: 'blur'}
          ],

        },
        userId: '',
        uploadUrl: baseUrl + 'upload/file/img',
        uploadIosUrl: baseUrl + 'upload/file/other'
      }
    },
    methods: {
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let para = Object.assign({}, this.form);
            globalAxios('appinfo/create', para).then((res) => {
              let data = res.data;
              if (data.code === '000000') {
                this.$alert(data.msg, '温馨提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push('/appMan');
                  }
                });
              } else {
                this.$message.error(data.msg);
              }
            }).catch(() => {
            });
          }
        })
      },
      beforeIos(file) {
        return globalValidP12(file, this.$message);
      },
      handleIos1Success(res, file) {
        if (res.code === '000000') {
          const data = res.data;
          this.form.iosDevCredential = data.fileUrl;
        }
        else {
          this.$message.error(res.msg);
        }
      },
      handleIos2Success(res, file) {
        if (res.code === '000000') {
          const data = res.data;
          this.form.iosProductCredential = data.fileUrl;
        }
        else {
          this.$message.error(res.msg);
        }
      },
      handleAvatarSuccess(res, file) {
        if (res.code === '000000') {
          const data = res.data;
          this.form.appIcon = data.fileUrl;
        }
        else {
          this.$message.error(res.msg);
        }
      },
      beforeAvatarUpload(file) {
        return globalValidImg(file, this.$message);
      }
    },
    mounted() {
      this.form.userId = JSONParse(sessionStorage.userInfo).userId;
    }
  }
</script>

<style scoped lang="scss">
  .app-man {
    width: 100%;
    overflow-y: scroll;
    .main-content {
      margin-left: 60px;
      margin-right: 60px;
      margin-top: 30px;
    }
    .add-appdiv {
      border: 1px solid rgb(204, 204, 204);
      border-radius: 5px;
      padding: 30px 30px;
      margin-bottom: 30px;
      .f-left {
        float: left;
        h3 {
          margin: 0;
          padding-top: 5px;
          color: #666;
        }
      }
      .ap-bottom {
        border-bottom: 1px solid rgb(204, 204, 204);
        margin-bottom: 22px;
      }
      .form-add {
        margin-left: 100px;
        width: 600px;
        .avatar-uploader {
          width: 60px;
          height: 60px;
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          text-align: center;
          line-height: 60px;
          color: #666;
          display: inline-block;
          vertical-align: top;
          margin-right: 10px;
        }
        .avatar-uploader:hover {
          border-color: #6cc;
        }
        .avatar {
          width: 60px;
          height: 60px;
          display: block;
        }
      }
    }
    .text-right {
      text-align: right;
      margin-bottom: 30px;
    }
  }

  .app-man .add-appdiv:first-child, .app-man .add-appdiv:last-child {
    padding-bottom: 8px;
  }
</style>