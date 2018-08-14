<template>
  <section class="app-man">
    <div class="main-content">
      <el-form ref="form" :model="form" :rules="rules" label-width="50px">
        <div class="add-appdiv">
          <div class="f-left">
            <h3><em class="red">*</em>组名称</h3>
          </div>
          <div class="form-add">
            <el-form-item label="" prop="groupName">
              <el-input placeholder="请输入用户组名称" v-model="form.groupName" :maxlength="15"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="add-appdiv">
          <div class="f-left">
            <h3>标签过滤</h3>
          </div>
          <div class="form-add">
            <div class="fa-right">
              <el-radio-group v-model="form.tagsType">
                <el-radio label="1">满足所有标签</el-radio>
                <el-radio label="2">满足任意标签</el-radio>
              </el-radio-group>
              <div class="tag-list">
                <el-tag
                    :key="tag" v-for="tag in dynamicTags" :closable="true"
                    :close-transition="false" @close="handleClose(tag)">
                  {{tag}}
                </el-tag>
                <el-input
                    class="input-new-tag" v-if="inputVisible" v-model="inputValue"
                    ref="saveTagInput" size="mini"
                    @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput"
                           v-else-if="!inputVisible&&dynamicTags.length<10">添加标签
                </el-button>
                <span class="right-num">{{dynamicTags.length}}/10</span>
              </div>
              <p class="small-tip">点击任意位置或回车添加标签</p>
            </div>
          </div>
        </div>
        <div class="add-appdiv rel">
          <div class="f-left">
            <h3>地理位置</h3>
          </div>
          <div class="form-add">
            <div class="fa-right">
              <div class="tag-list">
                <el-tag
                    :key="tag" v-for="tag in form.cityIds" :closable="true"
                    :close-transition="false" @close="handleClose1(tag)">
                  {{tag.areaName}}
                </el-tag>
                <el-button class="button-new-tag" size="small"
                           @click="chooseCity">选择省市
                </el-button>
              </div>
              <p class="small-tip">点击选择省市，展开省市列表，选择省加载所有的城市列表</p>
            </div>
            <div class="all-city" v-if="showCityAll">
              <h3>省份/直辖市：</h3>
              <div class="">
                <span v-for="(pov,index) in allPov" @click="getCity(pov,'pov')"
                      :class="{'city-span':true,active:pov.id==povId}">{{pov.areaName}}</span>
              </div>
              <h3>城市：</h3>
              <div class="">
                <span v-if="allCity.length>1" @click="saveCity(parentInfo)"
                      :class="{'city-span':true,active:parentInfo.id==colorList[parentInfo.id]&&!!parentInfo.id}">全省</span>
                <span v-for="city in allCity" @click="saveCity(city)"
                      :class="{'city-span':true,active:city.id==colorList[city.id]}">
									{{city.areaName}}
								</span>
              </div>
            </div>
          </div>
        </div>
        <div class="add-appdiv">
          <div class="f-left">
            <h3>活跃用户</h3>
          </div>
          <div class="form-add">
            <el-form-item label="">
              <el-select placeholder="请选择类型" v-model="form.activeType">
                <el-option label="请选择" value=""></el-option>
                <el-option label="活跃用户" value="1"></el-option>
                <el-option label="非活跃用户" value="2"></el-option>
              </el-select>
              <span class="day-active">
								<el-input placeholder="" v-model="form.activeDays" :maxlength="10"
                          class="input"></el-input>
								<i>天</i>
							</span>

            </el-form-item>
          </div>
        </div>
        <div class="add-appdiv">
          <div class="f-left">
            <h3>系统版本</h3>
          </div>
          <div class="form-add">
            <el-form-item label="">
              <div>
                <el-checkbox-group v-model="form.opsys">
                  <el-checkbox v-if="isSupprotAndroid == 1"
                               label="Android" name="type" @change="handleAndroidChange"
                               value="b29a89dc975c4ebb86c03c19d29b3260"></el-checkbox>
                  <el-checkbox v-if="isSupportIos == 1"
                               label="Ios" name="type" @change="handleIosChange"
                               value="f43a68bfd37b4cb3823a2efaf9eed6c0"></el-checkbox>
                  <el-checkbox v-if="isSupportWinphone == 1"
                               label="Windows" name="type" @change="handleWindowsChange"
                               value="1f110e5787c64ebd86bbd1f436d9e17b"></el-checkbox>
                </el-checkbox-group>
              </div>
              <el-row :gutter="20">
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <div v-if="isSupprotAndroid == 1"><img
                        src="../../../assets/images/android_1.png"><span>Android</span></div>
                    <div v-if="isSupportIos == 1"><img
                        src="../../../assets/images/ios_1.png"><span>Ios</span></div>
                    <div v-if="isSupportWinphone == 1"><img
                        src="../../../assets/images/wp_1.png"><span>Windows</span></div>
                  </div>
                </el-col>
                <el-col :span="9">
                  <div class="grid-content bg-purple">
                    <div v-if="isSupprotAndroid == 1">
                      <label>最低</label>
                      <el-select placeholder="请选择类型" v-model="androidInfo.opsysVersionMinId"
                                 class="w-120 bp-select" :disabled=!isAndroid>
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="ver in androidVer" :label="ver.opsysVersionName"
                                   :value="ver.opsysVersionName"
                                   :key="ver.opsysVersionName"></el-option>
                      </el-select>
                    </div>
                    <div v-if="isSupportIos == 1">
                      <label>最低</label>
                      <el-select placeholder="请选择类型" v-model="iosInfo.opsysVersionMinId"
                                 class="w-120 bp-select" :disabled=!isIos>
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="ver in iosVer" :label="ver.opsysVersionName"
                                   :value="ver.opsysVersionName"
                                   :key="ver.opsysVersionName"></el-option>
                      </el-select>
                    </div>
                    <div v-if="isSupportWinphone == 1">
                      <label>最低</label>
                      <el-select placeholder="请选择类型" v-model="windowInfo.opsysVersionMinId"
                                 class="w-120 bp-select" :disabled=!isWindows>
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="ver in windowVer" :label="ver.opsysVersionName"
                                   :value="ver.opsysVersionName"
                                   :key="ver.opsysVersionName"></el-option>
                      </el-select>
                    </div>
                  </div>
                </el-col>
                <el-col :span="9">
                  <div class="grid-content bg-purple">
                    <div v-if="isSupprotAndroid == 1">
                      <label>最高</label>
                      <el-select placeholder="请选择类型" v-model="androidInfo.opsysVersionMaxId"
                                 class="w-120 bp-select" :disabled=!isAndroid>
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="ver in androidVer" :label="ver.opsysVersionName"
                                   :value="ver.opsysVersionName"
                                   :key="ver.opsysVersionName"></el-option>
                      </el-select>
                    </div>
                    <div v-if="isSupportIos == 1">
                      <label>最高</label>
                      <el-select placeholder="请选择类型" v-model="iosInfo.opsysVersionMaxId"
                                 class="w-120 bp-select" :disabled=!isIos>
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="ver in iosVer" :label="ver.opsysVersionName"
                                   :value="ver.opsysVersionName"
                                   :key="ver.opsysVersionName"></el-option>
                      </el-select>
                    </div>
                    <div v-if="isSupportWinphone == 1">
                      <label>最高</label>
                      <el-select placeholder="请选择类型" v-model="windowInfo.opsysVersionMaxId"
                                 class="w-120 bp-select" :disabled=!isWindows>
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="ver in windowVer" :label="ver.opsysVersionName"
                                   :value="ver.opsysVersionName"
                                   :key="ver.opsysVersionName"></el-option>
                      </el-select>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="text-right">
        <el-button size="large" @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="onSubmit" size="large" :disabled=!isPress>确认创建</el-button>
      </div>
    </div>
  </section>
