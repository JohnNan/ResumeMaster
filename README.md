# ResumeMaster   

> 这是一个微信小程序的项目，主要业务为利用微信小程序这个平台来帮助用户在移动端上快速创建简历
> 功能上支持短信验证，简历模板替换在线生成个性化PDF，邮件用户附件PDF文件 etc..

> 在此做一下小程序开发的总结：

    1、微信web开发者工具 v0.15.152900 还是有很多坑的..

    2、微信做了一些原生支持还是有很多原生组件在小程序上支持不太好（比如左滑删除），尝试后bug为 当前元素绑定5个事件（touchstart，touchend，touchmove，catchtap，longtap）会有事件处理顺序问题，未能达到产品要求，需要正确认识微信小程序。（Is not H5 neither native）

    3、小程序一开始是通过app.json，app.js俩文件进行程序全局的统筹配置初始化，比如页面路由，系统字体样式等在app.json，通用方法或初始方法在js文件中定义

    4、每一个对应的page是一个view 由wxml，wxss，json,js管理展示，所有的数据都通过异步请求来的

    5、小程序中的数据遵循单向数据绑定，所谓单向指的是js文件中维护的appData数据模型变化时会自动同步到wxml里，但是wxml中的值变化需要通过事件绑定函数回传至js中重新赋值。

    6、组件，样式问题..

Mini Programe For Tencent wechat
> This is a minor wechat programming project which can be used as a platform to help users create resumes rapidly on Mobile Terminals .
> This project supports verifying via text message, replacing resume templates, creating customised PDF online and creating PDF attachments for email users.

Here is a summary for the project development:

    1.Wechat web developer tool v0.15.152900 still has quite a few errors.

    2.Wechat had some original supports but still do not work well on some minor programs (eg. Left-slide Delete). The tested bugs are prioritising problems in the five current binding elements (touchstartm touchend, otuchmove, catchtap, longtap), which does not meet products requirements, and we need to correctly recognise the Wechat minor program. (Is not H5 neither native)

    3.The minor program initially used app.json and app.js to initialise the Cohort Configuration . For example, page routing was conducted by using app.jason and general method and initial method are defined in JS files.

    4.Every matched page is a view demonstrated by wxml, wxss, json and js and all data comes from Asynchronous Request.

    5.The data in the minor program is subject to one-direction data binding , which means the appData modules maintained in the JS files will automatically be saved into the wxml as they are changed, but the value in the wxml have to be reassigned through transferring date from Event binding function  to the JS.

    6.Component, style problems..
