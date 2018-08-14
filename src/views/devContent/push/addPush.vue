<template>
  <section>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="card-push">
      <el-tab-pane label="创建推送" name="first">
        <div class="info-push app-man">
          <el-form ref="form" :model="form" label-width="100px">
            <div class="add-appdiv">
              <div class="f-left">
                <h3>编辑内容</h3>
              </div>
              <div class="form-add">
                <el-form-item label="消息类型：">
                  <el-select placeholder="请选择类型" v-model="metaInfo.type">
                    <el-option label="自定义消息" value="0"></el-option>
                    <el-option label="通知" value="1"></el-option>
                    <el-option label="富媒体消息" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="标题：">
                  <el-input v-model="metaInfo.title" placeholder="请输入标题"
                            :maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="内容：" class="minH-200">
                  <el-input type="textarea" v-model="metaInfo.content" placeholder="请输入推送内容"
                            class="minH-300" :maxlength="300"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="add-appdiv">
              <div>
                <div class="f-left">
                  <h3>目标平台：</h3>
                </div>
                <div class="form-add">
                  <ul class="platform">
                    <li v-if="isSupportIos == 1" @click="addPlatform('IOS')"
                        :class="{ios: true,active: form.platform.indexOf('IOS')>=0}">
                      <div>IOS</div>
                    </li>
                    <li v-if="isSupprotAndroid == 1" @click="addPlatform('ANDROID')"
                        :class="{android: true,active:form.platform.indexOf('ANDROID')>=0}">
                      <div>Android</div>
                    </li>
                    <li v-if="isSupportWinphone == 1" @click="addPlatform('WINDOWS')"
                        :class="{windows: true,active:form.platform.indexOf('WINDOWS')>=0}">
                      <div>Windows</div>
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <div class="f-left">
                  <h3>目标人群：</h3>
                </div>
                <div class="form-add">
                  <ul class="fa-ul">
                    <li :class="{active: person==1}" @click="person=1">所有人</li>
                    <li :class="{active: person==2}" @click="person=2">所有标签(Tag)</li>
                    <li :class="{active: person==3}" @click="person=3">设备别名(Alias)</li>
                    <li :class="{active: person==4}" @click="person=4">用户群组</li>
                  </ul>
                  <div class="per-msg" v-if="person==1">
                    <p>
                      将向应用所有的注册用户推送此消息
                    </p>
                  </div>
                  <div class="per-msg" v-else-if="person==2">
                    <div class="tag-list">
                      <el-tag
                          :key="tag" v-for="tag in audience.tags" :closable="true"
                          :close-transition="false" @close="handleClose(tag)">
                        {{tag}}
                      </el-tag>
                      <el-input
                          class="input-new-tag" v-if="inputVisible" v-model="inputValue"
                          ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm"
                          @blur="handleInputConfirm">
                      </el-input>
                      <el-button v-else-if="!inputVisible&&audience.tags.length<10"
                                 class="button-new-tag" size="small" @click="showInput">添加标签
                      </el-button>
                      <p class="small-tip">点击任意位置或回车添加标签</p>
                    </div>
                    <span class="right-num">{{audience.tags.length}}/10</span>
                  </div>
                  <div class="per-msg" v-else-if="person==3">
                    <el-input v-model="audience.alias" placeholder="请输入别名"
                              style="width:530px;"></el-input>
                  </div>
                  <div class="per-msg" v-else-if="person==4">
                    <el-select
                        v-model="audience.id" multiple :multiple-limit="10" :filterable="true"
                        :allow-create="false" placeholder="请选择用户组" class="user-group">
                      <el-option
                          v-for="item in userGroup" :key="item.value"
                          :label="item.groupName" :value="item.groupId">
                      </el-option>
                    </el-select>
                    <span class="right-num">{{audience.id.length}}/10</span>
                  </div>
                </div>
              </div>
              <!-- <div>
                <div class="f-left">
                  <h3>发送时间：</h3>
                </div>
                <div class="form-add">
                  <ul class="fa-ul">
                    <li class="active">立即</li>
                    <li>定时</li>
                  </ul>
                  <div class="datetime">
                    <el-date-picker
                        v-model="form.time"
                        type="datetime"
                        placeholder="选择日期时间">
                      </el-date-picker>
                  </div>
                </div>
              </div> -->
            </div>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="text-right">
      <el-button size="large" @click="$router.go(-1)">取消</el-button>
      <el-button type="primary" @click="onSubmit" size="large" :disabled=!isPress>确认发送</el-button>
    </div>
  </section>
