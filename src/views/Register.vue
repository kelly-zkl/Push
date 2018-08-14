<template>
  <el-form :model="form" ref="form" label-position="left" label-width="0px"
           class="login-container register">
    <h3 class="title"><em class="logo">logo</em>开发者管理后台</h3>
    <div class="res-tabs">
      <div class="tip t-6cc text-center">
        <span>开发者类型</span>
        <el-tooltip class="item" effect="dark" content="开发者类型注册后不可更改" placement="right">
          <i class="el-icon-information rel"></i>
        </el-tooltip>
      </div>
      <ul class="nav">
        <li :class="{actived : form.type ==3}" @click="showType(3)">个人</li>
        <li :class="{actived : form.type ==2}" @click="showType(2)">公司</li>
      </ul>
    </div>
    <div class="login-box">
      <el-input type="text" v-model="form.loginName" auto-complete="off" placeholder="用户名（6-20个字符）"
                :maxlength="20"></el-input>
      <el-input type="text" v-model="form.mobilePhone" auto-complete="off" placeholder="手机号"
                :maxlength="11">
        <template slot="append">
          <el-button type="primary" :style="{background: codeMsg.bgColor}" @click="checkPhone">
            {{codeMsg.msg}}
          </el-button>
        </template>
      </el-input>
      <el-input type="text" v-model="form.validateCode" auto-complete="off" placeholder="验证码"
                :maxlength="10"></el-input>
    </div>
    <div class="login-box">
      <el-input type="password" v-model="form.password" auto-complete="off"
                placeholder="设置密码（6-18位字母+数字格式）" :maxlength="18"></el-input>
      <el-input type="password" v-model="form.password2" auto-complete="off" placeholder="确认密码"
                :maxlength="18"></el-input>
    </div>
    <div class="password">
      <el-checkbox v-model="checked" checked>我同意并遵守《消息推送平台服务协议》</el-checkbox>
    </div>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handSubmit"
                 :loading="logining">注册
      </el-button>
      <router-link :to="{ path: '/login'}" class="reg-user">
        <span><em class="t-666">已有帐号？</em>登录</span>
      </router-link>
    </el-form-item>
  </el-form>
</template>

<script>
  import md5 from 'js-md5';
  import {globalAxios, JSONParse, mobileValidator, pwdValidator} from '../common/js/api';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        form: {
          loginName: '',
          mobilePhone: '',
          type: '3',
          password: '',
          validateCode: '',
        },
        checked: true,
        codeMsg: {msg: '发送验证码', bgColor: '#6cc'},
        m: 60
      }
    },
    methods: {
      checkPhone() {
        mobileValidator(this.form.mobilePhone) ? this.sendCode() : this.$message.error(
            '请输入正确的手机号码~');
      },
      sendCode() {
        if (this.codeMsg.bgColor === '#6cc') {
          this.logining = true;
          let para = {};
          para.mobilePhone = this.form.mobilePhone;
          para.validateModule = 'register';
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
      showType(type) {
        this.form.type = type;
      },
      checkForm() {
        // 用户名
        let form = this.form, bol = true, msg = '';
        if (!form.loginName) {
          bol = false;
          msg = '请输入用户名';
        }
        else if (!mobileValidator(form.mobilePhone)) {
          bol = false;
          msg = '请输入正确的手机号码';
        }
        else if (!form.validateCode) {
          bol = false;
          msg = '请输入验证码';
        }
        else if (!pwdValidator(form.password)) {
          bol = false;
          msg = '请输入正确的密码,数字+字母格式';
        }
        else if (!form.password2) {
          bol = false;
          msg = '请再次输入密码';
        }
        else if (form.password !== form.password2) {
          bol = false;
          msg = '两次输入密码不相同';
        } else if (!this.checked) {
          bol = false;
          msg = '请接受消息推送平台服务协议';
        }
        if (!bol) {
          this.$message.error(msg);
        }
        return bol;
      },
      handSubmit(ev) {
        if (this.checkForm()) {
          this.logining = true;
          globalAxios('user/register', this.form).then((res) => {
            let data = res.data;
            this.logining = false;
            if (data.code === '000000') {
              this.$alert(data.msg, '温馨提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$router.push({path: '/login'});
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          }).catch(() => {
          });
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/styles/login.scss';
</style>