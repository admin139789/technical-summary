import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import mutations from './mutations'
import actions from './actions'


export default new Vuex.Store({
	// 包含mutation ,state,getters
  ...mutations,
	actions
});
