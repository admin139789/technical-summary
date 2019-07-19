# Summary

##### 1.beforeDestroy()生命周期

用来切换路由/组件的时候，销毁定时器还有websocket，还有轮播图片

##### 2.使用轮播图插件，动态渲染，必须使用$nextTick方法

<https://blog.csdn.net/congboer/article/details/94039756>

##### 3.过滤器  filter

<https://blog.csdn.net/qq_24065713/article/details/84775650>

常常用来处理数值的格式

```

<div v-bind:id="rawId | formatId"></div>
filters: {
    capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
    }
}

```

##### 4.二维码

<https://blog.csdn.net/zhuswy/article/details/80267748>

```
//1.html
<div class="download-qcode">
	//一定要加上ref，才能在对应区域生成相应的二维码图片
   <div ref="qrCodeDiv">
   </div>
</div>

//2.js
<scrtpt>
    import QRCode from "qrcodejs2";
    mounted() {
        this.erweima = 'http://180.97.215.113/down.php'（跟后端拿地址）
        //一定要加上
        this.$nextTick(function() {
          this.bindQRCode(this.erweima);
        });    
    },
    methods：{
        //生成二维码图片
        bindQRCode: function(erweima_url) {
          let _this = this;
          new QRCode(this.$refs.qrCodeDiv, {
            text: erweima_url,
            width: 100,
            height: 100,
            colorDark: "#333333", //二维码颜色
            colorLight: "#ffffff", //二维码背景色
            correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
          })
        }
    }
</script>
```

##### 5.vconsole

##### <https://www.jianshu.com/p/388e31a451ea>

##### 6.上传文件

```
window.URL.createObjectURL    

可以用于在浏览器上预览本地图片或者视频，访问前先转化为相应路径（blob二进制格式）
```

```
//1.
<form  ref='currentform' id='formId'>
	<ul>
		// li加上背景图片！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
        <li>
        
        	//input 则设置opacity为0隐藏，然后显示li的背景图片！！！！！！！！！！！！！！
            <input
            type="file"
            class="upload"
            @change="addImg(idx,$event)"
            ref="inputer"
            multiple
            accept="image/png, image/jpeg, image/gif, image/jpg"
            style="opacity:0;"
            name='files[]'
            >  
            
            
            <!-- 图片渲染 -->
            <div
            class="close"
            v-show="isimgshow_arr[idx]"
            style="width:40px;height:40px;background-color:#fff"
            >
                <img
                :src="imgarr[idx]"
                alt
                width="40"
                height="40"
                :class="{imgactive:isimgshow_arr[idx]}"
                >
                <span @click="delImg(idx)">×</span>
            </div>
        </li>
	</ul>
</form>

//2.js
<script>
	data:{
		return{
			files:[0,0,0],
			imgarr: ["", "", ""],
      		isimgshow_arr: [false, false, false]
		}
	}
	methods:{
		//添加图片
		addImg（）{
			let inputDOM = this.$refs.inputer;
			 // 通过DOM取文件数据
      		this.fil = inputDOM[idx].files;
      		//转化文件路径
      		 var imgurl = window.URL.createObjectURL(this.fil[0]);
             this.$set(this.files, idx, imgurl);
             //图片展示
            for (let i = 0; i < this.imgarr.length; i++) {
                if (i == idx) {
                  this.imgarr[i] = imgurl;
                  this.isimgshow_arr[i] = true;
                } 
                else if (this.imgarr[i] == "") {
                  this.imgarr[i] = "";
                }
      		}
		}，
		//删除图片
		deleteImg（）{
			for (let i = 0; i < this.imgarr.length; i++) {
                if (i == idx) {
                  this.imgarr[i] = "";
                  this.isimgshow_arr[i] = false;
                  this.files[idx] = 0;
                  let inputDOM = this.$refs.inputer;
                  // 这一步很关键
                  inputDOM[i].value = "";
                }
            }
      		this.$forceUpdate();
		}，
	}
</script>
```

### 7.promise

<https://www.cnblogs.com/whybxy/p/7645578.html>

```
<script>
		function runAsync1(){
			var p = new Promise(function(resolve, reject){
				//做一些异步操作
				setTimeout(function(){
					console.log('异步任务1执行完成');
					resolve('异步请求1');
				}, 1000);
			});
			return p;            
		}
		function runAsync2(){
			var p = new Promise(function(resolve, reject){
				//做一些异步操作
				setTimeout(function(){
					console.log('异步任务2执行完成');
					resolve('异步请求2');
				}, 1000);
			});
			return p;            
		}
		function runAsync3(){
			var p = new Promise(function(resolve, reject){
				//做一些异步操作
				setTimeout(function(){
					console.log('异步任务3执行完成');
					resolve('异步请求3');
				}, 1000);
			});
			return p;            
		}

		runAsync1()
		.then(function(data){
			console.log(data);
			return runAsync2();
		})
		.then(function(data){
			console.log(data);
			return '链式调用';  //这里直接返回数据
		})
		.then(function(data){
			console.log(data);
		});
</script>
```

```
//定义主函数，回调函数作为参数
function A(callback) {
    callback();  
    console.log('我是主函数');      
}

//定义回调函数
function B(){
    setTimeout("console.log('我是回调函数')", 3000);//模仿耗时操作  
}

//调用主函数，将函数B传进去
A(B);

//输出结果
我是主函数
我是回调函数
```

### 8.async / await

<https://blog.csdn.net/zhaoxiang66/article/details/81017373>

```
function getCode(){
     return axios.get('json/code.json');
 }
function getlist(params){
     return axios.get('json/person.json',params)
 }
 
//async await
async function getResult(){
	//await1
    let code = await getCode();
    console.log(code.data.code);
    if(code.data.code == 0){
    var params = {
    code:code.data.code
    }
    //await2
    let list = await getlist(params);
    console.log(list.data.list);
    }
}
getResult();

```

##### 9.git checkout

返回上一个版本，eg：git checkout .则返回所有版本

##### 10.背景图片不适应



##### 11.props接受参数设置属性，限制传参属性

![](F:\technical_summary\img\捕获.PNG)

