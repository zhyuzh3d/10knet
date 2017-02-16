var data = {};

data.practiceArr = [{
    id: '1',
    title: '实训项目-1',
    class: {
        title: '2015级软件3班',
            memberArr: {
                length: 12,
            },
    },
    begin: '2017-01-12',
    end: '2017-01-26',
    qqGroup: '28981123',
    master: {
        name: '赵云鹏',
        qq: '431223345',
        mobile: '13223422112',
        avatar: 'http://q.qlogo.cn/qqapp/101297684/6E98DA96970E841BEF5BEF2005EFA21A/100',
    },
    desc: '这请同学们务必认真按照每日任务完成进度，观看视频，填写试卷，提交Github项目代码，上传文件图片。苟日新，日日新；一步慢，天天慢。',
    days: [{
        tasks: [{
            type: 'url',
            title: '观看视频，熟悉CSS选择器',
            purpose: '记忆以下选择器的基本语法：id选择器，属性选择器，类选择器，标记选择器，伪类选择器 hover／link/visited/before/after等等。',
            url: 'http://www.xmgc360.com//_pages/lesson/lesson.html?courseid=194&lessonid=2219',
        }, {
            type: 'url',
            title: '阅读官方文档，复习CSS选择器语法',
            purpose: '通过在线阅读和练习强化各种选择器的语法',
            url: 'http://www.w3school.com.cn/cssref/css_selectors.ASP',
        }, {
            type: 'exam',
            title: '填写试卷，自我评估',
            purpose: '达到80分以上',
            limit: 80,
            exam: {
                id: 999,
                title: 'CSS选择器语法测试',
            },
        },{
            type: 'file',
            title: '用html+css代码实现以下页面效果图的页面',
            purpose: '通过技术导师的评估',
            pic:[{
                url:'',
            }]
        }]
    }],
    daysDelayCount: 2,
}, {
    id: '2',
    title: '实训项目-2',
    class: {
        title: '2015级软件3班',
    },
    duration: 14,
    begin: '2017-01-12',
    end: '2017-01-26',
}, {
    id: '3',
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
    desc: '软件开发与工程管理系，最有前途的专业，最有前途的童鞋！',
    school: {
        title: '苏州大学计算机学院',
        avatar: 'http://tse2.mm.bing.net/th?id=OIP.M97030561cd57587859b25539962d549fo0&w=150&h=150&c=7&qlt=90&o=4&pid=1.7',
        desc: '苏州大学，简称苏大，坐落于中国历史文化名城——江苏省苏州市，是江苏省属重点综合性大学，国家国防科技工业局与江苏江苏省人民政府共建高校、  国家“211工程”重点建设高校、“2011计划”首批牵头高校，“111计划”首批地方高校',
    },
    create: '2017-03-12',
    practiceArr: data.practiceArr,
    memberArr: [{
        name: '韩梅梅',
        nick: '梅梅',
        avatar: 'http://q.qlogo.cn/qqapp/101297684/6E98DA96970E841BEF5BEF2005EFA21A/100'
    }, {
        name: '李雷',
        nick: '雷雷',
        avatar: 'http://www.xmgc360.com/files/user/2016/10-31/101106a75178434125.PNG'
    }, {
        name: '王小猫',
        nick: 'maomao',
        avatar: 'http://q.qlogo.cn/qqapp/101297684/0AE29B1226EB49FBB9DCA37CAB8A3C16/100'
    }, {
        name: '李晓明',
        nick: 'Ming1234',
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
    nick: 'PFzhao1209',
    exp: '1203',
    brief: '1969年出生于湖北仙桃，小米科技创始人、董事长兼首席执行官；金山软件公司董事长；中国大陆著名天使投资人。 2012年12月，荣获“中国经济年度人物新锐奖”。 雷军曾任两届海淀区政协委员，2012年当选北京市人大代表，2013年2月当选全国人民代表大会代表。',
    motto: '我就是我，不一样的焰火！',
    avatar: 'http://www.xmgc360.com/files/user/2016/10-31/101106a75178434125.PNG',
    mobile: '13405044454',
    school: {
        title: '苏州大学数学学院'
    },
    role: '教师'
}

export default data;
