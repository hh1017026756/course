// pages/myHistory/myHistory.js
const app = getApp()
var api = require('../../../util/api.js')
import articleItem from '../../../template/articleItem/articleItem'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardLimits: 0,
    myInfo: {
      username: 'USERNAME',
      medals: [
        '../../../default/default-icon.png',
        '../../../default/default-icon.png',
        '../../../default/default-icon.png',
        '../../../default/default-icon.png'],
      phone: '18512346956',
      email: '123456789@163.com',
      company: '美国永辉有限公司',
      department: 'IT技术部',
      position: 'IT初级经理',
      intro: '我要在代码的世界里飞翔。'
    },
    isMyInfoVisiable: false,
    isGetOtherInfo: null,
    isAlreadyGetOtherInfo: null,
    otherid: null,
    encreptInfo: {
      phone: '************',
      wechatId: '****',
      email: '******'
    },
    myArticles: [
      {
        id: 1,
        text: '《有效识别金融项目》课程。',
        images: [
          '../../../default/default-pic.png',
          '../../../default/default-pic.png',
          '../../../default/default-pic.png'
        ],
        writerFace: '../../../default/default-icon.png',
        writerName: 'USERNAME',
        date: '2020-01-01',
        likeNum: 8965
      },
      {
        id: 2,
        text: '《有效识别金融项目》课程。',
        images: [
          '../../../default/default-pic.png',
          '../../../default/default-pic.png',
          '../../../default/default-pic.png'
        ],
        writerFace: '../../../default/default-icon.png',
        writerName: 'USERNAME',
        date: '2020-01-01',
        likeNum: 8965
      },
      {
        id: 3,
        text: '《有效识别金融项目》课程。',
        images: [
          '../../../default/default-pic.png',
          '../../../default/default-pic.png',
          '../../../default/default-pic.png'
        ],
        writerFace: '../../../default/default-icon.png',
        writerName: 'USERNAME',
        date: '2020-01-01',
        likeNum: 8965
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.data.isGetOtherInfo = true
      this.data.isAlreadyGetOtherInfo = false
      this.data.otherid = options.id
      api.getOtherBasicInfo.call(this, this.data.otherid) //获取除联系方式外的其他信息
      api.getUserHistoryAbstractList.call(this, app.getOpenid(), this.data.otherid) //获取文章历史记录
    }
    else {
      var that = this
      this.data.isGetOtherInfo = false
      api.getMyInfo.call(this, app.getOpenid()) //获取个人信息
      api.getUserHistoryAbstractList.call(this, app.getOpenid(), app.getOpenid()) //获取个人历史文章列表信息
    }
    api.getMyCardLimits.call(this, app.getOpenid())
  },

  //点击查看联系方式
  isMyInfoVisiableToggle: function () {
    var that = this
    if (this.data.isGetOtherInfo) {        //获取别的用户信息
      if (!this.data.isAlreadyGetOtherInfo) {        //还没有获取当前用户信息
        //向服务器发送请求询问是否已有权限获取详细信息，如果已有权限则直接获取
        api.isOtherCardAccessible.call(this, app.getOpenid(), this.data.otherid, (res) => {
          if (res) {
            //服务器返回可成功获取详细信息的权限，直接获取详细信息
            api.getOtherInfo.call(that, app.getOpenid(), that.data.otherid, () => {
              that.setData({
                isMyInfoVisiable: !that.data.isMyInfoVisiable,
              })
              api.getMyCardLimits.call(that, app.getOpenid())
              that.data.isAlreadyGetOtherInfo = true
            })
          } else {
            //服务器返回没有权限获取详细信息，小程序向用户发起询问
            if (that.data.cardLimits > 0) {    //用户查看次数足够
              wx.showModal({
                title: '是否确认查看用户信息?',
                content: '您剩余查看次数为：' + that.data.cardLimits + '次',
                success: (res) => {
                  if (res.confirm) {
                    //向服务器发送请求查看当前用户信息
                    api.getOtherInfo.call(that, app.getOpenid(), that.data.otherid, () => {       //服务器返回成功
                      that.setData({
                        isMyInfoVisiable: !that.data.isMyInfoVisiable,
                      })
                      api.getMyCardLimits.call(that, app.getOpenid())
                      that.data.isAlreadyGetOtherInfo = true
                    })
                  }
                }
              })
            }
            else {                             //用户查看次数不足
              wx.showModal({
                title: '今日查看次数不足',
                content: '是否消耗5个钧融币查看？',
                success: (res) => {
                  if (res.confirm) {
                    //向服务器发送请求查看当前用户信息
                    api.getOtherInfo.call(that, app.getOpenid(), that.data.otherid, () => {       //服务器返回成功
                      that.setData({
                        isMyInfoVisiable: !that.data.isMyInfoVisiable,
                      })
                      api.getMyCardLimits.call(that, app.getOpenid())
                      that.data.isAlreadyGetOtherInfo = true
                    }, () => {                         //服务器返回失败
                      wx.showModal({
                        title: '获取用户信息失败',
                        content: '查看次数和金额都不足',
                        showCancel: false
                      })
                    })
                  }
                }
              })
            }
          }
        })
      }
      else {                              //已经获取当前用户信息
        that.setData({
          isMyInfoVisiable: !that.data.isMyInfoVisiable,
        })
      }

    }
    else {                               //获取自己信息
      api.getMyInfo.call(this, app.getOpenid(), () => {
        that.setData({
          isMyInfoVisiable: !that.data.isMyInfoVisiable,
        })
      })
    }
  },

  onSendMyCard: function (e) {
    /*console.log(e)*/
    if (this.data.isGetOtherInfo) {
      api.sendMyCard.call(this, app.getOpenid(), this.data.otherid, null, e.detail.formId, null, null, (res) => {
        /*console.log(res)*/
        wx.hideLoading()
        wx.showToast({
          icon: "none",
          title: res.message,
        })
      })
    }
    else {
      wx.showModal({
        content: '无需给自己发名片',
        showCancel: false
      })
    }
  },

  onBackToIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  previewImg: function (e) {
    articleItem.previewImg(e)
  }
})