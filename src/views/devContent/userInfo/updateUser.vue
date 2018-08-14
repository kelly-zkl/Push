<template>
  <section class="all">
    <el-tabs type="border-card" class="update-user-type">
      <el-tab-pane label="个人信息">
        <h3 class="title-h3">帐号信息</h3>
        <el-form ref="form" :model="userForm" label-width="120px" class="user-form">
          <el-form-item label="类型：">
            <span>{{userForm.developer.developerType == 3 ? '个人开发者' : '公司开发者'}}</span>
          </el-form-item>
          <el-form-item label="用户名：">
            <span>{{userForm.loginName}}</span>
          </el-form-item>
          <el-form-item label="手机号码：">
            <span>{{userForm.mobilePhone}}</span>
            <span class="sure-check"><i class="el-icon-circle-check"></i>已验证</span>
            <span class="update-span" @click="changeMobile">变更手机号</span>
          </el-form-item>
          <el-form-item label="登录密码：">
            <span>{{userForm.password}}</span>
            <span class="update-span" @click="changePassword">修改密码</span>
          </el-form-item>
          <el-form-item label="注册日期：">
            <span>{{userForm.registerDate}}</span>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="开发者信息">
        <div v-if="(!!userForm.developer)&&updateDev==1">
          <h3 class="title-h3">开发者认证<span class="sure-check"
                                          v-if="userForm.developer.isAuthentication==2"><i
              class="el-icon-circle-check"></i>已认证</span></h3>
          <el-form ref="form" label-width="150px" class="user-form">
            <el-form-item label="开发者类型：">
              <span>{{userForm.developer.developerType == 2 ? '公司' : '个人'}}</span>
            </el-form-item>
            <el-form-item label="真实姓名：">
              <span>{{userForm.developer.realName || '-'}}</span>
            </el-form-item>
            <el-form-item label="公司名称：" v-if="userForm.developer.developerType==2">
              <span>{{userForm.developer.companyName || '-'}}</span>
            </el-form-item>
            <el-form-item label="营业执照号：" v-if="userForm.developer.developerType==2">
              <span>{{userForm.developer.credentialNo || '-'}}</span>
            </el-form-item>
            <el-form-item label="证件号码：" v-if="userForm.developer.developerType==3">
              <span>{{userForm.developer.cardNo || '-'}}</span>
            </el-form-item>
            <el-form-item label="证件图片：">
              <div v-if="userForm.developer.developerType==2">
                <img :src="userForm.developer.cardPhoto" width="120" height="120"
                     v-if="!!userForm.developer.cardPhoto">
              </div>
              <div v-else>
                <img :src="userForm.developer.idCardFront" width="120" height="120"
                     v-if="!!userForm.developer.idCardFront">
                <img :src="userForm.developer.idCardBack" width="120" height="120"
                     v-if="!!userForm.developer.idCardBack">
                <img :src="userForm.developer.idCardHand" width="120" height="120"
                     v-if="!!userForm.developer.idCardHand">
              </div>
            </el-form-item>
            <el-form-item label="手机号码：">
              <span>{{userForm.developer.developerMobile || '-'}}</span>
            </el-form-item>
            <el-form-item label="" class="update-dev">
              <el-button type="primary" @click="updateDev=0" size="large">修改资料</el-button>
              <el-button type="danger" size="large" @click="cancel"
                         v-if="userForm.developer.isAuthentication==2">取消认证
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else>
          <h3 class="title-h3">开发者认证</h3>
          <el-form ref="devForm" label-width="150px" class="user-form" >
            <el-form-item label="开发者类型：">
              <span>{{userForm.developer.developerType == 2 ? '公司' : '个人'}}</span>
            </el-form-item>
            <el-form-item label="真实姓名：">
              <el-input v-model="updateForm.realName" :maxlength="10"></el-input>
            </el-form-item>
            <div v-if="userForm.developer.developerType==2">
              <el-form-item label="公司名称：">
                <el-input v-model="updateForm.companyName" :maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="营业执照号：">
                <el-input v-model="updateForm.credentialNo" :maxlength="18"></el-input>
              </el-form-item>
              <el-form-item label="营业执照：">
                <div class="upload-img">
                  <el-upload
                      class="avatar-uploader"
                      :action="uploadUrl"
                      :show-file-list="false"
                      :on-success="cardCSuccess"
                      :before-upload="beforeAvatarUpload" accept="image/jpeg,image/png,image/gif"
                      name="attachFile">
                    <img v-if="img.company" :src="img.company" class="avatar" width="120"
                         height="120">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <span style="color: #888">营业执照图片</span>
                </div>
              </el-form-item>
            </div>
            <div v-else>
              <el-form-item label="身份证号：" prop="cardNo">
                <el-input v-model="updateForm.cardNo" :maxlength="18"></el-input>
              </el-form-item>
              <el-form-item label="身份证号图片：">
                <div class="upload-img">
                  <el-upload
                      class="avatar-uploader"
                      :action="uploadUrl"
                      :show-file-list="false"
                      :on-success="card1Success"
                      :before-upload="beforeAvatarUpload" accept="image/jpeg,image/png,image/gif"
                      name="attachFile">
                    <img v-if="img.card1" :src="img.card1" class="avatar" width="120" height="120">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <span>身份证照-正面</span>
                </div>
                <div class="upload-img">
                  <el-upload
                      class="avatar-uploader"
                      :action="uploadUrl"
                      :show-file-list="false"
                      :on-success="card2Success"
                      :before-upload="beforeAvatarUpload" accept="image/jpeg,image/png,image/gif"
                      name="attachFile">
                    <img v-if="img.card2" :src="img.card2" class="avatar" width="120" height="120">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <span>身份证照-背面</span>
                </div>
                <div class="upload-img">
                  <el-upload
                      class="avatar-uploader"
                      :action="uploadUrl"
                      :show-file-list="false"
                      :on-success="card3Success"
                      :before-upload="beforeAvatarUpload" accept="image/jpeg,image/png,image/gif"
                      name="attachFile">
                    <img v-if="img.card3" :src="img.card3" class="avatar" width="120" height="120">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <span>身份证照-手持</span>
                </div>
              </el-form-item>
            </div>
            <el-form-item label="手机号码：" class="uu-append">
              <el-input v-model="userForm.developer.developerMobile" :maxlength="11">
                <template slot="append">
                  <el-button type="primary" :style="{background: codeMsgForDev.bgColor}"
                             @click="checkPhoneForDev">{{codeMsgForDev.msg}}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="验证码：">
              <el-input v-model="upValidateCode" :maxlength="6">
              </el-input>
            </el-form-item>
            <el-form-item label="" class="update-dev">
              <el-button type="primary" @click="updateDevSubmit" size="large">提交</el-button>
              <el-button size="large" @click="updateDev=1">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="" :visible.sync="dialogVisiblePhone" size="small" class="updateUser">
      <h3 class="uu-dialog-title">变更手机号</h3>
      <div class="login-box">
        <el-input type="text" v-model="mobilePhone" auto-complete="off" placeholder="手机号"
                  :maxlength="11">
          <template slot="append">
            <el-button type="primary" :style="{background: codeMsg.bgColor}" @click="checkPhone">
              {{codeMsg.msg}}
            </el-button>
          </template>
        </el-input>
        <el-input type="text" v-model="validateCode" auto-complete="off" placeholder="验证码"
                  :maxlength="6"></el-input>
      </div>
      <div class="lb-btn">
        <el-button type="primary" @click="sureBandPhone" class="sure-btn">确认绑定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="" :visible.sync="dialogVisiblePwd" size="small" class="updateUser">
      <h3 class="uu-dialog-title">修改密码</h3>
      <div class="login-box">
        <el-input type="password" v-model="oldPassword" auto-complete="off"
                  placeholder="旧密码（6-18位字母+数字格式）" :maxlength="18">
        </el-input>
      </div>
      <div class="login-box">
        <el-input type="password" v-model="newPassword" auto-complete="off"
                  placeholder="新密码（6-18位字母+数字格式）" :maxlength="18">
        </el-input>
        <el-input type="password" v-model="surePassword" auto-complete="off"
                  placeholder="确认密码（6-18位字母+数字格式）" :maxlength="18"></el-input>
      </div>
      <div class="lb-btn">
        <el-button type="primary" @click="sureBandPwd" class="sure-btn">确认修改</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '../../../common/js/util'
  import {
    globalAxios, JSONParse, mobileValidator, pwdValidator,
    globalValidImg, businessLicenseValid, userCardValid
  } from '../../../common/js/api'

  export default {
    data() {
      return {
        userForm: {
          developerType: '',
          developer: {}
        },
        userId: '',
        dialogVisiblePhone: false,
        dialogVisiblePwd: false,
        codeMsg: {msg: '获取验证码', bgColor: '#6cc'},
        codeMsgForDev: {msg: '获取验证码', bgColor: '#6cc'},
        mobilePhone: '',
        validateCode: '',
        oldPassword: '',
        newPassword: '',
        surePassword: '',
        m: 60,
        mDev: 60,
        updateDev: 1,
        uploadUrl: baseUrl + 'upload/file/img',
        img: {
          card1: '',
          card2: '',
          card3: '',
          company: ''
        },
        updateForm: {},
        upValidateCode: ''
      }
    },
    methods: {
      changeMobile() {
        this.dialogVisiblePhone = true;
//        this.mobilePhone = '';
//        this.codeMsg.msg = '获取验证码';
//        this.validateCode = '';
      },
      changePassword() {
        this.dialogVisiblePwd = true;
        this.oldPassword = '';
        this.newPassword = '';
        this.surePassword = '';
      },
      cancel() {
        globalAxios('developer/authen/cancel/' + this.userId, {}).then((res) => {
          let data = res.data;
          if (data.code === '000000') {
            this.$message.success(data.msg);
            this.getUserInfo();
          } else {
            this.$message.error(data.msg);
          }
        }).catch(() => {
        });
      },
      updateDevSubmit() {
        let para = this.updateForm, url = '';
        // 2公司 3个人
        if (!para.realName) {
          this.$message.error('请填写真实名称');
          return false;
        }
        if (para.developerType === 3) {
          url = 'developer/personal/commit';
          if (!para.cardNo) {
            this.$message.error('请填写身份证号码');
            return false;
          }
          if (!userCardValid(para.cardNo)) {
            this.$message.error('身份证号码格式错误');
            return false;
          }
          if (!this.img.card1 || !this.img.card2 || !this.img.card3) {
            this.$message.error('请上传所有的开发者身份证图片');
            return false;
          }
          para.idCardFront = this.img.card1;
          para.idCardBack = this.img.card2;
          para.idCardHand = this.img.card3;
        } else {
          url = 'developer/company/commit';
          if (!para.companyName) {
            this.$message.error('请填写公司名称');
            return false;
          }
          if (!para.credentialNo) {
            this.$message.error('请填写营业执照号码');
            return false;
          }
          if (!businessLicenseValid(para.credentialNo)) {
            this.$message.error('请输入正确的营业执照号码，由18位的阿拉伯数字或大写英文字母（除了I、O、Z、S、V）组成');
            return false;
          }
          if (!this.img.company) {
            this.$message.error('请上传公司营业执照图片');
            return false;
          }
          para.cardPhoto = this.img.company;
        }
        if (!this.upValidateCode) {
          this.$message.error('请输入验证码');
          return false;
        }
        para.validCode = this.upValidateCode;
        globalAxios(url, para).then((res) => {
          let data = res.data;
          if (data.code === '000000') {
            this.$message.success(data.msg);
            this.getUserInfo();
            this.updateDev = 1;
          } else {
            this.$message.error(data.msg);
          }
        }).catch(() => {
        });
      },
      beforeAvatarUpload(file) {
        return globalValidImg(file, this.$message);
      },
      card1Success(res) {
        if (res.code === '000000') {
          const data = res.data;
          this.img.card1 = data.fileUrl;
        }
        else {
          this.$message.error(res.msg);
        }
      },
      card2Success(res) {
        if (res.code === '000000') {
          const data = res.data;
          this.img.card2 = data.fileUrl;
        }
        else {
          this.$message.error(res.msg);
        }
      },
      card3Success(res) {
        if (res.code === '000000') {
          const data = res.data;
          this.img.card3 = data.fileUrl;
        }
        else {
          this.$message.error(res.msg);
        }
      },
      cardCSuccess(res) {
        if (res.code === '000000') {
          const data = res.data;
          this.img.company = data.fileUrl;
        }
        else {
          this.$message.error(res.msg);
        }
      },
      sureBandPwd() {
        if (this.oldPassword === '') {
          this.$message.error('请输入旧密码~');
          return false;
        } else if (this.newPassword === '') {
          this.$message.error('请输入新密码~');
          return false;
        } else if (this.surePassword === '') {
          this.$message.error('请再次输入新密码~');
          return false;
        } else if (!pwdValidator(this.oldPassword)) {
          this.$message.error('旧密码格式错误~');
          return false;
        } else if (!pwdValidator(this.newPassword)) {
          this.$message.error('新密码格式错误~');
          return false;
        } else if (this.newPassword !== this.surePassword) {
          this.$message.error('新密码和确认密码不一致~');
          return false;
        }
        let para = {};
        para.userId = this.userId;
        para.oldPassword = this.oldPassword;
        para.newPassword = this.newPassword;
        globalAxios('user/modifyPassword', para).then((res) => {
          let data = res.data;
          this.dialogVisiblePwd = false;
          if (data.code === '000000') {
            this.$message.success(data.msg);
            this.getUserInfo();
            localStorage.pwd = sessionStorage.pwd = this.newPassword;
            this.oldPassword = '';
            this.newPassword = '';
            this.surePassword = '';
          } else {
            this.$message.error(data.msg);
          }
        }).catch(() => {
        });
      },
      sureBandPhone() {
        if (!this.validateCode) {
          this.$message.error('请输入验证码~');
          return false;
        }
        if (mobileValidator(this.mobilePhone)) {
          let para = {};
          para.userId = this.userId;
          para.mobilePhone = this.mobilePhone;
          para.validateCode = this.validateCode;
          globalAxios('user/modifyMobile', para).then((res) => {
            let data = res.data;
            if (data.code === '000000') {
              this.$message.success(data.msg);
              this.dialogVisiblePhone = false;
              this.getUserInfo();
              this.mobilePhone = '';
              this.codeMsg.msg = '获取验证码';
              this.validateCode = '';
            } else {
              this.$message.error(data.msg);
            }
          }).catch(() => {
          });
        } else {
          this.$message.error('手机号码不正确~');
        }
      },
      checkPhoneForDev() {
        mobileValidator(this.userForm.developer.developerMobile) ? this.sendCodeForDev()
            : this.$message.error('请输入正确的手机号码~');
      },
      sendCodeForDev() {
        if (this.codeMsgForDev.bgColor === '#6cc') {
          this.logining = true;
          let para = {};
          para.mobile = this.userForm.developer.developerMobile;
          globalAxios('developer/validate/send', para).then((res) => {
            let data = res.data;
            this.logining = false;
            if (data.code === '000000') {
              this.$message.success(data.msg);
              let _this = this;
              _this.codeMsgForDev = {msg: _this.mDev + 's', bgColor: '#999'};
              // 发送验证码
              let t = setInterval(function () {
                _this.mDev--;
                if (_this.mDev === 0) {
                  _this.codeMsgForDev = {msg: '重新获取验证码', bgColor: '#6cc'};
                  _this.mDev = 60;
                  clearTimeout(t);
                } else {
                  _this.codeMsgForDev = {msg: _this.mDev + 's', bgColor: '#999'};
                }
              }, 1000)
            } else {
              this.$message(data.msg);
            }
          }).catch(() => {
          });
        }
      },
      checkPhone() {
        mobileValidator(this.mobilePhone) ? this.sendCode() : this.$message.error('请输入正确的手机号码~');
      },
      sendCode() {
        if (this.codeMsg.bgColor === '#6cc') {
          this.logining = true;
          let para = {};
          para.mobilePhone = this.mobilePhone;
          para.validateModule = 'modifyMobile';
          globalAxios('validate/mobile', para).then((res) => {
            let data = res.data;
            this.logining = false;
            if (data.code === '000000') {
              this.$message.success(data.msg);
              let _this = this;
              _this.codeMsg = {msg: _this.m + 's', bgColor: '#999'};
              // 发送验证码
              let t = setInterval(function () {
                _this.m--;
                if (_this.m === 0) {
                  _this.codeMsg = {msg: '重新获取验证码', bgColor: '#6cc'};
                  _this.m = 60;
                  clearTimeout(t);
                } else {
                  _this.codeMsg = {msg: _this.m + 's', bgColor: '#999'};
                }
              }, 1000)
            } else {
              this.$message(data.msg);
            }
          }).catch(() => {
          });
        }
      },
      getUserInfo() {
        globalAxios('user/get/' + this.userId, {}).then((res) => {
          let data = res.data;
          if (data.code === '000000') {
            this.userForm = data.data;
            let obj = data.data.developer, _form = {};
            _form.developerId = obj.developerId;
            _form.userId = this.userForm.userId;
            _form.developerMobile = obj.developerMobile || '';
            _form.realName = obj.realName || '';
            _form.developerType = obj.developerType || '';
            if (_form.developerType === 3) {
              _form.cardNo = obj.cardNo || '';
              this.img.card1 = obj.idCardFront || '';
              this.img.card2 = obj.idCardBack || '';
              this.img.card3 = obj.idCardHand || '';
            }
            else {
              _form.companyName = obj.companyName || '';
              _form.credentialNo = obj.credentialNo || '';
              this.img.company = obj.cardPhoto || '';
            }
            this.updateForm = _form;
          }
          else {
            this.$message.error(data.msg);
          }
        }).catch(() => {
        });
      }
    },
    mounted() {
      this.userId = JSONParse(sessionStorage.userInfo).userId;
      this.getUserInfo();
    }
  }
