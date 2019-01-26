// pages/me/updateMe/updateMe.js
const app = getApp();
var api = require('../../../util/api.js')
var util = require('../../../util/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: 0,
    price298: 298,
    price998: 998,
    priceEnterprise: '免费',
    isHideModalput: true,
    username: "",
    password: "",
    enterpriseName: "",
    description: "",
    isAdminUsernameExistent: false,
    isEnterpriseDescriptionNotEnough: false,
    isEnterprise: false,
    isEnterprisePending: false,
    licenseTempUrl: "",
    returnInfo: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this
    api.getMyCredit.call(this, app.getOpenid())
    api.getMySubmittedEnterprise.call(this, app.getOpenid(), (res) => {
      if (res.status == "submitted") {
        that.setData({
          isEnterprisePending: true
        })
      }
    })
    api.getLevelList.call(this, (levels) => {
      levels.forEach((level) => {
        switch (level.name) {
          case "298": that.data.price298 = level.price; break;
          case "998": that.data.price998 = level.price; break;
          default: break;
        }
      })
      that.setData(that.data)
    })
    api.getPrivilegeList.call(this, (privileges) => {
      privileges.forEach((privilege) => {
        switch (privilege.name) {
          case "enterprise": that.data.priceEnterprise = privilege.price === 0 ? '免费' : privilege.price; break;
          default: break;
        }
      })
      that.setData(that.data)
    })
  },

  updateTo298: function () {
    wx.showModal({
      title: '确认升级',
      content: '你确认以¥298的价格升级为298用户吗？',
      success: (res) => {
        if (res.confirm)
          api.updateMe.call(this, app.getOpenid(), '298', 298, util.getTodayDate())
          that.onShow()
      }
    })
  },

  updateTo998: function () {
    wx.showModal({
      title: '确认升级',
      content: '你确认以¥998的价格升级为998用户吗？',
      success: (res) => {
        if (res.confirm)
          api.updateMe.call(this, app.getOpenid(), '998', 998, util.getTodayDate())
      }
    })
  },

  updateToEnterprise: function () {
    var that = this
    wx.showModal({
      title: '确认升级',
      content: '你确认升级为企业用户吗？',
      success: (res) => {
        if (res.confirm) {
          that.setData({
            isHideModalput: false
          })
        }
      }
    })
  },

  //取消按钮
  cancel: function () {
    console.log('cancel')
    this.setData({
      isHideModalput: true
    });
  },
  //确认
  confirm: function () {
    console.log('confirm')
    if (this.isValid()) {
      this.setData({
        isHideModalput: true
      })
      api.setMyUserAsEnterprise.call(this,
        this.data.enterpriseName,
        this.data.description,
        this.data.licenseTempUrl,
        app.getOpenid(),
        this.data.username,
        this.data.password,
        (res) => {
          wx.showModal({
            content: res.data.message,
            showCancel: false,
          })
        }
      )
    }
  },

  isValid: function () {
    if (this.data.username == "") {
      wx.showToast({
        title: '用户名不得为空，请重填',
        icon: 'none'
      })
      return false
    }
    if (this.data.password == "") {
      wx.showToast({
        title: '密码不得为空，请重填',
        icon: 'none'
      })
      return false
    }
    if (this.data.enterpriseName == "") {
      wx.showToast({
        title: '企业名称不得为空，请重填',
        icon: 'none'
      })
      return false
    }
    if (this.data.description == "") {
      wx.showToast({
        title: '企业描述不得为空，请重填',
        icon: 'none'
      })
      return false
    }
    if (this.data.licenseTempUrl == "") {
      wx.showToast({
        title: '未上传企业经营许可证，请上传',
        icon: 'none'
      })
      return false
    }
    if (this.data.isAdminUsernameExistent) {
      wx.showToast({
        title: '用户名已存在，请重填',
        icon: 'none'
      })
      return false
    }
    if (this.data.isEnterpriseDescriptionNotEnough) {
      wx.showToast({
        title: '企业描述不满30字，请重填',
        icon: 'none'
      })
      return false
    }
    return true
  },

  updateUsername: function (e) {
    this.data.username = e.detail.value;
    var that = this
    api.isAdminUsernameExistent.call(this, this.data.username, (isAdminUsernameExistent) => {
      that.setData({
        isAdminUsernameExistent: isAdminUsernameExistent
      })
    })
  },

  updatePassword: function (e) {
    this.data.password = e.detail.value;
  },

  uploadLicense: function (e) {
    var that = this
    wx.chooseImage({
      success: function (res) {
        that.setData({
          licenseTempUrl: res.tempFilePaths[0]
        })
      },
    })
  },

  updateEnterpriseName: function (e) {
    this.data.enterpriseName = e.detail.value;
  },

  updateEnterpriseDescription: function (e) {
    this.data.description = e.detail.value;
    this.setData({
      isEnterpriseDescriptionNotEnough: this.data.description.length < 30
    })
  },

  goToPay: function () {
    wx.navigateTo({
      url: '../pay/pay'
    })
  }
})