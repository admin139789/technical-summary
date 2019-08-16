
<template>
	<div class="downloadApp" :style=" 
     {backgroundImage:'url('+mobileImg+')'}">
	    <div class='visitBtn'>
	     	<p class='commonBtn' @click='pidRegister'  v-show='showBtn'>
	     		点击试玩
	     	</p>
	     	<p class='downclick commonBtn' @click='showIOSh5' v-show='showBtn'>
	     		<a :href="deviceApk" ref='AforDevice'>
	     			请点击下载App
	     		</a>
	     	</p>
		</div>
		<!-- 测试 -->
		<!-- <p style='width: 100px;height: 100px;background-color:red;color:#000'>{{isWeinXin}}{{isQQ}}</p> -->
	    <!-- ios  显示页面 -->
	    <div class="modal" id="app-tutorial-modal" v-if='showIOS'>
			<div class="modal-inner">
				<div class="modal-header">
					<h2 class="modal-title">IOS安装提醒</h2>
					<a class="modal-close" href="javascript:void(0);" @click='closeIOS'>关闭</a>
				</div>
				<div class="modal-body" >
					<p style="text-indent: 8mm;">官方搜集了一些已更新iOS 9用户出现的典型问题，下述一一解答：</p>
					<p style="text-indent: 8mm;">部分用户无法正常启动APP应用(如下图)</p>
					<p style="text-align: center;">
						<!-- <img src="/statics/web/himg/q1.png" alt=""> -->
						<img class="modal-img1" :src="iosTips1">
					</p>
					<p>STEP 1</p>
					<p style="text-indent: 8mm;">选择【设置】-【通用】-【设备管理】</p>
					<p style="text-align: center;">
						<!-- <img src="/statics/web/himg/q2.png" alt="">
	                <img src="/statics/web/himg/q3.png" alt=""> -->
						<img class="modal-img2" :src="iosTips2">
						<img class="modal-img3" :src="iosTips3">
					</p>
					<p>STEP 2</p>
					<p style="text-indent: 8mm;">选择【WHT HIGH TECH COMPANY INC.】-点击【信任 WHT HIGH TECH COMPANY INC.】</p>
					<p style="text-align: center;">
						<!-- <img src="/statics/web/himg/q4.png" alt="">
	                <img src="/statics/web/himg/q5.png" alt=""> -->
						<img class="modal-img4" :src="iosTips4">
						<img class="modal-img5" :src="iosTips5">
					</p>
					<p>STEP 3</p>
					<p style="text-indent: 8mm;">选择【信任】!</p>
					<p style="text-align: center;">
						<!-- <img src="/statics/web/himg/q6.png" alt=""> -->
						<img class="modal-img6" :src="iosTips6">
					</p>
					<p>OK，完成上述步骤，就可以开始体验手机APP版啦!</p>
				</div>
			</div>
		</div>
		<!-- qq/weixin 显示页面 -->
		<div class='guidePage' v-if='isWeinXin|| isQQ'>
			<img src="../../assets/img/guidepage.png" alt="">			
		</div>
	</div>
	
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default{
	data(){
		return{
			mobileImg:'',
			deviceApk:'javascript:void(0)',
			iosTips1:'',
			iosTips2:'',
			iosTips3:'',
			iosTips4:'',
			iosTips5:'',
			iosTips6:'',
			showIOS:false,
			isAndroid:false,
			isIOS:false,
			isWeinXin:false,
			isQQ:false,
			showBtn:true,
			introductionid:'',
      		introduction: "", //介绍人的信息
      		tgParams:'',//pid对应的用户名
		}
	},
	mounted(){
		this.isWeinXin=false;
		this.isQQ=false;
		//获取到推荐人
		this.tgParams= this.GetQueryString("pidUserName"); 
		console.log('this.tgParams123456789',this.tgParams)
		// 判断设备
		this.mobileDevice();
		console.log('ios||android ====status','isAndroid',this.isAndroid,'isIOS',this.isIOS)
		//请求相关下载参数
		console.log('this.urlRequest','/',this.urlRequest.substr('/index.php'))
		this.$axios
        .post(this.urlRequest + "?m=api&c=sysconf&a=down_conf")
        .then(res => {
          if(res.status==0){
          	let {ios_ver,android_ver,down_conf:{mobile_pic,ios_tips_1,ios_tips_2,ios_tips_3,ios_tips_4,ios_tips_5,ios_tips_6}}=res;
            //app下载背景图
            var subIndex = this.urlRequest.indexOf('/index.php');
            var mobileUrl = this.urlRequest.substring(0,subIndex);
            this.mobileImg=mobileUrl+mobile_pic;
            this.iosTips1=mobileUrl+ios_tips_1;
			this.iosTips2=mobileUrl+ios_tips_2;
			this.iosTips3=mobileUrl+ios_tips_3;
			this.iosTips4=mobileUrl+ios_tips_4;
			this.iosTips5=mobileUrl+ios_tips_5;
			this.iosTips6=mobileUrl+ios_tips_6;
			console.log(666,ios_ver.url,mobileUrl+android_ver.url)
			if(navigator.userAgent.match(/iPhone/i)){
				console.log('ios设备');
				this.deviceApk=ios_ver.url;
			}
			else if(navigator.userAgent.match(/Android/i)){
				console.log('android设备');
				this.deviceApk=mobileUrl+android_ver.url;
			}
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
	methods:{
		//获取页面传送过来的参数
		GetQueryString(name) {
			console.log('window.location.hash.substring(2)',window.location.hash.substring(2))
			var query = window.location.hash.substring(2);
			console.log(query,'query')
			if(query.indexOf('?')!=-1){
				var vars = query.split("?")[1].split("&");
				console.log(vars);
				for (var i = 0; i < vars.length; i++) {
					var pair = vars[i].split("=");
					if (pair[0] == name) {
						return pair[1];
					}
				}
				return false;

			}

			
		},
		// 判断设备
		mobileDevice(){
			// android / iphone
			if(navigator.userAgent.match(/iPhone/i)){
				console.log('ios设备');
				this.isIOS=true;
				this.isWeinXin=false;
			}
			if(navigator.userAgent.match(/Android/i)){
				console.log('android设备');
				this.isAndroid=true;
				this.isWeinXin=false;
			}
			// weixin
			if(navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger"){
				console.log('微信访问');
				this.isWeinXin=true;
				this.showBtn=false;
			}
			else{
				this.isWeinXin=false;
			}
			// qq
			if(navigator.userAgent.toLowerCase().match(/QQ/i) == "qq"){
				console.log('qq访问');
				this.isQQ=true;
				this.showBtn=false;
			}
			else{
				this.isQQ=false;
			}
			// qq浏览器
			if(navigator.userAgent.indexOf('MQQBrowser') > -1){
				console.log('qq浏览器访问');
				this.showBtn=true;
				this.isQQ=false;
			}
		},
		showIOSh5(){
			console.log('显示ios 证书信任')
			if(this.isIOS){
				this.showIOS=true;
			}
		},
		closeIOS(){
			this.showIOS=false;
		},
		...mapActions(["SET_USER_INFO_DATA", "SET_ACCOUNT_DATA"]),
		//点击。游客登陆
		// guest_login() {
		// 	let params = {
		// 		flag: "4",
		// 		code: "123",
		// 		flag:localStorage.getItem('flag'),
		// 		// referrer: this.introduction || ""
		// 	};
		// 	this.$vux.loading.show();
		// 	this.$axios
		// 	.post(this.urlRequest + "?m=api&c=user&a=registerMachine", params)
		// 	.then(res => {
		// 		this.$vux.loading.hide();

		// 		if (res.status == 0) {
		// 			localStorage.setItem("token", res.token);
		// 			localStorage.setItem("isUser", false);

		// 			this.$axios
		// 			.post(this.urlRequest + "?m=api&c=user&a=userInfo", {
		// 				token: localStorage.getItem("token")
		// 			})
		// 			.then(res => {
		// 				this.SET_USER_INFO_DATA({
		// 					Obj: res.data
		// 				});
		// 			});
		// 			this.SET_ACCOUNT_DATA({
		// 				Obj: {}
		// 			});
		// 			this.$vux.toast.show({
		// 				text: "登陆成功"
		// 			});
		// 			this.$router.push({
		// 				//跳转到首页
		// 				name: "home",
		// 				query:{
		// 					pidName:this.tgParams
		// 				}
		// 			});
		// 		} else {
		// 			if (res.ret_msg && res.ret_msg != "") {
		// 				this.$vux.toast.show({
		// 					text: res.ret_msg
		// 				});
		// 			}
		// 		}
		// 	})
		// 	.catch(error => {
		// 		this.$vux.toast.show({
		// 			text: "请求超时"
		// 		});
		// 	});
		// },
		//点击跳转注册页面
		pidRegister(){
			//获取pid名称
			this.getPidName("pidUserName");
			//
			this.$router.push({
				name: 'register',
				// query:{
				// 	pidName:this.tgParams
				// }
			})
		},
		// 获取pid 对应用户名
		getPidName(name){
			var query = window.location.hash.substring(2);
			console.log('query==================',query);
			if(query.indexOf('?')!=-1){
				var vars = query.split("?")[1].split("&");
				console.log(vars);
				for (var i = 0; i < vars.length; i++) {
					var pair = vars[i].split("=");
					if (pair[0] == name) {
						localStorage.setItem('pidName',pair[1])
						return pair[1];
					}
				}
				localStorage.setItem('pidName','')
				return false;
			}
			else{
				localStorage.setItem('pidName','')
			}
		},

	},
}
</script>
<style sccoped>
	.downloadApp{
		width: 100%;
		height: 100%;
		background-size: 100% 100%;
	}
	.visitBtn{
		width: 160px;
		position:fixed;
		left: 50%;
		bottom: 50px;
		transform: translateX(-50%);
	}
	.downclick,.commonBtn {
		background-color: #C82834;		
		height: 30px;
		border-radius:8px;
		color:#fff;
		margin:10px 0;
		text-align: center;
		line-height: 30px;	
		font-size: 16px;	
	}
	.downclick a{
		display:block;
		height: 30px;
		color:#fff;
		font-size: 16px;
	}
	/*ios提醒安装页面*/
	.modal{
		position:absolute;
		left: 0px;
		top: 0px;
		overflow:auto;
		width: 100%;
		height: 100%;
		z-index:10000;
		background-color:#fff;
		-webkit-overflow-scrolling: touch;
	}
	.modal img{
		width: 100%;
	}
	.modal-inner {
		margin: 20px auto;
		max-width: 480px;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: rgb(255, 255, 255);
		border-radius: 4px;
		box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.8);
	}

	.modal-header {
		position: relative;
		height: 40px;
		padding: 4px;
		border-bottom: 1px solid rgb(221, 221, 221);
		box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.1);
	}

	.modal-title {
		margin: 0;
		font-weight: normal;
		font-size: 14px;
		padding: 0px 8px;
		line-height: 32px;
	}

	.modal-close {
		position: absolute;
		top: 8px;
		right: 8px;
		color: rgb(153, 153, 153);
		width: 48px;
		height: 24px;
		line-height: 24px;
		font-size: 12px;
		text-align: center;
		background-color: rgb(238, 238, 238);
		border-radius: 2px;
	}
	.modal-close:hover {
		color: rgb(255, 255, 255);
		background-color: rgb(204, 0, 0);
	}
	.modal-body {
		padding: 10px;
		overflow: auto;
		height: 100%;
	}
	/*weixin/qq 引导页*/
	.guidePage{
		width: 100%;
		height: 100%;
		position:absolute;
		left: 0px;
		top: 0px;
		z-index:999;
		background:rgba(0,0,0,0.6);
	}
	.guidePage img{
		width: 100%;
		margin-top: 20px;
		/*height: 100%;*/
	}
</style>