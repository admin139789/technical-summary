<template>
  <div class="accountInfo">
    <div class="headerWrap">
      <x-header class="header" :left-options="{backText: ''}">我要分享</x-header>
    </div>
    <!--切换按钮  -->
    <div id='box' >
      <!-- <div id="tab" :class="tab_choose" v-if='showNum>0'>
          <div :class="{'_red':true,'redleft':index==1,'redright':index==2}"></div>
          <span class="span1 _span" @click="take_changes(1)">邀请好友</span>
          <span class="span2 _span" @click="take_changes(2)" >直接开户</span>
      </div> -->
    </div>
    <!-- 二维码图片1 '_show1':index==1,'_show11':index==2-->
    <div :class="{erweima1:true,'comerweima':true}"  v-if='showNum>0'>
      <img src="~x&x/images/other/square.png" alt="" class='_img'>
      <qrcode :value="JumpUrl" type="img" class="erweima" :size="screenwidth/2.5"></qrcode>
      <div class="allbtn">
        <button @click="copy" :data-clipboard-text="JumpUrl" class="tag-read">复制链接</button>
        <button class="tag-read" @click.stop='saveqrcode'>保存图片</button>
      </div>    

    </div>
    <!-- 二维码图片2 '_show2':index==2,'_show22':showNum>0&&index==1-->
    <div  :class="{erweima2:true,'comerweima':true}" v-if='showNum==0'>
      <img src="~x&x/images/other/square.png" alt="" class='_img'>
      <qrcode :value="downUrl" type="img" class="erweima" :size="screenwidth/2.5"></qrcode>
      <div class="allbtn">
        <button @click="copy" :data-clipboard-text="downUrl" class="tag-read">复制链接</button>
        <button class="tag-read" @click.stop='saveqrcode'>保存图片</button>
      </div>      
    </div>
    <!-- 文字显示区域 -->
    <div class='word'>
      <img src="~x&x/images/other/word.png" alt="">
    </div>
  
  </div>
</template>

<script>
import Clipboard from "clipboard";
import Qrcode from "vux/src/components/qrcode/index.vue";
import { XHeader } from "vux";

