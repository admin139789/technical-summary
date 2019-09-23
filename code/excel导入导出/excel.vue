<template>
  <div>
    <!-- 我是父组件 -->
    <!-- <son v-bind='num'/> -->
    <br>
    <div class='edit'>
      导入
      <input class='excel' type="file" @change="importfxx(this)"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" ref='inputer'/>
    </div>
    <br>
    <div class='edit' @click='exportExcel'>
      导出
      <!-- <input type="file" class='excel' placeholder="导出" @change="importfxx(this)"> -->
    </div>
    <!-- 
     -->

    <!-- <div class="content">
      <a href="javascript:;" class="file">
      导入
        <input id="imFile" type="file" style="display: none" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"  @change="importfxx(this)" />
      </a> -->
      <!-- <Button @click="uploadFile()">导入</Button> -->
    </div>

  </div>
</template>
<script>
// import son from './son'
  export default{
    components:{
      son:function (resolve) {
        //异步组件写法
        require(['./son.vue'], resolve)
      }
    },
    data(){
      return{
        imFile:'',
        errorMsg:'',
        fullscreenLoading:false,
        errorDialog:false,
        sels:[],//需要导出的数据
      }
    },
    mounted(){
    } ,
    methods:{
      //导入
      // importfxx(obj) {
      //   let _this = this;
      //   let inputDOM = this.$refs.inputer;
      //   // 通过DOM取文件数据
      //   this.file = event.currentTarget.files[0];
      //   console.log('this.files111111',this.files,inputDOM,obj)
      //   var rABS = false; //是否将文件读取为二进制字符串
      //   var f = this.file;
      //   var reader = new FileReader();
      //   //if (!FileReader.prototype.readAsBinaryString) {
      //     FileReader.prototype.readAsBinaryString = function(f) {
      //       var binary = "";
      //       var rABS = false; //是否将文件读取为二进制字符串
      //       var pt = this;
      //       var wb; //读取完成的数据
      //       var outdata;
      //       var reader = new FileReader();
      //       reader.onload = function(e) {
      //         var bytes = new Uint8Array(reader.result);
      //         var length = bytes.byteLength;
      //         for(var i = 0; i < length; i++) {
      //           binary += String.fromCharCode(bytes[i]);
      //         }
      //         var XLSX = require('xlsx');
      //         if(rABS) {
      //           wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
      //             type: 'base64'
      //           });
      //         } else {
      //           wb = XLSX.read(binary, {
      //             type: 'binary'
      //           });
      //         }
      //         outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西
      //         this.da = [...outdata]
      //         console.log('da==',this.da)
      //         let arr = []
      //         this.da.map(v => {
      //           let obj = {}
      //           obj.id = v.id
      //           obj.status = v.status
      //           arr.push(obj)
      //         })
      //         this.sels=this.da;
      //         console.log('arr====',arr,'this.sels',this.sels)
      //         let para = {
      //           //withList: JSON.stringify(this.da)
      //           withList: arr
      //         }
      //         _this.$vux.toast.show({
      //           text: "请耐心等待导入成功"
      //         });
      //         // withImport(para).then(res => {
      //         //   window.location.reload()
      //         // })

      //       }
      //       reader.readAsArrayBuffer(f);
      //     }
      //     if(rABS) {
      //       reader.readAsArrayBuffer(f);
      //     } else {
      //       reader.readAsBinaryString(f);
      //     }
      //     console.log('this.files22222',this.files,inputDOM)
      // },

      importfxx(obj) {
        let _this = this;
        let inputDOM = this.$refs.inputer;
        // 通过DOM取文件数据
        this.file = event.currentTarget.files[0];
        var rABS = false; //是否将文件读取为二进制字符串
        var f = this.file;
        var reader = new FileReader();
        FileReader.prototype.readAsBinaryString = function(f) {
          var binary = "";
          var rABS = false; //是否将文件读取为二进制字符串
          var pt = this;
          var wb; //读取完成的数据
          var outdata;
          var reader = new FileReader();
          reader.onload = function(e) {
            var bytes = new Uint8Array(reader.result);
            var length = bytes.byteLength;
            for(var i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            var XLSX = require('xlsx');
            if(rABS) {
              wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                type: 'base64'
              });    
            } else {
              wb = XLSX.read(binary, {
                type: 'binary'
              });
            }
            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西
            _this.sels=outdata;
            console.log('outdata',outdata, 'sels',_this.sels)
       
          }
          reader.readAsArrayBuffer(f);
        }
        if(rABS) {
          reader.readAsArrayBuffer(f);
        } else {
          reader.readAsBinaryString(f);
        }
        _this.$vux.toast.show({
          text: "导入成功"
        });
      },
      //导出
      exportExcel() {　//兼容ie10哦！
        if(this.sels.length==0){
          this.$vux.toast.show({
            text: "请先导入"
          });
          return false;
        }      
        var _this=this;
        require.ensure([], () => {　　　　　　　　
          const { export_json_to_excel } = require('../../assets/js/excel/Export2Excel');　　//引入文件Export2Excel　　　　　　
          const tHeader = [ '产品','投资顾问','持仓']; //将对应的属性名转换成中文　　　　　
          const filterVal =['nickname', 'product_name', 'STOCK_NAME'];//table表格中对应的属性名　　　　　 　　　
          const list = _this.sels;　　// _this.sels就是你想要导出的数据[{userName: '1001', realName: '张三'}]
          const data = this.formatJson(tHeader, list);　
          export_json_to_excel(tHeader, data, 'test');
          this.$vux.toast.show({
            text: "导出成功"
          });　　　　　　
        })
      },      
      formatJson(filterVal, jsonData) {
        return filterVal.map(v => jsonData.map(j => j[v]));
      }
   }
  }
</script>
<style>
  .edit{
    position: relative;
    text-align: center;
    width: 40px;
    margin:0 auto;
    font-size: 16px;
    font-weight: bold;
  }
  .excel{
    border:0 none;
    opacity:0;
    position:absolute;
    left: 0px;
    top: 0px;
    width: 40px;

  }
</style>
