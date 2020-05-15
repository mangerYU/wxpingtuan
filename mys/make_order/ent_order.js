var app = getApp(),
  common = require("../../pages/common/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
        list:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    app.util.request({
      url: "entry/wxapp/index",
      data: {
          op: "dianYuanActlist",
          version: app.globalData.version
      },
      success: function(a) {
        console.log(a.data);
        that.setData({
          list:a.data.data
        })
      }

});
  },
  toOrder:function(e){
    var id=e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: './order?id='+id,
    })
  },
  toTuoke:function(e){
    var pid=e.currentTarget.dataset.id;
    var that=this;
    that.setData({
      showhb: !0,
      showShare: !1
  });
     app.util.request({
        url: "entry/wxapp/index",
        data: {
            op: "member_code",
            pid: pid
        },
        success: function(a) {
            var t = a.data;
            "" != t.data && that.setData({
                code: t.data.code,
                showhb: !0,
                showShare: !1
            });
        }
    });

  },
  dlimg: function() {
    app.common.saveImg(this.data.code);
},
  closehb: function() {
    this.setData({
        showhb: !1
    });
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