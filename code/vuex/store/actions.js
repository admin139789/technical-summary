import * as types from './types'
import axios from '../assets/js/http'
export default {

    NAV_SHOW: ({
        commit
    }) => {
        commit(types.NAV_SHOW);
    },
    NAV_HIDE: ({
        commit
    }) => {
        commit(types.NAV_HIDE);
    },

    SET_ISLOGIN: ({
        commit
    }, { boolean }) => {
        commit(types.SET_ISLOGIN, boolean);
    },

    SET_SERVICE: ({
        commit
    }, { String }) => {
        commit(types.SET_SERVICE, String);
    },

    SET_USER_INFO_DATA: ({ commit }, { Obj }) => {
        console.log("提交！");
        if (!localStorage.getItem("token") || localStorage.getItem("token") && JSON.stringify(Obj) != "{}") {
            commit(types.SET_USER_INFO_DATA, Obj);
            return false;
        }
        //处理异步请求的
        return new Promise((resolve) => {
            axios.post(axios.defaults.baseURL + '?m=api&c=user&a=userInfo', { 'token': localStorage.getItem("token") }).then(function (res) {
                commit(types.SET_USER_INFO_DATA, res.data);
                //   resolve(res);
            });
            // .catch(error => {
            //     commit(types.SET_USER_INFO_DATA, {status:-1, err:'获取用户信息失败,请刷新页面重新获取'});
            // });
        })
    },
    SET_ACCOUNT_DATA: ({ commit }, { Obj }) => {
        if (!localStorage.getItem("token") || localStorage.getItem("token") && JSON.stringify(Obj) != "{}") {
            commit(types.SET_ACCOUNT_DATA, Obj);
            return false;
        }
        //处理异步请求的
        return new Promise((resolve) => {
            axios.post(axios.defaults.baseURL + '?m=api&c=account&a=index', { 'token': localStorage.getItem("token") }).then(function (res) {
                commit(types.SET_ACCOUNT_DATA, res);
                //   resolve(res);
            })
        })
    },

    SET_BANKED_DATA: ({ commit }) => {
        return new Promise((resolve) => {
            axios.post(axios.defaults.baseURL + '?m=api&c=bank&a=getUserBank', { 'token': localStorage.getItem("token") }).then(function (res) {
                commit(types.SET_BANKED_DATA, res);
            })
        })
    },

    SET_PLATFORM_CONFIG: ({ commit }, { Obj }) => {
        return new Promise((resolve) => {
            axios.post(axios.defaults.baseURL + '?m=api&c=app&a=getPlatformConfig').then(function (res) {
                commit(types.SET_PLATFORM_CONFIG, res.data);
                //   resolve(res);
            });
        })
    },

    SET_RECHARGE_DATA: ({//充值数据
        commit
    }, { Obj }) => {
        commit(types.SET_RECHARGE_DATA, Obj);
    },

}
