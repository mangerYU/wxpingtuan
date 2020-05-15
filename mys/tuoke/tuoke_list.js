var app = getApp(), common = require("../../pages/common/common.js"), page = 1, pagesize = 20, isbottom = !1;

Page({
    data: {
        list: [],
    },
    //再领一份
    menu_on: function(t) {
         var did = t.currentTarget.dataset.did;
         var pid = t.currentTarget.dataset.pid;
         console.log(did+","+pid);
         wx.navigateTo({
           url: './tuoke?&tuoke=tuoke_@did@'+did+'@pid@'+pid,
         })

    },
    //查看活动
    menu_btn: function(n) {
        var did = n.currentTarget.dataset.did;
        var pid = n.currentTarget.dataset.pid;
        var gid = n.currentTarget.dataset.gid;
        console.log(did+","+pid+","+gid);
        wx.navigateTo({
            url: './tuoke?fxtuoke_&did='+did+'&pid='+pid+'&gid='+gid
          })


    },
    onLoad: function(t) {
      console.log(t);
        var a = this;
          a.getData(!0);
    },
    onReachBottom: function() {
        this.getData(!1);
    },
    getData: function(t) {
        var e = this;
        t && (isbottom = !(page = 1), e.setData({
            list: []
        })), isbottom || app.util.request({
            url: "entry/wxapp/index",
            data: {
                op: "group_order",
                page: page,
                pagesize: pagesize
            },
            success: function(t) {
                var a = t.data.data;
                e.setData({list:a})
                console.log(a);
                var str;
                var len=e.data.list;
                if ("" != a) {
                    function nowTime(){
                        for (let m= 0; m< len.length; m++) {
                            const element =len[m];
                            var intTime=len[m].time;
                            var day=0, hour=0, minute=0, second=0; 
                            var days;
                            if(intTime>0){
                                day = Math.floor(intTime / (60 * 60 * 24));
                                hour = Math.floor(intTime / (60 * 60)) - (day * 24);
                                minute = Math.floor(intTime / 60) - (day * 24 * 60) - (hour * 60);
                                second = Math.floor(intTime) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                                if(hour <=9) hour = '0' + hour;
                                if (minute <= 9) minute = '0' + minute;
                                if (second <= 9) second = '0' + second;
                                e.data.list[m].time--; 
                               str=hour+':'+minute+':'+ second;
                             if(day<=0||day==''){days='';}
                             else{  days=day+'天';}
                            }else{
                              str = "已结束！";
                            }
                            e.data.list[m].timeout= str;//在数据中添加difftime参数名，把时间放进去 
                            e.data.list[m].timeday= days;                    
                                                
                        }  
                        e.setData({
                            userlist:e.data.list
                        })   
                    }
                    nowTime();
                    var timer=setInterval(nowTime,1000);
                         
                }
              
            }
        });
    }
});