const app = getApp()
var util = require('./util.js')

function getAbstractList(kind, openid, lastId, lastIdType) {
  var that = this
  wx.showLoading({
    title: '载入中',
  })
  wx.request({
    url: app.globalData.backendUrl + "getAbstractListBefore",
    data: {
      kind: kind,
      openid: openid,
      articleId: lastId,
      articleType: lastIdType
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      wx.hideLoading()
      if (res.data.status == 500) {
        wx.showToast({
          title: '获取文章列表失败',
          icon: 'none'
        })
        return
      }
      var articles = res.data.abstractList
      if (articles.length <= 0) {
        return
      }
      articles.forEach((article) => {
        article.images = article.images.map((image) => app.globalData.picUrl + image)
        article.writerFace = app.globalData.picUrl + article.writerFace
        switch (article.kind) {
          case 'course': article.kindName = "课程"; break;
          case 'document': article.kindName = "文档"; break;
          case 'project': article.kindName = "项目"; break;
          default: break;
        }
      })
      that.data.articles = that.data.articles.concat(articles)
      that.data.lastId = articles[articles.length - 1].id
      that.data.lastIdType = articles[articles.length - 1].kind
      that.setData(that.data)
    }
  })
}

function getAbstractListByCondition(openid, condition) {
  var that = this
  if (condition == "") {
    condition = null
  }
  wx.showLoading({
    title: '搜索中',
  })
  wx.request({
    url: app.globalData.backendUrl + "getAbstractListByCondition",
    data: {
      openid: openid,
      condition: condition
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      /*console.log(res.data)*/
      wx.hideLoading()
      that.data.articles = res.data.abstractList
      that.data.articles.forEach((article) => {
        article.images = article.images.map((image) => app.globalData.picUrl + image)
      })
      that.setData(that.data)
      if (!that.data.articles.length) {
        wx.showToast({
          title: '无搜索结果',
          icon: 'none'
        })
      }
    }
  })
}

function getFeedList(openid, id) {
  var that = this
  wx.showLoading({
    title: '载入中',
  })
  wx.request({
    url: app.globalData.backendUrl + "getFeedViewListBefore",
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      openid: openid,
      id: id
    },
    method: 'GET',
    success: (res) => {
      wx.hideLoading()
      /*console.log(res)*/
      if (res.statusCode == 200) {
        res.data.feedViews.forEach((article) => {
          article.writerFace = app.globalData.picUrl + article.writerFace
          article.images = article.images.map((image) => {
            return app.globalData.picUrl + image
          })
        })
        that.data.articles = that.data.articles.concat(res.data.feedViews)
        var articles = that.data.articles
        that.data.lastId = articles[articles.length - 1].id
        that.setData(that.data)
      } else if (res.statusCode == 500) {
        wx.showModal({
          title: res.data.error,
          content: res.data.message,
          showCancel: false
        })
      }
    },
    fail: (res) => {
      wx.hideLoading()
      wx.showToast({
        title: '服务器未连接',
        icon: 'none'
      })
    }
  })
}

function getCourse(id) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getCourse",
    data: {
      id: id
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      that.setData({
        course: res.data.course
      })
    }
  })
}

function getMyCourse(openid, courseId, then) {
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: app.globalData.backendUrl + "getMyCourse",
    data: {
      openid: openid,
      courseId: courseId
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      wx.hideLoading()
      console.log(res)
      if (res.statusCode == 200) {
        console.log(200)
        let course = res.data.course
        course.image = app.globalData.picUrl + course.image
        course.video = app.globalData.picUrl + course.video
        console.log(course)
        then(course)
      }
    }
  })
}

function getDocument(id) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getDocument",
    data: {
      id: id
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      if (res.statusCode == 200) {
        res.data.document.preview = app.globalData.picUrl + res.data.document.preview
        that.setData({
          document: res.data.document
        })
      } else if (res.statusCode == 500) {
        console.log(res.data.message)
      } else {
        console.log(res)
      }
    }
  })
}

function getProject(id) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getProject",
    data: {
      id: id
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      that.setData({
        project: res.data.project
      })
    }
  })
}

function getAd(showPlace, then) {
  /**
   * 方法：getAd
   * 参数：
   * 无
   */
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getCheckedAd",
    data: {
      showPlace: showPlace
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      if (res.statusCode == 200) {
        res.data.ad.image = app.globalData.picUrl + res.data.ad.image
        if (then) then(res.data)
      }
      /*
      that.data.ad = res.data.ad
      that.data.ad.image = app.globalData.picUrl + that.data.ad.image
      that.setData(that.data)
      */
    }
  })
}

