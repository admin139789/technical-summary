import  Plugin from '../../components/plugin.vue'

export default {
  install (Vue,options={}) {
    const VuePlugin = Vue.extend(Plugin)
    let toastPlugin = null
    function $popupPlugin (params) {
      return new Promise(resolve => {
        if (!toastPlugin) {
          toastPlugin = new VuePlugin()
          // 挂载(缺一不可)
          toastPlugin.$mount()
          document.querySelector( options.container ||'body').appendChild(toastPlugin.$el)
        }
        toastPlugin.showTheNotice(params)
        resolve()
      })
    }

    Vue.prototype.$popupPlugin = $popupPlugin
  }
}
