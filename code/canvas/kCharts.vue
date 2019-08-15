<!--走势图-->
<template>
  <div class="accountInfo">
    <div class="nav">
      <!-- 下拉框 -->
      <img class="arrow_left" @click="back" src="~x&x/images/common/arrow_left.png">
      <span class="title" @click="changes_arrow">
        {{type.name}}
        <img :class="arrow_class" src="~x&x/images/common/arrow_up.png">
      </span>
      <!-- 日期 -->
      <div class="pickerDemo">
        <div class="showTime" @click="selectData">
          <span class="selectTime">{{nowdate_str}}</span>
          <img src="~x&x/images/common/calendar.png">
        </div>
        <div class="pickerPop" @touchmove.prevent>
          <mt-datetime-picker
            lockScroll="true"
            ref="datePicker"
            class="myPicker"
            type="date"
            v-model="nowdate"
            @confirm="dateconfirm"
          ></mt-datetime-picker>
        </div>
      </div>
    </div>
    <!-- <div ref="wrapper" class="table_div">
      <div style="height:100%;">
        <Scroll
          class="height100"
          :on-reach-bottom="handleReachBottom"
          :on-reach-top="handleReachTop"
          :height="wrapperHeight"
        >
          <Table
            :columns="columns_title"
            :data="columns_data"
            size="small"
            ref="table"
            border
            class="table"
          ></Table>
        </Scroll>
      </div>
    </div> -->
    <!-- 走势曲线 -->
    <div class='trend'  v-if='trendData.length>0'>
      <!-- 左table部分 -->
      <div class='dvLeft'>
        <table class='tabLeft'>
          <tbody class='tbLeft' >
          <!-- <tr style='background-color:#e8eaec;height: 32px;line-height:14px;border-bottom: 1px solid #ccc;' rowspan='2' class='zonhe' >
            <td style='height: 32px;line-height:14px;'>总和</td>
          </tr>
          <tr v-for='(item,index) in 28' :key='index' style='line-height:14x;width: 14px;height: 14px;' class='issue'>
            <td style='width: 14px;height: 14px;border-bottom: 1px solid #ccc;line-height:14px;'>{{28-item}}</td>
          </tr> -->
          <tr style='background-color:#e8eaec;height: 32px;line-height:14px;border-bottom: 1px solid #ccc;'  class='zonhe'
          rowspan='29' >
           总和     
          </tr>
          <tr style='line-height:12px;border: 1px solid #ccc;' v-for='(item,index) in 28' :key='index' class='issueNum'>
          {{28-item}}
          </tr>
          </tbody>
        </table>
      </div>
      <!-- 右table部分 -->
      <div class='dvRight' style='position:relative'>
      <!-- position:relative; z-index:10 -->
        <table class='tabRight' style='border-top: 1px solid #ccc;'>
          <tbody class='tbRight'>
            <!-- 头部展示 -->
            <tr  class='rt' id='rt' style='border-bottom: 1px solid #ccc;height: 18px; line-height:18px;'>
              <td :colspan='trendData.length' style='background-color:#e8eaec;height: 18px; line-height:18px;'>前30期中奖号码分布如下</td>
            </tr>
            <tr  style='background-color:#e8eaec;width: 14px;height: 14px;' class='ro' id='ro'>
               <td v-for='(item1,idx1) in  colorData' :key='idx1' style=' border-right: 1px solid #ccc;border-bottom: 1px solid #ccc;line-height: 14px;width: 14px;height: 14px;'><span style="border-radius;50%;display;block;" ref='openSpan'>{{item1.open_result}}</span>
               </td> 
            </tr>
            <!-- 内容-走势图trendData  border: 1px solid #ccc;border-top: 0 none; border-left:0 none;-->
            <tr v-for='(item20,idx20) in 28' :key='idx20'  ref='trArr' class='rm'>
              <td v-for='(item21,idx21) in trendData' :key='idx21' style=' border: 1px solid #ccc;border-top: 0 none; border-left:0 none;width: 14px;height: 14px;'></td>
            </tr>
            <!-- 期号  -->
            <tr style='text-orientation: upright;' class='tb'>
              <td v-for='(item3,idx3) in trendData' :key='idx3' style='border:0 none;font-size: 10px;height: 36px;'>
                <div style=" writing-mode: vertical-rl;color:#000;font-size: 10px;" class='issue'>
                   {{item3.issue.substring(item3.issue.length-3)}}
                </div>
              </td>
            </tr>
          </tbody>
          <div id='cvsDiv'></div>
        </table>
      </div>
      <!-- 加载更多按钮 -->
      <!-- <div class='loadmore' @click='loadMore'>
        <span>加载</span>
        <span>更多</span>
      </div> -->
    </div>
    <!-- 文字说明 -->
    <div class="desc"  v-if='trendData.length>0'>
      <p>以30期作为基础数据分析</p>
      <p>热门<span class='remen'></span>:开10期以上</p>
      <p>中门<span class='zhongmen'></span>:开5期以上</p>
      <p>冷门<span class='lengmen'></span>:小于5期且出现连续不开10期以上</p> 
    </div>
    <!-- 下拉框选项 -->
    <div id="type_modal" :class="modal_show" @click="changes_arrow">
      <div class="type_all">
        <div
          :class="item.name==type.name?'choose_class':'default_class'"
          v-for="(item,index) in lotteryData"
          :key="index"
          :value="item"
          @click.stop="change_type(item)" v-if='item.id==1||item.id==3||item.id==15'
        >{{item.name}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import Scroll from "../../../node_modules/iview/src/components/Scroll/Scroll.vue";
export default {
  data() {
    let _this = this;
    return {
      orderHight: 0, //table可以显示的高度
      arrow_class: "arrow_down", //默认当前下拉框为收起的状态
      nowdate: "", //date格式的日期
      nowdate_str: "", //20xx-xx-xx
      modal_show: "modal_hidden",
      page: 1,
      lottery_type:'',
      trendData:[],//开奖数据
      colorData:[],//开奖数据(带上颜色)
      openArr:[],//开奖总和
      testArr:[],//测试
      cvsArr:[],//获取开奖的位置
      createTd:[],//td标签
      macthColorArr1:[],//匹配颜色数组1
      macthColorArr2:[],//匹配颜色数组2
      getNum:0,//小于5期且连续不开10期以上的i的初始值
      isGetNum:false,//连续不开十期开关
      currentColor:'gray',
      lotteryData:[
        {
          name:'开元通宝',
          id:'15'
        },{
          name:'乾元重宝',
          id:'3'
        },
        {
          name:'顺天元宝',
          id:'1'
        }
      ],//头部数据
      type: {  
        name: "顺天元宝",
        id:'1'
      }, //初始化
    };
  },
  mounted() {
    //数据初始化
    if(JSON.stringify(this.$route.query)!='{}'){
      this.type.id=this.$route.query.id;
      this.type.name=this.$route.query.lottery_title;
      this.lottery_type=this.$route.query.id;
      this.getDataInit();
    }
    this.nowdate = this.nowdate_str = this.getnowdate();
    // this.wrapperHeight =document.documentElement.clientHeight -this.$refs.wrapper.getBoundingClientRect().top;
  },
  methods: {
    // 侧拉加载更多
    slideOver(){
      var clienWidth  = document.documentElement.clienWidth;
      console.log('进行滚动',clienWidth)
    },
    //加载更多
    loadMore(){
      this.page++;
      console.log('this.page',this.page);
      this.getDataInit();
    },
    createCanvasLine(){
      var cvs_top=''; 
      var cvs_left='';
      var minTop='';
      var minLeft='';
      var cvsHeight='';
      var cvsdiv = document.getElementById("cvsDiv");
      //获取相应的宽度 高度
      var cw=this.createTd[0].clientWidth;
      var ch=this.createTd[0].clientHeight;
      for(var i=0;i<this.cvsArr.length;i++){ 
        var tdw=this.createTd[i].offsetLeft;
        var tdh=this.createTd[i].offsetTop;
        console.log('tdw tdh',tdw,tdh)
        var cvs = document.createElement("canvas");
        if(i<this.cvsArr.length-1){ 
          cvsHeight =Math.abs(this.createTd[i+1].offsetTop-this.createTd[i].offsetTop);
          if(cvsHeight==0){
            cvsHeight=1;
          }
          cvs.height=cvsHeight;
          this.openArr[i]=this.openArr[i]+'';
          if(this.openArr[i][0]==0){
            this.openArr[i]=this.openArr[i].substring(1,);
          } 
          var spaceTop=(27-Math.max(this.openArr[i],this.openArr[i+1]));      
          if(this.openArr[i]*1>this.openArr[i+1]*1){
            minTop=tdh+ch/2;
          }
          else{
            minTop=tdh+ch/2-cvsHeight;
          }
          if(cvsHeight==0){
            minTop=minTop-1;
          }  
          minLeft=tdw+cw/2+1/2;
        }
        cvs.width=cw;     
        cvs_top=minTop;
        cvs_left=minLeft;
        //影响画线重大因素
        cvs.style.top=cvs_top+'px';
        cvs.style.left=cvs_left+'px';
        var cxt = cvs.getContext("2d");
        cxt.save();
        cvs.style.position='absolute';
        cxt.strokeStyle = 'orange';
        cxt.lineWidth = 1;
        cxt.lineJoin = "round";
        cxt.beginPath();
        if(this.openArr[i]*1>this.openArr[i+1]*1){
          cxt.moveTo(0,0);
          cxt.lineTo(cw,cvsHeight);
        }
        else{
          cxt.moveTo(0,cvsHeight);
          cxt.lineTo(cw,0);
        }        
        cxt.closePath();
        cxt.stroke();
        cxt.restore();
        cvs.classList.add('huabu');
        if(i<this.cvsArr.length-1){
          this.createTd[i].append(cvs);
          // cvsdiv.append(cvs);    
        }  
      } 
    },
    //获取偏移量(不可取)---使用offsetTop+offsetLeft
    getOffset(Node, offset) {    
      if (!offset) {        
        offset = {};
        offset.top = 0; 
        offset.left = 0;
      }
      if (Node == document.body) {
        //当该节点为body节点时，结束递归        
        return offset;   
      }
      offset.left += Node.offsetLeft;
      offset.top += Node.offsetTop;    
      return this.getOffset(Node.offsetParent, offset);//向上累加offset里的值
    },
    //判断每一期和的个数
    judgeNum(_arr){
      var _res = [];
      _arr.sort(); 
      for (var i = 0; i < _arr.length;) {  
        var count = 0;  
        for (var j = i; j < _arr.length; j++) {  
          if (_arr[i] == _arr[j]) {  
            count++;  
          }  
        }  
        _res.push([_arr[i], count]);  
        i += count;  
      }  
      //_res 二维数维中保存了 值和值的重复数  
      var _newArr = [];
      this.macthColorArr1=[];
      this.macthColorArr2=[];
      for (var i = 0; i < _res.length; i++) {  
        _newArr.push({openNum:_res[i][0] ,countNum:_res[i][1]}); 
        // this.macthColorArr2.push(_res[i][0]+'X'+_res[i][1]);
        this.macthColorArr2.push(_res[i][0]);
      }     
      this.macthColorArr1=_newArr;
    },
    setGray(openNum){
      this.getNum=0;
      this.isGetNum=false;  
      for(var n=0;n<this.page;n++){ 
        var currentPage=n*30;
        for(var i=0+currentPage;i<=20+currentPage;i++){
          for(var j=0+i;j<10+i;j++){
            if((this.openArr[j]+'').indexOf(openNum)==-1){
              this.isGetNum=true;
            }
          }
          if(this.isGetNum){
            this.getNum++;
          }
        }
      }    
      if(this.getNum>=10){
        return 'gray';
      }
      else{
        return '#000';
      }
      // console.log('this.getNum',openNum,this.getNum)   
    },
    //获取相应节点td
    getTd(){
      this.$nextTick(()=>{
        for(var i=0;i<this.openArr.length;i++){
          //判断小于10-含有数字0
          // if(this.openArr[i][0]==0){
          //   this.openArr[i]=this.openArr[i].substring(1,);
          // } 
          //颜色判断
          var cIdx=this.macthColorArr2.indexOf(this.openArr[i]);
          var currentCount=this.macthColorArr1[cIdx].countNum*1;
          if(currentCount>=10){
            this.currentColor='red';
          }
          else if(currentCount>=5&&currentCount<10){
            this.currentColor='blue';
          }
          else if(currentCount<5){       
            var returnColor = this.setGray(this.openArr[i]+'');
            this.currentColor=returnColor;
          }
          this.colorData[i].type_color=this.currentColor;            
          this.$refs.trArr[27-this.openArr[i]].childNodes[i].innerHTML='<span class="openSpan" style="background-color:'+this.currentColor+';color:#fff;border-radius:50%;display:block;width:6px;height:6px;margin:0 auto"></span>';
          this.createTd.push(this.$refs.trArr[27-this.openArr[i]].childNodes[i]);
          var tdOffset=this.getOffset(this.$refs.trArr[27-this.openArr[i]].childNodes[i]);
          // var tdOffset=this.$refs.trArr[27-this.openArr[i]].childNodes[i].offsetTop;
          this.cvsArr.push(tdOffset);
          console.log('cvsArr',this.cvsArr)
        }
        //获取开奖号码span,匹配颜色
        for(var k=0;k<this.$refs.openSpan.length;k++){
          this.$refs.openSpan[k].style.color=this.colorData[k].type_color;
        }
        // 使用canvas画线
        this.createCanvasLine();
      });
    },
    //获取中将号码
    getDataInit(){  
      var params = {
        token: localStorage.getItem("token"),
        date: this.nowdate_str,
        lottery_type: this.lottery_type,
        page: this.page
      };
      this.$vux.loading.show();
      this.$axios
        .post(this.urlRequest + '?m=api&c=openAward&a=trendList', params)
        .then(res => {
          this.$vux.loading.hide();
          if(res.status==0){
            //只要前三十个数据
            if(this.page==1){
              this.trendData=res.list.slice(0,30);
              this.colorData=res.list.slice(0,30);  
            }
            else if(this.page>1){
              for(var i=0;i<res.list.slice(0,30).length;i++){
                this.trendData.push(res.list[i]);
                this.colorData.push(res.list[i]);
              }          
            }
            //openArr/testArr 初始化
            this.openArr=[];
            this.testArr=[];
            for(var i=0;i<this.trendData.length;i++){
              this.openArr.push(this.trendData[i].open_result*1);
              this.testArr.push(this.trendData[i].open_result*1);
            }
            // 判断每个号码开期情况
            this.judgeNum(this.testArr);
            //获取节点nextTick
            this.getTd();
          }
        })
        .catch(error => {
          console.log(error);
          this.$vux.loading.hide();
          this.$vux.toast.show({
            text: "数据请求超时"
          });
        });
    },
    //返回到上一页
    back() {
      this.$router.go(-1);
    },
    //刷新：下滑刷新
    handleReachTop() {
      let _this = this;
      return new Promise(resolve => {
        _this.page = 1;
        _this.getDataInit();
        resolve();
      });
    },
    //上划加载更多
    handleReachBottom() {
      let _this = this;
      return new Promise(resolve => {
        if (this.pullUpLoadFlag) {
          this.$vux.toast.show("没有更多了");
          resolve();
          return false;
        } else {
          _this.page++;
          _this.getDataInit();
          resolve();
        }
      });
    },
    //方法：改动彩票类型
    change_type(_v) {
      let _this = this;
      this.type = _v;
      this.page = 1;
      this.changes_arrow();
      this.lottery_type = _v.id;
      //数据清空
      this.openArr=[];
      this.cvsArr=[];
      this.createTd=[];
      var cvsdiv = document.getElementById("cvsDiv");
      this.trendData=''; 
      cvsdiv.innerHTML='';
      this.getDataInit();
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    //类型选择的下拉框变动事件
    changes_arrow() {
      if (this.arrow_class == "arrow_down") {
        this.arrow_class = "arrow_up";
        this.modal_show = "modal_show";
      } else {
        this.arrow_class = "arrow_down";
        this.modal_show = "modal_hidden";
      }
    },
    //日期提交事件
    dateconfirm() {
      this.nowdate_str = this.getnowdate(this.nowdate);
      //数据清空
      this.openArr=[];
      this.cvsArr=[];
      this.createTd=[];
      var cvsdiv = document.getElementById("cvsDiv");
      this.trendData=''; 
      cvsdiv.innerHTML='';
      this.getDataInit();
    },
    //日期选择的事件
    selectData() {
      this.$refs["datePicker"].open();
    },
    // 获取今天的日期
    getnowdate(_date) {
      let n_date,
        date_str = "";
      if (_date == null || _date == undefined) {
        n_date = new Date();
      } else {
        n_date = _date;
      }
      date_str += n_date.getFullYear();
      date_str += "-";
      n_date.getMonth() > 9
        ? (date_str += n_date.getMonth() + 1)
        : (date_str += "0" + (n_date.getMonth() + 1));
      date_str += "-";
      n_date.getDate() > 9
        ? (date_str += n_date.getDate())
        : (date_str += "0" + n_date.getDate());
      return date_str;
    },
  }
};
</script>

<style scoped>
.accountInfo {
  width: 100%;
  height: 100%;
  position: relative;
  -webkit-overflow-scrolling: touch;
}
.nav .title {
  text-align: center;
  font-size: 0.48rem;
  color: #fff;
  width: 30%;
  position: relative;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  display: block;
  line-height: 1.3rem;
}
.type_class_true {
  color: #d32627;
  border-color: #d32627;
}
.type_class_false {
  color: #ccc;
  border-color: #ccc;
}

.nav .title img {
  width: 15px;
  height: 15px;
  position: absolute;
  top: calc(0.65rem - 7.5px);
  margin-left: 5px;
  transition: all 0.3s;
}
.nav .arrow_up {
  transform: rotate(180deg);
}
.nav .arrow_down {
  transform: rotate(0deg);
}
.nav .arrow_left {
  width: 20px;
  height: 20px;
  position: absolute;
  left: 15px;
  top: calc(0.65rem - 10px);
}
.nav .pickerDemo img {
  width: 20px;
  height: 20px;
  top: 0;
}
.showTime {
  color: #fff;
  width: 100%;
  position: absolute;
}
.nav {
  height: 1.3rem;
  width: 100%;
  position: fixed;
  background-image: url("../../assets/img/header.png");
  background-repeat: no-repeat;
  background-size: 100%;
  z-index: 100;
}
.circut {
  position: absolute;
  width: 100%;
  left: 0px;
  bottom: 10px;
  text-align: center;
  color: #ccc;
}
.version {
  margin-top: 120px;
  text-align: center;
}
.version img {
  margin-bottom: 30px;
}
.pickerDemo {
  line-height: 1.3rem;
  position: absolute;
  height: 1.3rem;
  width: 90px;
  text-align: center;
  float: right;
  right: 15px;
  top: 0;
}
#type_modal {
  width: 100%;
  height: calc(100% - 40px);
  transition: all 0.3s;
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 40px;
  z-index: 999;
}
.type_all {
  background-color: #fff;
  padding: 0.45rem;
}
.type_all div {
  display: inline-block;
}
.modal_hidden {
  height: 0 !important;
  overflow: hidden;
}
.modal_show {
  height: calc(100% - 40px);
}
.table_class {
  width: 100%;
  position: relative;
  overflow: scroll;
}
.table {
  width: 100%;
  height: 100%;
}
.table_class .table_left {
  width: 20%;
  left: 0;
  position: relative;
}
.table_class .table_right {
  width: 80%;
  left: 20%;
  position: absolute;
}
.left_item,
.left_title {
  width: 100%;
  height: 25px;
  font-size: 14px;
  line-height: 25px;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  text-align: center;
  color: #d32627;
}
.left_title {
  position: relative;
  color: #333;
}
.table_top {
  width: 100%;
  overflow: hidden;
}
.table_top span {
  width: 20%;
  display: inline-block;
}
.effectNav {
  margin-top: 10px;
  border-top: 1px solid #666;
  background: #999;
  padding-bottom: 10px;
}
.effectNav h3 {
  padding: 0 10px;
  background: #ddd;
  background: #333;
  color: #fff;
}
.effectNav ul {
  font-size: 0;
}
.effectNav li {
  display: inline-block;
  font-size: 12px;
  padding: 0 10px;
  margin: 10px 0 0 10px;
  background: #cdcdcd;
}
.effectNav li.new {
  background: #fce8cd;
}
.tabBox .hd {
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  font-size: 20px;
  background: #f3f3f3;
  border-top: 2px solid #cecece;
}

.tabBox .hd ul {
  overflow: hidden;
}

.tabBox .hd ul li {
  float: left;
  margin: 0 10px;
  color: #515151;
}

.tabBox .hd ul .on {
  border-bottom: 2px solid #ba2636;
  color: #ba2636;
}

.tabBox .hd ul .on a {
  display: block; /* 修复Android 4.0.x 默认浏览器当前样色无效果bug */
}

.tabBox .bd ul {
  padding: 10px 0 10px 10px;
}

.tabBox .bd li {
  height: 33px;
  line-height: 33px;
}

.tabBox .bd a {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

/* 去掉链接触摸高亮 */
.tabBox .bd li a {
  color: #555;
}

.tabBox .bd .t {
  height: 85px;
  overflow: hidden;
}

.tabBox .bd .t .pic {
  width: 130px;
  float: left;
}

.tabBox .bd .t .con {
  margin-left: 130px;
  line-height: 20px;
}

.tabBox .bd .t .con p {
  font-size: 12px;
  color: #999;
}
.table_bttom,
.table_top {
  width: 80%;
  margin-left: 20%;
  height: 50px;
  line-height: 50px;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  overflow-x: scroll;
  overflow-y: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
  -webkit-overflow-scrolling: touch;
  text-align: justify;
  background: #f78361;
  padding: 0px 5px;
  box-sizing: border-box;
}
.table_bttom a,
.table_top a {
  color: #fff;
  text-decoration: none;
  margin-right: 10px;
}
.table_top::-webkit-scrollbar {
  display: none;
}
.table_bttom::-webkit-scrollbar {
  display: none;
}
.table_title {
  width: 20%;
  margin-left: 0;
  height: 50px;
  line-height: 50px;
  float: left;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  overflow-x: scroll;
  overflow-y: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
  -webkit-overflow-scrolling: touch;
  text-align: justify;
  background: #f78361;
  padding: 0px 5px;
  box-sizing: border-box;
}
.table_left {
  width: 20%;
  margin-left: 0;
  height: 50px;
  line-height: 50px;
  float: left;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  overflow-x: scroll;
  overflow-y: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
  -webkit-overflow-scrolling: touch;
  text-align: justify;
  background: #f78361;
  padding: 0px 5px;
  box-sizing: border-box;
}
.type_all .default_class {
  width: 2rem;
  height: 0.8rem;
  text-align: center;
  margin-top: 0.2rem;
  border-radius: 5px;
  border: 1px solid #999;
  line-height: 0.8rem;
}
.type_all div:nth-child(4n + 1) {
  margin-right: 0.3rem;
  margin-left: 0.1rem;
}
.type_all div:nth-child(4n + 2) {
  margin-right: 0.3rem;
}
.type_all div:nth-child(4n + 3) {
  margin-right: 0.3rem;
}
.type_all div:nth-child(4n) {
  margin-right: 0.1rem;
}
.type_all .choose_class {
  width: 2rem;
  height: 0.8rem;
  text-align: center;
  margin-top: 0.2rem;
  border-radius: 5px;
  border: 1px solid #999;
  line-height: 0.8rem;
  background-color: #d32627;
  color: #fff;
  border-color: #fff;
}
.height100 {
  height: 100%;
}
.table_div {
  width: 100%;
  position: fixed;
  top: 40px;
  height: calc(100% - 40px);
}
/deep/ .ivu-table-cell {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
<style scoped>
/*幸运28样式*/
.red {
  background: url("~x&x/images/winprice/red.png") no-repeat;
  background-size: contain;
}
.blue {
  background: url("~x&x/images/winprice/blue.png") no-repeat;
  background-size: contain;
}
.green {
  background: url("~x&x/images/winprice/green.png") no-repeat;
  background-size: contain;
}
.gray {
  background: url("~x&x/images/winprice/gray.png") no-repeat;
  background-size: contain;
}
</style>
<!-- 走势图 -->
<style scoped>
  .trend{
    width: 100%;
    overflow: hidden;
    padding-top: 1.3rem;
  }
  .trend .dvLeft{
    width: 6%;
    float: left;
    box-shadow: 2px 0px 6px -2px rgba(0,0,0,.5);
    border-bottom: 1px solid #ccc;
    /*padding-right: 1px;*/
  }
  /*左表格*/
  .trend .dvLeft .tbLeft{
    width: 100%;
  }
  .trend .dvLeft .tbLeft td{  
    text-align: center;
    font-size: 12px;
    /*line-height:14px;*/
    /*border-bottom: 1px solid #ccc;*/
  }
  /* .trend .dvLeft .tbLeft td:last-child{
    border-bottom:0 none;
  }*/
   .trend .dvLeft .tbLeft tr{
    height: 14px;
    width: 24px;
    text-align: center;
    line-height: 14px;
  }
  .trend .dvLeft .zonhe{
    border-right: 1px solid #ccc;
  }
  .trend .dvLeft .zonhe td{
    /*height: 32px;*/
    font-size: 12px;
  }
  .issue{
    line-height: 14px;
    padding-right: 2px;
  }
  .issue td{
    line-height: 14px;
    border-left: 1px solid #000;
  }
  /**********************************************/
  /*右表格*/
  .trend .dvRight{
    width: 94%;
    float: left;
    overflow: auto;
    position:relative;
  }
  .trend .dvRight .tabRight{
    width: 100%;
    /*border-top: 1px solid #ccc; */
  }
  .trend .dvRight .tbRight .rt{
    text-align:center;
    height: 18px;
    background-color:#e8eaec;
    line-height:18px;
    /*border-bottom: 1Px solid #ccc;*/
  }
  .trend .dvRight .tbRight .rt td{
    height: 18px;
    line-height:18px;
  }
  .trend .dvRight .tbRight .rm{
    height: 14px;
    line-height: 14px;
  }
  .trend .dvRight .tbRight .rm  td{
    height:14px;
    line-height: 14px;
    /*canvas写行内样式不写内联*/
    /*border: 1Px solid #ccc;
    border-top: 0 none; 
    border-left:0 none;*/ 
  }
  .trend .dvRight .tbRight .ro{
    height:14px;
    line-height: 14px;
  }
  .trend .dvRight .tbRight td{
    text-align: center;
    width: 20px;
    height: 14px;
    line-height:14px;

  }
  .trend .dvRight .tbRight .rb .issue{
    font-size: 12px;
  }
  #tabRight{
    left: -1px;
  }
  /* 加载更多按钮 */
  .loadmore{
    width: 12%;
    height: 45px; 
    text-align: center;
    border-radius:50%;
    float: left;
    color:#fff;    
    background-color:#ccc;
    margin-top: 200px;
  }
  .loadmore span{
    display:block;
    text-align: center;
    margin-top: 3px;
  }
  /*下拉框*/
  .modal_hidden {
    height: 0 !important;
    overflow: hidden;
  }
  .modal_show {
    height: calc(100% - 40px);
  }
  /*说明*/
  .desc{
    width: 320px;
    border: 1px solid #ccc;
    margin:0 auto;
    margin-top: 30px;
    height: 100px;
  }
  .desc p{
    margin:5px;
  }
  .remen{
    display:inline-block;
    width: 5px;
    height: 5px;
    margin:3px;
    border-radius:50%;
    background-color: red;
  }
  .zhongmen{
    display:inline-block;
    width: 5px;
    height: 5px;
    margin:3px;
    border-radius:50%;
    background-color: blue;
  }
  .lengmen{
    display:inline-block;
    width: 5px;
    height: 5px;
    margin:3px;
    border-radius:50%;
    background-color: gray;
  }
</style>
