// pages/statistics/statistics.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        symbolStr: '',
        ansList: []
    },

    handleSymbolInput(e) {
        const { value } = e.detail;
        // this.setData({
        //     symbolStr: value
        // })
        this.data.symbolStr = value
    },

    handleInput(e) {
        const { symbolStr } = this.data;
        const { value } = e.detail;
        const max = {}, ansList = [];

        value.replaceAll('\n', symbolStr).split(symbolStr).forEach((val) => {
          if (max[val]) {
            max[val] += 1;
          } else {
            max[val] = 1;
          }
        });

        Object.getOwnPropertyNames(max).forEach((key) => {
            if (key) {
                ansList.push({
                    number: key,
                    count: max[key]
                  });
            }
        });

        ansList
          .sort((x, y) => y.count - x.count);
          
        this.setData({
            ansList
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const {type} = options
        if (type === 'statistics') {
            wx.setNavigationBarTitle({
                title: '累计最多数',
            })
        } 
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})