</template>
<script>
  import util from '../../../common/js/util'
  import {globalAxios, JSONParse} from '../../../common/js/api';

  export default {
    data() {
      return {
        activeName: 'first',
        audience: {
          id: [],
          alias: '',
          tags: []
        },
        userGroup: [],
        inputVisible: false,
        isPress: true,
        isSupportIos: 1,
        isSupprotAndroid: 1,
        isSupportWinphone: 1,
        inputValue: '',
        person: this.$route.query.person || 1,
        content: '',
        form: {
          platform: '',
          appId: sessionStorage.appId
        },
        metaInfo: {
          type: '0',
//          title: '',
          contentType: 'text/plain',
          content: ''
        }
      }
    },
    methods: {
      addPlatform(val) {
        this.form.platform.indexOf(val) >= 0 ? this.form.platform = this.form.platform.replace(
            val + ',', '') : this.form.platform += val + ',';
      },
      onSubmit() {
        this.isPress = false;
        let para = this.form, metaInfo = this.metaInfo, audience = {};
        if (!metaInfo.title) {
          this.$message.error('请输入标题');
          this.isPress = true;
          return false;
        }
        if (!metaInfo.content) {
          this.$message.error('请输入推送内容');
          this.isPress = true;
          return false;
        }
        if (!para.platform) {
          this.$message.error('请选择目标平台');
          this.isPress = true;
          return false;
        } else {
          para.platform = para.platform.substring(0, para.platform.length - 1);
        }
        if (this.person === 2) {
          if (this.audience.tags.length <= 0) {
            this.$message.error('请输入标签');
            this.isPress = true;
            return false;
          } else {
            audience.tags = this.audience.tags.join(',');
          }
        } else if (this.person === 3) {
          if (!this.audience.alias) {
            this.$message.error('请输入别名');
            this.isPress = true;
            return false;
          } else {
            audience.alias = this.audience.alias;
          }
        } else if (this.person === 4) {
          if (this.audience.id.length <= 0) {
            this.$message.error('请选择用户组');
            this.isPress = true;
            return false;
          } else if (this.audience.id.length > 10) {
            this.$message.error('用户组不能超过10个');
            this.isPress = true;
            return false;
          } else {
            audience.id = this.audience.id.join(',');
          }
        }
        if (metaInfo.type === '2') {
          metaInfo.contentType = 'text/rich';
        }
        para.metaInfo = metaInfo;
        para.audience = audience;
        globalAxios('push/send', para).then((res) => {
          let data = res.data;
          this.isPress = true;
          if (data.code === '000000') {
            this.$alert(data.msg, '温馨提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.$router.go(0);
                // this.$router.push('/userGroupList');
              }
            });
          } else {
            this.$message(data.msg);
          }
        }).catch(() => {
        });
      },
      handleClick(tab, event) {
        // console.log(tab, event);
      },
      handleClose(tag) {
        this.audience.tags.splice(this.audience.tags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          let bol = true, msg = '';
          for (let i in this.audience.tags) {
            if (inputValue === this.audience.tags[i]) {
              bol = false;
              msg = '标签已存在';
            }
          }
          if (inputValue.length > 20) {
            bol = false;
            msg = '标签长度不能超过20';
          }
          bol ? this.audience.tags.push(inputValue) : this.$message.error(msg);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      getUserGroupList() {
        globalAxios('group/query', {pageNumber: 1, pageSize: 1000, appId: this.form.appId}).then(
            (res) => {
              let data = res.data;
              if (data.code === '000000') {
                let obj = data.data.content;
                this.userGroup = obj;
              } else {
                this.$message(data.msg);
              }
            }).catch(() => {
        });
      },
      getAppInfo() {
        globalAxios('appinfo/get/' + this.form.appId, {}).then((res) => {
          let data = res.data;
          if (data.code === '000000') {
            this.isSupportIos = data.data.isSupportIos;
            this.isSupprotAndroid = data.data.isSupprotAndroid;
            this.isSupportWinphone = data.data.isSupportWinphone;
            let appStatus = data.data.appStatus;
            if (appStatus === 2) {
              this.isPress = false;
              this.$message.error(data.data.appName + '已停用不能创建推送');
            } else {
              this.isPress = true;
            }
          } else {
            this.$message.error(data.msg);
          }
        }).catch(() => {
        });
      }
    },
    mounted() {
      this.form.appId = sessionStorage.appId;
      this.getAppInfo();
      this.getUserGroupList();

      if (this.$route.query.groupId) {
        if (this.$route.query.groupId.length > 10) {
          this.audience.id.push(this.$route.query.groupId)
        } else {
          this.audience.id = this.$route.query.groupId;
        }
      } else {
        this.audience.id = [];
      }
    }
  }
