// pages/renwulist/renwulist.js
const app = getApp()
var zm = require('../../utils/zm_tools.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    js:0,
    rwtype:"0",
  rwlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    //查询列表
    var that=this;
    zm.post("/renwu/getmine", { pageindex: this.data.js, rwtype: options.rwtype, rwfl:options.rwfl},function(r){ 
      that.setData({
        rwlist:r.rwlist,
        rwtype: options.rwtype
      })
    })
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