function likePlus(openid, kind, articleId, article) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "likePlus",
    data: {
      openid: openid,
      kind: kind,
      articleId: articleId
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      if (article.hasLiked) {
        article.likeNum--;
      } else {
        article.likeNum++;
      }
      article.hasLiked = !article.hasLiked
      that.setData(that.data)
    }
  })
}

function purchaseCourse(courseId, openid, price, date, then) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "addPurchase",
    data: {
      openid: openid,
      type: 'course',
      detail: courseId,
      price: price,
      date: date
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      console.log('购买课程结果：', res)
      if (res.data.ok == false) {
        wx.showModal({
          content: res.data.message,
          showCancel: false
        })
      } else if (res.data.ok == true) {
        wx.showModal({
          content: '购买课程成功',
          showCancel: false
        })
        getMyCourse.call(that, app.getOpenid(), that.data.course.id, () => {
          that.data.isOwnCourse = true
          that.setData(that.data)
        })
        if (then) then()
      }
    }
  })
}

function getPersonList(kind, then) {
  var that = this
  wx.showLoading({
    title: '载入中',
  })
  wx.request({
    url: app.globalData.backendUrl + "getPersonList",
    data: {
      workClass: kind
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      wx.hideLoading()
      that.data.cards = res.data.persons
      that.data.cards.forEach((card) => {
        card.face = app.globalData.picUrl + card.face
        return card
      })
      that.setData(that.data)
      if (then) then()
    }
  })
}

function getMyInfo(openid, then) {
  /**
   * 方法：getUser
   * 参数：
   * 无
   */
  var that = this
  wx.showLoading({
    title: '载入中',
  })
  wx.request({
    url: app.globalData.backendUrl + "getMyUser",
    data: {
      openid: openid
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      wx.hideLoading()
      that.data.myInfo = res.data.user
      that.data.myInfo.face = app.globalData.picUrl + that.data.myInfo.face
      if (that.data.myInfo.levelName == '998') {
        that.data.myInfo.medals.push('/pages/me/img/gold.png')
      } else if (that.data.myInfo.levelName == '298') {
        that.data.myInfo.medals.push('/pages/me/img/silver.png')
      } else if (that.data.myInfo.levelName === 'common') {
        that.data.myInfo.medals.push('/pages/me/img/copper.png')
      }
      if (that.data.myInfo.isEnterprise) {
        that.data.myInfo.medals.push('/pages/me/img/enterprise.png')
      }
      that.setData(that.data)
      if (then) then()
    }
  })
}

function getOtherBasicInfo(id) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getPerson",
    data: {
      openid: id
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      /*console.log(res)*/
      that.data.myInfo = res.data.person
      that.data.myInfo.face = app.globalData.picUrl + res.data.person.face
      that.setData(that.data)
    }
  })
}

function getOtherInfo(myid, otherid, resolve, reject) {
  /**
   * 方法：getOtherCard
   * 参数：
   * 无
   */
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getOtherCard",
    data: {
      userOpenid: myid,
      otherOpenid: otherid
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      /*console.log(res)*/
      if (res.statusCode == 200) {
        if (JSON.stringify(res.data) != '{}') {
          that.data.myInfo = res.data.card
          that.data.myInfo.face = app.globalData.picUrl + that.data.myInfo.face
          that.setData(that.data)
          if (resolve) resolve()
        } else {
          // 次数和金额都不足
          if (reject) reject()
        }
      }
    }
  })
}

function checkMyReceivedCard(senderOpenid, receiverOpenid) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "checkMyReceivedCard",
    data: {
      senderOpenid: senderOpenid,
      receiverOpenid: receiverOpenid
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      console.log(res)
    }
  })
}

function uploadImageOneByOne(photos, index, length, then) {
  console.log(photos)
  if (!photos.length) {
    then()
    return
  }
  wx.uploadFile({
    url: app.globalData.backendUrl + "uploadImage",
    filePath: photos[index],
    name: 'image',
    success: (res) => {
      index++
      if (index == length) {
        then()
        return
      }
      uploadImageOneByOne(photos, index, length, then)
    }
  })
}

