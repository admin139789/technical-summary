import Vue from 'vue'
import axios from 'axios'
import router from '../../router'
// import store from '@/store'
//axios的一些配置，比如发送请求显示loading，请求回来loading消失之类的
//
axios.interceptors.request.use(function(config) { //配置发送请求的信息
    // config.data = encryption(JSON.stringify(config.data));
    if(config.data && !config.data.token){
        config.data.token=localStorage.getItem('token')
    }
    if (typeof config.data == 'object') {
        var data = new Array();
        for (var key in config.data) {
            data.push(key + '=' + config.data[key]);
        }
        config.data = data.join("&");
    }
    return config;
}, function(error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function(response) { //配置请求回来的信息
    // response.data.data =JSON.parse(decrypt(response.data.data))
    // if(response.data.data.code == 0){
    //   Vue.$router.push({path: '/login'});
    //   return;
    // }
    if (response.data.status === 1202) {
        //token失效
        localStorage.setItem('token','');
        router.push({
            name:"Login",
            path:'/login',
            params: {timeOut: true}
        });
        return false;
    }
    return response.data;
}, function(error) {

    return Promise.reject(error);
});

export function resetImgurl(url) {//静态资源
  Vue.prototype.imgurl=url;
  localStorage.setItem("imgurl", Vue.prototype.imgurl);
  Vue.prototype.$addr = Vue.prototype.imgurl;
};

export function resetRequesturl(url) {
  Vue.prototype.requesturl = url;
  localStorage.setItem("requesturl", Vue.prototype.requesturl);
  Vue.prototype.urlRequest = Vue.prototype.requesturl + '/index.php';
  axios.defaults.baseURL = Vue.prototype.urlRequest;
};

export function decrypt(str){ //解密
    var base64_decode =function(input) {
        var rv;
        rv = window.atob(input);
        rv = escape(rv);
        rv = decodeURIComponent(rv);
        return rv;
    }
    // var token = 'hcht_2016_kylin';
    // var token = hex_md5(token);
    var token="5c322a0f381b67359f6c195453d84052";
    var str = JSON.parse(base64_decode(str));
    var str2 = new Array();
    var index = '';
    for (var i = 0; i < str.length; i++) {
        if (i > token.length - 1) {
            index = token.length - 1;
        } else {
            index = i;
        }
        str2[i] = String.fromCharCode(str[i] - token[index].charCodeAt());
    }
    return base64_decode(str2.join(""));
};

export function encryption(str){ //加密
    // str = JSON.stringify(str)
    var base64_encode =function(input) {
        var rv;
        rv = encodeURIComponent(input);
        rv = unescape(rv);
        rv = window.btoa(rv);
        return rv;
    }
    // var token = hex_md5('hcht_2016_kylin');
    var token ="5c322a0f381b67359f6c195453d84052";
    var str = base64_encode(str);
    var len = str.length;
    var data = new Array();
    var index = 0;
    for (var i = 0; i < len; i++) {
        if (i > token.length - 1) {
            index = token.length - 1;
        } else {
            index = i;
        }
        data[i] = str[i].charCodeAt() + token[index].charCodeAt();
    }
    data = base64_encode('['+data.join(",")+']');
    var str2 = '{"data":"' + data + '"}';
    var str3 ={
        json:str2
    }
    return str3;
}

export default axios
