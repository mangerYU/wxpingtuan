// beauty_shop/mys/activity.js
var app = getApp(),
  common = require("../../pages/common/common.js");
  const util = require('../../../utils/util.js');
Page({
  data: {
    navbar: ['未激活', '进行中', '已完成', '已失效'],
    orderCode: '',
    countTime: [],
    list: [],
    idIndex: 1,
    hides:0,
    id:'',
    page:1,
    pagesize:20,
    wearList:[]

  },
  onLoad: function (options) {
    console.log(options.id);
    var that=this;
    that.setData({
      hides:0,
      id:options.id
    })
    that.getlist();
  },
  navbarTap: function (e) {
    let idx = e.currentTarget.dataset.idx;
    this.setData({
      idIndex: idx + 1
    });
    wx.pageScrollTo({
      scrollTop: 0,
    })
    this.getlist();
  },
  phone: function (p) {
      var phoneNum=p.currentTarget.dataset.phid;
      console.log("phid:"+phoneNum);
    wx.makePhoneCall({
      phoneNumber:phoneNum,
    })
  },
  affirm:function(e){
    var tuanid=e.currentTarget.dataset.tuanid;
    console.log(tuanid);
    app.util.request({
      url: "entry/wxapp/index",
      data: {
          op: "updateGroupTuokeStatusByOver",
          version: app.globalData.version,
          gid:tuanid
      },
      success: function(a) {
          console.log("123"+a.data.message);
          if(a.data.errno>1){
            console.log("123"+a.data.message);
            wx.showModal({
              title: '提示',
              content: a.data.message+",去跳转首页",
              success: function(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../pages/base/base.wxml'
                })
              } else if (res.cancel) {
              console.log('用户点击取消')
              }
              }
              })
            
          }

      }

});
  },
  onReachBottom: function() {
    console.log("加载中"+this.data.page);
    wx.showLoading({
      title: '玩命加载中..',
    })
    this.getlist();
},
  getlist: function () {
    var that = this;
    var token_stat = that.data.idIndex;
    var id=that.data.id;
    var page=that.data.page;
    var pagesize=that.data.pagesize;
    app.util.request({
      url: "entry/wxapp/index",
      data: {
        op: "dianYuanManageActList",
        version: app.globalData.version,
        tuoke_status: token_stat,
        page:page,
        pagesize:pagesize,
        pid:id
      },
      success: function (a) {
        var data = a.data.data;
        that.setData({ list: data });
       console.log(data);
       if( typeof(data) == "undefined" || data=="" || data.length==0){
          that.setData({ hides:0 });
          console.log(that.data.hides);
          
       }else{
        that.setData({ hides:1});
        console.log(that.data.hides);
        var len=that.data.list;
        function nowTime() {
          for (var i = 0; i < len.length; i++) {  
            if(that.data.list[i].status==1){
                  that.setData({
                    proType:'未激活'
                  })
            } else if(that.data.list[i].status==2){
              that.setData({
                proType:'进行中'
              })
            } else if(that.data.list[i].status==3){
              that.setData({
                proType:'已完成'
              })
            } else if(that.data.list[i].status==4){
              that.setData({
                proType:'已失效'
              })
            }else{
              that.setData({
                proType:''
              })
            }
           var intDiff =that.data.list[i].time;
           var day=0, hour=0, minute=0, second=0; 
           var bgcolor;
           var daynumber;   
           var days;
           if(intDiff > 0){
            day = Math.floor(intDiff / (60 * 60 * 24));
            hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
            minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            if(hour <=9) hour = '0' + hour;
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            that.data.list[i].time--;      
           var str=hour+':'+minute+':'+ second;
           if(day<=0||day==''){
              days='';
           }else{
            days=day+'天';  
           }
           if(day<3){
                bgcolor='../../resource/red.png',
                daynumber='三天内'
           }else if(day>=3&&day<5){
            bgcolor='../../resource/yellow.png',
            daynumber='五天内'
           }else if(day<7){
            bgcolor='../../resource/blue.png',
            daynumber='七天内'
           }else{
            bgcolor='../../resource/blue.png',
            daynumber='七天外'
           }
           }else{
            var str = "已结束！";
              bgcolor='../../resource/red.png',
              daynumber=that.data.proType;
          
            //clearInterval(timer); 
           }
          that.data.list[i].timeout= str;//在数据中添加difftime参数名，把时间放进去
          that.data.list[i].timeday= daynumber;
          that.data.list[i].timebg= bgcolor;
          that.data.list[i].todays= days;
          }

         }
         nowTime();
         var wear=that.data.wearList;
         that.setData({
           page: page+=1,
           wearList:wear.concat(that.data.list)
         })
         var timer = setInterval(nowTime, 1000);
        
       };

      }
    })
  }
})