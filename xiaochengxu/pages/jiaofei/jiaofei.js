const app = getApp()
var zm = require('../../utils/zm_tools.js')
// pages/jiaofei/jiaofei.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prepay_id: "",
    _paySignjs: "",
    timeStamp:"",
    nonceStr: "",
    rwid: "",
    rw: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      rwid: options.rwid
    });
    zm.post("/fukuan/fkok", { rwid: options.rwid }, function (jfok) {
      console.log(jfok);
      if (jfok.jg =='已经支付了'){
        wx.showModal({
          title: '提示',
          content: '已经交过费用了',
          showCancel: false,
          success: function (res) {
            //console.log("为了更好的提供服务，请您授权", res);
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
       
      }else{
        //加载任务明细与付款标识
        zm.post("/fukuan/getkey", { rwid: options.rwid }, function (r) {
          console.log("jiaofei", r);
          that.setData({
            prepay_id: r.jg.prepay_id,
            timeStamp: r.jg.timeStamp,
            _paySignjs: r.jg._paySignjs,
            nonceStr: r.nonceStr,
            rw: r.rw
          });
        });
      }
    });
    
  },
  //付款
  fukuan: function () {
    let timestamp = parseInt(this.data.timeStamp).toString();
    console.log("fukuan", {
      'timeStamp': timestamp,
      'nonceStr': this.data.nonceStr,
      'package': 'prepay_id=' + this.data.prepay_id,
      'signType': 'MD5',
      'paySign': this.data._paySignjs});
      var that=this;
    wx.requestPayment({
      'timeStamp': timestamp,
      'nonceStr': that.data.nonceStr,
      'package': 'prepay_id=' + that.data.prepay_id,
      'signType': 'MD5',
      'paySign': that.data._paySignjs,
      'success': function (res) {
        zm.post("/fukuan/fkok", { rwid: that.data.rwid }, function (r) {
          wx.reLaunch({
            url: '../shouye/shouye'
          })
        });
      },
      'fail': function (res) {
        console.log("fukuan",res);
        zm.alert('fail:' + JSON.stringify(res));
      }
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