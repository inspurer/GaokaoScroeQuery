//login.js
//获取应用实例
// var wc = require('../../utils/wxCache.js')
var app = getApp();
Page({
  data: {
    remind: '加载中',
    angle: 0,
    year: 2019,
  },
  
  
  onLoad:function(){
    var that = this;
    // var user_info = wc.get('user_info'); //登录过后，用户信息会缓存 
    
    that.setData({
      year: new Date().getFullYear()
    });
  },

  goQuery: function () {
    wx.redirectTo({
      url: 'query',
    })
  },
  
  onShow:function(){
    
  },
  onReady: function(){
    var _this = this;
    setTimeout(function(){
      _this.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function(res) {
      var angle = -(res.x*30).toFixed(1);
      if(angle>14){ angle=14; }
      else if(angle<-14){ angle=-14; }
      if(_this.data.angle !== angle){
        _this.setData({
          angle: angle
        });
      }
    });
  },
});