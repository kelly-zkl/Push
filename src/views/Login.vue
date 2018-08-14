<template>
  <el-form :model="form" :rules="rules" ref="form" label-position="left" label-width="0px"
           class="login-container">
    <h3 class="title"><em class="logo">logo</em>开发者管理后台</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="form.username" auto-complete="off"
                placeholder="账号/手机号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="form.password" auto-complete="off"
                placeholder="密码"></el-input>
    </el-form-item>
    <div class="password">
      <el-checkbox v-model="checked" checked>记住密码</el-checkbox>
      <router-link :to="{ path: '/forgetPwd'}" class="forget-pwd">
        <span>忘记密码？</span>
      </router-link>
    </div>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2"
                 :loading="logining">登录
      </el-button>
      <router-link :to="{ path: '/register'}" class="reg-user">
        <span>注册新用户</span>
      </router-link>
    </el-form-item>
  </el-form>
</template>

<script>
  import md5 from 'js-md5';
  import {globalAxios, JSONParse} from '../common/js/api';
  //  import NProgress from 'nprogress'

  export default {
    data() {
      return {
        logining: false,
        form: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入账号', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
          ]
        },
        checked: true
      }
    },
    methods: {
      handleReset2() {
        this.$refs.form.resetFields();
      },
      handleSubmit2(ev) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.logining = true;
            let username = this.form.username, password = md5(this.form.password);
            globalAxios('login?username=' + username + '&password=' + password, {}).then((res) => {
              this.logining = false;
              let response = res.data;
              if (response.code === '000000') {
                let data = response.data;
                // 是否记住密码
                if (this.checked) {
                  data.password = this.form.password;
                  localStorage.pwd = sessionStorage.pwd = this.form.password;
                } else {
                  localStorage.pwd = sessionStorage.pwd = '';
                }
                localStorage.userInfo = sessionStorage.userInfo = JSON.stringify(data);
                // 判断是什么角色  如果是管理员 进入管理员首页
                // console.log(this.$router.addRoutes() )
                // 获取菜单树
                // globalAxios('user/menu/'+data.userId,{}).then((res) => {
                //     let _data = res.data;
                //     if(_data.code=='000000'){
                //         sessionStorage.menu = JSON.stringify(_data.data);
                //         // let obj = _data.data;
                //         // for(let i in obj){
                //         //   _this.$router.addRoutes(obj[i]);
                //         // }

                //     }
                //     else{
                //        _this.$message.error(data.msg);
                //     }
                // })
                data.roles.length > 0 && (data.roles[0] === 'pdev' || data.roles[0] === 'cdev')
                    ? this.$router.push({path: '/appMan'}) : this.$router.push({path: '/main'});
              } else {
                this.$message.error(response.msg);
              }
            }).catch(() => {
            });
          } else {
            this.$message.error('error submit!!');
            return false;
          }
        });
      }
    },
    mounted() {
      // 是否保存密码
      let user = JSONParse(localStorage.userInfo);
      this.form.username = user.username;
      this.form.password = localStorage.pwd;
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/styles/login.scss';
</style>