</script>
<style scoped lang="scss">
  .card-push {
  }

  .small-tip {
    margin: 8px 0 0 0;
    padding: 0;
    color: #999;
  }

  .info-push {
    border: 1px solid rgb(209, 227, 229);
    border-top: 0;
    padding: 15px 20px;
  }

  .add-appdiv {
    clear: both;
    padding: 20px 20px 20px 20px;
    margin-bottom: 10px;
    border: none;

    .f-left {
      float: left;

      h3 {
        margin: 0;
        padding-top: 5px;
        color: #666;
      }
    }
    .ap-bottom {
      border-bottom: 1px solid rgb(204, 204, 204);
      margin-bottom: 22px;
    }

    .form-add {
      margin-left: 80px;
      width: 700px;
    }

    .fa-ul {
      list-style-type: none;
      font-size: 0;
      border-radius: 60px;
      display: inline-block;
      overflow: hidden;
      width: 560px;
      border: 1px solid rgb(204, 204, 204);
      padding: 0;
      margin-left: 50px;

      li {
        display: inline-block;
        width: 140px;
        font-size: 14px;
        height: 40px;
        margin: 0;
        padding: 0;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
      }

      li:hover, li.active {
        background: #6cc;
        color: #fff;
      }

    }
    .datetime {
      margin-left: 90px;
      margin-top: 20px;
    }

    .per-msg {
      margin-left: 70px;
      margin-bottom: 50px;
      margin-top: 20px;
      width: 520px;
    }

  }

  .card-push .add-appdiv:first-child {
    border-bottom: 1px solid rgb(204, 204, 204);
  }

  .text-right {
    margin-top: 20px;
    text-align: right;
  }

  .tag-list {
    width: 480px;
    display: inline-block;
    vertical-align: top;

    .el-tag {
      margin-bottom: 5px;
    }
  }

  .right-num {
    color: #999;
    line-height: 25px;
  }

  .user-group {
    width: 470px;
    margin-right: 10px;
  }

  .platform {
    list-style-type: none;
    margin-bottom: 50px;
    margin-top: 0;

    li {
      display: inline-block;
      width: 120px;
      text-align: center;
      cursor: pointer;
      border-right: 1px solid #ddd;
      padding-top: 50px;

      div {
        margin: 8px 0
      }
    }
    li.ios {
      background: url('../../../assets/images/pus_ios_1.png') top center no-repeat;
      color: #999;
    }

    li.android {
      background: url('../../../assets/images/pus_android_1.png') top center no-repeat;
      color: #999;
    }

    li.windows {
      background: url('../../../assets/images/pus_wp_1.png') top center no-repeat;
      color: #999;
    }

    li.ios:hover, li.ios.active {
      background: url('../../../assets/images/pus_ios_2.png') top center no-repeat;
      color: #6cc;
    }

    li.android:hover, li.android.active {
      background: url('../../../assets/images/pus_android_2.png') top center no-repeat;
      color: #6cc;
    }

    li.windows:hover, li.windows.active {
      background: url('../../../assets/images/pus_wp_2.png') top center no-repeat;
      color: #6cc;
    }

    li:last-child {
      border-right: none;
    }
  }
</style>
