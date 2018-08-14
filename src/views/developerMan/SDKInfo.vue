<template>
  <section>
    <el-card class="box-card tabs">
      <h2 class="h2">SDK信息</h2>
      <el-form ref="form" :model="form" label-width="120px" style="margin-left: 100px">
        <el-form-item label="类型：">
          {{form.type == 1 ? '客户端SDK' : '服务器端SDK'}}
        </el-form-item>
        <el-form-item label="编程语言：">
          {{form.opSys}}
        </el-form-item>
        <el-form-item label="SDK下载地址：">
          <a :href="form.sdkPath" class="t-6cc">
            {{form.sdkPath ? form.sdkPath.substring(form.sdkPath.lastIndexOf("/") + 1,
              form.sdkPath.length) : '--'}}</a>
        </el-form-item>
        <el-form-item label="文档下载地址：">
          <a :href="form.docUrl" class="t-6cc">
            {{form.docUrl ? form.docUrl.substring(form.docUrl.lastIndexOf("/") + 1,
              form.docUrl.length) : '--'}}</a>
        </el-form-item>
        <el-form-item label="版本：">
          {{form.sdkVersion || '-'}}
        </el-form-item>
        <el-form-item label="更新日期：">
          {{form.updateTime}}
        </el-form-item>
        <el-form-item label="更新内容：" class="h-auto">
          <div>{{form.info || '-'}}</div>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="v-list">
      <h2 class="h2">版本记录</h2>
      <el-table :data="tableList" highlight-current-row style="width: 100%;margin-bottom: 50px">
        <el-table-column type="index" width="70" label="序号" align="center">
        </el-table-column>
        <el-table-column prop="sdkVersion" label="版本" width="130" align="center">
        </el-table-column>
        <el-table-column prop="info" label="描述" min-width="300" align="center">
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="180" align="center">
        </el-table-column>
        <el-table-column prop="accountName" label="操作人" width="200" align="center">
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间" width="250" align="center">
        </el-table-column>
      </el-table>
    </div>

  </section>
</template>
<script>
  import util from '../../common/js/util'
  import NProgress from 'nprogress'
  import {globalAxios} from '../../common/js/api';

  export default {
    data() {
      return {
        sdkId: this.$route.query.sdkId,
        form: {},
        tableList: []
      }
    },
    methods: {
      //获取详情
      getInfoById() {
        NProgress.start();
        globalAxios('sdk/get/' + this.sdkId, {}).then((res) => {
          let data = res.data;
          NProgress.done();
          if (data.code === '000000') {
            this.form = data.data;
            this.getListByType(this.form.opSys);
          } else {
            this.$message(data.msg);
          }
        }).catch(() => {
        });
      },
      // 按类型查询各版本SDK列表
      getListByType(type) {
        NProgress.start();
        globalAxios('sdk/list/' + type, {}).then((res) => {
          let data = res.data;
          NProgress.done();
          if (data.code === '000000') {
            this.tableList = data.data;
            for (let i = 0; i < data.data.length; i++) {
              if (i === (data.data.length - 1)) {
                this.tableList[i].operation = '新建';
              } else {
                this.tableList[i].operation = '更新';
              }
            }
          } else {
            this.$message(data.msg);
          }
        }).catch(() => {
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      }
    },
    mounted() {
      this.getInfoById();
    }
  }
</script>

<style scoped lang="scss">
  .tabs {
    .el-form {
      margin-top: 5px;
    }
    .el-form-item {
      margin-bottom: 5px;
      div {
        word-break: break-word;
        line-height: 1.5;
        margin-top: 8px;
      }
    }
    .el-form:after {
      content: '';
      clear: both;
      height: 0;
    }
  }

  .h2 {
    margin: 0;
    padding: 10px;
    font-size: 16px;
    color: #666;
  }

  .v-list {
    margin-top: 20px;
    .h2 {
      padding-bottom: 20px;
      text-indent: 14px;
    }
  }
</style>