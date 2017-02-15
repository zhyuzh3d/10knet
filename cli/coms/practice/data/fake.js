var data = {};

data.practiceArr = [{
    id:'1',
    title: '实训项目-1',
    class: {
        title: '2015级软件3班',
    },
    begin: '2017-01-12',
    end: '2017-01-26',
}, {
    id:'2',
    title: '实训项目-2',
    class: {
        title: '2015级软件3班',
    },
    duration: 14,
    begin: '2017-01-12',
    end: '2017-01-26',
}, {
    id:'3',
    title: '实训项目-3',
    class: {
        title: '2015级软件3班',
    },
    duration: 14,
    begin: '2017-01-12',
    end: '2017-01-26',
}];

data.classArr = [{
    title: '2015级软件3班',
    practiceArr: data.practiceArr,
    memberArr: [{
        name: '韩梅梅',
        avatar: 'http://q.qlogo.cn/qqapp/101297684/6E98DA96970E841BEF5BEF2005EFA21A/100'
    }, {
        name: '李雷',
        avatar: 'http://www.xmgc360.com/files/user/2016/10-31/101106a75178434125.PNG'
    }, {
        name: '王小猫',
        avatar: 'http://q.qlogo.cn/qqapp/101297684/0AE29B1226EB49FBB9DCA37CAB8A3C16/100'
    }, {
        name: '李晓明',
        avatar: 'http://q.qlogo.cn/qqapp/101297684/7B0991E6BA277CAF305226893C1FCA02/100'
    }]
}, {
    title: '2015级软件4班',
    practiceArr: data.practiceArr,
    memberArr: [{
        name: '韩梅梅',
        avatar: 'http://q.qlogo.cn/qqapp/101297684/6E98DA96970E841BEF5BEF2005EFA21A/100'
    }, {
        name: '李雷',
        avatar: 'http://www.xmgc360.com/files/user/2016/10-31/101106a75178434125.PNG'
    }, {
        name: '王小猫',
        avatar: 'http://q.qlogo.cn/qqapp/101297684/0AE29B1226EB49FBB9DCA37CAB8A3C16/100'
    }, {
        name: '李晓明',
        avatar: 'http://q.qlogo.cn/qqapp/101297684/7B0991E6BA277CAF305226893C1FCA02/100'
    }]
}];

data.accInfo = {
    name: '赵鹏方',
    avatar: 'http://www.xmgc360.com/files/user/2016/10-31/101106a75178434125.PNG',
    mobile: '13405044454',
    school: {
        title: '苏州大学数学学院'
    },
    role: '教师'
}

export default data;
