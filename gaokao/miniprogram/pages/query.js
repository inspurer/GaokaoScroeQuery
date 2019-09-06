var locData = require('../utils/loc.js'); //引入自己定义的数据
const regeneratorRuntime = require('../utils/runtime.js'); //引入自己定义的数据

// 在页面中定义插屏广告
let interstitialAd = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wl: ['全部', '文科', '理科'],
    px: ['全部', '本科提前批', '本科一批', '本科二批', '本科三批', '高职(专科)'], //批次列表内容
    qyopen: false, //点击地区/院校筛选滑动弹窗显示效果，默认不显示
    qyshow: true, //用户点击闭关区域的弹窗设置，默认不显示
    nzopen: false, //文理筛选弹窗
    pxopen: false, //批次筛选弹窗
    nzshow: true,
    pxshow: true,
    isfull: false,
    cityleft: locData.getLoc(), //获取地区/院校的下拉框筛选项内容
    citycenter: {}, //选择地区/院校左边筛选框后的显示的中间内容部分
    cityright: {}, //选择地区/院校的中间内容部分后显示的右边内容
    select1: '地区', //地区/院校选中后的第二个子菜单，默认显示地区下的子菜单
    select2: '新课标一卷', //地区/院校选择部分的中间
    select3: '0', //地区/院校选择部分的右边
    shownavindex: '',
    count: 0,


    wlIndex: 0, //文理内容下拉框，默认第一个
    pxIndex: 0, //批次内容下拉框，默认第一个
    syIndex: 0,

    resultData: [], // 查询结果
    hasdataFlag: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      citycenter: this.data.cityleft['地区'],
    })

    this.setData({
      cityright: this.data.citycenter['新课标一卷'],
    })


    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-d5560030593f3f48'
      })
      interstitialAd.onLoad(() => { })
      interstitialAd.onError((err) => { })
      interstitialAd.onClose(() => { })
    }

    this.doQuery()
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

  // 获取滚动条当前位置
  onPageScroll: function (e) {
    console.log(e)
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop: function (e) { // 一键回到顶部
    console.log(e)
    let that = this;

    if (wx.pageScrollTo) {

      setTimeout(function () {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 50
        })
      }, 200)
      wx.pageScrollTo({
        scrollTop: 0,
        success: res => {
          console.log(res)
        },

        complete: res => {
          console.log(res)
          that.setData({
            floorstfloorstatusatus: false
          });
          console.log(that.data.floorstatus)
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  // 地区/院校列表下拉框是否隐藏
  listqy: function (e) {
    if (this.data.qyopen) {
      this.setData({
        qyopen: false,
        nzopen: false,
        pxopen: false,
        nzshow: true,
        pxshow: true,
        qyshow: true,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        qyopen: true,
        pxopen: false,
        nzopen: false,
        nzshow: true,
        pxshow: true,
        qyshow: false,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }

  },
  // 文理下拉框是否隐藏
  list: function (e) {
    if (this.data.nzopen) {
      this.setData({
        nzopen: false,
        pxopen: false,
        qyopen: false,
        nzshow: true,
        pxshow: true,
        qyshow: true,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        nzopen: true,
        pxopen: false,
        qyopen: false,
        nzshow: false,
        pxshow: true,
        qyshow: true,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }
  },
  // 批次下拉框是否隐藏
  listpx: function (e) {
    if (this.data.pxopen) {
      this.setData({
        nzopen: false,
        pxopen: false,
        qyopen: false,
        nzshow: true,
        pxshow: true,
        qyshow: true,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        content: this.data.px,
        nzopen: false,
        pxopen: true,
        qyopen: false,
        nzshow: true,
        pxshow: false,
        qyshow: true,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }
    console.log(e.target)
  },
  // 地区/院校第一栏选择内容
  selectleft: function (e) {
    console.log('用户选中左边菜单栏的索引值是：' + e.currentTarget.dataset.city);
    this.setData({
      cityright: {},
      citycenter: this.data.cityleft[e.currentTarget.dataset.city],
      select1: e.currentTarget.dataset.city,
    });
    console.log(this.data.select1)
    if (this.data.select1 == '地区') {
      this.setData({
        select2: '新课标一卷',
        cityright: this.data.citycenter["新课标一卷"],
        select3: 0,
      })
    } else {
      this.setData({
        select2: '北京',
        cityright: this.data.citycenter["北京"],
        select3: 0,
      })
    }

  },

  compare: function (property) {

    return function (a, b) {

      var value1 = a[property];
    
      var value2 = b[property];

      return value2 - value1;

    }

  },

  async doQuery() {

    var that = this;
    var cat = this.data.select1
    var name = this.data.citycenter[this.data.select2][this.data.select3]
    var wenli = this.data.wl[this.data.wlIndex]
    var pici = this.data.px[this.data.pxIndex]

    console.log(cat, name, wenli, pici)

  
    const MAX_LIMIT = 20;


    const db = wx.cloud.database({
      env: 'gaokao-y7y84'
    })

    var newResult = new Array();


    if (cat == "地区") {
      that.setData({
        ischool: false,
        resultData: []
      })
      if (wenli == '全部' && pici != '全部') {
        wx.showLoading({
          title: '加载中',
        })
        const countResult = await db.collection('province').where({
          stu_loc: name,
          pc: pici,

        }).count()
        const total = countResult.total
        //计算需分几次取
        const batchTimes = Math.ceil(total / MAX_LIMIT)
        // 承载所有读操作的 promise 的数组
        //初次循环获取云端数据库的分次数的promise数组
        for (let i = 0; i < batchTimes; i++) {
          const promise = await db.collection('province').where({
            stu_loc: name,
            pc: pici,
          }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
          //二次循环根据​获取的promise数组的数据长度获取全部数据push到arraypro数组中
          for (let j = 0; j < promise.data.length; j++) {
            var item = {};
            item.code = i * MAX_LIMIT + j;
            item.name = promise.data[j].stu_loc;
            item.year = promise.data[j].year;
            item.wl = promise.data[j].wl;
            item.pc = promise.data[j].pc;
            item.score = promise.data[j].score;
            console.table(promise.data)
            newResult.push(item)
          }
        }
        if (newResult.length != 0) {
          newResult.sort(that.compare("year"));
          that.setData({
            hasdataFlag: true,
            resultData: newResult
          })
        } else {
          that.setData({
            hasdataFlag: false,
            resultData: newResult
          })
        }

        wx.hideLoading()

      } else if (wenli != '全部' && pici == '全部') {

        wx.showLoading({
          title: '加载中',
        })
        const countResult = await db.collection('province').where({
          stu_loc: name,
          wl: wenli,
        }).count()
        const total = countResult.total
        //计算需分几次取
        const batchTimes = Math.ceil(total / MAX_LIMIT)
        // 承载所有读操作的 promise 的数组
        //初次循环获取云端数据库的分次数的promise数组
        for (let i = 0; i < batchTimes; i++) {
          const promise = await db.collection('province').where({
            stu_loc: name,
            wl: wenli,
          }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
          //二次循环根据​获取的promise数组的数据长度获取全部数据push到arraypro数组中
          for (let j = 0; j < promise.data.length; j++) {
            var item = {};
            item.code = i * MAX_LIMIT + j;
            item.name = promise.data[j].stu_loc;
            item.year = promise.data[j].year;
            item.wl = promise.data[j].wl;
            item.pc = promise.data[j].pc;
            item.score = promise.data[j].score;
            console.table(promise.data)
            newResult.push(item)
          }
        }
        if (newResult.length != 0) {
          newResult.sort(that.compare("year"));

          that.setData({
            hasdataFlag: true,
            resultData: newResult
          })
        } else {
          that.setData({
            hasdataFlag: false,
            resultData: newResult
          })
        }

        wx.hideLoading()

      } else if (wenli == '全部' && pici == '全部') {
        wx.showLoading({
          title: '加载中',
        })
        const countResult = await db.collection('province').where({
          stu_loc: name,
        }).count()
        const total = countResult.total
        //计算需分几次取
        const batchTimes = Math.ceil(total / MAX_LIMIT)
        // 承载所有读操作的 promise 的数组
        //初次循环获取云端数据库的分次数的promise数组
        for (let i = 0; i < batchTimes; i++) {
          const promise = await db.collection('province').where({
            stu_loc: name,
          }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
          //二次循环根据​获取的promise数组的数据长度获取全部数据push到arraypro数组中
          for (let j = 0; j < promise.data.length; j++) {
            var item = {};
            item.code = i * MAX_LIMIT + j;
            item.name = promise.data[j].stu_loc;
            item.year = promise.data[j].year;
            item.wl = promise.data[j].wl;
            item.pc = promise.data[j].pc;
            item.score = promise.data[j].score;
            console.table(promise.data)
            newResult.push(item)
          }
        }
        if (newResult.length != 0) {
          newResult.sort(that.compare("year"));

          that.setData({
            hasdataFlag: true,
            resultData: newResult
          })
        } else {
          that.setData({
            hasdataFlag: false,
            resultData: newResult
          })
        }

        wx.hideLoading()

      } else {
        wx.showLoading({
          title: '加载中',
        })
        const countResult = await db.collection('province').where({
          stu_loc: name,
          pc: pici,
          wl: wenli
        }).count()
        const total = countResult.total
        //计算需分几次取
        const batchTimes = Math.ceil(total / MAX_LIMIT)
        // 承载所有读操作的 promise 的数组
        //初次循环获取云端数据库的分次数的promise数组
        for (let i = 0; i < batchTimes; i++) {
          const promise = await db.collection('province').where({
            stu_loc: name,
            wl: wenli,
            pc: pici,
          }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
          //二次循环根据​获取的promise数组的数据长度获取全部数据push到arraypro数组中
          for (let j = 0; j < promise.data.length; j++) {
            var item = {};
            item.code = i * MAX_LIMIT + j;
            item.name = promise.data[j].stu_loc;
            item.year = promise.data[j].year;
            item.wl = promise.data[j].wl;
            item.pc = promise.data[j].pc;
            item.score = promise.data[j].score;
            console.table(promise.data)
            newResult.push(item)
          }
        }
        if (newResult.length != 0) {
          newResult.sort(that.compare("year"));

          that.setData({
            hasdataFlag: true,
            resultData: newResult
          })
        } else {
          that.setData({
            hasdataFlag: false,
            resultData: newResult
          })
        }
        wx.hideLoading()
      }
    } else if (cat == "院校") {
      var syList = new Array();

      that.setData({
        ischool: true,
        school_name: name,
        syIndex: 0,
        resultData: [],
        oldSYresultData: undefined,
      })
      if (wenli == '全部' && pici != '全部') {
        wx.showLoading({
          title: '加载中',
        })
        const countResult = await db.collection('university').where({
          name: name,
          pc: pici,
        }).count()
        const total = countResult.total
        //计算需分几次取
        const batchTimes = Math.ceil(total / MAX_LIMIT)
        // 承载所有读操作的 promise 的数组
        //初次循环获取云端数据库的分次数的promise数组
        for (let i = 0; i < batchTimes; i++) {
          const promise = await db.collection('university').where({
            name: name,
            pc: pici,
          }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
          //二次循环根据​获取的promise数组的数据长度获取全部数据push到arraypro数组中
          for (let j = 0; j < promise.data.length; j++) {
            var item = {};
            item.code = i * MAX_LIMIT + j;
            syList.push(promise.data[j].stu_loc);
            item.name = promise.data[j].name;
            item.year = promise.data[j].year;
            item.stu_loc = promise.data[j].stu_loc;
            item.wl = promise.data[j].wl;
            item.pc = promise.data[j].pc;
            item.score = promise.data[j].score;
            console.table(promise.data)
            newResult.push(item)
          }
        }
        that.removeDub(syList);

        if (newResult.length != 0) {
          newResult.sort(that.compare("year"));

          that.setData({
            hasdataFlag: true,
            resultData: newResult
          })
        } else {
          that.setData({
            hasdataFlag: false,
            resultData: newResult
          })
        }
        wx.hideLoading()

      } else if (wenli != '全部' && pici == '全部') {

        wx.showLoading({
          title: '加载中',
        })
        const countResult = await db.collection('university').where({
          name: name,
          wl: wenli,
        }).count()
        const total = countResult.total
        //计算需分几次取
        const batchTimes = Math.ceil(total / MAX_LIMIT)
        // 承载所有读操作的 promise 的数组
        //初次循环获取云端数据库的分次数的promise数组
        for (let i = 0; i < batchTimes; i++) {
          const promise = await db.collection('university').where({
            name: name,
            wl: wenli,
          }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
          //二次循环根据​获取的promise数组的数据长度获取全部数据push到arraypro数组中
          for (let j = 0; j < promise.data.length; j++) {
            var item = {};
            item.code = i * MAX_LIMIT + j;
            syList.push(promise.data[j].stu_loc);
            item.name = promise.data[j].name;
            item.year = promise.data[j].year;
            item.stu_loc = promise.data[j].stu_loc;
            item.wl = promise.data[j].wl;
            item.pc = promise.data[j].pc;
            item.score = promise.data[j].score;
            console.table(promise.data)
            newResult.push(item)
          }
        }
        that.removeDub(syList);
        if (newResult.length != 0) {
          newResult.sort(that.compare("year"));

          that.setData({
            hasdataFlag: true,
            resultData: newResult
          })
        } else {
          that.setData({
            hasdataFlag: false,
            resultData: newResult
          })
        }
        wx.hideLoading()

      } else if (wenli == '全部' && pici == '全部') {
        wx.showLoading({
          title: '加载中',
        })
        const countResult = await db.collection('university').where({
          name: name,
        }).count()
        const total = countResult.total
        //计算需分几次取
        const batchTimes = Math.ceil(total / MAX_LIMIT)
        // 承载所有读操作的 promise 的数组
        //初次循环获取云端数据库的分次数的promise数组
        for (let i = 0; i < batchTimes; i++) {
          const promise = await db.collection('university').where({
            name: name,
          }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
          //二次循环根据​获取的promise数组的数据长度获取全部数据push到arraypro数组中
          for (let j = 0; j < promise.data.length; j++) {
            var item = {};
            item.code = i * MAX_LIMIT + j;
            syList.push(promise.data[j].stu_loc);
            item.name = promise.data[j].name;
            item.year = promise.data[j].year;
            item.stu_loc = promise.data[j].stu_loc;
            item.wl = promise.data[j].wl;
            item.pc = promise.data[j].pc;
            item.score = promise.data[j].score;
            console.table(promise.data)
            newResult.push(item)
          }
        }
        that.removeDub(syList);

        if (newResult.length != 0) {
          newResult.sort(that.compare("year"));

          that.setData({
            hasdataFlag: true,
            resultData: newResult
          })
        } else {
          that.setData({
            hasdataFlag: false,
            resultData: newResult
          })
        }
        wx.hideLoading()

      } else {
        wx.showLoading({
          title: '加载中',
        })
        const countResult = await db.collection('university').where({
          name: name,
          wl: wenli,
          pc: pici
        }).count()
        const total = countResult.total
        //计算需分几次取
        const batchTimes = Math.ceil(total / MAX_LIMIT)
        // 承载所有读操作的 promise 的数组
        //初次循环获取云端数据库的分次数的promise数组
        for (let i = 0; i < batchTimes; i++) {
          const promise = await db.collection('university').where({
            name: name,
            wl: wenli,
            pc: pici
          }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
          //二次循环根据​获取的promise数组的数据长度获取全部数据push到arraypro数组中
          for (let j = 0; j < promise.data.length; j++) {
            var item = {};
            item.code = i * MAX_LIMIT + j;
            syList.push(promise.data[j].stu_loc);
            item.name = promise.data[j].name;
            item.year = promise.data[j].year;
            item.stu_loc = promise.data[j].stu_loc;
            item.wl = promise.data[j].wl;
            item.pc = promise.data[j].pc;
            item.score = promise.data[j].score;
            console.table(promise.data)
            newResult.push(item)
          }
        }
        that.removeDub(syList);

        if (newResult.length != 0) {
          newResult.sort(that.compare("year"));

          that.setData({
            hasdataFlag: true,
            resultData: newResult
          })
        } else {
          that.setData({
            hasdataFlag: false,
            resultData: newResult
          })
        }
        wx.hideLoading()

      }
    }

    that.setData({
      count: that.data.count + 1
    })

    if (that.data.count==2) {
      // 在适合的场景显示插屏广告
      if (interstitialAd) {
        interstitialAd.show().catch((err) => {
          console.error(err)
        })
      }
    }



  },

  removeDub: function (args) {
    var arr = ['全部'];
    for (var i = 0; i < args.length; i++) {
      if (arr.indexOf(args[i]) < 0) {
        arr.push(args[i])
      }
    }
    this.setData({
      syList: arr
    })
  },

  // 地区/院校中间栏选择的内容
  selectcenter: function (e) {
    console.log('用户选中中间菜单栏的索引值是：' + this.data.citycenter[e.currentTarget.dataset.city]);

    this.setData({
      cityright: this.data.citycenter[e.currentTarget.dataset.city],
      select2: e.target.dataset.city,
      select3: '0'
    });
  },
  // 地区/院校右边栏选择的内容
  selectright: function (e) {
    console.log(e.currentTarget.dataset.city);
    this.setData({
      select3: e.currentTarget.dataset.city
    });
  },
  // 点击灰色背景隐藏所有的筛选内容
  hidebg: function (e) {
    this.setData({
      qyopen: false,
      nzopen: false,
      pxopen: false,
      nzshow: true,
      pxshow: true,
      qyshow: true,
      isfull: false,
      shownavindex: 0,
    })
  },
  // 地区/院校清空筛选项
  quyuEmpty: function () {
    this.setData({
      select1: '地区',
      select2: '新课标一卷',
      select3: '0',
      citycenter: this.data.cityleft['地区'],
    })
    this.setData({
      cityright: this.data.citycenter[this.data.select2]
    })

    this.doQuery()
  },
  // 地区/院校选择筛选项后，点击提交
  submitFilter: function () {
    console.log('选择的一级选项是：' + this.data.select1);
    console.log('选择的二级选项是：' + this.data.select2);
    console.log('选择的三级选项是：' + this.data.citycenter[this.data.select2][this.data.select3]);
    // 隐藏地区/院校下拉框
    this.setData({
      qyopen: false,
      nzopen: false,
      pxopen: false,
      nzshow: true,
      pxshow: true,
      qyshow: true,
      isfull: false,
      shownavindex: 0
    })

    this.doQuery()
  },


  // 文理筛选框提交内容
  selectWL: function (e) {
    console.log('文理下拉框筛选的内容是：' + this.data.wl[e.currentTarget.dataset.index]);
    // 隐藏文理下拉框选项
    this.setData({
      wlIndex: e.currentTarget.dataset.index,

      nzopen: false,
      pxopen: false,
      qyopen: false,
      nzshow: true,
      pxshow: true,
      qyshow: true,
      isfull: false,
      shownavindex: 0
    });

    this.doQuery()

  },
  // 批次下拉框筛选
  selectPX: function (e) {
    console.log('批次下拉框筛选的是:  ' + this.data.px[e.currentTarget.dataset.index]);
    this.setData({
      pxIndex: e.currentTarget.dataset.index,
      nzopen: false,
      pxopen: false,
      qyopen: false,
      nzshow: true,
      pxshow: true,
      qyshow: true,
      isfull: false,
      shownavindex: 0
    });
    this.doQuery()
  },

  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showSYModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showSYModalStatus: false
      })
    }.bind(this), 200)
  },

  selectSY: function (e) {

    console.log(1111)
    this.setData({
      showSYModalStatus: true,
    })
  },

  typeClick: function (e) {
    var index = e.target.dataset.index;
    this.setData({
      syIndex: index
    })
    if (index == 0) {
      if (this.data.oldSYresultData != undefined) {
        this.setData({
          resultData: this.data.oldSYresultData
        })
      } else {

      }
    } else {
      if (this.data.oldSYresultData == undefined) {
        this.setData({
          oldSYresultData: this.data.resultData
        })
      }
      var newResult = new Array();
      for (var i = 0; i < this.data.oldSYresultData.length; i++) {
        if (this.data.oldSYresultData[i].stu_loc == this.data.syList[index]) {
          newResult.push(this.data.oldSYresultData[i])
        }
      }
      this.setData({
        resultData: newResult
      })
    }
    console.log(index);
    this.hideModal()
  }
})