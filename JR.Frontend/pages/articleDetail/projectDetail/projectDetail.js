// pages/articleDetail/projectDetail/projectDetail.js
const app = getApp()
var api = require('../../../util/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    project: {
      id: 1, //编号
      title: '这是一个页面', //简介
      identity: 'IT初级经理', //身份
      phone: '123456789', //联系方式
      city: '亚太区', //所在城市
      industry: 'IT', //所属行业
      business: '金融牌照', //业务标签
      content: '这是一个很牛逼的项目', //项目详情
      money: 2333, //项目资金
      attachment: 'http://www.baidu.com/test.zip' //附件路径
    },
    isDownLoadAttachment: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.getProject.call(this, options.id)
  },

  onDownload: function () {
    var that = this
    if (this.data.project.attachment) {
      api.downloadFile.call(this, this.data.project.attachment, () => {
        that.setData({
          isDownLoadAttachment: true
        })
      })

    }
    else {
      wx.showModal({
        content: '该项目不存在附件',
        showCancel: false
      })
    }
  },

  onOpen: function () {
    var that = this
    console.log(that.data.savedFilePath)
    if (/.*?(gif|png|jpg|jpeg)/.test(that.data.savedFilePath)) {
      //图片
      wx.previewImage({
        urls: [that.data.savedFilePath],
      })
    }
    else {
      //文档
      wx.openDocument({
        filePath: that.data.savedFilePath
      })
    }
  }
})