</template>

<script>
  import util from '../../../common/js/util'
  import {globalAxios, JSONParse, globalValidImg, globalValidP12} from '../../../common/js/api';

  export default {
    data() {
      return {
        showCityAll: false,
        ios: 2,
        isPress: true,
        dynamicTags: [],
        procity: [],
        inputVisible: false,
        isSupportIos: 1,
        isSupprotAndroid: 1,
        isSupportWinphone: 1,
        inputValue: '',
        allPov: [],
        allCity: [],
        form: {
          tagsType: '',
          groupName: '',
          activeType: '',
          activeDays: '',
          opsys: [],
          cityIds: [],
          appId: this.$route.query.appId || sessionStorage.appId
        },
        rules: {
          groupName: [
            {required: true, message: '请输入用户组名称', trigger: 'blur'}
          ],
        },
        userId: '',
        windowInfo: {
          opsysId: '1f110e5787c64ebd86bbd1f436d9e17b',
          opsysVersionMinId: '',
          opsysVersionMaxId: ''
        },
        iosInfo: {
          opsysId: 'f43a68bfd37b4cb3823a2efaf9eed6c0',
          opsysVersionMinId: '',
          opsysVersionMaxId: ''
        },
        androidInfo: {
          opsysId: 'b29a89dc975c4ebb86c03c19d29b3260',
          opsysVersionMinId: '',
          opsysVersionMaxId: ''
        },
        windowVer: [],
        iosVer: [],
        androidVer: [],
        parentInfo: {},
        colorList: {},
        povId: '',
        isAndroid: false,
        isIos: false,
        isWindows: false
      }
    },
    methods: {
      handleAndroidChange(event) {
        this.isAndroid = event.target.checked
      },
      handleIosChange(event) {
        this.isIos = event.target.checked
      },
      handleWindowsChange(event) {
        this.isWindows = event.target.checked
      },
      chooseCity() {
        this.showCityAll = !this.showCityAll;
      },
      saveCity(info) {
        // 判断是否存在id
        let bol = true;
        for (let i in this.form.cityIds) {
          if (this.form.cityIds[i].id === info.id) {
            bol = false;
            this.form.cityIds.splice(i, 1);
            this.colorList[info.id] = '';
          }
        }
        if (bol) {
          this.showCityAll = false;
          this.form.cityIds.push(info);
          this.colorList[info.id] = info.id;
          this.colorList[info.parentId] = info.parentId;
        }
      },
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      handleClose1(tag) {
        this.form.cityIds.splice(this.form.cityIds.indexOf(tag), 1);
        this.colorList[tag.id] = '';
        this.povId = '';
        this.parentInfo = {};
//        this.showCityAll = false;
//        saveCity(tag);
//        this.getCity('', 'pov');
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
          for (let i in this.dynamicTags) {
            if (inputValue === this.dynamicTags[i]) {
              bol = false;
              msg = '标签已存在';
            }
          }
          if (inputValue.length > 20) {
            bol = false;
            msg = '标签长度不能超过20';
          }
          bol ? this.dynamicTags.push(inputValue) : this.$message.error(msg);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      onSubmit() {
        this.isPress = false;
        if (this.form.groupName.length <= 0) {
          this.isPress = true;
          this.$message.error('请输入用户组名称');
          return false;
        }
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let para = Object.assign({}, this.form);
            para.groupDesc = '';
            if (this.dynamicTags.length > 0 || this.form.cityIds.length > 0 || this.form.activeType
                || this.form.opsys.length > 0) {
              if (this.dynamicTags.length > 0) {
                if (!para.tagsType) {
                  this.$message.error('请选择标签过滤类型');
                  this.isPress = true;
                  return false;
                }
                para.groupDesc = (para.tagsType === '1' ? '满足所有Tag 等于' : '满足任意Tag 等于');
              } else {
                para.tagsType = '';
                this.form.tagsType = '';
              }
              para.groupTags = this.dynamicTags.join(',');
              para.groupDesc += para.groupTags + '包含';
              para.cityIds = [];
              for (let i in this.form.cityIds) {
                para.groupDesc += this.form.cityIds[i].areaName + ',';
                para.cityIds.push(this.form.cityIds[i].id);
              }
              if (this.form.cityIds.length > 0) {
                para.groupDesc += '地区';
              }
              if (para.activeType || para.activeDays) {
                if (!/^[0-9]*$/.test(para.activeDays) || !para.activeDays) {
                  this.$message.error('请输入正确的天数');
                  this.isPress = true;
                  return false;
                }
                if (!para.activeType) {
                  this.$message.error('请选择活跃用户类型');
                  this.isPress = true;
                  return false;
                }

                para.groupDesc += '最近 ' + para.activeDays + ' 天内';
                para.groupDesc += (para.activeType === '1' ? '活跃用户' : '不活跃用户');
              }
              para.opsys = [];
              for (let i in this.form.opsys) {
                if (this.form.opsys[i] === 'Android') {
                  para.opsys.push(this.androidInfo);
                  if (!this.checkVersion(this.androidInfo.opsysVersionMinId,
                          this.androidInfo.opsysVersionMaxId, 'Android')) {
                    this.isPress = true;
                    return false;
                  }
                  para.groupDesc += ',android系统版本在' + this.androidInfo.opsysVersionMinId + '至'
                      + this.androidInfo.opsysVersionMaxId;
                }
                if (this.form.opsys[i] === 'Ios') {
                  para.opsys.push(this.iosInfo);
                  if (!this.checkVersion(this.iosInfo.opsysVersionMinId,
                          this.iosInfo.opsysVersionMaxId, 'Ios')) {
                    this.isPress = true;
                    return false;
                  }
                  para.groupDesc += ',ios系统版本在' + this.iosInfo.opsysVersionMinId + '至'
                      + this.iosInfo.opsysVersionMaxId;
                }
                if (this.form.opsys[i] === 'Windows') {
                  para.opsys.push(this.windowInfo);
                  if (!this.checkVersion(this.windowInfo.opsysVersionMinId,
                          this.windowInfo.opsysVersionMaxId, 'Windows')) {
                    this.isPress = true;
                    return false;
                  }
                  para.groupDesc += ',Windows系统版本在' + this.windowInfo.opsysVersionMinId + '至'
                      + this.windowInfo.opsysVersionMaxId;
                }
              }
              para.groupDesc += '的用户';
              globalAxios('group/add', para).then((res) => {
                let data = res.data;
                this.isPress = true;
                if (data.code === '000000') {
                  this.$alert(data.msg, '温馨提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                      this.$router.push('/userGroupList');
                    }
                  });
                } else {
                  this.$message.error(data.msg);
                }
              }).catch(() => {
              });
            } else {
              this.isPress = true;
              this.$message.error('标签、位置、活跃用户、版本：必须填入一个');
            }
          }
        })
      },
      checkVersion(min, max, msg) {
        let bol = true;
        if (!min || !max) {
          bol = false;
          this.$message.error('请选择' + msg + '的最高版本和最低版本');
        } else if (parseFloat(min) > parseFloat(max)) {
          bol = false;
          this.$message.error(msg + '的最低版本不能高于最高版本');
        }
        return bol;
      },
      getVersion(para) {
        let id = '', arry = [];
        if (para === 'window') {
          id = this.windowInfo.opsysId;
        } else if (para === 'ios') {
          id = this.iosInfo.opsysId;
        }
        else if (para === 'android') {
          id = this.androidInfo.opsysId;
        }
        globalAxios('opsys/version/get/' + id, {}).then((res) => {
          let data = res.data;
          if (data.code === '000000') {
            arry = data.data;
            if (para === 'window') {
              this.windowVer = arry;
            } else if (para === 'ios') {
              this.iosVer = arry;
            }
            else if (para === 'android') {
              this.androidVer = arry;
            }
          } else {
            this.$message.error(data.msg);
          }
        }).catch(() => {
        });
      },
      // 获取省市
      getCity(id, pov) {
        this.parentInfo = id;
        id = (!!id ? id.id : '000000');
        !!pov ? this.povId = id : '';
        globalAxios('area/queryByPid/' + id, {}).then((res) => {
          let data = res.data;
          if (data.code === '000000') {
            id === '000000' ? this.allPov = data.data : this.allCity = data.data;
          } else {
            this.$message.error(data.msg);
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
          } else {
            this.$message.error(data.msg);
          }
        }).catch(() => {
        });
      }
    },
    mounted() {
      this.form.userId = JSONParse(sessionStorage.userInfo).userId;
      this.form.appId = this.$route.query.appId || sessionStorage.appId;
      this.getAppInfo();
      this.getVersion('window');
      this.getVersion('ios');
      this.getVersion('android');
      this.getCity();
    }
  }
