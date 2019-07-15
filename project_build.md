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

