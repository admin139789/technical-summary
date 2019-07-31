# The project related

#### 1.项目目录文件结构

（1）vue使用最新是vue脚手架

（2）react 可以去使用dva脚手架

├─src
│  ├─assets（存放静态资源）
│  ├─common（存放一些公共内容）
│  ├─components（多个组件的文件夹，每个组件文件夹又有多个小组件）
│  ├─router（路由）
│  └─store（vuex）
└─static（存放经常修改的资源）

#### 2.assets / static  区别





#### 3.computed

状态需要自己动态变化的时候，使用computed

return返回值当属性使用，动态监听变化

```
// background就是一个属性（动态require  可以用这个）
<img :src='_imgUrl'/>
computed: {
  _imgUrl () {
    return require('./bgs/' + this.id + '.jpg')
  }
}
```

![](F:\technical_summary\img\commputed.PNG)

// 用在input里，  get 和 set

#### 4.transitionName(路由切换滑动效果)

```
//1.html
    <div id="app" ref="app">
        <transition :name="transitionName">
          <router-view class="app_view"></router-view>
        </transition>
     </div>
//2.js
	data() {
        return {
          transitionName: "",
          transList: {
            "/home": 1,
            "/winPrice": 2,
            "/discover": 3,
            "/mine": 4
          }
        }
  	},
  	watch:{
  		$route(to, from) {
              if (this.transList[to.path] && this.transList[from.path]) {
                if (this.transList[to.path] > this.transList[from.path]) {
                  this.transitionName = "app-from-right";
                } else {
                  this.transitionName = "app-from-left";
                }
              } else {
                this.transitionName = "";
              }
         }
  	}
//3.css
	<style scoped>
        .app_view {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
        }

        .app-from-left-enter {
          opacity: 0;
          transform: translate(-100%, 0);
        }

        .app-from-right-enter {
          opacity: 0;
          transform: translate(100%, 0);
        }

        .app-from-left-enter-active,
        .app-from-right-enter-active {
          transition: all 0.1s cubic-bezier(0.55, 0, 0.1, 1);
        }

        .app-from-left-leave-active,
        .app-from-right-leave-active {
          transition: all 0.1s cubic-bezier(0.55, 0, 0.1, 1);;
        }

        .app-from-left-leave-to,
        .app-from-right-leave-to {
          opacity: 0;
          /*transform: translate(-100% 0);*/
        }
	</style>
```

#### 5.watch  监听

<https://blog.csdn.net/Amanda_wmy/article/details/83749560>

（1）handler：一般对象用这个

（2）deep：true ;  ： 深度监听，需要用在属性是对象的时候，里面的键值对都加上watcher监听器

（3）immediate：true ;  :当父组件向子组件动态传值时，子组件props首次获取到父组件传来的默认值时，也需要执行函数，此时就需要将immediate设为true,若为false的话，则为使用data里面参数默认设置的值，当有参数改变的时候才会执行handler函数

#### 6.keep-alive（动态组件以及动态路由）

<https://blog.csdn.net/buddha_itxiong/article/details/81069087>

```
//动态组件
<keep-alive include="test-keep-alive">
  <!-- 将缓存name为test-keep-alive的组件 -->
  <component></component>
</keep-alive>
 
<keep-alive include="a,b">
  <!-- 将缓存name为a或者b的组件，结合动态组件使用 -->
  <component :is="view"></component>
</keep-alive>
 
<!-- 使用正则表达式，需使用v-bind -->
<keep-alive :include="/a|b/">
  <component :is="view"></component>
</keep-alive>
 
<!-- 动态判断 -->
<keep-alive :include="includedComponents">
  <router-view></router-view>
</keep-alive>
 
<keep-alive exclude="test-keep-alive">
  <!-- 将不缓存name为test-keep-alive的组件 -->
  <component></component>
</keep-alive>

//data
data(){
	return{
		view:'a'
	}
}
点击切换view的值
```

```
//动态路由
1.router里的index.js
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home ,
      meta: {
        keepAlive: true // 需要被缓存
      }
    }
  ]
 })
 
 2.App.vue
 <template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
 
<script>
  export default {
    name: 'App'
  }
</script>
```

```
 //!!!
 activated:function(){
    window.addEventListener('scroll',this.scrollChange);//当从缓存中调取数据时触发该生命周期函数
 },
 deactivated:function(){
     window.removeEventListener('scroll',this.scrollChange);
 }
```

#### 7.main.js

存放全局（需要共用）的东西！！！