function publishMyArticle(openid, kind, content, photos) {
  /**
   * 方法：publishMyFeed
   * 参数：
   * 文本内容：content
   */
  var that = this
  wx.showLoading({
    title: '发布圈子中',
  })
  uploadImageOneByOne(photos, 0, photos.length, () => {
    wx.request({
      url: app.globalData.backendUrl + "publishMyFeed",
      data: {
        writerOpenid: openid,
        kind: kind,
        date: util.getTodayDate(),
        content: content
      },
      header: {
        'Authorization': 'Bearer ' + app.getToken(),
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      success: (res) => {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
          icon: 'succes',
          duration: 1000,
          success: () => {
            setTimeout(() => {
              wx.navigateBack()
            }, 1000)
          },
          mask: true
        })
      }
    })
  })
}

function modifyMyInfo() {
  /**
   * 方法：updateUser
   * 参数：
   * 用户头像：face
   * 用户名：username
   * 电话：phone
   * 邮箱：email
   * 城市：city
   * 公司：company
   * 部门：department
   * 职位：position
   * 个人简介：intro
   */
  var that = this
  wx.showLoading({
    title: '上传中',
  })
  wx.uploadFile({
    //上传用户图片
    url: app.globalData.backendUrl + "uploadHead",
    filePath: that.data.newMyInfo.face,
    name: 'face',
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: (res) => {
      wx.request({
        //上传用户信息
        url: app.globalData.backendUrl + "updateMyProfile",
        data: {
          openid: app.getOpenid(),
          username: that.data.newMyInfo.username,
          phone: that.data.newMyInfo.phone,
          email: that.data.newMyInfo.email,
          city: that.data.newMyInfo.city,
          company: that.data.newMyInfo.company,
          department: that.data.newMyInfo.department,
          position: that.data.newMyInfo.position,
          intro: that.data.newMyInfo.intro,
          label: that.data.newMyInfo.label
        },
        header: {
          'Authorization': 'Bearer ' + app.getToken(),
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'GET',
        success: (res) => {
          wx.hideLoading()
          wx.showToast({
            title: '修改成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1000)
        }
      })
    },
    fail: (res) => {
      wx.request({
        //上传用户信息
        url: app.globalData.backendUrl + "updateMyProfileWithoutFile",
        data: {
          openid: app.getOpenid(),
          face: that.data.newMyInfo.face.replace(app.globalData.picUrl, ""),
          username: that.data.newMyInfo.username,
          phone: that.data.newMyInfo.phone,
          email: that.data.newMyInfo.email,
          city: that.data.newMyInfo.city,
          company: that.data.newMyInfo.company,
          department: that.data.newMyInfo.department,
          position: that.data.newMyInfo.position,
          intro: that.data.newMyInfo.intro,
          label: that.data.newMyInfo.label
        },
        header: {
          'Authorization': 'Bearer ' + app.getToken(),
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'GET',
        success: (res) => {
          wx.hideLoading()
          wx.showToast({
            title: '修改成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1000)
        }
      })
    }
  })
}

function getPersonListByCondition(openid, condition) {
  /**
   * 方法：searchCards
   * 参数：
   * 搜索条件：condition
   */
  var that = this
  if (condition == "") {
    condition = null
  }
  wx.showLoading({
    title: '搜索中',
  })
  wx.request({
    url: app.globalData.backendUrl + "getPersonListByCondition",
    data: {
      openid: openid,
      condition: condition
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      wx.hideLoading()
      that.data.cards = res.data.persons
      that.data.cards.forEach((card) => {
        card.face = app.globalData.picUrl + card.face
      })
      that.setData(that.data)
      if (!that.data.cards.length) {
        wx.showToast({
          title: '无搜索结果',
          icon: 'none'
        })
      }
    }
  })
}

function getMyPersonList(openid, kind) {
  /**
   * 方法：getMyPersonList
   * 参数：
   * 用户openId：openId
   * 展示类别：kind
   */
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getMyCardList",
    data: {
      openid: openid,
      kind: kind
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      console.log(res)
      that.data.cards = res.data.cards
      that.data.cards.forEach((card) => {
        card.face = app.globalData.picUrl + card.face
      })
      that.setData(that.data)
    }
  })
}

function getUserHistoryAbstractList(myOpenid, otherOpenid) {
  /**
   * 方法：getUserHistoryAbstractList
   * 参数：用户openId：openId
   */
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getUserHistoryAbstractList",
    data: {
      myOpenid: myOpenid,
      otherOpenid: otherOpenid
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      that.data.myArticles = res.data.abstractList
      that.data.myArticles.forEach((article) => {
        article.writerFace = app.globalData.picUrl + article.writerFace
        article.images = article.images.map((image) => app.globalData.picUrl + image)
      })
      that.setData(that.data)
    }
  })
}

function downloadFile(filepath, then) {
  var that = this
  wx.showLoading({
    title: '下载中',
  })
  wx.downloadFile({
    url: app.globalData.picUrl + filepath,
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: (res) => {
      wx.hideLoading()
      wx.saveFile({
        tempFilePath: res.tempFilePath,
        success: (res) => {
          that.setData({
            savedFilePath: res.savedFilePath
          })
          if (then) then()
        }
      })
    }
  })
}

function getClassificationList(then) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getClassificationList",
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      that.setData({
        labelArray: res.data.classifications.map((c) => c.userLabel)
      })
      if (then) then()
    }
  })
}

