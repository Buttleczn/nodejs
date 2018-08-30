var qcloud = require('../../vendor/wafer2-client-sdk/index')
var zm = require('../../utils/zm_tools.js')
var config = require('../../config')
var app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    islogin:false,
    name:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qcloud.setLoginUrl(config.service.loginUrl)
    wx.getUserInfo({
      success: this.shouquan
    });
  },
  shouquan:function(e){ 
    let rawData = e["rawData"];
    if(!rawData){
      rawData = e.detail.rawData;
    }
    this.setData({
      islogin:true,
      name:JSON.parse(rawData).nickName
    });
    
    if (!app.globalData.userInfo) {
      zm.get("/user?app=x", { uuid: "" }, function (r) {        
        app.globalData.userInfo = r;
        zm.post("/getziyuan/leixing", {}, function (r) {
          app.globalData.renwuleixing = r.jg;
          wx.switchTab({
            url: '../shouye/shouye'
          })
        });
      })
    }
    //加载类型
    wx.switchTab({
      url: '../shouye/shouye'
    })

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
})