#### 8.axios（封装在  /src/assets/js/http.js  里面）

axios参数配置

<https://blog.csdn.net/itkingone/article/details/81083597>

axios（项目实战需要用到）

<https://blog.csdn.net/qq_33270001/article/details/82800674>

跨域

<https://blog.csdn.net/u012369271/article/details/72848102>

##### axios二次封装！！！！！！！！！（重点看）

<https://blog.csdn.net/qq_30669833/article/details/81701588>

axios请求超时，配置一些东西

<https://blog.csdn.net/qq_41772754/article/details/88367039>

<https://www.cnblogs.com/hcxy/p/10052465.html>

```
/***
 * Created by Simple on 2018/1/14 0014.
 * Http请求控制器模块
 */
 
import axios from 'axios';
import store from '@/store/index';
import types from '@/store/types';
import router from '@/router/index';
import { Loading, Message } from 'element-ui';
 
// axios 配置
axios.defaults.timeout = 15000;
// axios.defaults.baseURL = 'http://api.xxx.com/v2/接口地址';
 
// 配置通用请求动画
let loading = null;
 
axios.interceptors.request.use(config => {
    console.time('ajax请求耗时');
    if (store.state.users.token) {
        config.headers.Authorization = store.getters.token;
    }
 
    loading = Loading.service({
        lock: true,
        text: '拼命加载中...',
        background: 'rgba(255, 255, 255, .6)'
    });
 
    return config;
}, err => {
    loading.close();
    return Promise.reject(err);
});
 
// http response 拦截器
axios.interceptors.response.use(response => {
    if (response && response.data) {
        switch (response.data.code) {
        case '401':
                // 401 清除token信息并跳转到登录页面
            store.commit(types.CLEAR_USER_TOKEN);
            Message.error({
                message: '身份过期，请重新登录'
            });
 
            setTimeout(() => {
                router.replace({
                    path: '/login',
                    name: 'Login',
                    query: { redirect: router.currentRoute.fullPath }
                });
            }, 1200);
            break;
                //无权限
        case '403':
            router.replace({
                name: 'noAuth',
                query: { redirect: router.currentRoute.fullPath }
            });
        }
    }
    loading.close();
    console.timeEnd('ajax请求耗时');
    return response;
}, error => {
    if (error.response) {
        switch (error.response.status) {
        case '401':
                // 401 清除token信息并跳转到登录页面
            store.commit(types.CLEAR_USER_TOKEN);
            router.replace({
                name: 'Login',
                query: { redirect: router.currentRoute.fullPath }
            });
            break;
 
            //无权限
        case '403':
            router.replace({
                name: 'noAuth',
                query: { redirect: router.currentRoute.fullPath }
            });
            break;
        }
    }
    loading.close();
    Message.error({
        message: '哎呀~ (ಥ﹏ಥ)网络又开小差了,请稍后刷新重试!'
    });
    return Promise.reject(error.response.data);
});
 
export default axios;
```

#### 9.加密，解密

token的值与后端协商好

```
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
```

#### 10.拆组件！！！

单独一个页面作为一个文件夹，有一个主要的页面vue，进行拆分多个组件，每个组件单独建立一个文件（方便维护）

#### 11.组件封装（复用 ）！！！

<https://www.cnblogs.com/lanchar/p/6894167.html>

```
//2.eg: 封装一个  slid  组件

```

//1.组件的目录结构

![1003652-20170523142230570-875831353](F:\technical_summary\img\1003652-20170523142230570-875831353.png)

//2.代码上面

// 3.  在index.js 注册该组件，然后暴露出来

![](F:\technical_summary\img\1003652-20170523143329851-457728350.png)

//4.在main.js

```
import sjld from './components/sjld/index.js'

Vue.use(sjld);
```

//5.项目当中任意使用

```
<sjld :citys="citys" :sheng="sheng" @change="change"></sjld>

citys ,cheng 对应组件中 props 

chang 对应组件中$emit的方法
```

#### 12.rem ！！！

```
//  index.html 引入


		<!-- 自动计算根字体大小的脚本--> 
		<script> 
			
            //安卓的输入法虚拟键盘会影响body的高度，所以在加载时，
            //将body的原本高度给固定住
            document.body.style.height = window.innerHeight + "px";
            /*动态改变根元素字体大小*/
            function recalc() {
            var clientWidth = document.documentElement.clientWidth;
            if(!clientWidth) return;
            document.documentElement.style.fontSize = 40 * (clientWidth / 750) + 'px';
            // 字体大小   = 1个rem单位表示多少个像素（设备的宽度   /设计宽度）
            }

            function initRecalc() {
            recalc();
            var resizeEvt = 'osrientationchange' in window ? 'orientationchange' :       			'resize';
            if(!document.addEventListener) return;
            window.addEventListener(resizeEvt, recalc, false);
            document.addEventListener('DOMContentLoaded', recalc, false);
            }
            initRecalc();
			
		</script>
```

