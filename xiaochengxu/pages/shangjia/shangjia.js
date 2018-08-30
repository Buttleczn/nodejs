//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var zm = require('../../utils/zm_tools.js')
const app = getApp()
var tijiaostate=false;
Page({
  data: {
    userInfo: {},
    imgsrcbase: config.service.imgsrcbase,
    //任务标题
    title: '',

    //标签类型
    lxval: "",
    lxlist: [],
    lxindex: 0,
    rwflfy: 0,
   
    //营业开始时间
    starttime: "08:00",
    //营业结束时间
    endtime: "20:00",
    //摘要
    zhaiyao: '',
    //商标
    shangbiaofiles: [],
    shangbiaoimgs: {},
    //店面
    dianmianfiles: [],
    dianmianimgs: {},
    
    //位置
    weizhi: {
      latitude: "",
      longitude: "",
      name: "",
      fullname: ""
    },
    //电话
    dianhua: "",


    requestResult: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取发布人信息
      zm.get("/user", {}, function (r) {
        app.globalData.userInfo = r; 
        //加载类型
        zm.post("/getziyuan/shangjialeixing", {}, function (r) {
            app.globalData.renwuleixing = r.jg;
            that.setData({
              lxlist: app.globalData.renwuleixing
            })            
          });       
      })
    //获取位置
    zm.getAddress({
      cbk: function (r) {
        that.setData({
          weizhi: r
        })
      }
    })
  },
  valuechangge: function (e) {
    let datafild = e.currentTarget.dataset.bind;
    let value = e.detail.value;
    var jso = {};
    jso[datafild] = value;

    this.setData(jso)
  },
  bianqiangaibian: function (e) {
    this.setData({
      lxindex: e.detail.value,
      lxval: this.data.lxlist[e.detail.value].bm
    })
    
  },
  chooseImage: function (e) {
    let datafild = e.currentTarget.dataset.bind;
    var that = this;
    zm.xzImg(1, function (r) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      //that.data.files.concat(res.tempFilePaths)追加数组
      let files={};
      files[datafild] = r.tempFilePaths;
      that.setData(files);
    });
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
  xuanzeweizhi: function (e) {
    var that = this;
    zm.getAddress({
      type: 1,
      cbk: function (r) {
        that.setData({
          weizhi: r
        })
      }
    })
  },
   
  FaBuRenWu: function (e) {
    zm.alertwait("提交中。。。");
    if (tijiaostate) {
      return;
    }
    tijiaostate = !tijiaostate;
    //校验数据
    if (!this.data.title) {
      tijiaostate = !tijiaostate;
      zm.alert("店铺名称必须填写"); return;
    }
    if (this.data.shangbiaofiles.length < 1) {
      tijiaostate = !tijiaostate;
      zm.alert("请上传商标图片"); return;
    }
    if (this.data.dianmianfiles.length < 1) {
      tijiaostate = !tijiaostate;
      zm.alert("请上传店面图片"); return;
    }
    if (!this.data.dianhua) {
      tijiaostate = !tijiaostate;
      zm.alert("店铺电话必须填写"); return;
    }
    if (!this.data.lxval) {
      this.data.lxval = this.data.lxlist[this.data.lxindex].bm;
    } 
    var that = this;
    console.log('上传图片开始');
    //通过校验后，保存暂存的图片
    zm.upfile(this.data.shangbiaofiles[0], function (r) {
      //上传商标图片
      that.data.shangbiaoimgs = r.pid;
      zm.upfile(that.data.dianmianfiles[0], function (rx) {
        //上传店面图片
        that.data.dianmianimgs = rx.pid;
      zm.post("/shangjia/add", that.data, function (e) {
        if (e.isok) {
          zm.alertok("保存成功！");
          wx.reLaunch({
            url: '../shouye/shouye'
          });
        }
        tijiaostate = !tijiaostate;
      });
      });
    });
  }
})
