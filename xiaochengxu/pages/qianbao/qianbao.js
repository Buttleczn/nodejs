const util = require('../../utils/util.js')
const app = getApp()
var zm = require('../../utils/zm_tools.js')
Page({
  data: {
    account: 0,
    openid:''
  },

  onLoad: function (oprions) {
    var that = this;
    //获取当前用户余额
    zm.get("/renwu/get_account", { openid: oprions.openid }, function (r) {
      that.setData({
        account: r.userlist.account,
        openid: oprions.openid
      })
    })
  },

  tixian: function () {
    var that = this;
    if (that.data.account < 1){
      zm.alert("金额小于1元时无法提现");
    }else{
      zm.post("/fukuan/tixian", { rwid: that.data.openid, account: that.data.account }, function (r) {
        console.log(r);
        if (r.isok == "false") {
          zm.alertwait("提现时发生错误");
        } else {
          wx.navigateTo({
            url: '../qianbao/qianbao?openid=' + that.data.openid
          })
          zm.alertok("提现成功");
        }
      })
    }
  },
 
})