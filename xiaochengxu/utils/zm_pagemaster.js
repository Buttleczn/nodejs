//page通用方法
var page ={
  valuechangge: function (e) {
    let datafild = e.currentTarget.dataset.bind;
    let value = e.detail.value;
    var jso = {};
    jso[datafild] = value;
    console.log(datafild, value);
    this.setData(jso)
  },
  //打电话
  dadianhua: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.dianhua //仅为示例，并非真实的电话号码
    })
  },
  previewImageOne: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
  goback:function(e){
    wx.navigateBack({
      delta: 1
    })
  }
}

module.exports = page;