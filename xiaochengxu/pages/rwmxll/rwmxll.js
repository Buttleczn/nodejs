// pages/rwmx/rwmx.js
var zm = require('../../utils/zm_tools.js')
var zmpage = require('../../utils/zm_pagemaster.js')
var WxParse= require('../../wxParse/wxParse.js');
var app = getApp(); 
Page(zm.extend({}, zmpage, {

  /**
   * 页面的初始数据
   */
  data: {
    mxtype: 0,
    tab: 0,
    moreczlist: [{ bm: "01", mc: "详情" }, { bm: "01", mc: "撤销" }, { bm: "02", mc: "完成" }],
    moreczindex: 0,
    rwid: "",
    shyj: "",
    meno:"",
    //账户金额
    account:'',
    zfshengyu:'',
    userInfo:{},
    renwu: {
      //任务标题
      title: '',

      //赏金
      shangjin: "0",
      //摘要
      meno: '',
      //任务图片
      img: "/#",
      created_at: "",
      //关键信息
      keys: '',
      //转发人
      zhuanfaid:'',
      //点击人
      dianjiid:'',
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("rwmxll", options);
    var that = this;
    this.setData({
      mxtype: options.mxtype
    })

    //获取用户信息
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      zm.get("/user", {}, function (r) {
        that.setData({
          userInfo: r
        })
      })
    }
    console.log("user_inf" );
    console.log(that.data.userInfo);

    //加载任务明细
    zm.get("/renwu/getone_new", { pid: options.pid }, function (r) {
      //let htm=r.meno;
     // console.log(htm);
     // WxParse.wxParse('meno', 'html', htm, that, 5);
      console.log(r);
      that.setData({
        renwu: r.rwlist,
        rwid: options.pid
      })

      var dianjiyn = "N";
      var currentid = that.data.userInfo.openId;
      if (r.rwhislist){
        for (var i = 0; i < r.rwhislist.length; i++) {
          if (r.rwhislist[i].dianjiid == currentid) {
            dianjiyn = "Y";
            break;
          }
        }
      }
      console.log(dianjiyn)
      console.log(r.rwlist.zhuangtai)
      console.log(options.uid)
      //保存转发点击数
      if (options.uid && r.rwlist.zhuangtai == "正常" && dianjiyn == "N") {
        that.setData({
          zhuanfaid: options.uid,
          dianjiid: that.data.userInfo.openId,
          account: r.rwlist.account + r.rwlist.zdanjia,
          zfshengyu: r.rwlist.zmaxtiaoshu ? (r.rwlist.zmaxtiaoshu - 1):0
        })
        console.log(that.data.account);
        zm.post("/renwu/zhuanfa_add", that.data, function (r) {
          console.log("转发点击保存成功");
        })
      }
    },function(r){},false);
    
    
  
  },
  shouye:function(a){
    wx.reLaunch({
      url: '../shouye/shouye'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (o) {
    console.log("转发",o);
    return {
      title: "赏金：" + this.data.renwu.shangjin+" 元  "+ this.data.renwu.title,
      path: '/pages/rwmxll/rwmxll?mxtype=lqrw&pid=' + this.data.renwu.pid + "&uid=" + this.data.userInfo.openId,
      imageUrl: this.data.renwu.img,
      success: function (res) {
        // 转发成功
      }
    }
  }
}))