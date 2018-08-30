var qcloud = require('../vendor/wafer2-client-sdk/index')
var config = require('../config')
var util = require('../utils/util.js')

//登陆后台
var login = function (successcallback){
  // 调用登录接口
  qcloud.login({
    success(result) {
      successcallback();
    },
    fail(error) {
      util.showModel('登录失败', error)
      console.log('登录失败', error)
    }
  })
}
//提示信息
var alert=function(msg){
  util.showModel("提示",msg);
}
//等待提示
var alertwait=function(msg){
  util.showBusy(msg);
}
//成功提示
var alertok = function (msg) {
  util.showSuccess(msg);
}

//请求后台，url为server相对地址，例如：/demo
var post = function (url, data, successcallback,errorcallback){ 
  console.log(url);
  var that = this
  qcloud.request({
    url: `${config.service.host}/weapp`+url,
    method: 'POST',
    data: data,
    login: true,
    success(result) {
      console.log(`${config.service.host}/weapp` + url);
      successcallback(result.data.data);

    },
    fail(error) {
      if (error.message=="登录态已过期x"){
        //如果登陆超时，重新登陆再调用一次
        // login(function(){
        //   post(url, data, successcallback, errorcallback);
        // });
      }else{
        if (errorcallback) {
          errorcallback(error);
        } else if (error.message=="获取微信用户信息失败，请检查网络状态"){

        }        
        else {
          util.showModel('请求失败', error);
          console.log('request fail', error);
        }   
      }
    }
  })
}
//会显示等待标题
var postwait = function (waittext,url, data, successcallback, errorcallback) {
  util.showBusy('请求中...');
  post(url, data, successcallback, errorcallback);
}
//请求后台，url为server相对地址，例如：/demo
var get = function (url, data, successcallback,errorcallback,islogin) {
  console.log("get" + islogin,url);
  let logi=true;
  if (islogin==false){
    logi=false;
  }
  var that = this
  qcloud.request({
    url: `${config.service.host}/weapp` + url,
    method: 'GET',
    data: data,
    login: logi,
    success(result) {
      successcallback(result.data.data);
    },
    fail(error) {
      if (error.message == "获取微信用户信息失败，请检查网络状态") {
        wx.authorize({
          scope: 'scope.userInfo',
          success() {
            wx.getUserInfo()
          },
          fail(scopeerror) {
            console.log('scope.userInfo', scopeerror);
          }
        })
      }
      else  {
        if (errorcallback) {
          errorcallback(error);
        } else {
          util.showModel('请求失败', error);
          console.log('request fail', error);
        }
      }
    }
  })
}
//会显示等待标题
var getwait = function (waittext, url, data, successcallback, errorcallback) {
  util.showBusy('请求中...');
  get(url, data, successcallback, errorcallback);
}

//选择照片（只是选择，不会上传）：数量，回调
var xzImg = function (shuliang=9, successcallback, errorcallback){
  wx.chooseImage({
    count: shuliang,//最多可以选择的图片张数，默认9
    sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
    sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      //wx.saveFile(res.tempFilePaths);
      successcallback(res);
    },
    fail: function (error) {
      //util.showModel('上传图片失败', error);
      console.log('request fail', error);
    }
  })
  
}
//上传资源：本地资源资质
var upfile = function (filepath, successcallback, errorcallback){
  // 上传图片
  console.log('上传图片', filepath)
  wx.uploadFile({
    url: config.service.uploadUrl,
    filePath: filepath,
    name: 'file',
    header: { "Content-Type": "multipart/form-data"
     },
    formData: {
      'user': 'test'
    },
    success: function (res) {
     //util.showSuccess('上传图片成功')
     let jg = JSON.parse(res.data).data;
     console.log('jg:' +jg);
      successcallback(jg);
    },

    fail: function (e) {
      console.log("上传图片失败",e);
    }
  })
}
//上传资源：本地图片多张
var upfiles = function (filepath, successcallback, errorcallback) {
  // 上传图片
  console.log('上传图片', filepath)
  var jgs = new Array();
  var i=0;
  for(var index in filepath){
    wx.uploadFile({
      url: config.service.uploadUrl,
      filePath: filepath[index],
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        'user': 'test'
      },
      success: function (res) {
        //util.showSuccess('上传图片成功')
        //let jg = JSON.parse(res.data).data;
        if(!jgs){
          jgs = JSON.parse(res.data).data;
        }else{
          jgs.push(JSON.parse(res.data).data);
        }
        i++;
        if(filepath.length == i){
          console.log("filepath:"+filepath.length+"$$"+"count:"+i)
          successcallback(jgs);
        }
      },

      fail: function (e) {
        console.log("上传图片失败", e);
      }
    })
  }
}

var extend= function (target) {
  var sources = Array.prototype.slice.call(arguments, 1);

  for (var i = 0; i < sources.length; i += 1) {
    var source = sources[i];
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};
//获取微信信息，参数为json{type:[有，就是调用地图页面手动动选择位置]cbk:[成功回调，latitude:维度，longitude：经度，name：地名，fullname：详细地名]}
var getAddress=function(a){ 
if(a.type){
  wx.chooseLocation({
    success: function (r) {
      getaddinfo(r.latitude, r.longitude, a.cbk);
    }
  });
}else{
  wx.getLocation({
    success: function (r) {
      getaddinfo(r.latitude, r.longitude, a.cbk);
    },
    fail:function(r){
     
    }
  });
}
}
var getaddinfo = function (latitude, longitude,cbk){ 
  qcloud.request({
    url: "https://apis.map.qq.com/ws/geocoder/v1/",
    method: 'GET',
    data: {
      location: `${latitude},${longitude}`,
      key: "FHVBZ-5IQW3-XID3B-Y66SS-NUSRF-L4BLB"
    },
    success(result) { 
      let rjs={
        latitude: latitude,
        longitude: longitude,
        name: result.data.result.formatted_addresses.recommend,
        addrinfo: result.data.result.address_component,
        fullname: result.data.result.address
      }
      if (cbk){
        cbk(rjs);
      }
    },
    fail: function (err) {
      alert(err);
    }
  }); 
}
module.exports = { alert, alertwait, alertok, post, postwait, get, getwait, xzImg, upfile, upfiles, extend, getAddress}