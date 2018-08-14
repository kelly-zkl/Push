<template>
  <div id="app">
    <transition name="fade"
                mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import 'babel-polyfill'

  export default {
    name: 'app',
    components: {}
  }

</script>

<style lang="scss">
  body {
    margin: 0;
    padding: 0;
    /*background: url(assets/bg1.jpg) center !important;
      background-size: cover;*/
    // background: #1F2D3D;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }

  #app {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }

  .el-submenu [class^=fa] {
    vertical-align: baseline;
    margin-right: 10px;
  }

  .el-menu-item [class^=fa] {
    vertical-align: baseline;
    margin-right: 10px;
  }

  .toolbar {
    background: #f2f2f2;
    padding: 10px;
    //border:1px solid #dfe6ec;
    margin: 10px 0;
    .el-form-item {
      margin-bottom: 10px;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all .2s ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  .el-breadcrumb__item:last-child .el-breadcrumb__item__inner {
    color: rgb(102, 204, 204) !important;
  }

  .t-6cc {
    color: #6cc;
    text-decoration: none;
  }

  .di-table {
    .el-tabs--border-card > .el-tabs__content {
      padding: 0 !important;
    }
  }

  .mrg-top-8 {
    margin-top: 8px;
  }

  .w-120 {
    width: 120px !important;
  }

  .mrg-top-24 {
    margin-top: 24px !important;
  }

  .radius-5 {
    border-radius: 5px;
  }

  .el-form-item__content {
    height: 36px;
  }

  .upload {
    .el-upload {
      display: block;
    }
  }

  .el-table__body {
    .el-button + .el-button {
      margin-left: 0
    }
  }

  .textarea-min-height {
    min-height: 100px;
    textarea {
      min-height: 100px;
    }
  }

  .h-auto {
    .el-form-item__content {
      height: auto;
    }
  }

  .text-center {
    text-align: center
  }

  .rel {
    position: relative;
  }

  .t-666 {
    color: rgb(31, 58, 61);
    font-style: normal;
  }

  .login-box {
    .el-input {
      input[type='text'], input[type='password'] {
        border: none;
        border-bottom: 1px solid rgb(191, 215, 217);
        border-radius: 0;
        height: 42px;
      }
      .el-input-group__append {
        border-top: none;
        border-right: 0;
        .el-button {
          background: #6cc;
          margin-right: -5px;
          color: #fff;
        }
        .el-button:hover {
          opacity: .8;
        }
      }
    }
  }

  .uu-append {
    .el-input {
      .el-input-group__append {
        .el-button {
          background: #6cc;
          margin-right: -5px;
          color: #fff;
          height: 30px;
          padding-top: 8px;
        }
        .el-button:hover {
          opacity: .8;
        }
      }
    }
    .el-input__inner {
      border-right: none;
    }
  }

  .login-box .el-input:first-child input {
    border-radius: 5px 5px 0 0;
  }

  .login-box .el-input:last-child input {
    border-bottom: none;
    border-radius: 0 0 5px 5px;
  }

  .fpp-form {
    .el-alert--success {
      .el-alert__title {
        font-size: 16px;
      }
      .el-alert__icon {
        font-size: 20px;
      }
    }
  }

  .f-right {
    float: right;
  }

  .t-999 {
    color: #999;
  }

  .avatar-uploader {
    .el-upload {
      display: block;
    }
  }

  .upload {
    color: #fff;
    width: 80px;
    height: 36px;
    text-align: center;
    background: #66cccc;
    line-height: 36px;
    border-radius: 0 5px 5px 0;
    white-space: nowrap;
    cursor: pointer;
    box-sizing: border-box;
    display: block;
    margin: -10px;
    .el-upload {
      display: block;
    }
  }

  .upload:hover {
    opacity: .8;
  }

  .height-60 {
    .el-form-item__content {
      height: 60px;
    }
  }

  .minH-200 {
    height: 200px;
    textarea {
      min-height: 200px;
    }
  }

  .minH-200:after {
    content: ".";
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }

  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    display: block;
  }

  .el-tabs__header {
    margin-bottom: 0 !important;
  }

  .tag-list {
    .el-tag {
      margin-right: 5px;
    }
    .input-new-tag {
      display: inline-block;
      width: 100px;
    }
  }

  .bp-select {
    input {
      height: 28px;
    }
  }

  .user-form {
    .el-form-item {
      margin-bottom: 8px;
    }
  }

  .updateUser {
    .el-dialog__body {
      padding-top: 0;
    }
    h3 {
      text-align: center;
      color: #66CCCC;
      font-size: 22px;
      font-weight: normal;
      margin-bottom: 40px;
    }
  }

  .el-form-item__content {
    height: auto;
    min-height: 36px;
  }

  .menu-expanded {
    background: rgb(238, 245, 246);
  }
</style>
