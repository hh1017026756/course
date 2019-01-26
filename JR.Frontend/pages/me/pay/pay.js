// pages/me/pay/pay.js
const app = getApp();
var api = require('../../../util/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.getMyCredit.call(this, app.getOpenid())
  },

  bindCancel: function () {
    wx.navigateBack({})
  },

  bindSave: function (e) {
    var that = this;
    var amount = e.detail.value.amount;

    if (amount == "" || amount * 1 < 0) {
      wx.showModal({
        title: '错误',
        content: '请填写正确的充值金额',
        showCancel: false
      })
      return
    }
    /*test*/

    wx.request({
      url: app.globalData.backendUrl + "buyMyCredit",
      method: "GET",
      header: {
        'Authorization': 'Bearer ' + app.getToken(),
        'content-type': 'application/json'
      },
      data: {
        openid: app.getOpenid(),
        credit: amount
      },
      success: (res) => {
        if (res.statusCode == 200) {
          wx.showModal({
            title: '请在15分钟内支付完成',
            content: '',
            showCancel: false,
            success: () => {
              var requestPaymentParams = res.data.wxBuyCredit
              console.log(requestPaymentParams)
              wx.requestPayment({
                timeStamp: requestPaymentParams.timeStamp,
                nonceStr: requestPaymentParams.nonceStr,
                package: requestPaymentParams.packageContent,
                signType: requestPaymentParams.signType,
                paySign: requestPaymentParams.paySign,
                success: (res) => {
                  wx.showToast({
                    title: '充值成功',
                    icon: 'success',
                    duration: 1000
                  })
                  that.onLoad()
                }
              })
            }
          })
        } else if (res.statusCode == 404) {
          wx.showToast({
            title: '充值失败',
            icon: 'none',
            duration: 1000
          });
        }
      }
    })
  }
})