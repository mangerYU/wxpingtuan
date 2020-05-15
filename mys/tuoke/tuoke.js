var app = getApp(), common = require("../../pages/common/common.js"), util = require("../../../utils/util.js");
Page({
    data: {
      img:"../../resource/login.png",
      but_img:"https://meibo-1254316594.cos.ap-shanghai.myqcloud.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F/tuoke_button.png",
      tuan_bgimg:"https://meibo-1254316594.cos.ap-shanghai.myqcloud.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F/tuanbg.png",
      top_bgimg:'',
      tkbg_login:"https://meibo-1254316594.cos.ap-shanghai.myqcloud.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F/tkbg_login.png",
      tkbg_fenx:"https://meibo-1254316594.cos.ap-shanghai.myqcloud.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F/fenx_bg.png",
      user_bg:"https://meibo-1254316594.cos.ap-shanghai.myqcloud.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F/towuser.png",
      top_black:"https://meibo-1254316594.cos.ap-shanghai.myqcloud.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F/black.png",
      guize_bg:"https://meibo-1254316594.cos.ap-shanghai.myqcloud.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F/guize_bg.png",
      butText:'立即领取',
      butTitle:'限时领取',
      type:1,
      isRuleTrue:false,
      ifbut:1,
      buttype:0,
      time:'',
      userlist:[],
      urlparam:'',
      phone:'',
      gid:0,
      newtimes:0,
      cstime:'',
      userlist_Title:"",
      content2:"",
      content:''
    },
    onLoad: function(a) {
        console.log("a");
        console.log(a);
        var _this = this;      
        if(a.fxtuoke_){
            _this.setData({ 
                did:a.did,
                pid:a.pid,
                gid:a.gid
            });
            console.log("参团进入:"+_this.data.did);
            _this.activityInformation();
            _this.getTimes();
        }else{
            _this.setData({
                urlparam:a.tuoke,
            })
            _this.getTimes();
            _this.geturl();  
            _this.activityInformation();
        }
      },

      //获取url中的bid,pid
      geturl:function(){
        var that=this;
        //todo 20200511 获取参数,包含did 员工id , pid , 产品id
        //格式:@did@3@pid@19@status@1=开团/2=拼团
        var url_param = that.data.urlparam;

        var pid;
        var did;
        var status;
        console.log("22222",url_param);
        if(url_param){
          var url_param_arr = url_param.split('@');

          pid = url_param_arr[4];
          did = url_param_arr[2];
          that.setData({
            pid:pid,
            did:did
          })
        }
      },
      //遮罩层隐藏
    zhezhao_on:function(){
        this.setData({
            isRuleTrue:false
        })
    },
    //点击页面1按钮
    menu_on: function() {
        var m=this;
        m.setData({
            isRuleTrue:true
        })
        var getinfo = wx.getStorageSync('two_userInfo') || [];
        console.log("getinfo");
        console.log(getinfo);
        console.log(getinfo.nick+getinfo.mobile);
        var phone=getinfo.mobile;
        if(getinfo.nick==undefined||getinfo.nick==''){
            m.setData({ buttype:1 }) 
        }else if(phone==null||phone==""){
            m.setData({ buttype:2 }) 
        }else{ 
            m.setData({ buttype:3}) 
        }
       
    },
    //页面活动信息接口1
    activityInformation:function(){
        var _this=this;
        var pid=_this.data.pid;
        var did=_this.data.did;
        var gid=_this.data.gid;
        console.log("gid"+gid);
        app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "activityInformation",
                version: app.globalData.version,
                pid:pid,
                did:did,
                gid:gid
            },
            success: function(a) { 
                console.log(a.data.data.user_info);
                _this.setData({
                    top_bgimg:a.data.data.act_info.simg,
                    content2:a.data.data.act_info.content2,
                    
                })
                app.wxParse.wxParse("content2", "html", _this.data.content2, _this, 5);
                    console.log("富文本",_this.data.content2);

                var actInfo,orderInfo,title,onename,twoname;
                actInfo="";
               orderInfo="";
               onename="";
               twoname="";
               //判断是否有信息
                if(a.data.data.user_info.length!=0 && a.data.data.user_info!=""){
                    actInfo=a.data.data.user_info;
                }else {
                    _this.setData({
                        buttype:1,
                        isRuleTrue:true,
                        type:1,
                        userlist_Title:"点击按钮领取限时美丽礼包"
                    }); 
                    return;
                }
                  //判断是否有昵称和头像
                if(a.data.data.user_info.nick!="" && a.data.data.user_info.avatar!=""){
                   actInfo=a.data.data.user_info; 
                   _this.kthideName(a.data.data.user_info.nick);
                }else {            
                        _this.setData({
                            buttype:1,
                            isRuleTrue:true,
                            type:1,
                            ifbut:1,
                            butText:'立即领取',
                            userlist_Title:"点击按钮领取限时美丽礼包"
                        });   
                        return;
                }   
                //判断是否有手机号
                if(a.data.data.user_info.mobile==""){
                    _this.setData({
                        buttype:2,
                        butText:"立即激活",
                        ifbut:2,
                        type:2,
                        userlist_Title:'到店凭手机号领取礼包,请授权手机号',
                        'userlist.one.avatar':a.data.data.user_info.avatar
                     }) ;
                    _this.getTimes();
                    return;
                }
                wx.setStorageSync('two_userInfo', actInfo);   //将信息缓存
                //如果有手机号和昵称进入分享并开团
                if(a.data.data.user_info.mobile!="" && a.data.data.user_info.nick!=""){
                    _this.setData({
                        buttype:3,
                        butText:'立即分享',
                        type:2,
                        userlist:orderInfo
                    }) ;
                 _this.kaituan();
                }
                //名字过多就隐藏多余的
                if(a.data.data.order_list.length!=0||a.data.data.order_list!=""){
                    orderInfo=a.data.data.order_list;
                    if(orderInfo.one.nick!="" && typeof(orderInfo.one.nick) != "undefined"){
                        onename=orderInfo.one.nick;
                        _this.kthideName(onename);
                    if(orderInfo.two.nick!=""&& typeof(orderInfo.two.nick) != "undefined"){
                        console.log("1",orderInfo.two.nick);
                        twoname=orderInfo.two.nick;
                        _this.hideName(onename,twoname);
                    }
                    }
               
                }
                if(a.data.data.act_info!=""){
                     title=a.data.data.act_info.name;
                    wx.setNavigationBarTitle({ title: title })
                }
                console.log("activityInformation---success");
                console.log(a);            
            } ,   
            fail: function(a) {
                console.log(a.data.data);
                _this.setData({
                    top_bgimg:a.data.data.act_info.simg,
                    content2:a.data.data.act_info.content2,
                    
                })
                app.wxParse.wxParse("content2", "html", _this.data.content2, _this, 5);
                console.log("富文本",_this.data.content2);
                console.log(a);
                var errno=a.data.errno;
                var message=a.data.message;
            
                if(errno==2){   
                    console.log(message);           
                    wx.showToast({
                        title:message,
                        duration: 3000
                    })
                    setTimeout(function() {
                        wx.navigateTo({
                            url: '../../pages/index/index',
                          })
                    },3000);
                    return
                }
                if(errno==3){
                    console.log(message);
                    wx.showToast({
                        title:message,
                        duration: 3000
                    })
                    setTimeout(function() {
                        wx.navigateTo({
                            url: '../../pages/index/index',
                          })
                    },3000);
                    return
                }
                if(errno==4){
                    console.log(message);
                    wx.showToast({
                        title:message,
                        duration: 3000
                    })
                    setTimeout(function() {
                        wx.navigateTo({
                            url: '../../pages/index/index',
                          })
                    },3000);
                    return
                }
                if(errno==5){
                    console.log(message);
                    wx.showToast({
                        title:message,
                        duration: 3000
                    })
                    setTimeout(function() {
                        wx.navigateTo({
                            url: '../../pages/index/index',
                          })
                    },3000);
                
                    return
                }
                var orderInfo=a.data.data.order_list;
                var onename,twoname="";
                var ktname,ktimg,ktUserInfo="";
                if(orderInfo.one.nick!="" && typeof(orderInfo.one.nick) != "undefined"){
                    onename=orderInfo.one.nick;
                    _this.kthideName(onename);
                    if(orderInfo.two.nick!="" && typeof(orderInfo.two.nick) != "undefined"){
                        console.log("3",orderInfo.two.nick);
                        twoname=orderInfo.two.nick;
                        _this.hideName(onename,twoname);
                  }
                }
            
              if(a.data.data.kaituan_user_info.length!=0){
                ktUserInfo=a.data.data.kaituan_user_info;
              }

              if(a.data.data.kaituan_user_info.nick!="" && typeof(a.data.data.kaituan_user_info.nick) != "undefined"){
                ktname=a.data.data.kaituan_user_info.nick;
                ktimg=a.data.data.kaituan_user_info.avatar;
              }
                console.log(a.data.errno);
                if(errno==1){
                    console.log(message);
                    _this.setData({
                        buttype:1,
                        isRuleTrue:true,
                    });
                }
           
                if(errno==6){
                    console.log(message);
                  _this.setData({
                    type:3,
                    userlist_Title:"您发起的领取活动已到期,请点击按钮重新领取",
                    ifbut:2,
                    butText:"重新领取",
                    userlist:orderInfo,
                  })

                }
                if(errno==7){
                    console.log(message);
                    _this.setData({
                      type:3,
                      userlist_Title:"恭喜您领取成功",
                      ifbut:2,
                      butText:"再领一份",
                      userlist:orderInfo,
                    })
                }
                if(errno==8){
                    console.log(message);
                    _this.setData({
                      type:2,
                      userlist_Title:"邀请一位好友和您一同到店领取美丽礼包",
                      ifbut:1,
                      butText:"邀请好友",
                      userlist:orderInfo,
                    })

                }
                if(errno==9){
                    console.log(message);
                    _this.setData({
                      type:3,
                      userlist_Title:"您发起的领取活动已到期,请点击按钮重新领取",
                      ifbut:2,
                      butText:"重新领取",
                      userlist:orderInfo,
                    })
                }
                if(errno==10){
                    console.log(message);
                    _this.setData({
                      type:3,
                      userlist_Title:"礼包激活成功,与您的好友一起到店领取吧",
                      ifbut:2,
                      butText:"再领一份",
                      userlist:orderInfo,
                    })
                }
          
                if(errno==11){
                    console.log(message);
                    _this.kthideName(ktname);
                    _this.setData({
                      type:2,
                      userlist_Title:"快和好友一起领取美丽大礼包 ",
                      ifbut:3,
                      butText:"一起领取",
                      one_name:ktname,
                      'userlist.one.avatar':ktimg,
                    })
                }
                if(errno==12){
                    console.log(message);               
                    _this.kthideName(ktname);
                    _this.setData({
                      type:2,
                      userlist_Title:"快和好友一起领取美丽大礼包",
                      ifbut:3,
                      butText:"一起领取",
                      one_name:ktname,
                      'userlist.one.avatar':ktimg,
                    })
                }
                if(errno==13){
                    console.log(message);
                    _this.kthideName(ktname);
                    _this.setData({
                      type:2,
                      userlist_Title:"快和好友一起领取美丽大礼包",
                      ifbut:3,
                      butText:"一起领取",
                      one_name:ktname,
                      'userlist.one.avatar':ktimg,
                    })
                }
                if(errno==14){
                    console.log(message);
                    _this.setData({
                      type:3,
                      userlist_Title:"礼包激活成功,与您的好友一起到店领取吧",
                      ifbut:2,
                      butText:"再领一份",
                      userlist:orderInfo
                    })
                }

            }
      });
    },
    finInformation:function(){
        var _this=this;
        var pid=_this.data.pid;
        var did=_this.data.did;
        app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "activityInformation",
                version: app.globalData.version,
                pid:pid,
                did:did
            },
            success: function(a) { 
                console.log(a.data.data.user_info);
                _this.setData({
                    top_bgimg:a.data.data.act_info.simg,
                    content2:a.data.data.act_info.content2,
                    
                })
                app.wxParse.wxParse("content2", "html", _this.data.content2, _this, 5);
                    console.log("富文本",_this.data.content2);

                var actInfo,orderInfo,title,onename,twoname;
                actInfo="";
               orderInfo="";
               onename="";
               twoname="";
               //判断是否有信息
                if(a.data.data.user_info.length!=0 && a.data.data.user_info!=""){
                    actInfo=a.data.data.user_info;
                }else {
                    _this.setData({
                        buttype:1,
                        isRuleTrue:true,
                        type:1,
                        userlist_Title:"点击按钮领取限时美丽礼包"
                    }); 
                    return;
                }
                  //判断是否有昵称和头像
                if(a.data.data.user_info.nick!="" && a.data.data.user_info.avatar!=""){
                   actInfo=a.data.data.user_info; 
                   _this.kthideName(a.data.data.user_info.nick);
                }else {            
                        _this.setData({
                            buttype:1,
                            isRuleTrue:true,
                            type:1,
                            ifbut:1,
                            butText:'立即领取',
                            userlist_Title:"点击按钮领取限时美丽礼包"
                        });   
                        return;
                }   
                //判断是否有手机号
                if(a.data.data.user_info.mobile==""){
                    _this.setData({
                        buttype:2,
                        butText:"立即激活",
                        ifbut:2,
                        type:2,
                        userlist_Title:'到店凭手机号领取礼包,请授权手机号',
                        'userlist.one.avatar':a.data.data.user_info.avatar
                     }) ;
                    _this.getTimes();
                    return;
                }
                wx.setStorageSync('two_userInfo', actInfo);   //将信息缓存
                //如果有手机号和昵称进入分享并开团
                if(a.data.data.user_info.mobile!="" && a.data.data.user_info.nick!=""){
                    _this.setData({
                        buttype:3,
                        butText:'立即分享',
                        type:2,
                        userlist:orderInfo
                    }) ;
                 _this.kaituan();
                }
                //名字过多就隐藏多余的
                if(a.data.data.order_list.length!=0||a.data.data.order_list!=""){
                    orderInfo=a.data.data.order_list;
                    if(orderInfo.one.nick!="" && typeof(orderInfo.one.nick) != "undefined"){
                        onename=orderInfo.one.nick;
                        _this.kthideName(onename);
                    if(orderInfo.two.nick!=""&& typeof(orderInfo.two.nick) != "undefined"){
                        console.log("1",orderInfo.two.nick);
                        twoname=orderInfo.two.nick;
                        _this.hideName(onename,twoname);
                    }
                    }
               
                }
                if(a.data.data.act_info!=""){
                     title=a.data.data.act_info.name;
                    wx.setNavigationBarTitle({ title: title })
                }
                console.log("activityInformation---success");
                console.log(a);            
            } ,   
            fail: function(a) {
                console.log(a.data.data);
                _this.setData({
                    top_bgimg:a.data.data.act_info.simg,
                    content2:a.data.data.act_info.content2,
                    
                })
                app.wxParse.wxParse("content2", "html", _this.data.content2, _this, 5);
                console.log("富文本",_this.data.content2);
                console.log(a);
                var errno=a.data.errno;
                var message=a.data.message;
            
                if(errno==2){   
                    console.log(message);           
                    wx.showToast({
                        title:message,
                        duration: 3000
                    })
                    setTimeout(function() {
                        wx.navigateTo({
                            url: '../../pages/index/index',
                          })
                    },3000);
                    return
                }
                if(errno==3){
                    console.log(message);
                    wx.showToast({
                        title:message,
                        duration: 3000
                    })
                    setTimeout(function() {
                        wx.navigateTo({
                            url: '../../pages/index/index',
                          })
                    },3000);
                    return
                }
                if(errno==4){
                    console.log(message);
                    wx.showToast({
                        title:message,
                        duration: 3000
                    })
                    setTimeout(function() {
                        wx.navigateTo({
                            url: '../../pages/index/index',
                          })
                    },3000);
                    return
                }
                if(errno==5){
                    console.log(message);
                    wx.showToast({
                        title:message,
                        duration: 3000
                    })
                    setTimeout(function() {
                        wx.navigateTo({
                            url: '../../pages/index/index',
                          })
                    },3000);
                
                    return
                }
                var orderInfo=a.data.data.order_list;
                var onename,twoname="";
                var ktname,ktimg,ktUserInfo="";
                if(orderInfo.one.nick!="" && typeof(orderInfo.one.nick) != "undefined"){
                    onename=orderInfo.one.nick;
                    _this.kthideName(onename);
                    if(orderInfo.two.nick!="" && typeof(orderInfo.two.nick) != "undefined"){
                        console.log("3",orderInfo.two.nick);
                        twoname=orderInfo.two.nick;
                        _this.hideName(onename,twoname);
                  }
                }
            
              if(a.data.data.kaituan_user_info.length!=0){
                ktUserInfo=a.data.data.kaituan_user_info;
              }

              if(a.data.data.kaituan_user_info.nick!="" && typeof(a.data.data.kaituan_user_info.nick) != "undefined"){
                ktname=a.data.data.kaituan_user_info.nick;
                ktimg=a.data.data.kaituan_user_info.avatar;
              }
                console.log(a.data.errno);
                if(errno==1){
                    console.log(message);
                    _this.setData({
                        buttype:1,
                        isRuleTrue:true,
                    });
                }
           
                if(errno==6){
                    console.log(message);
                  _this.setData({
                    type:3,
                    userlist_Title:"您发起的领取活动已到期,请点击按钮重新领取",
                    ifbut:2,
                    butText:"重新领取",
                    userlist:orderInfo,
                  })

                }
                if(errno==7){
                    console.log(message);
                    _this.setData({
                      type:3,
                      userlist_Title:"恭喜您领取成功",
                      ifbut:2,
                      butText:"再领一份",
                      userlist:orderInfo,
                    })
                }
                if(errno==8){
                    console.log(message);
                    _this.setData({
                      type:2,
                      userlist_Title:"邀请一位好友和您一同到店领取美丽礼包",
                      ifbut:1,
                      butText:"邀请好友",
                      userlist:orderInfo,
                    })

                }
                if(errno==9){
                    console.log(message);
                    _this.setData({
                      type:3,
                      userlist_Title:"您发起的领取活动已到期,请点击按钮重新领取",
                      ifbut:2,
                      butText:"重新领取",
                      userlist:orderInfo,
                    })
                }
                if(errno==10){
                    console.log(message);
                    _this.setData({
                      type:3,
                      userlist_Title:"礼包激活成功,与您的好友一起到店领取吧",
                      ifbut:2,
                      butText:"再领一份",
                      userlist:orderInfo,
                    })
                }
          
                if(errno==11){
                    console.log(message);
                    _this.kthideName(ktname);
                    _this.setData({
                      type:2,
                      userlist_Title:"快和好友一起领取美丽大礼包 ",
                      ifbut:3,
                      butText:"一起领取",
                      one_name:ktname,
                      'userlist.one.avatar':ktimg,
                    })
                }
                if(errno==12){
                    console.log(message);               
                    _this.kthideName(ktname);
                    _this.setData({
                      type:2,
                      userlist_Title:"快和好友一起领取美丽大礼包",
                      ifbut:3,
                      butText:"一起领取",
                      one_name:ktname,
                      'userlist.one.avatar':ktimg,
                    })
                }
                if(errno==13){
                    console.log(message);
                    _this.kthideName(ktname);
                    _this.setData({
                      type:2,
                      userlist_Title:"快和好友一起领取美丽大礼包",
                      ifbut:3,
                      butText:"一起领取",
                      one_name:ktname,
                      'userlist.one.avatar':ktimg,
                    })
                }
                if(errno==14){
                    console.log(message);
                    _this.setData({
                      type:3,
                      userlist_Title:"礼包激活成功,与您的好友一起到店领取吧",
                      ifbut:2,
                      butText:"再领一份",
                      userlist:orderInfo
                    })
                }

            }
      });
    },
    //开团接口
    kaituan:function(){
        var that=this;
        var pid=that.data.pid;
        var did=that.data.did;
        console.log("123aa"+pid+did);
        app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "createKaiTuan",
                version: app.globalData.version,
                pid:pid,
                did:did
            },
            success: function(a) {
                console.log("aaaaaaaaa");
                var actInfo=a.data.data.user_info;
                wx.setStorageSync('two_userInfo', actInfo); 
                var orderInfo=a.data.data.order_list;
                var onename,twoname="";
                var ktname,ktimg,ktUserInfo="";
                if(orderInfo.one.nick!="" && typeof(orderInfo.one.nick) != "undefined"){
                    onename=orderInfo.one.nick;
                    that.kthideName(onename);
                    if(orderInfo.two.nick!="" && typeof(orderInfo.two.nick) != "undefined" ){
                        console.log("2",orderInfo.two.nick);
                        twoname=orderInfo.two.nick;
                        that.hideName(onename,twoname);
                  }
                } 
                wx.showToast({
                    title:"激活成功",
                    duration: 2000
                })
                that.setData({
                    newtimes:a.data.data.group_info.expiration_at,
                    userlist:a.data.data.order_list,
                    gid:a.data.data.group_info.id,
                    type:2,
                    butText:'立即分享',
                    ifbut:1,
                    userlist_Title:"邀请一位好友和您一同到店领取美丽礼包"
                })
                that.mintime();
               
            },  fail:function(a){
                console.log("1231423");
                console.log(a);
                console.log("77:",a.data.message);
                var err=a.data.errno;
                var actInfo=a.data.data.user_info;
                wx.setStorageSync('two_userInfo', actInfo);
                    if(err==7){
                            that.setData({
                                butText:'立即激活',
                                isRuleTrue:true,
                                buttype:2,
                                userlist_Title:"到店凭手机号领取礼包,请授权手机号"
                            })
                    }
            }
      });

    },
    //参团接口
    cantuan:function(){
        console.log("参团接口");
        var that=this;
        var pid=that.data.pid;
        var did=that.data.did;
        var gid=that.data.gid;
        app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "xinKePingTuan",
                version: app.globalData.version,
                pid:pid,
                did:did,
                gid:gid
            },
            success: function(a) {
                    console.log("拼团成功");   
                    wx.showToast({
                        title:"激活成功",
                        duration: 2000
                    })
                    setTimeout(function() {
                        wx.navigateTo({
                            url: './tuoke_list',
                          })
                    },2000);
            },
            fail: function(a) { }
      });
    },
    //点击分享的链接进入(拼团接口)     
    onShareAppMessage: function(res) {
        var a = this;
        var did=a.data.did;
        var pid=a.data.pid;
        var gid=a.data.gid;
        var t = "../../mys/tuoke/tuoke?fxtuoke_&did="+did+"&pid="+pid+"&gid="+gid;
        var i = "/beauty_shop/pages/base/base?&share=" + (t = escape(t));
          setTimeout(function() {
            wx.navigateTo({
                url: './tuoke_list',
              })
        },4000);
        return {
            title: a.data.one_name+"喊你一起领取大礼包",
            path: i,
        };
    },
    //姓名多出的隐藏
    hideName:function(oneName,twoName){
        console.log(twoName);
        var _this=this;
        if((oneName.length!=0&&oneName.length>4)||(twoName.length!=0&&twoName.length>4)){
            _this.setData({
                        one_name:oneName.substring(0,4) + "*",
                        two_name:twoName.substring(0,4) + "*"
                    })
        }else{
            _this.setData({
                one_name:oneName,
                two_name:twoName
            })
        }
    },
    //只显示开团人名称的多出隐藏显示
    kthideName:function(oneName){
        var that=this;
        console.log(111111,oneName.length)
        if(oneName.length!=0&&oneName.length>4){
            that.setData({
                one_name:oneName.substring(0,4) + "*"
            })
}else{
    that.setData({
        one_name:oneName
    })
}
    },
    //min时间
    mintime:function(){
        var _this=this;
        console.log("mintime",_this.data.newtimes);
        var newTime=_this.data.newtimes;
        var newtime2 =  newTime .replace(/-/g, "/")    //转换后即可兼容啦
        _this.data.timer=setInterval(() =>{
            _this.setData({
                time:util.getTimeLeft(newtime2)
            });
            if(newtime2=='0天0时0分0秒'){
                clearInterval(_this.data.timer);
            }
        },1000); 
    },
    bindgetuserinfo:function(res){
        var that=this;
        console.log("获取用户信息:");
        var getinfo=res.detail.userInfo
        app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "saveUserAvatarAndNick",
                version: app.globalData.version,
                nick:getinfo.nickName,
                avatar:getinfo.avatarUrl
            },
            success: function(a) {
                var bcUserInfo=a.data.data;
                console.log(bcUserInfo);
                var userName=bcUserInfo.nick;
              wx.setStorageSync('two_userInfo', bcUserInfo); 
              that.setData({
                buttype:2,
                type:2,
                ifbut:1,
                butText:'立即激活',
                userlist_Title:"到店凭手机号领取礼包,请授权手机号",
                'userlist.one.avatar':a.data.data.avatar,
            });   
            that.kthideName(userName);
    }
})
    },
    getPhoneNumber:function(e){
        var that=this;
        var pid=that.data.pid;
        var did=that.data.did;
        var getinfo = wx.getStorageSync('userInfo') || [];
        var twogetInfo = wx.getStorageSync('two_userInfo') || [];
        var encryData=e.detail.encryptedData;
         var iv=e.detail.iv;
         var session=getinfo.sessionid;
         console.log("session",session);
         app.util.request({
            url: "auth/session/mobile",
            data: {
                encryptedData:encryData,
                iv:iv,
                session_key:session,
                pid:pid,
                did:did
            },
            cachetime: 0,
            showLoading: !1,
            success: function(e) {
            console.log(e.data.data);
            var infoPhone=e.data.data.purePhoneNumber;
            twogetInfo.mobile=infoPhone;
           that.finInformation();
           console.log( twogetInfo.mobile);
           that.setData({
               phone: twogetInfo.mobile
           })
            },fail(e){ }
        });
    },
    //初始时间
    getTimes:function(){
        console.log("初始时间");
        var e = this;
        var newTime=e.getDay(7);
        var newtime2 =  newTime .replace(/-/g, "/")    //转换后即可兼容啦
        console.log("gettimes",newtime2);
      var time2= new Date(newtime2).getTime();
        this.data.timer=setInterval(() =>{
                e.setData({
                    cstime:util.getTimeLeft(newtime2)
                });
                if(newtime2=='0天0时0分0秒'){
                     clearInterval(e.data.timer);
                }
            },1000); 
    },
    getDay :function(day){  
        var that=this;
        var today = new Date();  
        var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;    
        today.setTime(targetday_milliseconds); //注意，这行是关键代码     
        var tYear = today.getFullYear();  
        var tMonth = today.getMonth();  
        var tDate = today.getDate();  
        tMonth = that.doHandleMonth(tMonth + 1);  
        tDate = that.doHandleMonth(tDate);  
        return tYear+"-"+tMonth+"-"+tDate;  
    } ,
    doHandleMonth : function(month){  
    var m = month;  
    if(month.toString().length == 1){  
       m = "0" + month;  
    }  
    return m;  
}
});