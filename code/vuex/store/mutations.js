import * as types from './types'
import getters from './getters'
import state from './state'

const mutations = {

    [types.NAV_SHOW](state) {
        state.navShow = true;
    },
    [types.NAV_HIDE](state) {
        state.navShow = false;
    },

    [types.SET_ISLOGIN](state, boolean) {
        state.isLogin = boolean;
    },

    [types.SET_SERVICE](state, String) {
        state.service = String
    },

    [types.SET_BANKED_DATA](state, Obj) {
        state.bankedData = Obj
        console.log(Obj, 'bankedData')
    },

    [types.SET_USER_INFO_DATA](state, Obj) {
        state.userInfo = Obj
        console.log(Obj, 'userInfo')
    },
    
    [types.SET_ACCOUNT_DATA](state, Obj) {
        state.accountData = Obj
    },
    setAccountData(state, Obj) {
        state.accountData = Obj
    },
    setRoomData(state, Obj) {
        state.roomData = Obj
    },
    setSerTime(state, Obj) {
        state.serTime = Obj
    },
    setLotRstData(state, Obj) {
        state.lotRstData = Obj
    },
    setNewRstData(state, Obj) {
        state.newRstData = Obj
    },
    setcacheid(state, _id) {
        state.cacheid = id;
    },

    [types.SET_RECHARGE_DATA](state, Obj) {
        state.rechargeData = Obj
    },
    [types.SET_SERVER_DATA](state, Obj) {
        state.serverData = Obj
    },

    setSignObj(state, Obj) {
        state.signObj = Obj
    },

    [types.SET_PLATFORM_CONFIG](state, Obj) {
        state.platformConfig = Obj
        // console.log(Obj, 'platformConfig')
    },

    // 轮播图对象
    setBannerObj(state, Obj){
        state.bannerArr = Obj

    },
    // 中将和值
    sethezhiObj(state, Obj){
        state.roomData.show_hezhi = Obj
    },

    setHeaderFooter(state, Obj) {
      state.httpRequestData.getHeaderFooter = Obj;
    },

    setAIndex(state, Obj) {
      state.httpRequestData.aIndex = Obj;
    },

    setOpenAward(state, Obj) {
      state.httpRequestData.openAward = Obj;
    },

};
export default {
    state,
    mutations,
    getters
}
