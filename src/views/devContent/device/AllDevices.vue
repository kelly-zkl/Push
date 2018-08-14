<template>
  <section>
    <!--工具条-->
    <el-row class="toolbar" :span="24">
      <el-col :span="3">
        <el-input placeholder="设备ID" icon="search" v-model="inputClientId"
                  :on-icon-click="getDeviceList" style="width: 100%"></el-input>
      </el-col>
      <el-col :span="3">
        <el-input placeholder="别名" icon="search" v-model="inputAlias"
                  :on-icon-click="getDeviceList" style="width: 100%;margin-left: 10px"></el-input>
      </el-col>
      <el-col :span="3">
        <el-date-picker v-model="searchTime" type="datetime" placeholder="注册时间"
                        style="width: 100%;margin-left: 20px"></el-date-picker>
      </el-col>
      <el-col :span="2">
        <el-cascader placeholder="系统版本" expand-trigger="hover" v-model="versionValue"
                     style="width: 100%;margin-left: 30px" :options="versions"
                     @change="handleChange"></el-cascader>
      </el-col>
      <el-col :span="2">
        <el-select placeholder="当前状态" v-model="status" style="width: 100%;margin-left: 40px">
          <el-option v-for="item in devstatus" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="2" :offset="7">
        <el-button type="primary" @click="getDeviceList" class="f-right">搜索</el-button>
      </el-col>
      <el-col :span="2">
        <el-button @click="clearAll" style="margin-left: 10px">清除</el-button>
      </el-col>
    </el-row>
    <!--列表-->
    <el-table :data="devices" highlight-current-row v-loading="listLoading"
              @selection-change="selsChange">
      <el-table-column type="index" label="序号" width="70"
                       style="width: 100% !important;" align="center"></el-table-column>
      <el-table-column prop="clientId" label="设备ID" min-width="250"
                       sortable align="center"></el-table-column>
      <el-table-column label="设备别名" min-width="250" sortable align="center"
                       :formatter="formatAlias"></el-table-column>
      <el-table-column prop="registerTime" label="注册时间" width="200"
                       sortable align="center"></el-table-column>
      <el-table-column label="系统版本" :formatter="formatSys" width="150"
                       sortable align="center"></el-table-column>
      <el-table-column :formatter="formatArea" label="地区" width="200"
                       align="center"></el-table-column>
      <el-table-column prop="lastLoginTime" label="最后登录时间" width="200"
                       sortable align="center"></el-table-column>
      <el-table-column prop="online" label="当前状态" :formatter="formatStatus"
                       width="120" sortable align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template scope="scope">
          <el-button type="primary" size="small" @click="deviceInfo(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 15, 20, 30]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--弹框==设备详情-->
    <el-dialog title="" v-model="dialogDetail" :close-on-click-modal="false" class="updateUser">
      <h3>设备信息</h3>
      <el-form ref="form" :model="deviceForm" label-width="30%">
        <el-form-item label="设备ID"><span>{{deviceForm.clientId || '--'}}</span></el-form-item>
        <el-form-item label="设备别名">
          <span>{{deviceForm.alias || '--'}}</span>
        </el-form-item>
        <!--<el-form-item label="设备标签">-->
        <!--<span>{{deviceForm.tags || '&#45;&#45;'}}</span>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="设备群组">-->
        <!--<span>{{deviceForm.groups || '&#45;&#45;'}}</span>-->
        <!--</el-form-item>-->
        <el-form-item label="系统版本">
          <span>{{deviceForm.opType + deviceForm.opVersion || '--'}}</span>
        </el-form-item>
        <el-form-item label="注册时间">
          <span>{{deviceForm.registerTime || '--'}}</span>
        </el-form-item>
        <el-form-item label="最后登录时间">
          <span>{{deviceForm.lastLoginTime || '--'}}</span>
        </el-form-item>
        <el-form-item label="最后退出时间">
          <span>{{deviceForm.lastLogoutTime || '--'}}</span>
        </el-form-item>
        <el-form-item label="当前状态">
          <span style="color:#6699FF ">{{deviceForm.online == true ? '在线' : '离线'}}</span>
        </el-form-item>
        <el-form-item label="地区">
          <span>{{deviceForm.location.provinceName + deviceForm.location.cityName
          + deviceForm.location.areaName || '--'}}</span>
        </el-form-item>
        <el-form-item label="地址">
          <span>{{deviceForm.location.address || '--' }}</span>
        </el-form-item>
        <el-form-item label="经纬度">
          <span>{{deviceForm.location.lat + deviceForm.location.lon ? deviceForm.location.lat + ','
              + deviceForm.location.lon : '--'}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>
<script>
  import util from '../../../common/js/util'
  import {formatDate} from '../../../common/js/date'
  import {globalAxios, JSONParse, globalValidImg, globalValidP12} from '../../../common/js/api';

  export default {
    data() {
      return {
        devstatus: [
          {
            value: undefined,
            label: '全部'
          },
          {
            value: true,
            label: '在线'
          },
          {
            value: false,
            label: '离线'
          }
        ],
        status: undefined,
        versions: [
          {
            value: 'ANDROID',
            label: 'Android',
            children: []
          },
          {
            value: 'IOS',
            label: 'IOS',
            children: []
          },
          {
            value: 'WINDOWS',
            label: 'Windows',
            children: []
          }
        ],
        versionValue: [],
        dialogDetail: false,
        deviceForm: {
          location: {
            provinceName: ''
          },
        },
        inputClientId: '',
        inputAlias: '',
        searchTime: '',
        listLoading: false,
        devices: [],
        sels: [],
        total: 0,
        page: 1,
        size: 10
      }
    },
    methods: {
      deviceInfo(row) {
        this.deviceForm = row;
        this.dialogDetail = true;
      },
      handleChange(value) {
        this.versionValue = value;
      },
      formatArea(row, column) {
        return row.location.provinceName + row.location.cityName
            + row.location.areaName || '--';
      },
      formatAlias(row, column) {
        return row.alias || '--';
      },
      formatSys(row, column) {
        return row.opType + row.opVersion || '--';
      },
      formatStatus(row, column) {
        return row.online === true ? '在线' : '离线';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getDeviceList();
      },
      handleSizeChange(val) {
        this.size = val;
        this.getDeviceList();
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      getDeviceList() {
        let para = {};
        para.page = this.page;
        para.size = this.size;
        para.online = this.status;
        para.clientId = this.inputClientId;
        para.alias = this.inputAlias;
        para.opType = this.versionValue[0];
        para.opVersion = this.versionValue[1];
        para.queryBeginTime = this.searchTime ? formatDate(new Date(this.searchTime),
            "yyyy-MM-dd hh:mm:ss") : '';
        this.listLoading = true;
        globalAxios('device/query', para).then((res) => {
          let data = res.data;
          this.listLoading = false;
          if (data.code === '000000') {
            let obj = data.data;
            this.devices = obj.list;
            this.total = obj.count;
            this.page = obj.page;
            this.size = obj.size;
          } else {
            this.$message(data.msg);
          }
        }).catch(() => {
        });
      },
      clearAll() {//清除
        this.status = undefined;
        this.versionValue = [];
        this.searchTime = '';
        this.inputClientId = '';
        this.inputAlias = '';
        this.getDeviceList();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getDeviceList();
      },
      //操作系统版本
      getOptSys(opsysId, type) {
        globalAxios('opsys/version/get/' + opsysId, {}).then((res) => {
          if (res.status === 200) {
            let response = JSON.parse(res.request.response);
            if (response.code === '000000') {
              for (let i = 0; i < response.data.length; i++) {
                let child = {};
                child.value = response.data[i].opsysVersionName;
                child.label = response.data[i].opsysVersionName;
                this.versions[type].children.push(child);
              }
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
      this.getOptSys("b29a89dc975c4ebb86c03c19d29b3260", 0);
      this.getOptSys("f43a68bfd37b4cb3823a2efaf9eed6c0", 1);
      this.getOptSys("1f110e5787c64ebd86bbd1f436d9e17b", 2);
      this.getDeviceList();
    }
  }
</script>
<style scoped lang="scss">
  .el-form .el-form-item span {
    margin-left: 40px;
  }

  .toolbar {
    background: #f2f2f2;
    padding: 10px;
    margin: 0 0 10px 0;
  }
</style>