</script>

<style scoped lang="scss">
  .all {
    width: 94%;
    margin-left: 3%;
  }

  .update-user-type {
    margin-top: 20px;

    .title-h3 {
      vertical-align: top;
      margin: 10px 20px 0 0;
      padding-top: 5px;
      color: #666;
    }

    .user-form {
      padding-top: 20px;
      width: 600px;

      .update-dev {
        margin-top: 40px;
        margin-bottom: 20px;
      }

      .update-span {
        margin-left: 25px;
        color: #6cc;
        cursor: pointer;
      }

    }
    .sure-check {
      margin-left: 20px;
      color: #88D068;
      i {
        margin-right: 5px;
      }
    }
  }

  .login-box {
    border: 1px solid #bfd7d9;
    border-radius: 5px;
    width: 400px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
  }

  .lb-btn {
    width: 400px;
    margin-left: auto;
    margin-right: auto;

    .sure-btn {
      width: 100%;
      margin-top: 40px;
      margin-bottom: 30px;
      height: 45px;
      font-size: 17px;
    }

  }

  .uu-dialog-title {
    text-align: center;
    color: #66CCCC;
    font-size: 22px;
    margin-top: 30px;
    margin-bottom: 40px;
  }

  .upload-img {
    border: 1px dashed rgb(191, 215, 217);
    display: inline-block;
    width: 120px;
    height: 120px;
    text-align: center;
    margin-right: 25px;
    margin-top: 10px;
    border-radius: 5px;
    margin-bottom: 40px;
    vertical-align: top;

    .avatar-uploader {
      color: rgb(191, 215, 217);
      font-size: 24px;
      line-height: 120px;
      margin-bottom: 5px;
      height: 120px;
    }
  }
</style>
