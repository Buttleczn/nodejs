//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var zm = require('../../utils/zm_tools.js')
const app = getApp()

var tijiaostate=false;
var jisuanfeiyong=function(that) {
  let rwflfy = parseFloat(that.data.lxlist[that.data.lxindex].jg);
  let zdfy = that.data.zhiding ? parseFloat(that.data.zdtslist[that.data.zdtsindex].zdjg) : 0;
  let zffy = that.data.zhuanfa ? (that.data.zshangjin ? parseFloat(that.data.zshangjin):0) : 0;
  console.log("zhuanfa:" + that.data.zhuanfa+"%%%rwflfy:"+rwflfy+"$$$zdfy:"+zdfy+"$$$zffy:"+zffy);
  let fafy= rwflfy + zdfy + zffy;
  //优惠信息
  if (app.globalData.userInfo.chengwei != "游客") {
    fafy = 0;
  }
  that.setData({
    rwflfy: rwflfy,
    zdfy:zdfy,
    fbfy: fafy
    })
  }

Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    imgsrcbase: config.service.imgsrcbase,
    //任务标题
    title: '',

    //标签类型
    lxval: "",
    lxlist: [],
    lxindex: 0,
    rwflfy:0,
    //赏金
    shangjin: "",
    //截止日期 
    riqi: "2018-12-12",
    //一口价
    yikoujia: "",
    //摘要
    zhaiyao: '',
    //任务图片
    files: [],
    imgs: {},
    //关键信息
    keys: '',
    //位置
    weizhi: {
      latitude: "",
      longitude: "",
      name: "",
      fullname: ""
    },
    //电话
    dianhua:"",
    //置顶
    zhiding:"",
    zdtsval:"1",
    zdtslist:["1","2","3","4","5","6","7"],
    zdtsindex:0,
    zdtsjg:0,
    zdfy:0,
    //转发
    zhuanfa:"",
    zshangjin:"",
    zdanjia:"",
    zmaxtiaoshu:0,

    //发布费用
    fbfy:0,

    requestResult: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //获取发布人信息
    if (app.globalData.userInfo && app.globalData.userInfo.chengwei) {
      this.setData({
        dianhua: app.globalData.userInfo.dianhua
      })
      // 获取任务分类列表
      if (app.globalData.renwuleixing.length == 0) {
        //加载类型
        zm.post("/getziyuan/leixing", {}, function (r) {
          app.globalData.renwuleixing = r.jg;
          that.setData({
            lxlist: app.globalData.renwuleixing
          })
          jisuanfeiyong(that);
        });
      } else {
        this.setData({
          lxlist: app.globalData.renwuleixing
        })
        jisuanfeiyong(this);
      }
    } else {
      zm.get("/user", {}, function (r) {
        app.globalData.userInfo = r
        that.setData({
          dianhua: app.globalData.userInfo.dianhua
        })
        // 获取任务分类列表
        if (app.globalData.renwuleixing.length == 0) {
          //加载类型
          zm.post("/getziyuan/leixing", {}, function (r) {
            app.globalData.renwuleixing = r.jg;
            that.setData({
              lxlist: app.globalData.renwuleixing
            })
            jisuanfeiyong(that);
          });
        } else {
          that.setData({
            lxlist: app.globalData.renwuleixing
          })
          jisuanfeiyong(that);
        }
      })
    }
    //获取位置
    zm.getAddress({
      cbk: function (r) {
        that.setData({
          weizhi: r
        })
      }
    })




    //获取置顶天数
    zm.post("/getziyuan/zdts", {}, function (r) {
      that.setData({
        zdtslist: r.jg
      })
    });

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
    jisuanfeiyong(this);
  },
  chooseImage: function (e) {
    var that = this;
    zm.xzImg(9, function (r) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      //that.data.files.concat(res.tempFilePaths)追加数组
      //console.log(r.tempFilePaths)
      //that.data.files.concat(r.tempFilePaths)
      that.setData({
        files: r.tempFilePaths
      });
    });
    console.log(this.data.files);
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: this.data.files[0] // 需要预览的图片http链接列表 
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
  //获取手机号
  getPhoneNumber:function(r){
    //console.log(r);
    var that = this;
    zm.post("/login/gettel", { iv: r.detail.iv, encryptedData: r.detail.encryptedData}, function (e) {
      that.setData({
        dianhua: e.purePhoneNumber
      })
    }); 
  },
  //置顶改变
  zhidingchangge:function(e){
    this.setData({
      zhiding: e.detail.value
    })
    jisuanfeiyong(this);
  },
//置顶天数
  zhidinggaibian:function(e){
    this.setData({
      zdtsindex: e.detail.value,
      zdtsjg: this.data.zdtslist[e.detail.value].zdjg,
      zdtsval: this.data.zdtslist[e.detail.value].zdts
    })
    jisuanfeiyong(this);
  },

  //转发改变
  zhuanfachangge: function (e) {
    this.setData({
      zhuanfa: e.detail.value
    })
    jisuanfeiyong(this);
  },

  //转发金额改变
  zhuanfagaibian:function (e) {
    this.setData({
      zshangjin: e.detail.value
    })
    jisuanfeiyong(this);
  },

  FaBuRenWu: function (e) {
    zm.alertwait("提交中。。。");
    if (tijiaostate){
return;
    }
    tijiaostate =!tijiaostate;
    //校验数据
    if (!this.data.title) {
      tijiaostate = !tijiaostate;
      zm.alert("标题必须填写"); return;
    }
    if(this.data.zshangjin < this.data.zdanjia){
      zm.alert("转发赏金单条价格必须不大于预计转发赏金总额"); return;
    }
    //保存能够转发的最大条数
    if(this.data.zdanjia != 0){
      var zmax = parseInt(this.data.zshangjin / this.data.zdanjia);
      this.setData({
        zmaxtiaoshu: zmax
      })
    }
    if (this.data.files.length < 1) {
      tijiaostate = !tijiaostate;
      zm.alert("请上传图片"); return;
    }
    if (!this.data.lxval) {
      this.data.lxval = this.data.lxlist[this.data.lxindex].bm;
    }
    if (!this.data.shangjin) {
      this.data.shangjin="0";
    }
    //优惠信息
    if (app.globalData.userInfo.chengwei !="游客"){
      this.data.fbfy = 0;
    }


    var that = this;
    console.log('上传图片开始');
    //通过校验后，保存暂存的图片
    zm.upfiles(this.data.files, function (r) {
      console.log('上传图片成功', r);
      //绑定返回的信息
      that.data.img = r;
      console.log(that.data)
      zm.post("/renwu/adds", that.data, function (e) {
        if (e.isok) {
          zm.alertok("保存成功！");
          if (that.data.fbfy==0){
            wx.switchTab({
            url: '../logs/logs'
          });
          }else{
            wx.navigateTo({
              url: '../jiaofei/jiaofei?rwid=' + e.pid　　// 页面 A
            })
          }
          }
        tijiaostate = !tijiaostate;
      });
    });
  }
})
