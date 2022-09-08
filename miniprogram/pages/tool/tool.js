// pages/tool/tool.js

const breakStr = /\s+/;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        symbolStr: '',
        nums: '',
        ansList: [],
    },

    handleSymbolInput(e) {
        let regStr = ''
        let { value } = e.detail;
        const { nums } = this.data;

        value = value.trim().replaceAll(/\s+/g, ' ');
        for (let i = 0; i < value.length; i++) {
            const s = value[i];
            if (breakStr.test(s)) {
                regStr += '|';
            } else if (/([a-z|A-Z])+/.test(s)) {
                regStr += s;
            } else {
                regStr += `\\${s}`;
            }
        }
        this.data.symbolStr = regStr;

        if (nums) {
            this.computedResult()
        }
    },

    handleInput(e) {
        const { symbolStr } = this.data;
        const { value } = e.detail;
        
        this.data.nums = value.trim();

        if (symbolStr) {
            this.computedResult()
        }
        
    },

    computedResult() {
        const { symbolStr, nums } = this.data;
        const max = {}, ansList = [];

        const reg = new RegExp(symbolStr + '|\\s', 'g')
        // console.log('reg: ', reg)
        nums.split(reg).forEach((val) => {
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
        ansList.sort((x, y) => y.count - x.count);

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