<template>
  <section>
    <div class="main-content">
      <h2>开发者概况</h2>
      <el-row :gutter="24" class="mc-col">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <label class="mcg-label">新增开发者</label>
            <div class="mcg-value">{{developerCount}}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <label class="mcg-label">新增应用</label>
            <div class="mcg-value">{{appCount}}</div>
          </div>
        </el-col>
        <!-- <el-col :span="8">
          <div class="grid-content bg-purple">
            <label class="mcg-label">今日活跃</label>
            <div class="mcg-value">12345</div>
          </div>
        </el-col> -->
      </el-row>
    </div>
  </section>
</template>

<script>
  import util from '../common/js/util'
  import {globalAxios, JSONParse} from '../common/js/api';

  export default {
    data() {
      return {
        appCount: '',
        developerCount: ''
      }
    },
    methods: {
      getDeviceCount() {
        globalAxios('developer/statics/1', {}).then((res) => {
          let data = res.data;
          if (data.code === '000000') {
            let obj = data.data;
            this.appCount = obj.appCount;
            this.developerCount = obj.developerCount;
          } else {
            this.$message.error(data.msg);
          }
        }).catch(() => {
        });
      }
    },
    mounted() {
      this.getDeviceCount();
    }
  }
</script>

<style scoped lang="scss">
  .main-content {
    border: 1px solid #ddd;
    margin-top: 20px;
    padding: 20px;
    h2 {
      margin: 0 0 20px 0;
      padding: 0;
      font-size: 16px;
      color: #666;
    }
    .grid-content {
      background: #e4e4e4;
      padding: 20px;
      min-height: 80px;
      line-height: 80px;
      font-size: 16px;
      color: #666;
      .mcg-label {
        float: left;
        width: 60%;
        font-weight: bold;
        text-indent: 5%;
      }
      .mcg-value {
        font-size: 34px;
      }
    }
  }
</style>