#### 13.vue proxy  代理问题

##### <https://www.cnblogs.com/ldlx-mars/p/7816316.html>

<https://www.jb51.net/article/144028.htm>

#### 14.destory销毁问题

<https://www.cnblogs.com/woniubushinide/p/9282560.html>

![](F:\technical_summary\img\setTimeout.png)

```
    //销毁定时器
    destroySwipers() {
        if (this.swiper1) {
        this.swiper1.destroy();
        this.swiper1 = null;
        }
        if (this.swiper2) {
        this.swiper2.destroy();
        this.swiper2 = null;
        }
        if (this.swiper3) {
        this.swiper3.destroy();
        this.swiper3 = null;
        }
    }
    destroyed() {
        this.destroySwipers();
  	}
```

这样就不用每次都写this.timer1=null;this.timer2=null;this.timer3=null............................................

#### 15.上拉刷新，下拉加载更多

```
<template>
  <div class="priceresult">
    <main>
      <div class="toloadmore" stryle='height:100%' ref='toloadmore'>
        <scroller use-pullup :pullup-config="pullupDefaultConfig" @on-pullup-			         loading="loadMore"
        use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-        				loading="refresh"  
        lock-x ref="scrollerBottom" height="-48"          					 	 	 			:style='{display:listdata.length!=0?"block":"none"}'
        >
          <div class='scrollWrapper'  ref='scrollwrapper'>
            <ul class="taskul wrapper" ref='taskul'>
            <!-- 数据展示 -->
              <li
                v-for="(item,idx) in listdata"
                :key="idx"
                :class="{caiheight:name.indexOf('六合彩')!=-1,liData:true}"
                style='height: 70px;'
              > 
              </li>
            </ul>
          </div>
        </scroller>
      </div>
    </main>
  </div>
</template>
<script>
import { Scroller,XHeader } from "vux";
const pulldownDefaultConfig = {
   content: '下拉刷新',
   height: 40,
   autoRefresh: false,
   downContent: '下拉刷新',
   upContent: '释放后刷新',
   loadingContent: '正在刷新...',
   clsPrefix: 'xs-plugin-pulldown-'
   };
   const pullupDefaultConfig = {
   content: '上拉加载更多',
   pullUpHeight: 60,
   height: 40,
   autoRefresh: false,
   downContent: '释放后加载',
   upContent: '上拉加载更多',
   loadingContent: '加载中...',
   clsPrefix: 'xs-plugin-pullup-'
 };
export default {
  components: {
    Scroller
  },
  props: ["par"],
  data() {
    return {
      name: "",
      type:'',
      listdata: [],
      pagenum: 1,
      allLoaded: false, //数据是否加载完毕
      bottomStatus: "", //底部上拉加载状态
      wrapperHeight: 0, //容器高度
      topStatus: "", //顶部下拉加载状态
      page:1,
      list_length: "",
      pullupDefaultConfig: pullupDefaultConfig,
      pulldownDefaultConfig: pulldownDefaultConfig
    };
  },
  created() {
    // 进入页面初始化
    this.datainit();
  }
  methods: {
  	// 下拉刷新
    refresh() {
      this.pagenum = 1;
      this.datainit();
    },
    //上拉加载更多
    loadMore() {
      this.pagenum += 1;
      this.datainit();
    },
    // 数据请求
    datainit() {
      let type = this.$route.query.lottery_type;
      var date_res = this.formatDate(new Date());
      var params = {
        token: localStorage.getItem("token"),
        page: this.pagenum,
        lottery_type: type,
        date: date_res
      };

      this.$Indicator.open();

      this.$axios
        .post("/index.php/index.php?m=api&c=openAward&a=dataList", params)
        .then(res => {
          if (res.status == 0) {
            this.$Indicator.close();
            if (this.pagenum == 1) {
              let { list } = res;
              this.list_length = list.length;
              if (this.listdata.length <= this.list_length) {
                this.listdata = list;
              }
              this.$refs.scrollerBottom.enablePullup()
              this.$refs.scrollerBottom.donePulldown()

              this.handleTopChange("loadingEnd"); //数据加载完毕 修改状态码
            } 
            /*******************pagenum >1上拉加载******************************/
            else {
              let { list } = res;
              this.listdata = this.listdata.concat(list);
              this.handleBottomChange("loadingEnd"); //数据加载完毕 修改状态码;
              if (list.length < this.list_length) {
                this.allLoaded = true; //模拟数据加载完毕 禁用上拉加载
                this.$Toast("没有更多了！", "icon_fail");
                this.$refs.scrollerBottom.disablePullup();
              }
              this.$refs.scrollerBottom.donePullup()
            }            
          } else {
            this.$Toast("请求失败");
          }
          // 初始化获取节点(ref)
          this.getContentHeight()
        })
        .catch(err => {
          console.log(err);
          this.$Toast("请求有误");
        });
    },
    //初始化获取内容高度
    getContentHeight(){
      // 方法1
      this.$nextTick(() => {
        var scrollWrapper =document.querySelector('.scrollWrapper')
        var xsPluginPullupContainer =document.querySelector('.xs-plugin-pullup- 		 	  	 container')
        if(xsPluginPullupContainer){
          if(scrollWrapper.offsetHeight>document.documentElement.clientHeight){
            xsPluginPullupContainer.style.display='block';
          }
          else{
            xsPluginPullupContainer.style.display='none';
          }
        }  
      })
      // 方法2
      // setTimeout(()=>{
      //   var liData =document.querySelectorAll('li')
      // },2000)
    }
  }
};
</script>
```

