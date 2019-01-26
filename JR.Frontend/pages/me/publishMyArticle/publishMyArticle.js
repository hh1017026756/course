// pages/me/publishMyArticle/publishMyArticle.js
const app = getApp();
var api = require('../../../util/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    publishPhotos: [],
    publishInputValue: "",
    publishType: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {

  },

  //获取textarea输入文本内容
  bindInputValue: function (e) {
    this.setData({
      publishInputValue: e.detail.value
    })
  },

  //上次用户图片
  onUploadPhotos: function () {
    var that = this;
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        that.data.publishPhotos = that.data.publishPhotos.concat(res.tempFilePaths)
        that.setData(that.data)
      },
    })
  },

  //选择发布文章类型
  onChooseType: function (e) {
    this.setData({
      publishType: e.currentTarget.dataset.t
    })
    console.log(this.data.publishType)
  },
  
  //发布文章
  onPublish: function () {
    api.publishMyArticle.call(
      this,
      app.getOpenid(),
      this.data.publishType,
      this.data.publishInputValue,
      this.data.publishPhotos
    )
  }
})