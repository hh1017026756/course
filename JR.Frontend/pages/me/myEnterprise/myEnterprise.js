// pages/me/myEnterprise.js
const app = getApp();
var api = require('../../../util/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    api.getMySubmittedEnterprise.call(this, app.getOpenid(), (res) => {
      if (JSON.stringify(res) == "{}") {
        wx.showModal({
          title: '是否进入企业认证页面？',
          content: '请认证企业账户后查看该页面',
          success: (res) => {
            if(res.confirm) {
              wx.redirectTo({
                url: '/pages/me/updateMe/updateMe',
              })
            }
            else {
              wx.navigateBack()
            }
          }
        })
      }
      else {
        switch (res.status) {
          case 'rejected':
            wx.showModal({
              title: '注意',
              content: '您的企业申请已被拒绝',
              showCancel: false
            })
            break;
          case 'disqualified':
            wx.showModal({
              title: '注意',
              content: '您的企业账户已被删除',
              showCancel: false
            })
          default: break;
        }
        that.data.admin = res
        that.data.admin.licenseUrl = app.globalData.picUrl + that.data.admin.licenseUrl
        that.setData(that.data)
      }
    })
  }
})