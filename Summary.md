# Summary

##### 1.watch  监听

<https://blog.csdn.net/Amanda_wmy/article/details/83749560>

（1）handler：一般对象用这个

（2）deep：true ;  ： 深度监听，需要用在属性是对象的时候，里面的键值对都加上watcher监听器

（3）immediate：true ;  :当父组件向子组件动态传值时，子组件props首次获取到父组件传来的默认值时，也需要执行函数，此时就需要将immediate设为true,若为false的话，则为使用data里面参数默认设置的值，当有参数改变的时候才会执行handler函数