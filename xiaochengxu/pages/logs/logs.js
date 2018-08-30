//logs.js
const util = require('../../utils/util.js')
const app = getApp()
var zm = require('../../utils/zm_tools.js')
Page({
  data: {
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    tel:"",
    js:0,
    renwulist:{
      xuanshang:0,
      weiban:0,
      shsl:0
    }
  },
  
   /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function () { 
     var that=this;
     if (app.globalData.userInfo){
       this.setData({
         userInfo: app.globalData.userInfo
       })
     }else{
       zm.get("/user",{},function(r){
         that.setData({
           userInfo: r
         })
       })
     }
     console.log("log",this.data.userInfo);
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onShow: function (options) {
     //每次打开查询数量
     var that = this;
     zm.post("/renwu/jishu", { IsAdmin: that.data.userInfo.IsAdmin},function(r){
       that.setData({
         renwulist: r
       })
     })
   },
   /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
   onPullDownRefresh: function () {
     //每次打开查询数量
     var that = this;
     zm.post("/renwu/jishu", { IsAdmin: that.data.userInfo.IsAdmin }, function (r) {
       that.setData({
         renwulist: r
       })
     })
     zm.get("/user", {}, function (r) {
       that.setData({
         userInfo: r
       })
     })
   }
})
