// pages/articleDetail/articleDetail.js
const app = getApp()
var api = require('../../../util/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: {
      id: 1, //编号
      title: "《有效识别金融项目》课程。", //标题
      image: '../../../default/default-pic.png', //图片
      writerName: '锄禾日当午', //作者名字
      date: '2018-1-1', //日期
      likeNum: 999, //点赞数
      video: 'http://www.w3school.com.cn/i/movie.ogg', //视屏url
      price: 998, //价格
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    api.getLevelList.call(this, (levels) => {
      levels.forEach((level) => {
        /*console.log(level)*/
        switch (level.name) {
          case "298": that.data.discount298 = level.courseDiscountedRatio; break;
          case "998": that.data.discount998 = level.courseDiscountedRatio; break;
          default: break;
        }
      })
      that.setData(that.data)
    })
    api.getMyCourse(app.getOpenid(), options.id, (course) => {
      this.setData({
        course: course
      })
    })
  },

  //购买该课程
  onPurchase: function () {
    var that = this
    if (that.data.isOwnCourse) {
      wx.showModal({
        content: '您已购买过该课程',
        showCancel: false
      })
    } else {
      api.getMyUser.call(that, app.getOpenid(), (res) => {
        var price = that.data.course.price
        switch (res.levelName) {
          case "common": break;
          case "298": price = that.data.discount298 * price; break;
          case "998": price = that.data.discount998 * price; break;
          default: break;
        }
        that.data.course.price = price;
        wx.showModal({
          title: '确认购买',
          content: '确认以' + price + '的价格购买\r\n' + that.data.course.title + '\r\n吗？',
          success: (res) => {
            if (res.confirm) {
              console.log(that.data.course.id)
              api.purchaseCourse.call(that, that.data.course.id, app.getOpenid(), that.data.course.price, app.getDate(), () => {
                that.onLoad({ id: that.data.course.id })
              })
            }
          }
        })
      })
    }
  }
})