export default {
  data() {
    return {
      JumpUrl: "", //复制的二维码路径
      downUrl: "", //复制的二维码路径
      screenwidth: 320,
      tab_choose: "left1", //默认为左一
      isok1:false,
      isok2:true,
      index: 1,
      generalize_obj:{
        mode: 'personal',
        role_type: 1
      },
      showNum:0,
    };
  },
  computed:{
    // 是否为推广员标识
    // tuiGuangStatus(){
    //   if(this.generalize_obj.mode=='personal'){
    //     return true;
    //   }
    //   else if(this.generalize_obj.mode=='sales'&&this.generalize_obj.role_type==2){
    //     return true;
    //   }
    //   else{
    //     return false;
    //   }
    // }
  },
  components: {
    Qrcode,
    XHeader
  },
  mounted() {
    this.screenwidth = document.body.clientWidth;
    this.getshare();
    // 获取代理身份
    this.generalize_obj=JSON.parse(localStorage.getItem("generalize_obj"));
    console.log(this.generalize_obj,'获取路由参数params');
  },
  methods: {
    downloadIamge(selector, name) {
      var image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height

        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        var url = canvas.toDataURL('image/png')

        // 生成一个a元素
        var a = document.createElement('a')
        // 创建一个单击事件
        var event = new MouseEvent('click')

        // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
        a.download = name || '下载图片名称'
        // 将生成的URL设置为a.href属性
        a.href = url

        // 触发a的单击事件
        a.dispatchEvent(event)
      }

      // image.src = document.querySelector(selector).src
      image.src = selector
    },
    //保存二维码
    saveqrcode() {
      var imgSrc=document.querySelector('.erweima img').src;
      let that = this;
      if(window.isIosApp || window.isAndroidApp) {
        Wechat.savePic(function(succ){
          if(succ) {
            that.$vux.toast.show({
              text: "保存成功"
            });
          }
        }, function(reason){
          that.$vux.toast.show({
            text: reason,
          });
        });
        return;
      }
      this.downloadIamge(imgSrc, "二维码");
    },
    //切换显示
    take_changes(_index) {
      switch (_index) {
        case 1:
          this.tab_choose = "left1";
          this.index = 1;
          
          break;
        case 2:
          this.tab_choose = "right1";
          this.index = 2;
          // this.isok1=!this.isok1;
          // this.isok2=!this.isok2
          break;
      }
      // this.isok1=!this.isok1;
      // this.isok2=!this.isok2
    },
    //事件：设置密码
    getshare() {
      let _this = this;
      let params = {
        token: localStorage.getItem("token")
      };
      this.$axios
        .post(this.urlRequest + "?m=api&c=user&a=agentSharing", params)
        .then(res => {
          if(res.status==0){
            this.JumpUrl = localStorage.getItem("imgurl") + res.JumpUrl; //下线类型
            this.downUrl = localStorage.getItem("imgurl") + '/pcmobile/index.html#/downloadApp';
            this.showNum = res.pid;
            console.log('url===========',this.JumpUrl,this.downUrl,this.showNum)
          }
          else{
            this.$vux.toast.show({
              text: "网络超时"
            });
          }
        })
        .catch(err => {
          this.$vux.toast.show({
            text: "请求有误"
          });
        });
    },
    //方法：展示弹窗
    show_toast(message, icon) {
      let _this = this;
      if (this.Toast_cache != undefined) {
        this.Toast_cache.close();
        this.Toast_cache = undefined;
      }
      this.Toast_cache = _this.$Toast({
        message: message,
        iconClass: icon,
        duration: 2000
      });
      setTimeout(() => {
        this.Toast_cache = undefined;
      }, 2000);
    },
    copy(e) {
      let vm = this;
      var clipboard = new Clipboard(".tag-read");
      clipboard.on("success", e => {
        this.$vux.toast.show({
          text: "复制成功"
        });

        clipboard.destroy();
      });
      clipboard.on("error", e => {
        clipboard.destroy();
        if (window.isIosApp) {
          console.log("jump to ios");
          Wechat.copyText(
            vm.JumpUrl,
            function(result) {
              console.log("copy result: " + result);
              vm.$vux.toast.show({
                text: "复制成功"
              });
            },
            function(reason) {
              vm.$vux.toast.show({
                text: reason
              });
            }
          );
          return;
        } else {
          vm.$vux.toast.show({
            text: "该浏览器不支持自动复制"
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.comerweima{
  position:relative;
  z-index:10;
}
._img{
  position: fixed;
  left: 50%;
  transform: translateX(-49%);
  top: 102px;
  width: 308px;
  height: 246px;  
  z-index:-1;
}
.accountInfo {
  width: 100%;
  height: 100%;
  position:relative;
  background:url('~x&x/images/other/img_my_share_bg.png') no-repeat ;
  background-size:100% 100%;
}

.info {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
.change {
  margin: 0 10px;
  box-sizing: border-box;
}
.agree {
  width: 90%;
  margin: 20px auto;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  border-radius: 20px;
  background-color: red;
}
.hide_input {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

.clock {
  width: 90%;
  position: absolute;
  left: 5%;
  top: 50%;
  transform: translateY(-60%);
}
.change {
  width: 8.2rem;
  background-color: #fff;
  height: 1.5rem;
  position: absolute;
  left: 50%;
  margin-left: -4.1rem;
  top: 50%;
  box-sizing: border-box;
  transform: translateY(-60%);
  margin-top: 0.8rem;
  border: 1px solid #333;
}
.change li {
  box-sizing: border-box;
  width: calc(100% / 6);
  float: left;
  color: #000;
  display: block;
  height: 60%;
  margin-top: 0.3rem;
  text-align: center;
  border-right: 1px solid #333;
  font-size: 3rem;
  line-height: 0.5rem;
  position: relative;
}
.change li:nth-child(6) {
  border-right: none;
}
.input_mast {
  z-index: 99;
  width: 11rem;
  margin-left: -5.5rem;
  opacity: 0;
  color: transparent;
  background-color: #333;
  text-indent: -999em; /*文本向左缩进*/
  opacity: 0;
}
.change span {
  width: 0.6rem;
  height: 0.6rem;
  background-color: #000;
  position: relative;
  border-radius: 50%;
  display: block;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.word_tip {
  width: 8.2rem;
  text-align: center;
  position: absolute;
  left: 50%;
  margin-left: -4.1rem;
  top: 50%;
  box-sizing: border-box;
  transform: translateY(-50%);
  margin-top: -0.55rem;
  font-size: 0.35rem;
}
.another_tip {
  width: 8.2rem;
  text-align: center;
  position: absolute;
  left: 50%;
  margin-left: -4.1rem;
  top: 50%;
  box-sizing: border-box;
  transform: translateY(-50%);
  margin-top: 3.25rem;
  font-size: 0.35rem;
}
.bg_share_img {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -999;
}
.erweima {
  width: 4rem;
  /*position: absolute;*/
  top: 4.5rem;
  left: 50%;
  margin-left: -2rem;
  margin:0 auto;
}
.allbtn{
  width: 5rem;
  margin:0 auto;
  height: 1rem;
  padding-left:12px;
}
.tag-read {
  /*position: absolute;*/
  display: block;
  margin:4px;
  left: 50%;
  top: 9rem;
  width: 2rem;
  height: 0.8rem;
  font-size: 0.35rem;
  border-radius: 10rem;
  background-color: rgba(255, 67, 64, 1);
  color: #fff;
  float: left;
}
.header {
  background-image: none !important;
}
</style>
<style>
.erweima img {
  width: 4rem !important;
  height: 4rem !important;
}
/*切换*/
.active {
  border-radius: 20px;
  color: #fff;
  background-color: red;
}
#tab {
  transform: none !important;
  font-size: 0.4rem;
  width: 7.0rem;
  margin: 14px auto;
  height:36px;
  border-radius:22px;
  color: red;
  box-sizing: border-box;
  position: relative;
  margin-bottom: 32px;
  background-color: #fff;
  border: 1px solid  #E23F39;
}
#tab ._span {
  position: relative;
  z-index: 200;
  display: block;
  float: left;
  line-height: 1rem;
  text-align: center;
  width: 50%;
  height: 100%;
  border-radius:20px; 
}
#tab ._red {
  display: block;
  background-color: #E23F39 ;
  width: 50%;
  height:100%;
  border-radius:20px;
  transition: all 0.3s;
  position: absolute;
  margin-left: -1px !important;
  border: 1px solid #E23F39;
  z-index:111;
  /*box-sizing:border-box;*/
  /*margin-left: -1px;*/
}
.redleft{
  left: -4px !important;
  top:0px !important;
}
.redright{
  left:4px !important;
  top:0px !important;
}
.left1 {
  transform: none;
}
.right1 {
  transform: translateX(-50%);
}
.left1 .span1 {
  color: #fff !important;
  /*left:-5px;*/
}
.left1 .span2 {
  color: #d32627 !important;
}
.right1 .span1 {
  color: #d32627 !important;
}
.left1 div {
  transform: none;
}
.right1 div {
  transform: translateX(100%);
}
.right1 .span2 {
  color: #fff !important;
  left: 8px;
}
.show1{
  display:none !important;
}
.show2{
  display:none !important;
}
.word{
  margin-top: 20px;
  height: 50px;
}
.word img{
  width: 260px ;
  height: 40px;
  display:block;
  margin:0 auto;
}
#box{
  height: 36px;
  width: 262px;
  margin:24px auto;
  border-radius: 20px;
}
._show1{
  display:block !important;
  position:relative !important;
  z-index:100 !important;
}
._show2{
  display:block !important;
  position:relative !important;
  z-index:100 !important;
}
._show11{
  display:none !important;
}
._show22{
  display:none !important;
}
</style>
