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

