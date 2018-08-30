// pages/rwmx/rwmx.js
var zm = require('../../utils/zm_tools.js')
var zmpage = require('../../utils/zm_pagemaster.js')
var config = require('../../config')
var app = getApp();
Page(zm.extend({}, zmpage, {

  /**
   * 页面的初始数据
   */
  data: {
    imgsrcbase: config.service.imgsrcbase, 
    mxtype: 0,
    tab: 0,
    moreczlist: [{ bm: "01", mc: "详情" }, { bm: "01", mc: "撤销" }, { bm: "02", mc: "完成" }],
    moreczindex: 0,
    rwid: "",
    shyj: "",
    meno: "",
    shangjia: {
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
    //加载任务明细
    zm.get("/shangjia/getone", { pid: options.pid }, function (r) {
      that.setData({
        shangjia: r,
        rwid: options.pid
      })
    }, function (r) { }, false);
  },
  openweizhi:function(e){
    //打开店铺位置
    let x = parseFloat(this.data.shangjia.weizhi_latitude);
    let y = parseFloat(this.data.shangjia.weizhi_longitude);
    wx.openLocation({
      latitude: x,
      longitude: y,
      name: this.data.shangjia.weizhi_name
    })
  }
}))