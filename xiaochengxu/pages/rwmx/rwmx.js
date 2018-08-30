// pages/rwmx/rwmx.js
var zm = require('../../utils/zm_tools.js')
var zmpage = require('../../utils/zm_pagemaster.js')
Page(zm.extend({},zmpage,{

  /**
   * 页面的初始数据
   */
  data: {
    mxtype:0,
    tab:0,
    moreczlist: [{ bm: "01", mc: "详情"},{ bm: "01", mc: "撤销"},{ bm: "02", mc: "完成"}],
    moreczindex:0,
    rwid:"",
    shyj:"",
    rwhis:{},

    renwu:{
      //任务标题
      title: '',

      //赏金
      shangjin: "0",
      //摘要
      meno: '',
      //任务图片
      img:"/#",
      created_at:"",
      //关键信息
      keys: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.setData({
      mxtype: options.mxtype
    })
    console.log("optionspid:" + options.pid + "optionsmxtype" + options.mxtype)
    //加载任务明细
    zm.get("/renwu/getone_new",{pid:options.pid},function(r){
      that.setData({
        renwu: r.rwlist,
        rwid: options.pid,
        rwhis: r.rwhislist
      })
      console.log(r.rwhislist)
    });
    //加载浏览履历
    /*zm.get("/renwu/get_hisinfo", { pid: options.pid }, function (rhis) {
      console.log("lvli")
      console.log(rhis)
      that.setData({
        avatarUrls: rhis.avatarUrl,
        nickName: rhis.nickName
      })
      
    });*/
  },
  //打电话
  dadianhua: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.dianhua //仅为示例，并非真实的电话号码
    })
  },
  showtab:function(e){
    this.setData({
      tab: e.currentTarget.dataset.tab
    });
  },
  chexiao: function (e) {
    //撤销任务
    zm.get("/renwu/chexiao", { pid: this.data.rwid }, function (r) {
      wx.navigateTo({
        url: '../logs/logs'　// 页面 A
      })
    });
  },
  jiaofei: function (e) {
    //付款
    wx.navigateTo({
      url: '../jiaofei/jiaofei?rwid=' + this.data.rwid  　// 页面 A
    })
  },
  morecz:function(e){
switch(this.data.moreczindex){
case"01":{
    this.setData({
      tab: 0
    });
}break;
  case "02": {
   //改变任务取消
  } break;
  case "03": {
    //改变任务完成
  } break;
}
  },
  shjg:function(op){
    var that=this;
    let shjg = op.currentTarget.dataset.shjg;
    console.log(this.data.shyj);
    if(shjg=="02"){
//如果是打回，必须要填写意见
      if (!this.data.shyj){
  zm.alert("审批意见必须填写！！");
return;
}
    }
    zm.post("/admin/shrw", { rwid: that.data.rwid, shjg: shjg, spyj: that.data.shyj },function(r){
      if(r.isok){
        wx.redirectTo({ url:"../renwulist/renwulist?rwtype=shh"});
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
}))