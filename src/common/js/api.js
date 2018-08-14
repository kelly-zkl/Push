import axios from 'axios';

// global.baseUrl = 'http://150.242.58.73:8290/iot-push-web/';
// global.baseUrl = 'http://119.147.36.2:46000/iot-push-web/';
global.baseUrl = 'http://117.48.193.122:46000/iot-push-web/';
// ajax 公用
export const globalAxios = (url, params) => {
    // debugger;
    // let getTimes = new Date().getTime();
    return axios({
        url: baseUrl + url,
        data: params,
        method: 'post',
        timeout: 9000,
        // transformResponse: [function (data) {
        //   // 对 data 进行任意转换处理
        //   return JSON.parse(data);
        // }],
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            // 'signature'   :  signature(params,getTimes),
            // 't'           :  getTimes,
            // 'tokenId'     :  tokenId
        }
    })
};
global.authorityUrl = 'http://192.168.50.41:8180/sys-user/';
export const authorityAxios = (url, params) => {
    // debugger;
    // let getTimes = new Date().getTime();
    return axios({
        url: authorityUrl + url,
        data: params,
        method: 'post',
        timeout: 9000,
        // transformResponse: [function (data) {
        //   // 对 data 进行任意转换处理
        //   return JSON.parse(data);
        // }],
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            // 'signature'   :  signature(params,getTimes),
            // 't'           :  getTimes,
            // 'tokenId'     :  tokenId
        }
    })
};
// 处理成json
export const JSONParse = (params) => {
    let jp = '';
    if (!!params) {
        jp = JSON.parse(params);
    }
    return jp;
};
// 验证手机号码
export const mobileValidator = (phone) => {
    let bol = true;
    if (!/^1(3|4|5|7|8)\d{9}$/.test(phone)) {
        bol = false;
    }
    return bol;
};
//验证用户名
export const usernameValidator = (username) => {
    let bol = true;
    if (!/^[a-zA-Z0-9_]{6,16}$/.test(username)) {
        bol = false;
    }
    return bol;
};
// 验证密码
export const pwdValidator = (pwd) => {
    let bol = true;
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(pwd)) {
        bol = false;
    }
    return bol;
};
// 图片公用验证 gif / jpg / png / jpeg 
export const globalValidImg = (file, msg) => {
    let isJPG = false;
    if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type
        === 'image/gif') {
        isJPG = true;
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isJPG) {
        msg.error('上传图片只能是 JPG,gif或者png格式!');
    }
    else if (!isLt1M) {
        msg.error('上传图片大小不能超过 1MB!');
    }
    return isJPG && isLt1M;
};
// p12验证
export const globalValidP12 = (file, msg) => {
    let isP12 = false;
    if (file.type === 'application/x-pkcs12'
        || file.name.substring(file.name.length - 4, file.name.length)
        === '.p12') {
        isP12 = true;
    }
    if (!isP12) {
        msg.error('上传格式只能是p12!');
    }
    return isP12;
};

//身份证号码验证
export const userCardValid = (cardNo) => {
    let isCardNo = false;
// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    if (/^(1[1-5]|2[1-3]|3[1-7]|4[1-6]|5[0-4]|6[1-5]|71|8[1-2]|91)((\d{6}(0?[1-9]|1[0-2])((0?[1-9])|((1|2)[0-9])|30|31)\d{3})|(\d{4}(18|19|2[0-9])?\d{2}(0?[1-9]|1[0-2])((0?[1-9])|((1|2)[0-9])|30|31)\d{3}(\d|X|x)))$/.test(
            cardNo)) {
        isCardNo = true;
    }
    return isCardNo;
};
//身份证号码验证
export const businessLicenseValid = (value) => {
    let isCardNo = false;
// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    if (/^[A-HJ-NP-RT-UW-Y0-9]{18}$/.test(value)) {
        isCardNo = true;
    }
    return isCardNo;
}