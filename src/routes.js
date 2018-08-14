const Login = resolve => require(['./views/Login.vue'], resolve);
// const devInfo = resolve => require(['./views/devInfo.vue'], resolve);
const ForgetPwd = resolve => require(['./views/ForgetPwd.vue'], resolve);
const FgPwdAP = resolve => require(['./views/ForgetPwdAndPhone.vue'], resolve);
const NotFound = resolve => require(['./views/404.vue'], resolve);
const Home = resolve => require(['./views/Home.vue'], resolve);
const DevTopMain = resolve => require(['./views/otherPublic/devTopMain.vue'],
    resolve);
const DevTopMainLeft = resolve => require(
    ['./views/otherPublic/devTopMainLeft.vue'], resolve);

const Main = resolve => require(['./views/Main.vue'], resolve);
// 注册
const Register = resolve => require(['./views/Register.vue'], resolve);
// 开发者管理
const dList = resolve => require(['./views/developerMan/developerList.vue'],
    resolve);
const dInfo = resolve => require(['./views/developerMan/developerInfo.vue'],
    resolve);

const UpdateUserByAdmin = resolve => require(
    ['./views/developerMan/updateUserByAdmin.vue'], resolve);
// 应用管理
const appList = resolve => require(['./views/developerMan/applicationList.vue'],
    resolve);

// SDK管理
const SDKList = resolve => require(['./views/developerMan/SDKList.vue'],
    resolve);
const SDKInfo = resolve => require(['./views/developerMan/SDKInfo.vue'],
    resolve);

// 应用管理
const AppMan = resolve => require(['./views/devTop/appMan.vue'], resolve);
// 添加应用
const AddApp = resolve => require(['./views/devTop/addApp.vue'], resolve);
// 查看并修改应用
const ShowApp = resolve => require(['./views/devTop/appInfoAndUpdate.vue'],
    resolve);
// SDKall
const SDKAll = resolve => require(['./views/devTop/SDKAll.vue'], resolve);
// 数据统计 ==  设备统计
const deviceCount = resolve => require(
    ['./views/devContent/device/deviceCounts.vue'], resolve);
const allDevices = resolve => require(
    ['./views/devContent/device/AllDevices.vue'], resolve);
// 用户组  ==  用户组列表
const UGList = resolve => require(['./views/devContent/user/userGroupList.vue'],
    resolve);
// 用户组  ==  添加用户组
const AddUserGroup = resolve => require(
    ['./views/devContent/user/addUserGroup.vue'], resolve);
// 用户组  ==  修改用户组
const UpdateUserGroup = resolve => require(
    ['./views/devContent/user/updateUserGroup.vue'], resolve);
// 用户  ==  修改用户信息
const UpdateUser = resolve => require(
    ['./views/devContent/userInfo/updateUser.vue'], resolve);
// 应用管理 ==  推送主页
const PushMain = resolve => require(['./views/devContent/push/pushMain.vue'],
    resolve);
// 消息管理 ==  创建推送
const AddPush = resolve => require(['./views/devContent/push/addPush.vue'],
    resolve);
// 消息管理 ==  推送记录
const PushList = resolve => require(['./views/devContent/push/pushList.vue'],
    resolve);
// 消息管理 ==  推送记录
const PushDetail = resolve => require(
    ['./views/devContent/push/pushDetail.vue'],
    resolve);
// 功能权限 
const PowerList = resolve => require(['./views/authority/MenuManList.vue'],
    resolve);

//角色管理
const RoleList = resolve => require(['./views/authority/roleList.vue'],
    resolve);
//用户管理
const UserManager = resolve => require(['./views/authority/userManager.vue'],
    resolve);
let routes = [
  {
    path: '/',
    component: DevTopMain,
    name: '其他的头部导航',
    isDev: 'fei',
    children: [
      {path: '/appMan', component: AppMan, name: '应用列表'},
      {path: '/addApp', component: AddApp, name: '添加应用'},
      {path: '/SDKAll', component: SDKAll, name: 'SDK管理'}
    ]
  },
  {
    path: '/',
    component: DevTopMainLeft,
    isDev: 'fei',
    children: [
      {path: '/pushMain', component: PushMain, name: '', hidden: true}
    ]
  },
  {
    path: '/',
    component: DevTopMainLeft,
    isDev: true,
    name: '消息管理',
    children: [
      {path: '/addPush', component: AddPush, name: '创建推送'},
      {path: '/pushList', component: PushList, name: '推送记录'},
      {path: '/pushDetail', component: PushDetail, name: '推送详情', hidden: true}
    ]
  },
  {
    path: '/',
    component: DevTopMain,
    isDev: true,
    hidden: true,
    name: '用户信息',
    children: [
      {path: '/updateUser', component: UpdateUser, name: '修改用户信息'}
    ]
  },
  {
    path: '/',
    component: DevTopMainLeft,
    isDev: true,
    name: '用户标签',
    children: [
      {path: '/userGroupList', component: UGList, name: '用户组'},
      {path: '/addUserGroup', component: AddUserGroup, name: '创建分组'},
      {
        path: '/updateUserGroup', component: UpdateUserGroup, name: '修改分组',
        hidden: true
      }
    ]
  },
  {
    path: '/',
    component: DevTopMainLeft,
    isDev: true,
    name: '数据统计',
    children: [
      {path: '/deviceCounts', component: deviceCount, name: '设备统计'},
    ]
  },
  {
    path: '/',
    component: DevTopMainLeft,
    isDev: true,
    name: '',
    leaf: true,//只有一个节点
    children: [
      {path: '/showApp', component: ShowApp, name: '应用设置'}
    ]
  },
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  {
    path: '/register',
    component: Register,
    name: '',
    hidden: true
  },
  {
    path: '/forgetPwd',
    component: ForgetPwd,
    name: '',
    hidden: true
  },
  {
    path: '/fgPwdAP',
    component: FgPwdAP,
    name: '',
    hidden: true
  },
  {
    path: '/',
    component: Home,
    name: '开发者管理',
    children: [
      {path: '/dList', component: dList, name: '开发者账号'},
      {path: '/dInfo', component: dInfo, name: '开发者资料', hidden: true},
      {path: '/appList', component: appList, name: '应用管理'}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '管理员管理',
    hidden: true,
    children: [
      { path: '/updateUserByAdmin', component: UpdateUserByAdmin,
        name: '管理员资料修改',  hidden: true
      }
    ]
  },
  {
    path: '/',
    component: Home,
    name: 'SDK管理',
    children: [
      {path: '/SDKList', component: SDKList, name: 'SDK列表'},
      {path: '/SDKInfo', component: SDKInfo, name: 'SDK详情', hidden: true}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '数据统计',
    children: [
      {path: '/allDevices', component: allDevices, name: '设备统计'}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '功能权限',
    children: [
      {path: '/PowerList', component: PowerList, name: '菜单管理'},
      {path: '/RoleList', component: RoleList, name: '角色管理'},
      {path: '/UserManager', component: UserManager, name: '用户管理'}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    hidden: true,
    children: [
      {path: '/main', component: Main, name: '', hidden: true}
    ]
  },
  {
    path: '*',
    hidden: true,
    redirect: {path: '/404'}
  }
];

export default routes