function setMyUserAsEnterprise(enterpriseName, description, licenseUrl, openid, username, password, then) {
  var that = this
  wx.uploadFile({
    url: app.globalData.backendUrl + "uploadLicense",
    filePath: licenseUrl,
    name: 'license',
    success: (res) => {
      // 上传license成功
      console.log(res)
      wx.request({
        url: app.globalData.backendUrl + "setMyUserAsEnterprise",
        data: {
          enterpriseName: enterpriseName,
          description: description,
          openid: openid,
          username: username,
          password: password
        },
        header: {
          'Authorization': 'Bearer ' + app.getToken(),
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'GET',
        success: (res) => {
          if (then) then(res)
        }
      })
    }
  })
}

function updateMe(openid, detail, price, date) {
  wx.request({
    url: app.globalData.backendUrl + "addPurchase",
    data: {
      openid: openid,
      type: 'level',
      detail: detail,
      price: price,
      date: date
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      wx.showToast({
        title: res.data.message,
      })
    }
  })
}

function sendMyCard(senderOpenid, receiverOpenid, page, formId, data, emphasisKeyword, then) {
  var that = this
  wx.showLoading({
    title: '正在发送名片',
  })
  getMyUser.call(that, senderOpenid, (res) => {
    /*console.log(res)*/
    wx.request({
      url: app.globalData.backendUrl + "sendMyCard",
      data: {
        senderOpenid: senderOpenid,
        receiverOpenid: receiverOpenid,
        page: "/pages/me/myHistory/myHistory?id" + senderOpenid,
        formId: formId,
        data: "名片申请交换通知",
        emphasisKeyword: {
          "申请人": res.username,
          "备注": "您可点击查看Ta的名片，然后进入个人中心确认接收或拒绝！",
          "公司名称": res.company,
          "业务类型": res.label
        }
      },
      header: {
        'Authorization': 'Bearer ' + app.getToken(),
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      success: (res) => {
        if (res.statusCode == 200) {

          if (res.data.ok) {
            console.log(res)
            wx.hideLoading()
            wx.showToast({
              title: '发送名片成功',
            })
          }
          else {
            if (then) then(res.data)
          }
        }
      }
    })
  })
}

function getMyCredit(openid) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getMyUser",
    data: {
      openid: openid
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      /*console.log(res)*/
      that.setData({
        price: res.data.user.credit,
        isEnterprise: res.data.user.isEnterprise,
        is298: res.data.user.levelName === "298",
        is998: res.data.user.levelName === "998"
      })
    }
  })
}

function getMyUser(openid, then) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getMyUser",
    data: {
      openid: openid
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      if (res.statusCode == 200) {
        then(res.data.user)
      }
    }
  })
}

function isEnterprise(openid) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "isMyUserEnterprise",
    data: {
      openid: openid
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      that.setData({
        isEnterprise: res.data.ok
      })
    }
  })
}

function getMyEnterpriseAdmin(openid) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getMyEnterpriseAdmin",
    data: {
      openid: openid
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      that.setData({
        username: res.data.admin.username,
        password: res.data.admin.password,
        date: res.data.admin.date
      })
    }
  })
}

function getMyCardLimits(openid) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getMyUser",
    data: {
      openid: openid
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      /*console.log(res)*/
      that.setData({
        cardLimits: res.data.user.cardLimit
      })
    }
  })
}

function getLevelList(then) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getLevelList",
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      if (res.statusCode == 200) {
        if (then) then(res.data.levels)
      }
    }
  })
}

function getPrivilegeList(then) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getPrivilegeList",
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      if (res.statusCode == 200) {
        if (then) then(res.data.privileges)
      }
    }
  })
}

