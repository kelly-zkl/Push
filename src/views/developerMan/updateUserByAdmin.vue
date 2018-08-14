<template>
  <section>
    <el-tabs type="border-card" class="update-user-type">
      <el-tab-pane label="个人信息">
        <h3 class="title-h3">帐号信息</h3>
        <el-form ref="form" :model="userForm" label-width="120px" class="user-form">
          <el-form-item label="用户名：">
            <span>{{userForm.loginName}}</span>
          </el-form-item>
          <el-form-item label="手机号码：">
            <span>{{userForm.mobilePhone}}</span>
            <span class="sure-check" v-if="userForm.mobilePhone != '无'"><i
                class="el-icon-circle-check"></i>已验证</span>
            <span class="update-span" @click="dialogVisiblePhone=true">变更手机号</span>
          </el-form-item>
          <el-form-item label="登录密码：">
            <span>{{userForm.password}}</span>
            <span class="update-span" @click="dialogVisiblePwd=true">修改密码</span>
          </el-form-item>
          <el-form-item label="注册日期：">
            <span>{{userForm.registerDate}}</span>
          </el-form-item>
        </el-form>
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
  import util from '../../common/js/util'
  import {
    globalAxios, JSONParse, mobileValidator,
    pwdValidator, globalValidImg
  } from '../../common/js/api';

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
        codeMsg: {msg: '发送验证码', bgColor: '#6cc'},
        mobilePhone: '',
        validateCode: '',
        oldPassword: '',
        newPassword: '',
        surePassword: '',
        m: 60,
        updateDev: 1,
        uploadUrl: baseUrl + 'upload/file/img',
        img: {
          card1: '',
          card2: '',
          card3: '',
          company: ''
        },
        updateForm: {}
      }
    },
    methods: {
      sureBandPwd() {
        if (!pwdValidator(this.oldPassword)) {
          this.$message.error('旧密码格式错误~');
          return false;
        }
        if (!pwdValidator(this.oldPassword)) {
          this.$message.error('新密码格式错误~');
          return false;
        }
        if (this.newPassword !== this.surePassword) {
          this.$message.error('新密码和确认密码不一致~');
          return false;
        }
        let para = {};
        para.userId = this.userId;
        para.oldPassword = this.oldPassword;
        para.newPassword = this.newPassword;
        globalAxios('user/modifyPassword', para).then((res) => {
          let data = res.data;
          if (data.code === '000000') {
            this.$message.success(data.msg);
            this.getUserInfo();
            this.dialogVisiblePwd = false;
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
        let para = {};
        para.userId = this.userId;
        para.mobilePhone = this.mobilePhone;
        para.validateCode = this.validateCode;
        if (mobileValidator(this.mobilePhone)) {
          globalAxios('user/modifyMobile', para).then((res) => {
            let data = res.data;
            if (data.code === '000000') {
              this.$message.success(data.msg);
              this.getUserInfo();
              this.dialogVisiblePhone = false;
            } else {
              this.$message.error(data.msg);
            }
          }).catch(() => {
          });
        } else {
          this.$message.error('手机号码不正确~');
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
          } else {
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