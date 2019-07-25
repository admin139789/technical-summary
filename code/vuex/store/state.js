/**
 * 麻烦命名规范一点，谢谢
 */
const state = {
  bankedData: {}, //银行卡

  isLogin: localStorage.getItem('isLogin') ? localStorage.getItem('isLogin') : false,

  service: "",//客服链接

  userInfo: {
    nickname: '',
  },//用户个人信息

  accountData: {},//用户的钱

  navShow: true,

  roomData: {//房间信息
    showPmDlg: false,//投注面板显示隐藏
    plTipText: '',//赔率说明
    notZhuiHao: true,//是否追号
    issue: 0,//当前期号
    showAskRoad: false,//显示问路
    showMiPai: false,
    minBetMoney: 1,//最小投注
    stopBet: false,//停止投注
    roomListLen: 0,//房间列表长度
    show_hezhi:'',//中将和值初始化
    zon_arr:[],//oddsWay
    accept:0,//追号权限 1默认 0不可以追号
    maxqi:'',//最大期数
    maxbei:'',//最大倍数
    zhuiting:"1",//是否追停
    closeGame:0//已封盘的时候不给投注，追号，发信息

  },
  serTime: 0,//服务器时间
  lotRstData: {},//投注数据
  newRstData: {},//服务器返回真数据
  rechargeData:{},//充值数据

  serverData:[],//客服中心

  signObj: { //签到数据
    signMoney: 0, //签到奖励金额
    signState: 0, //签到状态
    signCurrent: 0, //签到次数
  },

  platformConfig: {}, //平台配置信息
  cacheid:'',//临时性存储id--胡


  bannerArr:[],//轮播图图片--陈


  httpRequestData: {//缓存home页和winprice页的http请求，不要一直打转，影响体验
    getHeaderFooter: null,//"/index.php/index.php?m=win&c=lobby&a=getHeaderFooter"
    aIndex: null,//"/?m=win&c=lobby&a=index"
    openAward: null,//'/?m=api&c=openAward&a=recentlyResult&lottery_types='
  },

};
export default state


