<template>
  <div class="annoucement" v-if="show">
    <div class='notice'>
      <p class='tongzhi'>{{select}}</p>
      <p class='desc'>{{editWord}}</p>
      <p class='btn'>
        <span class='ensure' id='ensure' @click='showNotice(1)'>查看</span>
        <span class='cancel' @click='showNotice(2)'>取消</span>
      </p>
    </div>
      
  </div>
</template>
<script>
import router from '../router';
export default {
  name:'plugin',
  created()
  {
    console.log("plugin.vue created......")
  }
  ,
  data()
  {
    return {
      show:false,
      editWord:'',//文案编辑
      select:'',//提现或者退款
    };
  },
  mounted(){
  }
  ,
  methods: {
    //显示公告
    showTheNotice(par){
      console.log('par',par)
      let {title,contents,title_code}=par;
      this.editWord=contents;
      this.show=true;
      if(title_code=='charge'){
        this.select='退款通知';
      }
      else if(title_code=='withdraw'){
        this.select='提现通知';
      }
    },
    //跳转信息
    showNotice(par){
      if(par==1){
        var params={
          token:localStorage.getItem('token'),
          page:1,
          type:2,
        }
        this.$axios
        .post(this.urlRequest + "?m=api&c=message&a=dataList", params)
        .then(res => {
          if(res.status==0){
            this._id=res.list[0].id;
            this._type=res.list[0].type;
            console.log('this.id/type',res,this._id,this._type,this);
            router.push({
              path: "/notice_detail",
              query: {
                id: this._id,
                type: this._type
              }
            });
          }
        })
        this.show=false;       
      }
      else if(par==2){
        this.show=false;      
      }
    },
  },
}
</script>
<style scoped>
  .annoucement{
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,0.5);
    position:fixed;
    z-index:1000;
    left: 0px;
    top: 0px;
  }
  .annoucement .notice{
    width: 240px;
    /*height: 160px;*/
    background-color: #fff;
    position:fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50% ,-50%);
    border-radius:12px;
    z-index:6000;
  }
  .annoucement .notice p{
    color:#000;
    width: 100%;
    font-size: 18px;
    text-align: center;
    margin:20px 0;
  }
  .annoucement .notice .btn{
    border-top: 1px solid #ccc;
  }
  .annoucement .notice .tongzhi{
    font-weight: bold;
    margin-top:10px;
  }
  .annoucement .notice .desc{
    padding:0 5px;
  }
  .annoucement .notice .btn span{
    display:block;
    width: 50%;
    font-size: 16px;
    text-align: center;
    box-sizing:border-box;
    padding:10px 0;
    
  }
  .annoucement .notice .btn .ensure{
    float: left;
    color:red;
    border-right: 1px solid #ccc;

  }
  .annoucement .notice .btn .cancel{
    float: right;
  }
</style>

