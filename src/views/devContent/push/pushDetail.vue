<template>
  <section class="app-man">
    <div class="main-content">
      <el-form ref="form" :model="form" label-width="150px">
        <div class="add-appdiv">
          <div class="ap-bottom">
            <div class="f-left">
              <h3>推送类型</h3>
            </div>
            <div class="form-add">
              <el-form-item label="类型：">
                {{form.type == 'message' ? '自定义消息' : form.type == 'richtext' ? '富媒体' : '通知'}}
              </el-form-item>
            </div>
            <div>
              <div class="f-left">
                <h3>编辑内容</h3>
              </div>
              <div class="form-add">
                <el-form-item label="标题：">{{form.title || '--'}}</el-form-item>
                <el-form-item label="内容：">{{form.content || '--'}}</el-form-item>
              </div>
            </div>
          </div>
          <div class="ap-bottom">
            <div class="f-left">
              <h3>目标平台</h3>
            </div>
            <div>
              <el-form-item>
                <ul class="platform">
                  <li v-if="form.supportIos" :class="{ios: true}">
                    <div>IOS</div>
                  </li>
                  <li v-if="form.supprotAndroid" :class="{android: true}">
                    <div>Android</div>
                  </li>
                  <li v-if="form.supportWinphone" :class="{windows: true}">
                    <div>Windows</div>
                  </li>
                </ul>
              </el-form-item>
            </div>
            <div>
              <div class="f-left">
                <h3>目标人群</h3>
              </div>
              <div style="margin-left: 40px">
                <el-form-item>{{form.targetDesc}}</el-form-item>
              </div>
            </div>
            <div>
              <div class="f-left">
                <h3>发送时间</h3>
              </div>
              <div style="margin-left: 40px">
                <el-form-item>{{form.sendTime}}</el-form-item>
              </div>
            </div>
          </div>
          <div>
            <div class="f-left">
              <h3>状态</h3>
            </div>
            <div style="margin-left: 40px">
              <el-form-item>{{form.status == 'SendComplete' ? '已发送' : '发送失败'}}</el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </div>
  </section>
</template>
<script>
  import util from '../../../common/js/util'
  import appCss from '../../../assets/styles/app.scss'
  import {globalAxios, JSONParse, globalValidImg, globalValidP12} from '../../../common/js/api';

  export default {
    data() {
      return {
        pushId: this.$route.query.pushId,
        form: {}
      }
    },
    methods: {
      getPushDetail() {
        globalAxios('push/get/pushhistory/' + this.pushId, {}).then((res) => {
          if (res.status === 200) {
            let response = JSON.parse(res.request.response);
            if (response.code === '000000') {
              this.form = response.data;
            } else {
              this.$message.error(response.msg);
            }
          } else {
            this.$message.error(res.status);
          }
        }).catch(() => {
        });
      }
    },
    mounted() {
      this.pushId = this.$route.query.pushId;
      this.getPushDetail();
    }
  }
</script>
<style scoped lang="scss">
  .platform {
    list-style-type: none;
    margin-top: 0;
    li {
      display: inline-block;
      width: 70px;
      text-align: center;
      padding-top: 50px;
    }

    li.ios {
      background: url('../../../assets/images/pus_ios_2.png') top center no-repeat;
      color: #6cc;
    }

    li.android {
      background: url('../../../assets/images/pus_android_2.png') top center no-repeat;
      color: #6cc;
    }

    li.windows {
      background: url('../../../assets/images/pus_wp_2.png') top center no-repeat;
      color: #6cc;
    }
  }
</style>