//app.js
var login = require('./vendor/wafer2-client-sdk/lib/login');
var config = require('./config')
var zm = require('./utils/zm_tools.js')
var qcloud = require('./vendor/wafer2-client-sdk/index')
var thatapp;
var shouquan=function(){
  wx.openSetting({
    success: (res) => {
      console.log("opensetting",res);
      if (res.authSetting['scope.userInfo']==undefined){
        wx.navigateTo({
          url: '../login/login'
        })
      }else
      if (res.authSetting['scope.userLocation'] && res.authSetting['scope.userInfo']) {
        qcloud.setLoginUrl(config.service.loginUrl);
        if (!thatapp.globalData.userInfo) {
          zm.get("/user?app=x", { uuid: "" }, function (r) {
            thatapp.globalData.userInfo = r;
            zm.post("/getziyuan/leixing", {}, function (r) {
              thatapp.globalData.renwuleixing = r.jg;
              thatapp.reloadpage();
            });
          })
        }
      }else{
        tishishouwuan();
      }
    },
    fail:function(r){

    }
  })
}
var tishishouwuan=function(){
  wx.showModal({
    title: '提示',
    content: '为了更好的提供服务，请您授权',
    showCancel:false,
    success:function(res){
      console.log("为了更好的提供服务，请您授权", res);
      if (res.confirm) {
        shouquan();
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    },
    fail: function (r) {
      console.log('授权失败。',r);
    },
    complete:function(c){
      console.log('授权失败,complete。', c);
      if (!c.confirm){
        tishishouwuan();
      }
    }
  })
}

App({
  onLaunch: function () {
    var that = this;
    wx.getLocation();
    thatapp=this;
    console.log("config.service.loginUrl" + config.service.loginUrl);
    //
    wx.getUserInfo({
      success:function(r){
        qcloud.setLoginUrl(config.service.loginUrl);
        if (!that.globalData.userInfo) {
          zm.get("/user?app=x", { uuid: "" }, function (r) {
            that.globalData.userInfo = r;
            zm.post("/getziyuan/leixing", {}, function (rx) {
              that.globalData.renwuleixing = rx.jg;
              // wx.reLaunch({
              //   url: '../shouye/shouye'
              // })
            });
          })
        }
        // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
        wx.getSetting({
          success(res) {
            console.log("wx.getSetting_" + res.authSetting['scope.userLocation'], res);
            if (!res.authSetting['scope.userLocation']) {
              wx.authorize({
                scope: 'scope.userLocation',
                success(r) {
                  console.log("scope.userLocation", r);
                },
                fail(r) {
                  tishishouwuan();
                }
              })
            }
          }
        });  
      },
      fail:function(r){
        tishishouwuan();
      }
    })
   
    
  },
  reloadpage:function(){
    qcloud.setLoginUrl(config.service.loginUrl);
    wx.reLaunch({
      url: 'pages/shouye/shouye'
    })
  },
  globalData: {
    userInfo: null,
    Address: null,
    renwuleixing:[]
  }
})