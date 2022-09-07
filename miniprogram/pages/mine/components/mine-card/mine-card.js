// pages/mine/components/mine-card/mine-card.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        toolsList: [
            { icon: '/static/images/mine/computer.png', text: '累计最多数', type: 'statistics' }
        ]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleClick(e) {
            const { type } = e.currentTarget.dataset;

            switch (type) {
                case 'statistics':
                    wx.navigateTo({
                      url: `/pages/statistics/statistics?type=${type}`,
                    })
                    break;
            
                default:
                    break;
            }
        }
    }
})
