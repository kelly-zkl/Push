<template>
  <el-form :model="form" ref="ruleForm2" label-position="left" label-width="0px"
           class="login-container fpp-form">
    <div v-if="step==1">
      <h3 class="title">验证身份</h3>
      <div class="login-box">
        <el-input type="text" v-model="form.loginName" auto-complete="off" placeholder="输入用户名"
                  :maxlength="20">
        </el-input>
        <el-input type="text" v-model="form.mobilePhone" auto-complete="off" placeholder="输入原绑定手机号"
                  :maxlength="11"></el-input>
      </div>
      <el-form-item style="width:100%;">
        <el-button type="primary" class="fpp-btn" @click.native.prevent="nextSetp"
                   :loading="logining">下一步
        </el-button>
      </el-form-item>
    </div>
    <div v-else>
      <el-alert title="身份验证通过" type="success" show-icon :closable="false">
      </el-alert>
      <h3 class="title">绑定新手机号</h3>
      <div class="login-box">
        <el-input type="text" v-model="form.mobilePhone" auto-complete="off" placeholder="手机号"
                  :maxlength="11">
          <template slot="append">
            <el-button type="primary" :style="{background: codeMsg.bgColor}" @click="checkPhone">
              {{codeMsg.msg}}
            </el-button>
          </template>
        </el-input>
        <el-input type="text" v-model="form.validateCode" auto-complete="off" placeholder="验证码"
                  :maxlength="6"></el-input>
      </div>
      <div class="login-box">
        <el-input type="password" v-model="form.password" auto-complete="off"
                  placeholder="设置新密码（6-18位字母+数字格式）" :maxlength="18"></el-input>
        <el-input type="password" v-model="form.password2" auto-complete="off" placeholder="确认密码"
                  :maxlength="18"></el-input>
      </div>
      <el-form-item style="width:100%;">
        <el-button type="primary" class="fpp-btn" @click.native.prevent="handleSubmit"
                   :loading="logining">完成
        </el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
  import md5 from 'js-md5';
  import {globalAxios, JSONParse, mobileValidator, pwdValidator} from '../common/js/api';

  export default {
    data() {
      return {
        logining: false,
        step: 1,
        form: {
          loginName: '',
          mobilePhone: '',
          validateCode: '',
          password: '',
          password2: ''
        },
        codeMsg: {msg: '发送验证码', bgColor: '#6cc'},
        m: 60,
        checked: true
      }
    },
    methods: {
      nextSetp() {
        // 验证身份
        if (!this.form.loginName) {
          this.$message.error('用户名不能为空');
          return false;
        }
        else if (!mobileValidator(this.form.mobilePhone)) {
          this.$message.error('请输入正确的手机号码');
          return false;
        }
        let para = {};
        para.loginName = this.form.loginName;
        para.mobilePhone = this.form.mobilePhone;
        globalAxios('validate/reset', para).then((res) => {
          let _data = res.data;
          this.logining = false;
          if (_data.code === '000000') {
            this.form.mobilePhone = '';
            this.step = 2;
          } else {
            this.$message.error(_data.msg);
          }
        }).catch(() => {
        });
      },
      checkPhone() {
        mobileValidator(this.form.mobilePhone) ? this.sendCode() : this.$message.error(
            '请输入正确的手机号码~');
      },
      sendCode() {
        if (this.codeMsg.bgColor === '#6cc') {
          this.logining = true;
          let para = {};
          para.mobilePhone = this.form.mobilePhone;
          para.validateModule = 'reset';
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
      checkForm() {
        // 用户名
        let form = this.form, bol = true, msg = '';
        if (!mobileValidator(form.mobilePhone)) {
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
        }
        if (!bol) {
          this.$message.error(msg);
        }
        return bol;
      },
      handleSubmit(ev) {
        if (this.checkForm()) {
          this.logining = true;
          globalAxios('user/reset', this.form).then((res) => {
            let data = res.data;
            this.logining = false;
            if (data.code === '000000') {
              sessionStorage.pwd = localStorage.pwd = this.form.password;
//              this.handleLogin(this.form.loginName, this.form.password);
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
      },
      //登录
      handleLogin(username, pwd) {
        globalAxios('login?username=' + username + '&password=' + pwd, {}).then((res) => {
          let response = res.data;
          if (response.code === '000000') {
            let data = response.data;
            localStorage.userInfo = sessionStorage.userInfo = JSON.stringify(data);
            data.roles.length > 0 && (data.roles[0] === 'pdev' || data.roles[0] === 'cdev')
                ? this.$router.push({path: '/appMan'}) : this.$router.push({path: '/main'});
          } else {
            this.$message.error(response.msg);
          }
        }).catch(() => {
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/styles/login.scss';
</style>