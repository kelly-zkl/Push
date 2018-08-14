<template>
  <section class="app-man">
    <div class="main-content">
      <el-form ref="form" :model="form" label-width="150px" v-if="step==1">
        <el-button type="primary" @click="step=2" size="large" class="update-app">修改应用</el-button>
        <div class="add-appdiv">
          <div class="ap-bottom">
            <div class="f-left">
              <h3>基本信息</h3>
            </div>
            <div class="form-add">
              <el-form-item label="应用名称：">
                {{form.appName || '-'}}
              </el-form-item>
              <el-form-item label="应用图标：" class="height-60">
                <img v-if="form.appIcon" :src="form.appIcon" class="avatar border-r-5">
              </el-form-item>
            </div>
          </div>
          <div>
            <div class="f-left">
              <h3>应用信息</h3>
            </div>
            <div class="form-add">
              <el-form-item label="AppKey：">
                {{form.appKey || '-'}}
              </el-form-item>
              <el-form-item label="Master Secret：">
                {{form.appSecret || '-'}}
                <el-button type="default" size="small" style="margin-left: 15px;"
                           @click="resetSecret">重置
                </el-button>
              </el-form-item>
              <el-form-item label="创建时间：">
                {{form.createTime || '-'}}
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="add-appdiv">
          <div class="ap-bottom" v-if="form.isSupprotAndroid==1">
            <div class="f-left">
              <h3>Android</h3>
            </div>
            <div class="form-add">
              <el-form-item label="应用包名：" prop="androidAppPackage">
                {{form.androidAppPackage || '-'}}
              </el-form-item>
            </div>
          </div>
          <div class="ap-bottom" v-if="form.isSupportIos==1">
            <div class="f-left">
              <h3>IOS</h3>
            </div>
            <div class="form-add">
              <el-form-item label="ios开发证书：">
                <a :href="form.iosDevCredential" class="t-6cc ellipsis"
                   title="点击下载">{{form.iosDevCredential
                    ? form.iosDevCredential.substring(form.iosDevCredential.lastIndexOf(
                        "/") + 1, form.iosDevCredential.length) : '--'}}</a>
              </el-form-item>
              <el-form-item label="开发证书密码：">
                ******
              </el-form-item>
              <el-form-item label="ios生产证书：">
                <a :href="form.iosProductCredential" class="t-6cc ellipsis"
                   title="点击下载">{{form.iosProductCredential
                    ? form.iosProductCredential.substring(form.iosProductCredential.lastIndexOf(
                        "/") + 1, form.iosProductCredential.length) : '--'}}</a>
              </el-form-item>
              <el-form-item label="生产证书密码：" prop="iosProductPwd">
                ******
              </el-form-item>
              <el-form-item label="IOS bundleId：" prop="bundleId">
                {{form.bundleId || '-'}}
              </el-form-item>
            </div>
          </div>
          <div>
            <div class="f-left">
              <h3>windows</h3>
            </div>
            <div class="form-add">
              <el-form-item label="启用windows：">
                {{form.isSupportWinphone == 1 ? '是' : '否'}}
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px" v-else>
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
                  <el-input v-model="this.form.iosDevCredential" disabled>
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
                  <el-input v-model="this.form.iosProductCredential" disabled>
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
        <div class="text-right">
          <el-button size="large" @click="cancelModify">取消</el-button>
          <el-button size="large" type="danger" @click="updateAppStatus(2)" v-if="form.appStatus==1"
                     v-loading="updateLoading">停用
          </el-button>
          <el-button size="large" type="info" @click="updateAppStatus(1)" v-else
                     v-loading="updateLoading">启用
          </el-button>
          <el-button type="primary" @click="onSubmit" size="large" v-loading="updateLoading">保存
          </el-button>
        </div>
      </el-form>

    </div>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  import appCss from '../../assets/styles/app.scss'
  import {globalAxios, JSONParse, globalValidImg, globalValidP12} from '../../common/js/api';

  export default {
    data() {
      return {
        step: 1,
        ios: 2,
        updateLoading: false,
        appId: sessionStorage.appId,
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
          bundleId: '',
          appStatus: ''
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
        uploadUrl: baseUrl + 'upload/file/img',
        uploadIosUrl: baseUrl + 'upload/file/other',
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
        bundleId: '',
        appStatus: ''
      }
    },
    methods: {
      cancelModify() {
        this.step = 1;
        this.form.userId = this.userId;
        this.form.appName = this.appName;
        this.form.appIcon = this.appIcon;
        this.form.isSupprotAndroid = this.isSupprotAndroid;
        this.form.androidAppPackage = this.androidAppPackage;
        this.form.isSupportIos = this.isSupportIos;
        this.form.iosDevCredential = this.iosDevCredential;
        this.form.iosDevPwd = this.iosDevPwd;
        this.form.iosProductCredential = this.iosProductCredential;
        this.form.iosProductPwd = this.iosProductPwd;
        this.form.isSupportWinphone = this.isSupportWinphone;
        this.form.bundleId = this.bundleId;
        this.form.appStatus = this.appStatus;
      },
      resetSecret() {
        this.$confirm('Master Secret 变更将影响 API 推送，需要调用方更改调用代码。', '重要提示', {
          type: 'warning'
        }).then(() => {
          globalAxios('appinfo/resetSecret/' + this.form.appId, {}).then((res) => {
            let data = res.data;
            if (data.code === '000000') {
              this.$message.success(data.msg);
              this.getInfo();
            } else {
              this.$message.error(data.msg);
            }
          }).catch(() => {
          });
        }).catch(() => {
        });
      },
      updateAppStatus(status) {
        let msg = '您确定要停用该应用吗？';
        status === 1 ? msg = '您确定要启用该应用吗？' : "";
        this.$confirm(msg, '提示', {
          type: 'warning'
        }).then(() => {
          this.updateLoading = true;
          let para = {};
          para.appId = this.form.appId;
          para.appStatus = status;
          globalAxios('appinfo/upateStatus', para).then((res) => {
            let data = res.data;
            this.updateLoading = false;
            if (data.code === '000000') {
              this.$alert(data.msg, '温馨提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.getInfo();
                  this.step = 1;
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          }).catch(() => {
          });
        }).catch(() => {
        });
      },
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.updateLoading = true;
            let para = Object.assign({}, this.form);
            globalAxios('appinfo/update', para).then((res) => {
              let data = res.data;
              this.updateLoading = false;
              if (data.code === '000000') {
                this.$alert(data.msg, '温馨提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    // this.$router.push('/appMan');
                    this.getInfo();
                    this.step = 1;
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
        this.updateLoading = false;
        return globalValidP12(file, this.$message);
      },
      handleIos1Success(res, file) {
        if (res.code === '000000') {
          const data = res.data;
          this.form.iosDevCredential = data.fileUrl;
        } else {
          this.$message.error(res.msg);
        }
      },
      handleIos2Success(res, file) {
        if (res.code === '000000') {
          const data = res.data;
          this.form.iosProductCredential = data.fileUrl;
        } else {
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
      },
      getInfo() {
        globalAxios('appinfo/get/' + this.appId, {}).then((res) => {
          let data = res.data;
          if (data.code === '000000') {
            this.form = data.data;
            this.userId = data.data.userId;
            this.appName = data.data.appName;
            this.appIcon = data.data.appIcon;
            this.isSupprotAndroid = data.data.isSupprotAndroid;
            this.androidAppPackage = data.data.androidAppPackage;
            this.isSupportIos = data.data.isSupportIos;
            this.iosDevCredential = data.data.iosDevCredential;
            this.iosDevPwd = data.data.iosDevPwd;
            this.iosProductCredential = data.data.iosProductCredential;
            this.iosProductPwd = data.data.iosProductPwd;
            this.isSupportWinphone = data.data.isSupportWinphone;
            this.bundleId = data.data.bundleId;
            this.appStatus = data.data.appStatus;
          } else {
            this.$message.error(data.msg);
          }
        }).catch(() => {
        });
      }
    },
    mounted() {
      this.form.userId = JSONParse(sessionStorage.userInfo).userId;
      this.appId = sessionStorage.appId;
      this.getInfo();
    }
  }
</script>

<style scoped lang="scss">

</style>