// pages/login/login.js
var zm = require('../../utils/zm_tools.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    //排序标签
    tabs: ["最新任务", "距离最近"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    //省市
    weizhi: {},
    region: ['全部'],
    diqu: "全部",
    customItem: '全部',
    inputVal: "",
    //关键字
    keys: "",
    //标签类型
    lxval: "",
    lxlist: [],
    lxindex: 0,
    //分页
    pagerows: 10,
    pageindex: 0,
    pageend: false,
    zongliulan:0,
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
    var that=this;
    //获取位置
    let Address = app.globalData.Address;
    that.setData({
      xzdq: [Address.addrinfo.province, Address.addrinfo.city, '全部'],
      diqu: Address.addrinfo.city,
      weizhi: Address
    });
    //查询列表
    this.setData({
      lx: options.rwfl
    });


    this.chaxunlist();
  },
  //打电话
  dadianhua: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.dianhua //仅为示例，并非真实的电话号码
    })
  },
  //排序标签切换
  tabClick: function (e) {
    console.log(e.currentTarget);
    this.setData({
      paixu: this.data.tabs[e.currentTarget.id],
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    this.chaxunlist();
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
      lx:that.data.lx,
      diqu: that.data.diqu,
      keys: that.data.keys,
      paixu: that.data.paixu,
      pagerows: that.data.pagerows,
      pageindex: that.data.pageindex,
      weizhi_latitude: that.data.weizhi.latitude,
      weizhi_longitude: that.data.weizhi.longitude
    }
    zm.get("/renwu/getall", cxpara, function (r) {
      let pageend=true;
      if (r.rwlist && r.rwlist.length > 0) {
        pageend=false;
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
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
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