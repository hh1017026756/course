// pages/news/news.js
const app = getApp();
var api = require('../../util/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsItemList: [{
      title: "这是标题这是标题这是标题这是标题这是标题这是标题这是标题",
      content: "这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容",
      writerFace: "../../default/default-face.png",
      writerName: "发布者信息",
      timeStamp: "2020-01-01"
    },
    {
      title: "这是标题这是标题这是标题这是标题这是标题这是标题这是标题",
      content: "这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容",
      writerFace: "../../default/default-face.png",
      writerName: "发布者信息",
      timeStamp: "2020-01-01"
    },
    {
      title: "这是标题这是标题这是标题这是标题这是标题这是标题这是标题",
      content: "这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容",
      writerFace: "../../default/default-face.png",
      writerName: "发布者信息",
      timeStamp: "2020-01-01"
    }],
    lastNewsId: ""
  },

  getTitleAndContent: function (content) {
    const reg = /【.*?】/
    const results = reg.exec(content)
    /*console.log(results)*/
    if (results == null) {
      return {
        title: content, 
        content: ""
      }
    }
    else {
      return { 
        title: results[0],
        content: content.replace(results[0], "")
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.getNewsListBefore.call(this, "", (res) => {
      console.log(res)
      const tempNewsList = res.news.map((news) => {
        const result = this.getTitleAndContent(news.content)
        return {
          newsId: news.newsId,
          title: result.title,
          content: result.content,
          writerFace: "../../default/default-face.png",
          writerName: news.source,
          timeStamp: news.time,
          type: news.type
        }
      })
      if (tempNewsList.length > 0) {
        this.data.lastNewsId = tempNewsList[tempNewsList.length - 1].newsId
      }
      this.setData({
        newsItemList: tempNewsList
      })
    })
  },

  onReachBottom: function () {
    api.getNewsListBefore.call(this, this.data.lastNewsId, (res) => {
      const tempNewsList = res.news.map((news) => {
        const result = this.getTitleAndContent(news.content)
        return {
          newsId: news.newsId,
          title: result.title,
          content: result.content,
          writerFace: "../../default/default-face.png",
          writerName: news.source,
          timeStamp: news.time,
          type: news.type
        }
      })
      if (tempNewsList.length > 0) {
        this.data.lastNewsId = tempNewsList[tempNewsList.length - 1].newsId
      }
      this.setData({
        newsItemList: this.data.newsItemList.concat(tempNewsList)
      })
    })
  }
})