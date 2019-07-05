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
computed: {
  background () {
    return require('./bgs/' + this.id + '.jpg')
  }
}
```

