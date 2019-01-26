// pages/articleDetail/documentDetail/documentDetail.js
const app = getApp()
var api = require('../../../util/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    document: {
      id: 3,
      title: '这是一个文档标题',
      content: '这是文档的内容',
      writerName: '锄禾日当午',
      date: '2018-1-1',
      likeNum: 999
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      api.getDocument.call(this, options.id)
    } catch (e) {
      console.log('获取编号为' + options.id + '的文档失败')
    }
  },

  onDownload: function () {
    var that = this
    if (this.data.document.attachment) {
      api.getMyUser.call(this, app.getOpenid(), (res) => {
        if (res.levelName == "common") {
          wx.showModal({
            title: '您的权限为普通用户，无法下载',
            content: '即将跳转到升级账户页面',
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/me/updateMe/updateMe',
                })
              }
            }
          })

        }
        else {
          api.downloadFile.call(this, this.data.document.attachment, () => {
            that.setData({
              isDownLoadAttachment: true
            })
          })
        }
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
    wx.openDocument({
      filePath: that.data.savedFilePath,
    })
  },

  previewImg: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    //图片预览
    wx.previewImage({
      urls: [src] // 需要预览的图片http链接列表
    })
  },
})