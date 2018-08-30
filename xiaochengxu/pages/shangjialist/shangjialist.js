// pages/login/login.js
var zm = require('../../utils/zm_tools.js')
var config = require('../../config')
var app = getApp();

function bindlxfenye(that, rlxlist) {
  let lxfy = [];
  let lxfxone = [];
  let lxindex = 0;
  for (var i = 0; i < rlxlist.length; i++) {
    if (lxindex == 8) {
      lxfy.push(lxfxone);
      lxindex = 0;
      lxfxone = [];
    }
    lxindex++;
    lxfxone.push(rlxlist[i]);
  }
  while (lxindex < 8) {
    lxindex++;
    lxfxone.push({ bm: 'xxxxx', icon: 'xxxxx' + lxindex });
  }
  lxfy.push(lxfxone);
  //console.log("lxfy",lxfy);
  that.setData({
    lxlist: rlxlist,
    lxlistfenye: lxfy
  })
  console.log("lxfy", that.data.lxlistfenye);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    imgsrcbase: config.service.imgsrcbase,  
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    //省市
    weizhi: {},
    region: ['全部'],
    diqu: "全部",
    customItem: '全部',
    paixu: "",
    //关键字
    keys: "",
    //标签类型
    lx:"",    
    lxval: "",
    lxlist: [],
    lxindex: 0,
    lxlistfenye: [],
    //分页
    pagerows: 10,
    pageindex: 0,
    pageend: false,
    zongliulan: 0,
    fabushuliang: 0,
    dianpushuliang: 0,
    rwlist: []
  },
  keyschangge: function (e) {
    let datafild = e.currentTarget.dataset.bind;
    let value = e.detail.value;
    var jso = {};
    jso[datafild] = value;

    this.setData(jso)
    this.chaxunlist();
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

      //加载类型
      zm.get("/getziyuan/shangjialeixing", {}, function (r) {
        bindlxfenye(that, r.jg);
      }, function (x) { }, false);
    
    //获取位置
    if (app.globalData.Address) {
      let Address = app.globalData.Address;
      that.setData({
        xzdq: [Address.addrinfo.province, Address.addrinfo.city, '全部'],
        diqu: Address.addrinfo.city,
        weizhi: Address
      });
      that.chaxunlist();
    } else {
      zm.getAddress({
        cbk: function (r) {
          app.globalData.Address = r;
          that.setData({
            xzdq: [r.addrinfo.province, r.addrinfo.city, '全部'],
            diqu: r.addrinfo.city,
            weizhi: r
          });
          that.chaxunlist();
        }
      })
    }
  },
  shangjiaruzhu:function(e){
    wx.navigateTo({
      url: '../shangjia/shangjia'
    })
  },
  //地区改变
  bindRegionChange: function (e) {
    let xzdq = e.detail.value;
    let diqu = "全部";
    if (xzdq[2] == "全部") {
      if (xzdq[1] == "全部") {
        diqu = xzdq[0]
      } else {
        diqu = xzdq[1]
      }
    } else {
      diqu = xzdq[2]
    }
    this.setData({
      region: e.detail.value,
      diqu: diqu
    })
    this.chaxunlist();
  },
  chaxunlist: function (zhuijia) {
    var that = this;
    if (zhuijia) {
      that.data.pageindex = that.data.pageindex + 1;
      if (that.data.pageend) {
        return;
      }
    } else {
      that.data.pageindex = 0;
      that.data.rwlist = [];
    }
    let cxpara = {
      lx: that.data.lx,
      diqu: that.data.diqu,
      keys: that.data.keys,
      paixu: that.data.paixu,
      pagerows: that.data.pagerows,
      pageindex: that.data.pageindex,
      weizhi_latitude: that.data.weizhi.latitude,
      weizhi_longitude: that.data.weizhi.longitude
    }
   
    zm.get("/shangjia/getall", cxpara, function (r) {
      let pageend = true;
      if (r.rwlist && r.rwlist.length > 0) {
        pageend = false;
      }
      let rwlistc = that.data.rwlist.concat(r.rwlist);
      that.setData({
        pageend: pageend,
        pageindex: r.pageindex,
        zongliulan: r.zongliulan,
        fabushuliang: r.fabushuliang,
        dianpushuliang: r.dianpushuliang,
        rwlist: rwlistc
      })

    });
  },
  bianqiangaibian: function (e) {
    this.setData({
      lxindex: e.detail.value,
      lxval: this.data.lxlist[e.detail.value].bm
    })
    this.chaxunlist();
  },
  shijiangaibian: function (e) {
    this.setData({
      sjindex: e.detail.value,
      sjval: this.data.sjlist[e.detail.value].bm
    })
    this.chaxunlist();
  },
  shangjingaibian: function (e) {
    this.setData({
      shangjinindex: e.detail.value,
      shangjinval: this.data.shangjinlist[e.detail.value].bm
    })
    this.chaxunlist();
  },
  //分类标签点击
  changelx:function(e){
    this.setData({
      lx: e.currentTarget.dataset.param
    })
    this.chaxunlist();
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      lx: "" 
    })
    this.chaxunlist();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    this.chaxunlist(true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})