</script>

<style scoped lang="scss">
  .right-num {
    color: #999;
    line-height: 25px;
  }

  .app-man {
    width: 100%;
    .main-content {
      margin-left: 30px;
      margin-right: 30px;
    }
    .add-appdiv {
      border: 1px solid rgb(204, 204, 204);
      border-radius: 5px;
      padding: 30px 30px;
      margin-bottom: 30px;
      .f-left {
        float: left;
        h3 {
          margin: 0 50px 0 0;
          padding-top: 5px;
          color: #666;
        }
      }
      .ap-bottom {
        border-bottom: 1px solid rgb(204, 204, 204);
        margin-bottom: 22px;
      }
      .form-add {
        margin-left: 100px;
        width: 600px;
        .fa-right {
          margin-left: 50px;
          line-height: 2.3;
          .tag-list {
            margin-top: 5px;
          }
          .small-tip {
            margin: 8px 0 0 0;
            padding: 0;
            color: #999;
          }
        }
        .day-active {
          margin-left: 20px;
          .input {
            width: 100px;
          }
          i {
            font-style: normal;
            margin-left: 5px;
          }
        }
      }
    }

    .text-right {
      text-align: right;
      margin-bottom: 30px;
    }
    .grid-content {
      margin-top: 10px;
      img {
        vertical-align: middle;
        margin-right: 8px;
        margin-top: -2px;
      }
      .bp-select {
        height: 30px;
        margin-left: 10px;
      }
    }
  }

  .all-city {
    border: 1px solid rgb(204, 204, 204);
    border-radius: 5px;
    padding: 10px;
    position: absolute;
    width: 600px;
    background: #fff;
    z-index: 99;
    margin-top: -41px;
    margin-left: 50px;
    h3 {
      font-size: 15px;
      font-weight: normal;
      border-bottom: 1px dashed rgb(204, 204, 204);
      color: #6cc;
      padding-bottom: 10px;
      padding-top: 10px;
      margin: 0 0 10px 0;
    }
    .city-span {
      line-height: 1.5;
      display: inline-block;
      padding: 2px 5px;
      margin-right: 10px;
      border-radius: 5px;
      margin-bottom: 5px;
      cursor: pointer;
    }
    .city-span:hover, .city-span.active {
      background: #6cc;
      color: #fff;
    }
  }

  .app-man .add-appdiv:first-child, .app-man .add-appdiv:last-child {
    padding-bottom: 8px;
  }

  .red {
    color: red;
    margin-right: 5px;
  }
</style>