function isOtherCardAccessible(userOpenid, otherOpenid, then) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "isOtherCardAccessible",
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      userOpenid: userOpenid,
      otherOpenid: otherOpenid
    },
    method: 'GET',
    success: (res) => {
      if (res.statusCode == 200) {
        if (then) then(res.data.ok)
      }
    }
  })
}

function getMyCourseListBefore(openid, lastCourseId) {
  var that = this
  wx.showLoading({
    title: '载入中',
  })
  wx.request({
    url: app.globalData.backendUrl + "getMyCourseListBefore",
    data: {
      openid: openid,
      id: lastCourseId
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      wx.hideLoading()
      /*console.log(res.data)*/
      res.data.courseList.forEach((article) => {
        article.image = app.globalData.picUrl + article.image
      })
      that.data.articles = that.data.articles.concat(res.data.courseList)
      var articles = that.data.articles
      that.data.lastId = articles[articles.length - 1].id
      that.setData(that.data)
    }
  })
}

function isAdminUsernameExistent(username, then) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "isAdminUsernameExistent",
    data: {
      username: username
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      then(res.data.ok)
    }
  })
}

function getWxQrCode(then) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getWxQrCode",
    data: {
      scene: 'id=' + app.getOpenid(),
      page: 'pages/me/myHistory/myHistory',
      width: 200,
      autoColor: true,
      lineColorR: 0,
      lineColorG: 0,
      lineColorB: 0,
      isHyaline: true
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      if (res.statusCode == 200) {
        console.log(res)
        if (res.data.ok) {
          wx.getImageInfo({
            src: app.globalData.picUrl + res.data.imagePath,
            success: (res) => {
              if (then) then({ imagePath: res.path })
            }
          })
        }
      }
    }
  })
}

function getMySubmittedEnterprise(openid, then) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getMySubmittedEnterprise",
    data: {
      openid: openid
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      if (res.statusCode == 200) {
        if (then) then(res.data.enterprise)
      }
    }
  })
}

function getClassificationDescriptionList(then) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getClassificationDescriptionList",
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      if (res.statusCode == 200) {
        if (then) then(res.data)
      }
    }
  })
}

function getNewsListBefore(newsId, then) {
  var that = this
  wx.request({
    url: app.globalData.backendUrl + "getNewsListBefore",
    data: {
      type: "user",
      newsId: newsId
    },
    header: {
      'Authorization': 'Bearer ' + app.getToken(),
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: (res) => {
      if (res.statusCode == 200) {
        if (then) then(res.data)
      }
    }
  })
}

module.exports = {
  getAbstractList: getAbstractList,
  getAbstractListByCondition: getAbstractListByCondition,
  getFeedList: getFeedList,
  getCourse: getCourse,
  getMyCourse: getMyCourse,
  getDocument: getDocument,
  getProject: getProject,
  getAd: getAd,
  likePlus: likePlus,
  purchaseCourse: purchaseCourse,
  getPersonList: getPersonList,
  getMyInfo: getMyInfo,
  getOtherBasicInfo: getOtherBasicInfo,
  getOtherInfo: getOtherInfo,
  checkMyReceivedCard: checkMyReceivedCard,
  publishMyArticle: publishMyArticle,
  modifyMyInfo: modifyMyInfo,
  getPersonListByCondition: getPersonListByCondition,
  getMyPersonList: getMyPersonList,
  getUserHistoryAbstractList: getUserHistoryAbstractList,
  downloadFile: downloadFile,
  getClassificationList: getClassificationList,
  setMyUserAsEnterprise: setMyUserAsEnterprise,
  updateMe: updateMe,
  sendMyCard: sendMyCard,
  getMyCredit: getMyCredit,
  getMyUser: getMyUser,
  isEnterprise: isEnterprise,
  getMyEnterpriseAdmin: getMyEnterpriseAdmin,
  getMyCardLimits: getMyCardLimits,
  getLevelList: getLevelList,
  getPrivilegeList: getPrivilegeList,
  isOtherCardAccessible: isOtherCardAccessible,
  getMyCourseListBefore: getMyCourseListBefore,
  isAdminUsernameExistent: isAdminUsernameExistent,
  getWxQrCode: getWxQrCode,
  getMySubmittedEnterprise: getMySubmittedEnterprise,
  getClassificationDescriptionList: getClassificationDescriptionList,
  getNewsListBefore: getNewsListBefore
}