#### 16.VUEX（看官网）

<https://vuex.vuejs.org/zh/>

<https://blog.csdn.net/wopelo/article/details/80285167>

```
//  promise
请求接口完之后，成功之后需要手动写入  resolve（res）函数 ,然后再使用 then的方法 ，通过resolve传参传到then里面接收，然后进行一系列的操作
```

```
// 映射
1.先引入
import { mapGetters, mapActions ,mapMutions} from "vuex"
2.映射到computed中
computed: {
    ...mapGetters([
      "roomData",
      "userInfo",
      "accountData",
      "serTime",
      "lotRstData"
    ]),
    ...mapActions([/*解构*/ ]),
    ...mapMutions([/*解构*/ ]),
}
```

```
//  mutations
this.$store.commit()

1.修改state的值
	（1）mutation的方法()
	setRoomData(state, payload) {
        state.roomData = payload
    }
    （2）修改对象里面的值
    var obj = this.roomData
    obj.show_hezhi=this.zon
    this.$store.commit('setRoomData',obj)
    或者
    this.$store.state.roomData = { ...state.roomData,show_hezhi:this.zon }
    或者
    Vue.set(roomData, 'show_hezhi'：this.zon),
```

```
// actions
this.$store.dispatch()
1.actions.js
SET_USER_INFO_DATA: ({ commit }, { Obj }) => {
	
    if (!localStorage.getItem("token") || localStorage.getItem("token") && 		   			JSON.stringify(Obj) != "{}") {
            commit(types.SET_USER_INFO_DATA, Obj);
            return false;
        }
        //处理异步请求的
        return new Promise((resolve) => {
            axios.post(axios.defaults.baseURL + '?m=api&c=user&a=userInfo', { 'token': 				localStorage.getItem("token") }).then(function (res) {
                commit(types.SET_USER_INFO_DATA, res.data);
                //一定要执行成功的回调！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
                  resolve(res);
            })
            .catch(error => {
                commit(types.SET_USER_INFO_DATA, {status:-1, err:'获取用户信息失败,请刷新页面  				  重新获取'});
            });
        })
    },
 
2.调用
返回promise ===> promise.then
(变量a也是promise对象!!!)var a = this.$store.dispatch('SET_USER_INFO_DATA').then(res=>{
	console.log('处理promise对象返回的结果111111111111111',res)
})
.catch(function(error){
	console.log(error)
});


```

```
action  异步变同步
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }，
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

```
// 假设 getData() 和 getOtherData() 返回的是 Promise

actions: {
  async actionA ({ commit }/context) {
    context.commit/(解构)commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

action中的context

![](F:\technical_summary\img\action.PNG)

##### vuex 项目结构处理

<https://vuex.vuejs.org/zh/guide/structure.html>

#### 17.移动端调试工具

先下载插件再引入代码 

```
import VConsole from 'vconsole'
var vConsole = new VConsole();
```

