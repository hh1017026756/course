// pages/me/createPost/createPost.js
const app = getApp();
var api = require('../../../util/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    faceTempUrl: "", // 用户头像url
    qrcode: "", // 二维码字节流
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    api.getMyInfo.call(this, app.getOpenid(), () => {
      wx.showLoading({
        title: '加载中',
      })
      wx.getImageInfo({
        src: that.data.myInfo.face,
        success: (res) => {
          wx.hideLoading()
          var faceTempUrl = res.path
          api.getWxQrCode.call(that, (res) => {
            console.log(res.imagePath)
            that.setData({
              faceTempUrl: faceTempUrl,
              qrcode: res.imagePath
            })
            that.drawPost()
          })
        }
      })
    })
    
  },

  drawPost: function () {
    var that = this
    const ctx = wx.createCanvasContext('shareCanvas') //画布大小为600x900
    // 底图
    ctx.drawImage('img/post_template.jpg', 0, 0, 600, 600)
    //ctx.setFillStyle('#F5F6FD')
    ctx.setFillStyle('#FFF')
    ctx.fillRect(0, 600, 600, 300)

    const leftMargin = 30
    // 作者信息
    ctx.setTextAlign('left')    // 文字靠左
    ctx.setFillStyle('#000')  // 文字颜色：黑色
    ctx.setFontSize(25)
    ctx.fillText(this.data.myInfo.username + " 为您推荐", leftMargin + 100, 700)
    ctx.drawImage(this.data.faceTempUrl, leftMargin, 650, 80, 80)
    // Title
    ctx.setFontSize(40)         // 文字字号：22px
    ctx.fillText("金融人的新名片", leftMargin, 820)
    // 小程序码
    const qrImgSize = 200
    ctx.drawImage(this.data.qrcode, 360, 650, qrImgSize, qrImgSize)
    ctx.stroke()
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          canvasId: 'shareCanvas',
          success: (res) => {
            wx.hideLoading()
            const path = res.tempFilePath
            that.setData({
              imageTempUrl: path
            })
          }
        })
      })
    }, 100)
    
  },

  onSave: function () {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.imageTempUrl,
    })
  },

  previewImage: function () {
    wx.previewImage({
      urls: [this.data.imageTempUrl],
    })
  }
})