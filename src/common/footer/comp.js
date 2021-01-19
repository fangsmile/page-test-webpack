import commonApi from 'api/common';
import { OtherAppPage } from 'asset/js/enums'
import defaultIcon from './images/components-login-user.png';
import Dialog from 'component/common/dialog';

// 底部按钮交互逻辑绑定
export default class ComponentTool {
    constructor(gData, vue) {
        // debugger
        this.vue = vue;
        this.loginData = gData;
        this.xl = window.xlGetXl && window.xlGetXl();
        console.log("Component.constructor", this);
        this.componentBottomMenu = new ComponentBottomMenu();
        this.componentAppList = new ComponentAppList();
        this.customApps = {};
        this.customAppsCopy = {};
        this.allAppSettingArr = [];
        this.allAppSettingLength = 0;
        this.seletedApp = [];
        this.pageIndex = 1;
        this.pageNums = 1;
        this.allAppSettingObj = {};
        // this.loginData = {};
        this.timer = null;
        this.selfUrl = new SelfUrl(gData);
        this.isInteract = false; // 是否是授课组
        this.init();
        this.initEvent();
    }

    hideMoreTool() {
        this.vue.hideCallback && this.vue.hideCallback()
    }

    // 从xl获取loginData，初始化方案数据并展示
    async init() {
        const that = this;
            const vue = this.vue;
        console.log("Component.init");
        if (this.xl && this.xl.showStartTool && this.loginData.login.mode == '3') {
            // component.vue.$bus.emit(component.vue.$BusEvent.message,{type:'showStartTool',data:{o:true,right:this.loginData.toolRight,spread:this.loginData.toolSpread}})
            // this.xl.showStartTool(true, this.loginData.toolRight, this.loginData.toolSpread);
        }

        if (this.xl && this.xl.getData) {
            await this.initData();
                this.initHTML();
                if (that.xl && that.xl.getRecState) {
                    const recstate = this.xl.getRecState();
                    var screenRecord = document.querySelector("#smallToolBox .screen-record");
                    if (!screenRecord) { return; }
                    if (recstate == 1 || recstate == 2) {
                        if (!screenRecord.classList.contains("noneActive")) {
                            screenRecord.classList.add("noneActive");
                        }
                    } else {
                        if (screenRecord.classList.contains("noneActive")) {
                            screenRecord.classList.remove("noneActive");
                        }
                    }
                }
                var lockPadCom = document.getElementById("lockPadCom");
                if (this.loginData.islockPadCom) {
                    if (!lockPadCom.classList.contains("unlock")) {
                        lockPadCom.classList.add("unlock");
                    }
                } else {
                    if (lockPadCom.classList.contains("unlock")) {
                        lockPadCom.classList.remove("unlock");
                    }
                }
        } else {
            await this.initData();
            this.initHTML();
            var lockPadCom = document.getElementById("lockPadCom");
            if (this.loginData.islockPadCom) {
                if (!lockPadCom.classList.contains("unlock")) {
                    lockPadCom.classList.add("unlock");
                }
            } else {
                if (lockPadCom.classList.contains("unlock")) {
                    lockPadCom.classList.remove("unlock");
                }
            }
        }

        vue.$bus.on(vue.$BusEvent.blackboard_clickScreenRecordTrue, () => {
            const lockPadCom = document.getElementById("lockPadCom");
            if (!lockPadCom.classList.contains("unlock")) {
                lockPadCom.classList.add("unlock");
            }
        })
        vue.$bus.on(vue.$BusEvent.blackboard_clickScreenRecordFalse, () => {
            const lockPadCom = document.getElementById("lockPadCom");
            if (lockPadCom.classList.contains("unlock")) {
                lockPadCom.classList.remove("unlock");
            }
        })

        var screenRecord = document.querySelector(
            ".components-other-app .components-video"
        );

        // var comBubble = document.querySelector(".components-other-app .bubble");
    }

    // 根据xl的data解析出组件需要的数据
    async initData() {
        // debugger
        const that = this;
        that.customApps = that.loginData.appGroups;
        that.customAppsCopy = JSON.stringify(that.customApps);
         // debugger
         console.log(that.selfUrl.selfArr);
         that.allAppSettingLength = that.loginData.apps.length;// http://jira.xuelebj.net/browse/CLASSROOM-7757
         that.selfUrl.defaultUrlLength = that.allAppSettingLength;

        if (that.loginData.openWay === 2) { // http://jira.xuelebj.net/browse/CLASSROOM-6642
            $('.open-custom').hide();
            $('.custom-page-list-box')[0].style.display = 'none';
        } else {
            await that.selfUrl.initData();
            that.selfUrl.initEvent();
        }

        // debugger
        that.allAppSettingArr = [...that.loginData.apps, ...that.selfUrl.selfArr];
        console.log('YRE:', that.customApps)
        // that.customApps.customApps.forEach((item,i)=>{
        //   item.forEach((val,j)=>{
        //     if(val) {
        //       that.seletedApp.push(val);
        //     }
        //   })
        // })
        that.allAppSettingArr && that.allAppSettingArr.forEach((value, i) => {
            if (value.appId) {
                that.allAppSettingObj[value.appId] = value;
            } else {
                that.allAppSettingObj[value.id] = value;
            }
        });
    }

    hideLeftIcon() {
        document.querySelector('.components-blackboard-writing').style.display = "none";
        document.querySelector('.components-video').style.display = "none";
        document.querySelector('.components-screencut').style.display = "none";
        document.querySelector('.components-lockscreen').style.display = "none";
        document.querySelector('.components-minilize').style.display = "none";
    }

    initHTML() {
        const wholeDom = $('.components-section');

        const downlodeAiclass = document.getElementById("downlodeAIClass");

        if (window.xl) {
            // window.xl非空为壳，否则为浏览器端，浏览器隐藏几个按钮
            wholeDom.removeClass("components-web-client");
            downlodeAiclass.style.display = "none";
        }
        // 海信，锐捷定制 隐藏下载按钮
        if (this.loginData.userAgentForCompany) {
            downlodeAiclass.style.display = "none";
        }
        // 预览课件模式
        try {
            if (this.loginData.login && this.loginData.login.mode && this.loginData.login.mode == "3") {
                wholeDom.addClass("components-preview");
                // $("#componentPreviewClose").addClass("previewCouseware");
                this.hideLeftIcon();
                if (this.loginData.login.appPreview)
                    { $("#componentPreviewClose").addClass("previewCouseware"); }
                else {
                    $("#componentPreviewClose").removeClass("previewCouseware");
                }
                // component.vue.$bus.emit(component.vue.$BusEvent.message,{type:'showStartTool',data:{o:false,right:this.loginData.toolRight,spread:this.loginData.toolSpread}})
                // this.xl.showStartTool(false, this.loginData.toolRight, this.loginData.toolSpread);
            } else {
                // debugger
                wholeDom.removeClass("components-preview");
                $("#componentPreviewClose").removeClass("previewCouseware");
                // component.vue.$bus.emit(component.vue.$BusEvent.message,{type:'showStartTool',data:{o:true,right:this.loginData.toolRight,spread:this.loginData.toolSpread}})
                // this.xl.showStartTool(true, this.loginData.toolRight, this.loginData.toolSpread);
            }
        } catch (error) {

        }
        // 2018.01.26 小于1280分辨率下 右下角的按钮只显示全屏按钮，其余的隐藏
        const screenW = window.screen.width;
        wholeDom.addClass("components-resolution");
        if (screenW < 1200) {
            wholeDom.addClass("components-resolution1024");
        }
        // 教研员隐藏头像上手机样式
        if (this.loginData.login.user.identityId === "EDUCATION_STAFF") {
            document.querySelector(".components-cha .components-phone").classList.add("hide");
        }

        this.initUserInfo();
        this.initAllAppListHTML();
        this.initCustomAppsHTML();
        this.initTaskBarAppsHTML();
    }

    initUserInfo() {
        /*
          entryType : 1个人资源，2共享资源，3学校资源，4区县资源，5学校管理资源，6区县管理资源
          authorIcon:作者头像
          操作人:authorName,上传时间:upload,更新时间:updateTime,资源来源:rcFrom ，作者所在单位: unit
         */
        this.isInteract = !!((this.loginData.classState && this.loginData.classState.teachTargetType === 2));

        const userLoginCom = document.querySelector("#userLoginCom");
        const entryType = this.loginData.login.entryType;
        const authorIcon = this.loginData.login.authorIcon;
        const authorName = this.loginData.login.authorName;
        const upload = this.loginData.login.uploadTime || "";
        const updateTime = this.loginData.login.updateTime || "";
        const rcFrom = this.loginData.login.rcFrom || "";
        const unit = this.loginData.login.authorOrgName || "来自哪个学校"
        // var headIcom = "https://avatar.xueleyun.com/images/96x96_" + authorIcon + ".jpg";
        if (this.loginData.isTrial) {
            // 是否是试用状态
            //
            document.getElementById("userNameCom").innerHTML = '未登录';
            document.getElementById("schoolNameCom").innerHTML = '';
            document.getElementById("characterCom").style.backgroundImage = "url(" + defaultIcon + ")";
            userLoginCom.classList.remove("active");
            userLoginCom.style.cursor = "pointer";
        } else if (this.loginData.login.mode == "3" && (entryType == 1 || entryType == 2)) {
            // 预览大家分分享
            document.getElementById("smallToolBox").style.display = 'none';
            document.getElementById("userNamePreview").innerHTML = authorName + " · " + unit;
            document.getElementById("userComPreview").innerHTML = ("于" + updateTime + "更新");
            authorIcon && (document.getElementById("characterCom").style.backgroundImage = "url(" + authorIcon + ")");
        } else if (this.loginData.login.mode == "3" && (entryType == 3 || entryType == 5 || entryType == 6)) {
            // 预览学校资源或学校管理资源 或区县管理资源
            document.getElementById("smallToolBox").style.display = 'none';
            document.getElementById("userNamePreview").innerHTML = authorName + " · " + unit;
            document.getElementById("userComPreview").innerHTML = ("于" + upload + "共建");
            authorIcon && (document.getElementById("characterCom").style.backgroundImage = "url(" + authorIcon + ")");
        } else if (this.loginData.login.mode == "3" && (entryType == 4)) {
            // 预览区县资源
            document.getElementById("smallToolBox").style.display = 'none';
            document.getElementById("userNamePreview").innerHTML = rcFrom;
            document.getElementById("userComPreview").innerHTML = ("于" + upload + "提供");
            authorIcon && (document.getElementById("characterCom").style.backgroundImage = "url(" + authorIcon + ")");
        } else if (this.loginData.login.mode == "3" && (entryType == 7)) {
            // 预览学区资源
            document.getElementById("smallToolBox").style.display = 'none';
            document.getElementById("userNamePreview").innerHTML = authorName + " · " + unit;
            document.getElementById("userComPreview").innerHTML = ("于" + updateTime + "共享");
            authorIcon && (document.getElementById("characterCom").style.backgroundImage = "url(" + authorIcon + ")");
        } else {
            // 是否开通智慧课堂=
            userLoginCom.style.cursor = "inherit";
            if (this.loginData.login && this.loginData.login.isSmartClass == 1) {
                // 手机有颜色
                userLoginCom.classList.add("active");
            }
            document.getElementById("userNameCom").innerHTML
                = (this.loginData.login
                    && this.loginData.login.user
                    && this.loginData.login.user.realName)
                || "未登录";
            document.getElementById("schoolNameCom").innerHTML
                = (this.loginData.login
                    && this.loginData.login.user
                    && this.loginData.login.user.schoolName)
                || "";
            document.getElementById("characterCom").style.backgroundImage
                = "url(" + this.loginData.login.user.icon + ")";
        }
        document.getElementById("classNameCom").innerText// http://jira.xuelebj.net/browse/CLASSROOM-6143
            = this.loginData.classState && (!this.isInteract ? this.loginData.classState.name || "暂无班级" : (this.loginData.classState.aboutInteractGroup && this.loginData.classState.aboutInteractGroup.groupName) || "暂无教学组");
        document.getElementById("unitNameCom").innerHTML
            = this.loginData.courseware.unitName || "暂无教材";
        // console.log("lockPadCom === changed")
        // 如果是教研员，隐藏班级信息 及锁屏按钮；如果没有教材隐藏  “更换课程” "下课按钮";
        if (this.loginData.login && this.loginData.login.user.identityId === "EDUCATION_STAFF") {
            document.querySelector(".changeClass").style.display = "none";
            document.getElementById("classNameCom").style.display = "none";
            document.getElementById("lockPadCom").style.cssText = "display:none !important";
            if (!this.loginData.login.user.hasBooks) {
                document.getElementById("changeLessonCom").style.display = "none";
                document.getElementById("closeCom").style.display = "none";
            }
        }
        // else if (this.loginData.class.teachTargetType === 2) {//暂时去掉pad交互入口  锁屏--互动课堂
        //   document.getElementById("lockPadCom").style.setProperty("display", "none", "important")
        // }
        // 离线授课 屏蔽一些按钮 平板控制不可用；录课，抢答,截屏，投票不可用。去除编辑应用。助手入口不可用。
        if (this.loginData.openWay === 1) {
            document.querySelector(".changeClass").style.display = "none";
        } else {
            document.getElementById("lockPadCom").style.cssText = "display:none !important";
            document.getElementById("screeSnapCom").style.cssText = "display:none !important";// http://jira.xuelebj.net/browse/CLASSROOM-6376
            document.getElementById("screeRecordCom").style.cssText = "display:none !important";
            document.getElementById("changeLessonCom").style.display = "none";
            document.getElementById("blackboardWriting").style.cssText = "display:none !important";// http://jira.xuelebj.net/browse/CLASSROOM-7160
        }
        // else if(this.loginData.class.teachTargetType === 2){//暂时去掉pad交互入口  锁屏--互动课堂
        //   document.getElementById("lockPadCom").style.setProperty("display","none","important")
        // }
    }

    // 初始化所有应用列表
    initAllAppListHTML() {
        const appListUl = document.querySelector(".components-all-photo-ul-box");
        appListUl.innerHTML = `<span class='components-remove' id="removeCustomAppCom">移除</span>`
        console.log('@@@@@@@@', this.seletedApp);
        this.allAppSettingArr.forEach((appSetting, i) => {
            if (appSetting.appId) {
                if (this.seletedApp.includes(appSetting.appId)) {
                    appListUl.innerHTML
                        += '<li class="active" data-origin="true" data-appId="'
                        + appSetting.appId
                        + '" data-bigIcon="'
                        + appSetting.appBigIcon
                        + '"><div class="components-photo"><img draggable="false" src='
                        + encodeURI(appSetting.appBigIcon)
                        + ' alt=""></div><span>'
                        + appSetting.appName
                        + '</span><div class="components-selected"></div></li>';
                } else {
                    appListUl.innerHTML
                        += '<li data-origin="true" data-appId="'
                        + appSetting.appId
                        + '" data-bigIcon="'
                        + appSetting.appBigIcon
                        + '"><div class="components-photo"><img draggable="false" src='
                        + encodeURI(appSetting.appBigIcon)
                        + ' alt=""></div><span>'
                        + appSetting.appName
                        + '</span><div class="components-selected"></div></li>';
                }
            }
        });
    }

    // 初始化自定义方案应用列表
    async initCustomAppsHTML() {
        // debugger
        const that = this;
        let customApps = this.customApps.customApps;
        const customAppsUl = document.getElementById("customAppsCom");
        customAppsUl.innerHTML = "";
        console.log('that.allAppSettingObj:', customApps, that.allAppSettingObj)
        const allArr = [];
        for (const i in that.allAppSettingObj) {
            if (that.allAppSettingObj[i].id) {
                allArr.push(that.allAppSettingObj[i].id + '')
            } else if (that.allAppSettingObj[i].appId) {
                allArr.push(that.allAppSettingObj[i].appId + '')
            }
        }
        customApps = customApps && customApps.map((item) => {
            const temp = item.map((val) => {
                if (allArr.indexOf(val) == -1) {
                    return ""
                }
                    return val
            })
            return temp;
        })
        component.vue.$store.commit("setData", { appGroups: component.customApps });
        for (let i = 0;i < customApps.length;i++) {
            const appIds = customApps[i];
            for (let j = 0;j < appIds.length;j++) {
                const appId = appIds[j]
                if (appId) {
                    if (that.isInteract && appId == "00001010") { // 互动班级隐藏ai课堂
                        customAppsUl.innerHTML
                            += " <li data-groupNum="
                            + i
                            + " data-appNum="
                            + j
                            + ' data-appId="">空位</li>';
                        return false
                    }
                    if (that.allAppSettingObj[appId] && that.allAppSettingObj[appId].appId) {
                        customAppsUl.innerHTML
                            += "<li data-groupNum="
                            + i
                            + " data-appNum="
                            + j
                            + ' data-appId="'
                            + appId
                            + '"><img src='
                            + encodeURI(
                                that.allAppSettingObj[appId].appBigIcon
                            )
                            + ' alt=""></li>';
                    } else {
                        if (that.allAppSettingObj[appId]) {
                            const id = that.allAppSettingObj[appId].id;
                            const linkName = that.allAppSettingObj[appId].linkName;
                            // const bg = that.allAppSettingObj[appId].linkLogoColor;
                            const link = that.allAppSettingObj[appId].link;
                            const urlIcon = await this.selfUrl.syncIcon(link);
                            let background = that.allAppSettingObj[appId].linkLogoColor;
                            if (urlIcon) {
                                background = `url(${urlIcon}) no-repeat`;
                            }
                            customAppsUl.innerHTML += `<li data-groupNum="${i}" data-appNum="${j}" data-appId="${id}">
                <div class="components-plan-div" style="background:${background};background-size: 32px;background-position: center center"><p style="display: ${urlIcon ? 'none!important' : '-webkit-box!important'}">${linkName}</p></div>
                </li>
                `
                        } else {
                            customAppsUl.innerHTML
                                += " <li data-groupNum="
                                + i
                                + " data-appNum="
                                + j
                                + ' data-appId="">空位</li>';
                        }
                    }
                } else {
                    customAppsUl.innerHTML
                        += " <li data-groupNum="
                        + i
                        + " data-appNum="
                        + j
                        + ' data-appId="">空位</li>';
                }
            }
        }
        // 自定义方案显示到默认设置
        // setTimeout(() => {
        //     customAppsUl.scrollTop = 76 * this.customApps.default;
        // }, 0);
        console.log(that.allAppSettingObj)
    }

    // 初始化底部任务栏中的默认方案
    initTaskBarAppsHTML() {
        const that = this;
        const defaultCustomApps = this.customApps.customApps && this.customApps.customApps[
            this.customApps.default
        ];

        const taskAppListUl = document.getElementById("taskAppListCom");
        taskAppListUl.innerHTML = "";
        // var liList = taskAppListUl.querySelectorAll("li");
        // defaultCustomApps.forEach((appId, i) => {
        //     if (appId && that.allAppSettingObj[appId]) {
        //         taskAppListUl.innerHTML += '<li data-appid="' + appId + '"><img src=' + encodeURI(that.allAppSettingObj[appId].appSmallIcon) + '></li>';
        //     }
        // })
        if (!defaultCustomApps) { return; }
        console.log('initTaskBarAppsHTML^^^^^^^^^^^^', defaultCustomApps)// , that.allAppSettingObj
        for (let i = defaultCustomApps.length - 1;i >= 0;i--) {
            const appId = defaultCustomApps[i];
            if (appId && that.allAppSettingObj[appId]) {
                if (that.isInteract && appId == "00001010") { continue }// 互动班级隐藏ai课堂
                if (that.allAppSettingObj[appId].appId) {
                    taskAppListUl.innerHTML
                        += '<li data-appid="'
                        + appId
                        + '"><img src='
                        + encodeURI(
                            that.allAppSettingObj[appId].appSmallIcon
                        )
                        + "><span>"
                        + that.allAppSettingObj[appId].appName
                        + "</span></li>";
                } else {
                    taskAppListUl.innerHTML
                        += `<li class="self-footer-li" data-link="${that.allAppSettingObj[appId].link}" data-appid="${appId}"><div class="foot-self-bg"></div><span>${that.allAppSettingObj[appId].linkName}</span></li>`
                }
            }
        }
        if (this.loginData.openWay !== 2) { // 离线授课 去掉编辑按钮；
            taskAppListUl.innerHTML += '<li data-appId="editApp">编辑</li>';
        }
    }

    getEventPath(evt) {
        let element = evt.target;
        const pathArr = [element];
        if (element === null || element.parentElement === null) {
          return [];
        }
        while (element.parentElement !== null) {
          element = element.parentElement;
          pathArr.unshift(element);
        }
        console.log("polyfill:event.path");
        return pathArr;
      }

    initEvent() {
        const that = this;
        window.onresize = function (e) {
            that.componentAppList.exitEditAppGroup(); // 隐藏掉
        };
        // document对象上注册一个监听 visibilitychange
        // document.addEventListener("visibilitychange", function () {
        //     console.log(document.visibilityState);
        // })
        // 点击页面其他地方隐藏掉应用列表框
        document.onmouseup = document.onmousedown = document.ontouchstart = function (e) {
            const target = e.target;
            // debugger
            // 弹框的蒙层，不做操作
            let flag = false;
            const formTag = ['INPUT', 'TEXTAREA'];
            const diasbleClick = ['xl-dialog-mask', 'xl-dialog', 'bodyMask', 'xl-footer-hint'];
            that.getEventPath(e).some((t) => {
                if (t.classList && diasbleClick.some((d) => t.classList.contains(d))) {
                    flag = true;
                }
                if (e.target && e.target.nodeName && formTag.indexOf(e.target.nodeName) != -1) {
                    flag = false;
                }
            })
           if (flag) { return false; }
            let qrCodeBox;
            for (qrCodeBox = e.target;qrCodeBox && qrCodeBox.id != "qrCodeBox";qrCodeBox = qrCodeBox.parentElement) { }
            if (!qrCodeBox) {
                that.vue.$bus.emit(that.vue.$BusEvent.clickPage, e)
            }
            if (e.type == "mouseup") { let ddd; }
            else { let rrrr; }

            if (e.propagationPath) {
                const eventPath = e.propagationPath();
                let isClickAppList = false;
                let isMoreMenuList = false;
                let isQrcode = false;
                let istool = false;
                let toolbar = false;
                let isDownList = false;// http://jira.xuelebj.net/browse/CLASSROOM-7508
                let isfinishRecoding = false;
                eventPath.some((t) => {
                    if (t.id === "smallToolBox") {
                        toolbar = true;
                    }
                    if (t.className && (typeof t.className == "string") && t.className.indexOf('finishRecoding') != -1) {
                        isfinishRecoding = true;
                    }
                    if (t.id && t.id === "openDownload") {
                        isDownList = true;
                    }
                    if ((t.id
                        && (t.id == "appListDivCom" || t.id == "mainMenuCom" || t.id == "downlodeAIClass")) || (t.dataset && t.dataset["appid"] == "editApp"))
                        { return (isClickAppList = true), (isQrcode = true); }
                    if (t.id && t.id == "theMoreCom") { return (isMoreMenuList = true); }
                    if (t.id && (t.id == "smallResolution" || t.id == "pickUpCom")) { return (istool = true); }
                    if (t.id == "BdCanvas" || (t.id && t.id.toLocaleLowerCase() == "allcanvas") || t.id == "toolTabUl" || t.id == "tool-box" || t.className == "footerUl" || t.className == "footTab") {
                        return (toolbar = true);
                    }
                });
                console.log('that.selfUrl.isSwipe', that.selfUrl.isSwipe)
                if (isfinishRecoding) { // http://jira.xuelebj.net/browse/CLASSROOM-7720
                    return false;
                }
                // TODO
                if (!isClickAppList && !that.selfUrl.isSwipe && (!isDownList || e.type === "mouseup" && !that.vue.isDragBody)) {
                    that.componentAppList.exitEditAppGroup(); // 隐藏掉
                }
                if (!isMoreMenuList) { that.componentBottomMenu.hideMoreUl(); } // 隐藏掉

                const smallResolution = document.getElementById("smallResolution");
                if (!istool) {
                    smallResolution.classList.remove("active");
                }
                if (target.className != "components-pickup") {
                    // console.log(JSON.stringify(that))
                    // that&&that.vue&&that.vue.$bus.emit(that.vue.$BusEvent.message,{type:'openMoreTool',data:false});

                }

                if (!toolbar) {
                    that.hideMoreTool();
                }
                // if (!toolbar && that.loginData.isShowFooter && that.loginData.toolSpread && that.loginData.login.mode !== '3') {
                //     that&&that.vue&&that.vue.$bus.emit(that.vue.$BusEvent.message,{type:'showStartTool',data:{o:true, right:that.loginData.toolRight, spread:false}});
                //     qrCodeBox.classList.add('display-none');
                // }
                // hideMoreTool
                // 标志位重置为false
                that.selfUrl.isSwipe = false;
                // return false;
            }
        };
    }

    // get
    // setCustomAppsRequest(callBack) {
    //     var that = this;
    //     var xhr = new XMLHttpRequest();
    //     xhr.open(
    //         "get",
    //         "https://smartclass-api.xueleyun.com/api/mini/qrcode?token=" +
    //         that.loginData.login.token
    //     );
    //     xhr.setRequestHeader("content-type", "application/json; charset=utf-8");
    //     xhr.send();
    //     xhr.onload = function (e) {
    //         if (this.status == 200)
    //             //发送成功
    //             callBack && callBack(this.responseText);
    //     };
    // }
    plusDefaultGroupNum() {
        this.customApps.default = Math.min(4, ++this.customApps.default);
        return this.customApps.default;
    }

    minusDefaultGroupNum() {
        this.customApps.default = Math.max(0, --this.customApps.default);
        return this.customApps.default;
    }

    getCurrentCustomApp() {
        if (this.customApps.customApps) {
            return this.customApps.customApps[this.customApps.default];
        }
    }

    // 调用打开应用方法
    showApp(selectAppId) {
        const apps = this.loginData.apps;
        const currApp = apps.find((item) => item.appId == selectAppId);
        // http://jira.xuelebj.net/browse/CLASSROOM-7293
        // debugger
        let name = this.vue.$router.history.current.path;
        if (name.indexOf('/work/') != -1) {
            name = name.replace('/work/', '/workList/')
        }
        if (currApp && name.indexOf(currApp.appUrl) != -1) { return; }
        if (OtherAppPage[selectAppId]) {
            this.vue.$bus.emit('dispatch', { type: 1,
path: OtherAppPage[selectAppId],
id: selectAppId })
        } else if (!currApp && !OtherAppPage[selectAppId]) {
            const url = $('.self-app-li[data-appid=' + selectAppId + ']').attr('data-link');
            if (window.xl) {
                window.xl.minimize();
                window.xl.openExternal(url);
            } else {
                if (url.indexOf('http') !== -1) {
                    window.open(url);
                } else {
                    window.open('http://' + url);
                }
            }
        } else {
            this.vue.$store.commit("setData", { currAppId: selectAppId });
            this.vue.$bus.emit('dispatch', { type: currApp.appType,
path: currApp.appUrl,
id: selectAppId })
        }

        // this.xl && this.xl.showApp(selectAppId);
    }
}

class ComponentBottomMenu {
    constructor() {
        console.log("ComponentBottomMenu.constructor");
        this.isAppEditing = false; // 是否在编辑自定义apps
        this.timeOutId = 0; // setTimeOut() 的id
        this.timer = 0;
        this.init();
    }

    init() {
        const that = this;
        console.log("ComponentBottomMenu.init");
        const mainMenu = document.getElementById("mainMenuCom");
        const taskAppListUl = document.getElementById("taskAppListCom");
        // 主菜单按钮点击
        mainMenu.onclick = function (e) {
            const appListDiv = document.getElementById("appListDivCom");
            if (appListDiv.classList.contains("components-editing"))
                // 编辑方案中切换到方案列表 需要先保存方案
                { component.componentAppList.exitEditAppGroup(); }

            that.toggleAppListDiv(false);
        };
        //  1024下 点击小工具按钮
        const smallRelosotion = document.getElementsByClassName(
            "components-small-resolution"
        )[0];

        smallRelosotion.onclick = function (e) {
            const target = e.target;
            if (target.tagName == "LI") {
                if (smallRelosotion.classList.contains("active")) {
                    smallRelosotion.classList.remove("active");
                }
                // 点击到右侧小工具中的Li上面
                switch (target.id) {
                    case "screeRecordCom1":
                        component.componentBottomMenu.WinXpNotice();
                        break;
                    case "screeSnapCom1":
                        // component.xl && component.xl.clickScreenSnap();
                        component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'clickScreenSnap' })
                        break;
                    case "drawingCom1":
                        component.showApp("00000006");
                        break;
                    case "spotlightCom1":
                        component.showApp("00000007");
                        break;
                    case "responder1":
                        if (component.loginData.isTrial) {
                            // component.xl.modal("nologin");
                            component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'modal',
args: ['nologin'] })
                        } else if (component.loginData.classState.beike && component.loginData.openWay != 2) { // 离线的时候不阻止
                            // component.xl && component.xl.menuBeikePattern();
                            component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'menuBeikePattern' })
                        } else {
                            component.showApp("00000106")
                        }
                        break;
                    case "lockPadCom1":
                        toggleLockStatus1();
                        break;
                    case "keyboardCom1":
                        component.xl && component.xl.clickOsk();
                        break;
                }

                // 锁/开锁pad
                function toggleLockStatus1() {
                    const lockPadCom = document.getElementById("lockPadCom1");
                    if (lockPadCom.classList.contains("unlock")) {
                        lockPadCom.classList.remove("unlock");
                        component && component.vue && component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'clickLockPad',
data: false });
                        // component.xl && component.xl.clickLockPad(false);
                    } else {
                        lockPadCom.classList.add("unlock");
                        component && component.vue && component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'clickLockPad',
data: true });
                        // component.xl && component.xl.clickLockPad(true);
                    }
                }
            }
        };

        // 点击用户头像和姓名
        // 若未登录点击头像及未登录字样则显示登录框,调用xl.showLogin()；
        const userLoginCom = document.querySelector("#userLoginCom");
        const characterCom = document.querySelector("#characterCom");
        const openSignCom = document.querySelector("#openSignCom");
        const arrowCom = document.querySelector("#arrowCom");
        const previewClose = document.querySelector("#componentPreviewClose");
        const wholeDom = document.getElementsByClassName("components-section")[0];
        previewClose.onclick = (e) => {
            console.log("返回新建课件页面")
            if (component.loginData && component.loginData.login) {
                const loginDataObj = component.loginData.login;
                if (loginDataObj.mode) {
                    // loginDataObj.mode = "";
                    component.vue.$store.commit("setData", { login: { ...loginDataObj,
mode: '' } });
                }
            }

            // $("#componentPreviewClose").removeClass("previewCouseware");
            // component.showApp("00000008"); reset_footer
            component.vue.$store.commit('resetCacheList');
            component.vue.$bus.emit(component.vue.$BusEvent.reset_footer)
            component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'back',
ckey: () => {} })
            setTimeout(() => {
                wholeDom.classList.remove("components-preview");
                previewClose.classList.remove("previewCouseware");
            }, 100)
            // window.component = null;
            // setTimeout(()=>{
            //     component.vue.$bus.emit(component.vue.$BusEvent.message,{type:'back',ckey:()=>{}})
            // },100)
        }
        userLoginCom.onclick = (e) => {
            if (component.loginData.login.mode == "3") { // 预览不能点击
                return false;
            }
            const eventPath = e.propagationPath();
            console.log('eventPath', eventPath)
            eventPath.some((t) => {
                if (component.loginData && component.loginData.isTrial) {
                    if (t.id == "userLoginCom") {
                        console.log('userLoginCom showLogin')
                        component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'showLogin',
args: [] })
                        // window.showLogin();
                    }
                } else {
                    if (t.id == "characterCom") {
                        if (
                            component.loginData.login
                            && component.loginData.login.isSmartClass == 1
                        ) {
                            // 判断是否已经开通智慧课堂
                            return false;
                        }
                            // 弹出提示框
                            openSignCom.classList.add("active");
                    }
                }
            });
        };
        arrowCom.onclick = (e) => {
            // 点击箭头 弹框消失
            openSignCom.classList.remove("active");
        };

        // 底部任务栏列表点击
        taskAppListUl.onclick = function (e) {
            const target = e.target;
            const eventPath = e.propagationPath();
            eventPath.some((t) => {
                if (t.tagName == "LI") {
                    // 点击到任务栏中的Li上面
                    if (t.dataset["appid"] == "editApp") {
                        // 点击到编辑按钮
                        // that.isAppEditing = true;
                        $('.components-all-outer').removeAttr('style');
                        component.selfUrl.renderItemUrl(component.loginData.selfArr);

                        const appListDiv = document.getElementById("appListDivCom");
                        if (
                            appListDiv.classList.contains("components-applist-show")
                            && that.isAppEditing
                        )
                            // 编辑方案中切换到方案列表 需要先保存方案
                            { component.componentAppList.exitEditAppGroup(); }
                        // 内部已经有调用toggleAppListDiv的地方
                        else { that.toggleAppListDiv(true); }
                        component.componentAppList.appGroupChange();
                    } else if (t.classList.contains('self-footer-li')) {
                        const url = t.getAttribute('data-link');
                        if (window.xl) {
                            window.xl.minimize();
                            window.xl.openExternal(url);
                        } else {
                            if (url.indexOf('http') !== -1) {
                                window.open(url);
                            } else {
                                window.open('http://' + url);
                            }
                        }
                    } else {
                        // 选择某个app,跳转到该应用
                        const selectAppId = t.dataset["appid"];
                        if ((selectAppId == "00000105" || selectAppId == "00000104" || selectAppId == "00000102") && component.loginData.classState.beike && component.loginData.openWay != 2) { // 离线的时候不阻止
                            // component.xl && component.xl.menuBeikePattern();
                            component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'menuBeikePattern' })
                            return;
                        }
                        // 2018.01.25 http://jira.xuelebj.net/browse/CLASSROOM-3219
                        if (selectAppId == "00000103") {
                            // 如果点击屏幕分享
                            if (window.xl) {
                                that.WinXpNotice(selectAppId);
                            } else {
                                // web端
                                that.showAndHideNotice();
                            }
                        } else if (
                            (selectAppId == "00001005" || selectAppId == "00001004")
                            && that.isXP()
                        ) {
                            Dialog.showUnuseflash();
                            // return;
                        } else {
                            component.showApp(selectAppId);
                        }
                    }
                }
            });
            component.hideMoreTool();
        };
        const theMoreCom = document.getElementById("theMoreCom"); // 左下角帮助显示更多菜单
        theMoreCom.onclick = function (e) {
            const theMoreUlCom = document.getElementById("theMoreUlCom");
            if (theMoreUlCom.classList.contains("show"))
                { theMoreUlCom.classList.remove("show"); }
            else { theMoreUlCom.classList.add("show"); }
        };
        // 右下角工具列表
        const otherToolAppUl = document.getElementById("otherToolAppUlCom");
        otherToolAppUl.onclick = function (e) {
            const target = e.target;
            if (target.tagName == "LI") {
                // 点击到右侧小工具中的Li上面
                switch (target.id) {
                    case "pickUpCom":
                        // if (smallRelosotion.classList.contains("active")) {
                        //   smallRelosotion.classList.remove("active");
                        // } else {
                        //   smallRelosotion.classList.add("active");
                        // }
                        component && component.vue && component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'openMoreTool',
data: true });
                        break;
                    case "screeRecordCom":
                        if (component.loginData.isTrial) {
                            // component.xl.modal("nologin");
                            component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'modal',
args: ['nologin'] })
                        } else {
                            component.componentBottomMenu.WinXpNotice();
                        }
                        break;
                    case "screeSnapCom":
                        component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'clickScreenSnap' })
                        break;
                    case "clickScreenRecord":
                        component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'clickScreenRecord' })
                    case "drawingCom":
                        component.showApp("00000006");
                        break;
                    case "spotlightCom":
                        component.showApp("00000007");
                        break;
                    case "lockPadCom":
                        if (component.loginData.isTrial) {
                            // component.xl.modal("nologin");
                            component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'modal',
args: ['nologin'] })
                        } else if (component.loginData.login.isSmartClass == 2) {
                            // component.xl.modal("购买智慧课堂");
                            component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'modal',
args: ['购买智慧课堂'] })
                        } else {
                            toggleLockStatus();
                        }
                        break;
                    case "keyboardCom":
                        // component.xl && component.xl.clickOsk();
                        component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'clickOsk' })
                        break;
                    case "fullscreenCom":
                        component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'fullscreen' });
                        // component.xl && component.xl.fullscreen();
                        break;
                    case "minimizeCom":
                        component.xl && component.xl.minimize();
                        break;
                }
            }
        };
        // 课堂板书
       const blackboardWriting = document.getElementById("blackboardWriting");
       blackboardWriting && (blackboardWriting.onclick = function (event) { // components-section components-resolution
         const footer = document.querySelector("section.components-section.components-resolution");
         const height = footer && footer.getBoundingClientRect().height || 64;// http://jira.xuelebj.net/browse/CLASSROOM-7142
         component.vue.$bus.emit(component.vue.$BusEvent.message, { type: "blackboardWriting",
args: [height] })
       })
        // 锁/开锁pad
        function toggleLockStatus() {
            const lockPadCom = document.getElementById("lockPadCom");
            if (lockPadCom.classList.contains("unlock")) {
                // lockPadCom.classList.remove("unlock");
                component && component.vue && component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'clickLockPad',
data: false });
                // component.xl && component.xl.clickLockPad(false);
            } else {
                // lockPadCom.classList.add("unlock");
                component && component.vue && component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'clickLockPad',
data: true });
                // component.xl && component.xl.clickLockPad(true);
            }
        }
        // 左下角帮助菜单显示出来后 每个按钮点击逻辑处理
        // var theMoreUl = document.getElementById("theMoreUlCom");
        // theMoreUl.onclick = function (e) {
        //     var target = e.target;
        //     let eventPath = e.propagationPath();
        //     eventPath.some((t) => {
        //         if (t.tagName == "LI") {
        //             switch (t.id) {
        //                 case "minimizeCom":
        //                     component.xl && component.xl.minimize();
        //                     break;
        //                 case "helpCom":
        //                     component.xl && component.xl.dialogHelp();
        //                     break;
        //                 case "settingCom":
        //                     component.xl && component.xl.gear();
        //                     break;
        //                 case "closeCom":
        //                     component.xl && component.xl.power();
        //                     break;
        //             }
        //         }
        //     })
        // }
    }

    showOrHideApp(isShow) {
        const appListDiv = document.getElementById("appListDivCom");
        isShow ? appListDiv.classList.add("components-applist-show") : appListDiv.classList.remove("components-applist-show");
    }

    // 触发应用列表是否展示，是否展示编辑状态
    toggleAppListDiv(isAppEditing) {
        const appListDiv = document.getElementById("appListDivCom");
        const smallResolution = document.getElementById("smallResolution");

        if (this.isAppEditing == isAppEditing) {
            if (appListDiv.classList.contains("components-applist-show")) {
                appListDiv.classList.remove("components-applist-show");
            }
            else {
                appListDiv.classList.add("components-applist-show");
            }
            if (smallResolution.classList.contains("active")) {
                smallResolution.classList.remove("active");
            }
        } else {
            appListDiv.classList.add("components-applist-show");
            smallResolution.classList.remove("active");
        }
        // 判断是否点击的是编辑按钮，添加对应样式
        if (isAppEditing) { appListDiv.classList.add("components-editing"); }
        else { appListDiv.classList.remove("components-editing"); }

        this.isAppEditing = isAppEditing;

        // 添加定位的样式节点
        var appListPositionStyle = document.getElementById(
            "appListPositionStyleCom"
        );
        if (!appListPositionStyle) {
            var appListPositionStyle = document.createElement("style");
            appListPositionStyle.id = "appListPositionStyleCom";
            document
                .querySelector(".components-section")
                .appendChild(appListPositionStyle);
        }
        $('.components-all-outer').removeAttr('style');
        // 定位展示框位置
        if (isAppEditing) {
            const liList = document.querySelectorAll(".components-left li");
            appListPositionStyle.innerHTML
                = ".components-section .component-app-left{left:"
                + liList[liList.length - 1].getBoundingClientRect().left
                + "px !important}";
        } else
            { appListPositionStyle.innerHTML
                = ".components-section .component-app-left{left:"
                + (window.innerWidth / 2 - 214)
                + "px !important}"; }
    }

    hideMoreUl() {
        const theMoreUlCom = document.getElementById("theMoreUlCom");
        theMoreUlCom.classList.remove("show");
    }

    // 框架-xp系统下 提示框 http://jira.xuelebj.net/browse/CLASSROOM-3219
    WinXpNotice(appId) {
        const that = this;
        const uaString = navigator.userAgent.toLowerCase();
        // if (appId) {
        //     if (uaString.indexOf("wisdomclass_xp") != -1) {
        //         that.showAndHideNotice();
        //     } else {
        //         component.showApp(appId);
        //     }
        // } else {
        //     if (uaString.indexOf("wisdomclass_xp") != -1) {
        //         that.showAndHideNotice();
        //     } else {
        //         component.xl && component.xl.clickScreenRecord();
        //     }
        // }

        if (uaString.indexOf("wisdomclass_xp") != -1) {
            that.showAndHideNotice();
        } else {
            if (appId) {
                component.showApp(appId);
            } else {
                component.xl && component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'clickScreenRecord' })
            }
        }
    }

    isXP() {
        const uaString = navigator.userAgent.toLowerCase();
        // var osV = uaString.substr(uaString.indexOf("windows nt ")+11, 3);
        if (uaString.indexOf("wisdomclass_xp") != -1) {
            return true;
        }
            return false;
    }

    showAndHideNotice() {
        // xp系统提示框 显示或隐藏
        const comNotice = document.querySelector("#comNotice");
        comNotice.classList.add("notice");
        this.timeOutId && clearTimeout(this.timeOutId); // 清除id 避免多次点击造成的问题
        this.timeOutId = setTimeout(function () {
            comNotice.classList.remove("notice");
        }, 3000);
    }
}
// 应用列表交互逻辑绑定
class ComponentAppList {
    constructor() {
        console.log("ComponentAppList.constructor");
        this.init();
    }

    init() {
        const that = this;
        console.log("ComponentAppList.init");
        // 3.16.3 web增加客户端下载页http://jira.xuelebj.net/browse/CLASSROOM-5414
        const downlodeAiclass = document.getElementById("downlodeAIClass");
        downlodeAiclass.onclick = (e) => {
            window.open("https://act.xueleyun.com/zhkt/");
        }

        // 3.6 左下角菜单移到应用列表上
        const infoDiv = document.getElementById("infoCom");
        infoDiv.onclick = function (e) {
            const target = e.target;
            const eventPath = e.propagationPath();
            eventPath.some((t) => {
                if (t.tagName == "LI") {
                    switch (t.id) {
                        case "helpCom":
                            component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'dialogHelp',
ckey: () => {} },)
                            break;
                        case "settingCom":
                            component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'gear' })
                            break;
                    }
                }
            });
        };
        // 点击下课按钮
        const closeCom = document.getElementById("closeCom");

        closeCom.addEventListener('click', this.closeComFn, false)

        // 针对pwa更新，走下课逻辑，故直接触发下课的点击事件
        function clickCloseCom() {
            closeCom.click();
        }
        window.clickCloseCom = clickCloseCom;

        // 左右切换方案按钮事件绑定
        const leftBtnCom = document.getElementById("leftBtnCom");
        const rightBtnCom = document.getElementById("rightBtnCom");
        leftBtnCom.onclick = function () {
            rightBtnCom.classList.remove("disabled");
            if (!leftBtnCom.classList.contains("disabled")) {
                if (component.minusDefaultGroupNum() == 0)
                    { leftBtnCom.classList.add("disabled"); }
                that.appGroupChange();
            }
        };
        rightBtnCom.onclick = function () {
            leftBtnCom.classList.remove("disabled");
            if (!rightBtnCom.classList.contains("disabled")) {
                if (component.plusDefaultGroupNum() == 4)
                    { rightBtnCom.classList.add("disabled"); }
                that.appGroupChange();
            }
        };
        const appListCom = document.getElementById("appListCom"); // 下面的所有应用列表
        const customAppsCom = document.getElementById("customAppsCom"); // 最上面的五个方案列表
        // 下面的所有应用列表li点击事件逻辑处理
        appListCom.onclick = function (e) {
            const target = e.target;
            const eventPath = e.propagationPath();
            eventPath.some((t) => {
                if (t.tagName == "LI") {
                    if (component.componentBottomMenu.isAppEditing) {
                        // 自定义app方案
                        // A.应用方案列表中五个空位未满时，
                        // a.方案列表中有选中位置，
                        // 1.选中下面的app出现对勾选中状态，并放置到方案中选中位置（添加、替换或对换）
                        // 2.点击移除 移除选中方案app
                        // b.方案列表中没有选中位置，
                        // 1.选中下面的未勾选的app后出现对勾选中状态，并放置到方案中最左边空位中。
                        // 2.如选中已勾选状态的app，呈高亮状态，这时候可以点击移除按钮或者点击方案中的位置（移位或者调换）
                        // 3.点击移除 移除下面高亮且勾选的app，如没有移除方案中最右边app
                        // B.应用方案列表中五个空位全满时，
                        // a.方案列表中有选中位置，
                        // 1.选中下面的app出现对勾选中状态，并放置到方案中选中位置（替换或对换）
                        // 2.点击移除 移除选中方案app
                        // b.方案列表中没有选中位置，
                        // 1.选中下面的未勾选的app出现高亮状态，继续去点击方案中某个应用则为替换。
                        // 2.如选中已勾选状态的app，呈高亮状态，这时候可以点击移除按钮或者点击方案中的位置（调换）
                        // 3.点击移除 移除下面高亮且勾选的app，如没有移除方案中最右边app
                        var selectAppId = t.dataset["appid"];
                        const selectAppIcon = t.dataset["bigicon"];
                        var groupAppSelectLi = customAppsCom.querySelector(".active"); // 方案列表中已经选中的某个li
                        var groupSelectAppId = ""; // 方案列表中已经选中的某个li的appId  可能为空
                        groupAppSelectLi
                            && (groupSelectAppId = customAppsCom.querySelector(".active")
                                .dataset["appid"]);
                        const customAppIds = component.getCurrentCustomApp(); // 自定义过的所有方案的app列表
                        if (customAppIds.indexOf("") >= 0) {
                            // A.应用方案列表中五个空位未满时，
                            if (groupAppSelectLi) {
                                // a.方案列表中有选中位置，
                                if (!t.classList.contains("active")) {
                                    // 点击的应用无勾选状态
                                    if (!groupSelectAppId) {
                                        // 方案列表选中位置没有存放app的时候，添加
                                    } else {
                                        // 方案列表选中位置已经有存放app的时候，替换
                                    }
                                    t.classList.add("active"); // 添加勾选状态
                                    var groupAppSelectedIndex = [].indexOf.call(
                                        groupAppSelectLi.parentElement.children,
                                        groupAppSelectLi
                                    );
                                    resetCustomAppId(
                                        groupAppSelectedIndex,
                                        groupSelectAppId,
                                        selectAppId
                                    );
                                } else {
                                    // 点击的应用有勾选状态
                                    if (!groupSelectAppId) {
                                        // 方案列表选中位置没有存放app的时候,移位
                                    } else {
                                        // 方案列表选中位置已经有存放app的时候，换位
                                    }
                                    if (selectAppId != groupSelectAppId) {
                                        t.classList.add("selected"); // 添加高亮状态
                                        var groupAppSelectedIndex = [].indexOf.call(
                                            groupAppSelectLi.parentElement.children,
                                            groupAppSelectLi
                                        );
                                        resetCustomAppId(-1, selectAppId, groupSelectAppId); // 先把方案中对应下方选中appId的位置置为新值
                                        resetCustomAppId(
                                            groupAppSelectedIndex,
                                            groupSelectAppId,
                                            selectAppId
                                        ); // 把下方选中app放到方案中选中位置
                                    }
                                }
                            } else {
                                // b.方案列表中没有选中位置，
                                if (!t.classList.contains("active")) {
                                    // 点击的应用无勾选状态
                                    t.classList.add("active"); // 添加勾选状态
                                    resetCustomAppId(-1, "", selectAppId);
                                } else {
                                    var selectedEle = document.querySelector(
                                        ".components-all-photo .selected"
                                    );
                                    if (selectedEle) {
                                        selectedEle.classList.remove("selected"); // 去掉all应用列表中当前高亮app的高亮效果
                                        if (selectedEle.dataset["appid"] != t.dataset["appid"]) {
                                            // 不是重复选择某一个app时
                                            t.classList.add("selected"); // 添加高亮状态
                                        }
                                    } else { t.classList.add("selected"); } // 添加高亮状态
                                }
                            }
                        } else {
                            // B.应用方案列表中五个空位全满时
                            if (groupAppSelectLi) {
                                // a.方案列表中有选中位置，和A-a逻辑相同
                                if (!t.classList.contains("active")) {
                                    // 点击的应用无勾选状态
                                    if (!groupSelectAppId) {
                                        // 方案列表选中位置没有存放app的时候，添加
                                    } else {
                                        // 方案列表选中位置已经有存放app的时候，替换
                                    }
                                    t.classList.add("active"); // 添加勾选状态
                                    var groupAppSelectedIndex = [].indexOf.call(
                                        groupAppSelectLi.parentElement.children,
                                        groupAppSelectLi
                                    );
                                    resetCustomAppId(
                                        groupAppSelectedIndex,
                                        groupSelectAppId,
                                        selectAppId
                                    );
                                } else {
                                    // 点击的应用有勾选状态
                                    if (!groupSelectAppId) {
                                        // 方案列表选中位置没有存放app的时候,移位
                                    } else {
                                        // 方案列表选中位置已经有存放app的时候，换位
                                    }
                                    if (selectAppId != groupSelectAppId) {
                                        t.classList.add("selected"); // 添加高亮状态
                                        var groupAppSelectedIndex = [].indexOf.call(
                                            groupAppSelectLi.parentElement.children,
                                            groupAppSelectLi
                                        );
                                        resetCustomAppId(-1, selectAppId, groupSelectAppId); // 先把方案中对应下方选中appId的位置置为新值
                                        resetCustomAppId(
                                            groupAppSelectedIndex,
                                            groupSelectAppId,
                                            selectAppId
                                        ); // 把下方选中app放到方案中选中位置
                                    }
                                }
                            } else {
                                // b.方案列表中没有选中位置，（选中app出现高亮状态）
                                var selectedEle = document.querySelector(
                                    ".components-all-photo .selected"
                                );
                                if (selectedEle) {
                                    selectedEle.classList.remove("selected"); // 去掉all应用列表中当前高亮app的高亮效果
                                    if (selectedEle.dataset["appid"] != t.dataset["appid"]) {
                                        // 不是重复选择某一个app时
                                        t.classList.add("selected"); // 添加高亮状态
                                    }
                                } else { t.classList.add("selected"); } // 添加高亮状态
                            }
                        }
                        // if (t.classList.contains("active"))
                        //     t.classList.remove("active");
                        // else
                        //     t.classList.add("active");
                    } else {
                        // 应用列表选择后跳转
                        var selectAppId = t.dataset["appid"];
                        // 2018.7-31 http://jira.xuelebj.net/browse/CLASSROOM-4447
                        if ((selectAppId == "00000105" || selectAppId == "00000104" || selectAppId == "00000102") && component.loginData.classState.beike && component.loginData.openWay != 2) { // 离线的时候不阻止
                            // component.xl && component.xl.menuBeikePattern();
                            component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'menuBeikePattern' })
                            component.componentBottomMenu.toggleAppListDiv(false);
                            return;
                        }
                        // 2018.01.25 http://jira.xuelebj.net/browse/CLASSROOM-3219
                        if (selectAppId == "00000103") {
                            // 如果点击屏幕分享
                            if (window.xl) {
                                component.componentBottomMenu.WinXpNotice(selectAppId);
                            } else {
                                // web端
                                component.componentBottomMenu.showAndHideNotice();
                            }
                        } else if (
                            (selectAppId == "00001005" || selectAppId == "00001004")
                            && component.componentBottomMenu.isXP()
                        ) {
                            Dialog.showUnuseflash();
                            // return;
                        } else {
                            component.showApp(selectAppId);
                        }
                        // 2018.01.22 http://jira.xuelebj.net/browse/CLASSROOM-3101
                        component.componentBottomMenu.toggleAppListDiv(false);
                    }
                } else if (
                    t.tagName == "SPAN"
                    && t.id
                    && t.id == "removeCustomAppCom"
                ) {
                    var groupAppSelectLi = document.querySelector(
                        ".components-plan .active"
                    );
                    var selectedEle = document.querySelector(
                        ".components-all-photo .selected"
                    );
                    if (groupAppSelectLi) {
                        // 上面方案中有选中的app
                        var groupSelectAppId = groupAppSelectLi.dataset["appid"];
                        resetCustomAppId(-1, groupSelectAppId, ""); // 把方案中对应的appip置空
                    } else if (
                        selectedEle
                        && selectedEle.classList.contains("active")
                    ) {
                        // 下面列表有同时勾选和高亮的app，移除该app
                        var selectAppId = selectedEle.dataset["appid"];
                        resetCustomAppId(-1, selectAppId, ""); // 把方案中对应的appip置空
                    } else {
                        // 移除当前方案中最右侧的一个app
                        const curCustomApps = component.getCurrentCustomApp();
                        for (
                            let lastValueIndex = 4;
                            lastValueIndex >= 0;
                            lastValueIndex--
                        ) {
                            if (curCustomApps[lastValueIndex]) {
                                resetCustomAppId(-1, curCustomApps[lastValueIndex], ""); // 把方案中对应的appip置空
                                break;
                            }
                        }
                    }
                }
            });
        };
        // 方案列表li点击事件逻辑处理
        customAppsCom.onclick = function (e) {
            const target = e.target;
            const eventPath = e.propagationPath();
            eventPath.some((t) => {
                if (t.tagName == "LI") {
                    if (t.classList.contains("active"))
                        // 当前的li已经是有高亮选中状态下，再次点击取消高亮
                        { t.classList.remove("active"); }
                    else {
                        // 当前的li没有高亮选中状态
                        const acitveEle = document.querySelector(
                            ".components-plan .active"
                        );
                        if (acitveEle) {
                            // 其他的li有高亮选中状态
                            acitveEle.classList.remove("active"); // 先把高亮的li去掉active高亮效果
                            t.classList.add("active");
                        } else {
                            // 上面方案列表中全部都没有高亮选中状态
                            // 查找下面列表是否有高亮的li
                            const selectedEle = document.querySelector(
                                ".components-all-photo .selected"
                            );
                            if (!selectedEle) {
                                // 下面allapp列表有没有高亮的li
                                t.classList.add("active");
                            } else {
                                // 下面allapp列表有高亮的li
                                const selectAppId = selectedEle.dataset["appid"];
                                const groupSelectAppId = t.dataset["appid"];
                                if (groupSelectAppId) {
                                    // 点击的方案列表中的非空位
                                    if (groupSelectAppId != selectAppId) {
                                        var groupAppSelectedIndex = [].indexOf.call(
                                            t.parentElement.children,
                                            t
                                        );
                                        if (selectedEle.classList.contains("active"))
                                            // 下面的列表有高亮且勾选的app
                                            { resetCustomAppId(-1, selectAppId, groupSelectAppId); } // 先把方案中对应下方选中appId的位置置为新值
                                        resetCustomAppId(
                                            groupAppSelectedIndex,
                                            groupSelectAppId,
                                            selectAppId
                                        );
                                    }
                                } else {
                                    // 点击的方案列表中的空位
                                    if (selectedEle.classList.contains("active")) {
                                        // 下面的列表有高亮且勾选的app，则需要移位到点击方案的空位上
                                        var groupAppSelectedIndex = [].indexOf.call(
                                            t.parentElement.children,
                                            t
                                        );
                                        resetCustomAppId(-1, selectAppId, groupSelectAppId); // 先把方案中对应下方选中appId的位置置为新值
                                        resetCustomAppId(
                                            groupAppSelectedIndex,
                                            groupSelectAppId,
                                            selectAppId
                                        );
                                    } else {
                                        // 不会出现的情况
                                    }
                                }
                            }
                        }
                    }
                }
            });
        };
        // 把当前方案列表中对应appId的位置重置为newAppId，index代表方案列表中的索引值。如果为-1表示需要根据appId找到对应的位置索引值
        async function resetCustomAppId(index, appId, newAppId) {
            if (index == -1) {
                var i = component.customApps.default;
                var j = component.customApps.customApps[
                    component.customApps.default
                ].indexOf(appId);
                index = 5 * i + j;
            } else {
                var i = component.customApps.default; // Math.floor(index / 5);
                var j = index % 5;
            }

            const appLi = document.querySelectorAll(".components-plan li")[index];
            let newAppIcon = "";
            let selfApp = true;
            if (newAppId) {
                for (const i in component.allAppSettingObj) {
                    if (i == newAppId && component.allAppSettingObj[i].appId) {
                        selfApp = false;
                    }
                }
                if (!selfApp) {
                    newAppIcon
                        = component.allAppSettingObj[newAppId].appBigIcon;
                } else {
                    newAppIcon = true;
                }
            }
            appLi.dataset["appid"] = newAppId;
            appLi.dataset["bigicon"] = newAppIcon;
            if (newAppIcon) {
                if (!selfApp) {
                    appLi.innerHTML = "<img src=" + encodeURI(newAppIcon) + ' alt="">';
                } else {
                    $('li.self-app-li[data-appid="' + newAppId + '"]').addClass('active');
                    const src = $('li.self-app-li[data-appid="' + newAppId + '"]').attr('data-bigicon');
                    const linkName = $('li.self-app-li[data-appid="' + newAppId + '"]').find('span').html();
                    const link = $('li.self-app-li[data-appid="' + newAppId + '"]').attr('data-link');
                    const urlIcon = await component.selfUrl.syncIcon(link);
                    let background = $('li.self-app-li[data-appid="' + newAppId + '"]').attr('data-color');
                    if (urlIcon) {
                        background = `url(${urlIcon}) no-repeat`;
                    }
                    appLi.innerHTML = `<div class="components-plan-div" data-src="${src}" style="background:${background};background-size: 32px;background-position: center center"><p style="display: ${urlIcon ? 'none!important' : '-webkit-box!important'}">${linkName}</p></div>`;
                }
            }
            else {
                appLi.innerHTML = "空位";
            }
            // 修改方案列表中对应的数据
            component.customApps.customApps[i][j] = newAppId;
            that.appGroupChange();
        }
        // 更改课程按钮
        const changeLessonCom = document.getElementById("changeLessonCom");
        changeLessonCom.onclick = function (e) {
            // 打开选课件应用
            const sectionClassList = document.querySelector(".components-section")
                .classList;
            if (
                sectionClassList.contains("components-no-class")
                || sectionClassList.contains("components-no-unit")
                || sectionClassList.contains("components-no-class-no-unit")
            ) {
                return false;
            }
                // component.xl && component.xl.setLastCourseware(component.loginData.courseware, component.loginData.class);
                // component.xl && component.xl.changeKejian();
                component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'changeKejian' })
                // 2018.01.23 http://jira.xuelebj.net/browse/CLASSROOM-3171
                component.componentBottomMenu.toggleAppListDiv(false);
        };
        const changeClass = document.getElementById("changeClassFromOffline")
        changeClass.onclick = function() {
            component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'changeClassFromOffline' })
        }
        // 退出方案编辑按钮
        const exitCom = document.getElementById("exitCom");
        exitCom.onclick = function (e) {
            // 退出编辑，向xl更新数据
            that.exitEditAppGroup();
        };
    }

    //
    closeComFn() {
        if (
            component.xl
            && component.xl.getRecState
            && (component.xl.getRecState() == 1 || component.xl.getRecState() == 2)
        ) {
            // 正在录屏 和 正在合并音轨
            // component.xl.displayRecNote("正在录课，请终止录制后下课");
            // 3.6.0
            Dialog.alert('正在录课，请终止录制后下课')
            // component.xl.modal("screenRecording");
            // 暂停录屏
            // component.xl.onRecPause();
            if (component.xl.onRecPause() == 0) {
                console.log("暂停录屏成功---3.6.0");
            } else if (component.xl.onRecPause() == -1) {
                console.log("暂停录屏失败---3.6.0");
            } else if (component.xl.onRecPause() == -2) {
                console.log("找不到暂停录屏接口---3.6.0");
            }
            // }else if(component.xl && component.xl.getRecState && component.xl.getRecState()==2){//正在上传录屏文件
            //     component.xl.displayRecNote("微课上传中，请上传完成后下课");
        } else {
            // 除了上述两种情况，正常下课
            // component.xl && component.xl.power();
            component.vue.$bus.emit('message', { type: 'power' })
            component.componentBottomMenu.toggleAppListDiv(false);
        }
    }

    // 退出方案编辑
    exitEditAppGroup() {
        const appListDiv = document.getElementById("appListDivCom");
        if (appListDiv.classList.contains("components-applist-show")) {
            const copy = JSON.parse(component.customAppsCopy);
            console.log(copy)
            if (copy) {
                const isChangeCustomApps = !(
                    JSON.stringify(component.customApps.customApps)
                    == JSON.stringify(copy.customApps)
                );
                const isChangeCustomAppDefault = !(
                    component.customApps.default == copy.default
                );
                if (isChangeCustomApps || isChangeCustomAppDefault) {
                    if (component.loginData.isTrial) {
                        component.vue.$store.commit("setData", { appGroups: component.customApps });
                        component.customAppsCopy = JSON.stringify(component.customApps);
                    } else {
                        this.setCustomAppsRequest().then(() => {
                            component.vue.$store.commit("setData", { appGroups: component.customApps });
                            // component.xl &&
                            //     component.xl.setData({ appGroups: component.customApps }); //更新xl中的appGroups
                            component.customAppsCopy = JSON.stringify(component.customApps);
                        });
                        // Fix -- http://jira.xuelebj.net/browse/CLASSROOM-3608
                        // 选了新菜单，再发起ajax更新数据，本地的菜单数据等到响应成功在更新，会有时间上的延误。在ajax请求中点击白板，白板取到的是旧数据
                        component.vue.$store.commit("setData", { appGroups: component.customApps });
                        component.customAppsCopy = JSON.stringify(component.customApps);
                    }
                }
            }
            component.componentBottomMenu.toggleAppListDiv(
                component.componentBottomMenu.isAppEditing
            );
        }
    }

    // 保存方案 请求接口 更新gData
    setCustomAppsRequest() {
        const data = {
            modifyState: 1, // 是否修改了app组信息 枚举值 1：修改了 0:未修改 针对的是customApps信息是否修改
            customApps: component.customApps.customApps, // 如果app组信息 无修改可以不用传customApps字段
            userId: component.loginData.login.user.userId,
            schoolId: component.loginData.login.user.schoolId,
            default: component.customApps.default // 用户选择的默认app组
        }
        return commonApi.getAppGroups(component.loginData.login.token, data);
    }

    // 根据当前方案的app列表展示app列表中有对勾的应用，并切换任务栏中的应用
    appGroupChange() {
        const customAppsUl = document.getElementById("customAppsCom");
        customAppsUl.scrollTop = 76 * component.customApps.default;
        const customAppIds = component.getCurrentCustomApp();
        const allAppLiList = document.querySelectorAll(".components-all-photo li");
        console.log('***********', customAppIds, allAppLiList)
        component.seletedApp = customAppIds;
        for (let i = 0;i <= allAppLiList.length - 1;i++) {
            const li = allAppLiList[i];
            li.classList.remove("active");
            const appId = li.dataset["appid"];
            if (customAppIds.indexOf(appId) >= 0) {
                li.classList.add("active");
            }
        }
        const acitveEle = document.querySelector(".components-plan .active");
        acitveEle && acitveEle.classList.remove("active"); // 去掉方案中app高亮效果
        const selectedEle = document.querySelector(
            ".components-all-photo .selected"
        );
        selectedEle && selectedEle.classList.remove("selected"); // 去掉all应用列表中app高亮效果
        component.initTaskBarAppsHTML(); // 变化了方案后底部任务栏中的app也响应变化
        this.index = 0;
        document.getElementById("customAppTitleCom").innerHTML
            = "应用快捷区" + (component.customApps.default + 1);
        const leftBtnCom = document.getElementById("leftBtnCom");
        const rightBtnCom = document.getElementById("rightBtnCom");
        leftBtnCom.classList.remove("disabled");
        rightBtnCom.classList.remove("disabled");
        if (component.customApps.default == 0) {
            leftBtnCom.classList.add("disabled");
        } else if (component.customApps.default == 4) {
            rightBtnCom.classList.add("disabled");
        }
    }
}
class SelfUrl {
    constructor(gData) {
        this.xl = window.xlGetXl && window.xlGetXl();
        this.loginData = gData;
        this.api = "https://smartclass-api.xueleyun.com/api/links";
        this.selfBox = document.querySelector('.self-url-box');
        this.closeBtn = document.querySelector('.header-close-btn');
        this.addURL = document.querySelector('.self-add-form .self-add-form-url input');
        this.addName = document.querySelector('.self-add-form .self-add-form-name input');
        this.selfPic = document.querySelector('.self-add-pic p');
        this.selfAddBtn = document.querySelector('.self-add-btn');
        this.itemDelete = document.querySelector('.item-delete-btn');
        this.itemEditor = document.querySelector('.item-edit-btn');
        this.itemUrl = document.querySelector('.info-text-input-box .self-add-form-url');
        this.itemName = document.querySelector('.info-text-input-box .self-add-form-name');
        this.selfMask = document.querySelector('.self-mask');
        this.maxLen = 12;
        this.allNum = 0;
        this.maxItemNum = 50;
        this.colorArr = [];
        this.canAdd = false;
        this.pageNum = 1;
        this.index = 0;
        this.userId = null;
        this.schoolId = null;
        this.token = null;
        this.editorTimer = null;
        // this.initEvent();
        // this.initData();
        this.randomColor();
        this.selfArr = [];
        this.isSwipe = false;
    }

    isURL(str) {
        const reg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;
        if (str.indexOf('http') == -1) {
            str = 'http://' + str;
        }
        if (reg.test(str)) {
            return true;
        }
            return false;
    }

    getPageNum() {
        let num = $('#removeCustomAppCom').is(':hidden') ? $('#appListCom').find('li').length : $('#appListCom').find('li').length + 1;
        console.log($('#appListCom').find('li[data-origin]'))
        if ($('#appListCom').find('li[data-origin]').length == 0) {
          num += component.loginData.apps.length;
        }
        if (num / 16 < 1 || num === 16) {
            this.pageNum = 1;
        } else if (num / 16 > 1 && num % 16 !== 0) {
            this.pageNum = Math.ceil(num / 16);
        } else if (num / 16 > 1 && num % 16 == 0) {
            this.pageNum = num / 16;
        }
        console.log('页码数:', this.pageNum);
        this.buildPageIndex();
    }

    buildPageIndex() {
        let str = '<li class="active"></li>';
        const page = this.pageNum - 1;
        if (this.pageNum > 1) {
            for (let i = 0;i < page;i++) {
                str += '<li></li>';
            }
        }
        $('.custom-page-list-box').html(str);
    }

    initEvent() {
        const that = this;
        console.log('走进了initEvent');
        $('#appListDivCom').touch();
        $('#appListDivCom').off('swipe').off('swipeLeft').off('swipeRight');
        $('.components-section').off('click');
        document.body.onclick = async (event) => {
            if (event.target.classList.contains('item-delete-btn')) {
                const id = $(event.target).closest('.item').attr('data-id');
                const token = this.token;
                const that = this;
                try {
                    const res = await commonApi.deleteLinks(token, id);
                    const data = res.data;
                    if (data.state === 1) {
                        let deletItemNum = 0
                        that.selfArr.forEach((item, i) => {
                            if (item.id == id) {
                                deletItemNum = i;
                            }
                        })

                        $('.self-footer-li[data-appid="' + id + '"]').remove();
                        $('#customAppsCom').find('li[data-appid="' + id + '"]').removeAttr("data-bigicon").attr("data-appid", "").html("空位");
                        that.selfArr.splice(deletItemNum, 1)

                        component.allAppSettingArr.splice(component.allAppSettingLength + deletItemNum, 1)
                        delete component.allAppSettingObj[id];
                        console.log(that.selfArr, component.allAppSettingArr, component.allAppSettingObj)
                        console.log(component.customApps.customApps)
                        const customApps = component.customApps.customApps && component.customApps.customApps.map((item) => {
                            const temp = item.map((val) => {
                                if (val == id) {
                                    return ""
                                }
                                    return val
                            })
                            return temp;
                        })
                        // console.log(component.customApps.customApps)
                        component.vue.$store.commit("setData", { selfArr: that.selfArr,
appGroups: customApps });
                        that.renderItemUrl(component.loginData.selfArr);
                        that.getPageNum();
                    } else {
                        $('.self-warn-info').show().html(data.message).delay(3000).fadeOut();
                    }
                } catch (e) {
                    $('.self-warn-info').show().html('网络异常').delay(3000).fadeOut();
                }
            } else if (event.target.classList.contains('item-no-add')) {

            }
        }
        $('#appListDivCom').on('swipe', function () {
            component.xl.openControlTool();
            that.isSwipe = true;
        }).on('swipeLeft', function (event) {
            console.log('左滑');
            if (that.index + 1 < that.pageNum) {
                that.index++;
                console.log(that.index)
                $('.components-all-outer').css({
                    transform: `translateX(${-388 * that.index}px)`
                })
                $('.custom-page-list-box li').eq(that.index).addClass('active').siblings('li').removeClass('active');
                $('.components-all-photo-ul-box').eq(that.index).removeClass('noshow').siblings('.components-all-photo-ul-box').addClass('noshow');
            }
        }).on('swipeRight', function (e) {
            console.log('右滑', e);
            if (that.index == 0) {

            } else if (that.index > 0) {
                that.index--;
                $('.components-all-outer').css({
                    transform: `translateX(${-388 * that.index}px)`
                })
                $('.custom-page-list-box li').eq(that.index).addClass('active').siblings('li').removeClass('active');
                $('.components-all-photo-ul-box').eq(that.index).removeClass('noshow').siblings('.components-all-photo-ul-box').addClass('noshow');
            }
        })
            .on('touchend mouseup', function () {
                console.log('滑动结束')
                that.isSwipe = false;
            })
        // let editAppDom = $('li[data-appid="editApp"],#mainMenuCom');
        $('.components-footer').off('click');
        $('.components-footer').on('click', 'li[data-appid="editApp"],#mainMenuCom', function () {
            that.renderItemUrl(component.loginData.selfArr);
        });
        this.closeBtn.addEventListener('click', this.boxHide.bind(this));
        // this.addURL.addEventListener('keyup',this.syncName.bind(this,event));
        this.addName.addEventListener('input', this.forbiddenAdd.bind(this, event))

        $(this.selfAddBtn).off('click');
        $(this.selfAddBtn).on('click', this.appendUrlItem.bind(this));
        document.addEventListener('input', this.editorInputUrl.bind(this))

        $('.itembox').off('click', '.item-edit-btn')
        $('.itembox').on('click', '.item-edit-btn', this.editorItem.bind(this))
        $('.self-add-pic').off('click');
        $('.self-add-pic').on('click', function () {
            that.randomColor();
        })
        $('.open-custom').off('click');
        $('.open-custom').on('click', () => {
            if (component.loginData && component.loginData.isTrial) { // 试用模式弹框
                // component.xl.modal("nologin");
                component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'modal',
args: ['nologin'] })
                return false;
            }
            $('.self-url-box').show();
            $('.self-mask').show().css({
                height: window.screen.height * 2 + 'px',
                top: '-' + window.screen.height + 'px'
            });
            $('.components-bounced').removeClass('components-applist-show');
            that.randomColor();
            if ($('.itembox').find('.item').length == 0) {
                $('.add-item-box').hide();
                $('.splite-line').hide();
            } else {
                $('.add-item-box').show();
                $('.splite-line').show();
            }
            $('.self-url-box').css({
                'margin-top': '-' + (566 + (document.documentElement.clientHeight - 566) / 2) + 'px'
            })
            console.log(component.xl)
            component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'openOrHideApp',
data: true })
            // component.xl.openOrHideApp(true)
        })
        $('.custom-page-list-box').on('click', 'li', function () {
            const index = $('.custom-page-list-box li').index(this);
            $(this).addClass('active').siblings('li').removeClass('active');
            $('.components-all-outer').css({
                transform: `translateX(${-388 * index}px)`
            })
            that.index = index;
            $('.components-all-photo-ul-box').eq(that.index).removeClass('noshow').siblings('.components-all-photo-ul-box').addClass('noshow');
        })
    }

    async initData() {
        // debugger
        const that = this;
        that.userId = that.loginData.login.user.userId;
        that.schoolId = that.loginData.login.user.schoolId;
        that.token = that.loginData.login.token;
        let ret = [];
        try {
            ret = await commonApi.links('GET', { userId: that.userId,
schoolId: that.schoolId,
token: that.token });
            ret.data.reverse();
            // debugger
            // component.loginData.selfArr = ret.data
            component.vue.$store.commit("setData", { selfArr: ret.data });
        } catch (err) {
            console.log(err);
        }
        if (ret.data.length === 0) {
            $('.add-item-box').hide();
            $('.splite-line').hide();
        } else {
            that.renderItemUrl(component.loginData.selfArr);
        }
    }

    group(array, size) {
        const length = array.length
        if (!length || !size || size < 1) {
            return []
        }
        let index = 0
        let resIndex = 0
        const result = new Array(Math.ceil(length / size))
        while (index < length) {
            result[resIndex++] = array.slice(index, (index += size))
        }
        return result
    }

    async renderItemUrl(data) {
        console.log(data);
        $('.custom-page-list-box').html('');
        const itembox = $('.itembox');
        const appIconLen = $('#removeCustomAppCom').is(':hidden') ? this.defaultUrlLength : this.defaultUrlLength + 1;
        const str = [];
        let appstr = [];
        const appoutstr = [];
        this.selfArr = JSON.parse(JSON.stringify(data));
        this.allNum = this.selfArr ? data.length : 0;
        const arr = []
        const pageNum = Math.ceil((this.allNum + appIconLen) / 16);// 当前页码
        console.log(pageNum)
        for (const item of data) {
            const urlIcon = await this.syncIcon(item.link);
            let background = item.linkLogoColor;
            if (urlIcon) {
                background = `url(${urlIcon}) no-repeat`;
            }
            const $item = $(`
                <div class="item" data-id="${item.id}" data-color="${item.linkLogoColor}">
                    <div class="item-pic" style="background:${background};background-size:32px;background-position: center center"><p>${urlIcon ? '' : item.linkName}</p></div>
                    <div class="info">
                        <div class="info-text-box">
                            <div class="info-text-box-url">${item.link}</div>
                            <div class="info-text-box-name"></div>
                        </div>
                        <div class="info-text-input-box">
                            <div class="self-add-form-url">
                                <input type="text" class="self-item-url-input item-editor" maxlength="1000" value="${item.link}" placeholder="请输入网址">
                            </div>
                            <div class="self-add-form-name">
                                <input type="text" class="self-item-name-input item-editor" maxlength="60" value="${item.linkName}" placeholder="请输入链接名称">
                            </div>
                        </div>
                    </div>
                    <div class="right-btn">
                        <div class="item-edit-btn">编辑</div>
                        <div class="item-delete-btn">删除</div>
                    </div>
                </div>`)
            $item.find(".info .info-text-box .info-text-box-name").text(item.linkName);
            str.push($item);

            const active = component.seletedApp.includes(item.id + '') ? 'active' : '';
            const $self_app_li = $(
                `<li class="self-app-li ${active}" data-link="${item.link}" data-appid="${item.id}" data-bigicon="${item.linkName}" data-color="${item.linkLogoColor}">
                    <div class="components-photo" style="background:${background};background-size:32px;background-position: center center">
                    <div class="${urlIcon ? 'linkUrl' : ''}">${item.linkName}</div>
                    </div>
                    <span></span>
                    <div class="components-selected"></div>
                </li>
            `)
            $self_app_li.find("span").text(item.linkName);
            arr.push($self_app_li);
        }
        // $.each(data, async (i, item) => {
        //
        // })
        const groupArr = this.group(arr.slice(16 - appIconLen), 16);
        groupArr.unshift(arr.slice(0, 16 - appIconLen))
        // 分组之后数组格式是这样的 [[0,0,0],[16..],...,[0,0,0,0,0,0]]
        $.each(groupArr, (i, item) => {
            if (i == 0) { // 0d的时候是第一页剩下的那几个
                appstr = [...item];
            } else {
                const $componentBox = $(`<div class="components-all-photo-ul-box" data-new="true"></div>`);
                $componentBox.append(...item);
                appoutstr.push($componentBox);
            }
        })
        // appoutstr += "</div>";
        console.log(groupArr)
        $('.components-all-photo-ul-box[data-origin]').find('.self-app-li').remove();
        $('.components-all-photo-ul-box[data-new]').remove();
        $('.components-all-photo-ul-box[data-origin]').append(...appstr);// http://jira.xuelebj.net/browse/CLASSROOM-7504
        this.removeOtherApp()
        $('.components-all-outer').append(...appoutstr);
        itembox.empty();
        itembox.append(...str);
        // this.adjustComponentsInput();
        if (itembox.find('.item').length == 0) {
            $('.splite-line').hide();
            $('.add-item-box').hide();
        }
        $('.custom-page-list-box li').hide();
        this.getPageNum();

        if (this.pageNum == 1) {
            $('.custom-page-list-box')[0].style.display = 'none';
            $('.components-all-photo-ul-box').eq(0).removeClass('noshow');
        } else {
            $('.custom-page-list-box')[0].style.display = 'flex';
            $('.custom-page-list-box li').eq(0).addClass('active').siblings('li').removeClass('active');
            $('.components-all-photo-ul-box').eq(0).removeClass('noshow').siblings('.components-all-photo-ul-box').addClass('noshow');
        }
        $('.components-photo div').addClass('ellipsisRows')
        this.index = 0;
    }
    // 使用innerText，不转义特殊字符
    // adjustComponentsInput($parentElemnt){
    //     $parentElemnt.find(".components-all-photo-ul-box li.self-app-li").each((index,ele) => {

    //     })
    // }
    removeOtherApp() {
        $('li[data-origin="true"]').each((i, item) => {
            if ($(item).attr('data-appid') == '00001010') { // http://jira.xuelebj.net/browse/CLASSROOM-7395
                $(item).remove();
            }
            // if (this.loginData.isTrial) {
            //     if ($(item).attr('data-appid') == '00000103') {
            //         $(item).remove();
            //     }
            // }
        })
    }

    colorHex(str) {
        const that = str;
        // 十六进制颜色值的正则表达式
        const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        // 如果是rgb颜色表示
        if (/^(rgb|RGB)/.test(that)) {
            const aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
            let strHex = "#";
            for (var i = 0;i < aColor.length;i++) {
                let hex = Number(aColor[i]).toString(16);
                if (hex === "0") {
                    hex += hex;
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = that;
            }
            return strHex;
        } else if (reg.test(that)) {
            const aNum = that.replace(/#/, "").split("");
            if (aNum.length === 6) {
                return that;
            } else if (aNum.length === 3) {
                let numHex = "#";
                for (var i = 0;i < aNum.length;i += 1) {
                    numHex += (aNum[i] + aNum[i]);
                }
                return numHex;
            }
        }
        return that;
    }

    // 生成图标颜色
    randomColor() {
        this.colorArr = [];
        for (let i = 0;i < 3;i++) {
            const num = Math.floor(Math.random() * (1 - 255) + 255);
            this.colorArr.push(num)
        }
        if (Math.ceil(this.colorArr[0] * 0.299 + this.colorArr[1] * 0.578 + this.colorArr[2] * 0.114) < 192) {
            $('.self-add-pic').css({
                background: `rgb(${this.colorArr[0]},${this.colorArr[1]},${this.colorArr[2]})`
            })
        } else {
            this.colorArr = []
            this.randomColor()
        }
    }

    async editorInputUrl(event) {
        // debugger
        let pic = null;
        // if(event.target.classList.contains('self-item-url-input') || event.target.classList.contains('addurl') ) {
        if (event.target.classList.contains('self-item-name-input')) {
            pic = $(event.target).closest('.item').find('.item-pic p')[0];
        } else {
            pic = $(event.target).closest('.self-editor-add-content').find('.self-add-pic p')[0];
        }
        this.syncName(pic, event)
        // }
    }

    urlValidate(url) {
        if (url.indexOf('http://') != -1 || url.indexOf('https://') != -1) {
            return url;
        }
        return 'https://' + url;
    }

    async syncIcon(link) {
        return new Promise((resolve, reject) => {
            const img = new Image();
                const url = this.urlValidate(link) + '/favicon.ico';
            img.src = url;
            img.onerror = () => {
                resolve('');
            }
            // 放弃
            img.onabort = () => {
                resolve('');
            }
            // 加载成功
            img.onload = () => {
                resolve(url);
            }
            setTimeout(() => {
                resolve('');
            }, 500)
        })
    }

    syncName(pic, event) {
        const nowLen = this.strlen(event.target.value, event);
        const bigOrSmall = $(event.target).hasClass('item-editor');
        if (pic && ($(event.target).hasClass('addname') || $(event.target).hasClass('self-item-name-input'))) {
            pic.innerText = event.target.value;
            if (nowLen <= this.maxLen) {
                pic.innerText = event.target.value.substring(0, this.maxLen);
            }
        }
        if (bigOrSmall) {
            this.forbiddenEditorItem(event)
        } else {
            this.forbiddenAdd(event);
        }
    }

    // 隐藏弹窗
    boxHide() {
        console.log('退出弹窗!!!!');
        this.selfBox.style.display = 'none';
        this.selfMask.style.display = 'none';
        $('.addurl').val('');
        $('.addname').val('');
        $('.self-warning-info p').html('');
        $('.self-warning-info').html('');
        $('.components-all-outer').css({
            transform: 'translateX(0px)'
        });
        console.log(component.customApps)
        component.vue.$store.commit("setData", { appGroups: component.customApps });
        component.vue.$bus.emit(component.vue.$BusEvent.message, { type: 'openOrHideApp',
data: false })
        // component.xl.openOrHideApp(false)
        this.renderItemUrl(component.loginData.selfArr);
    }

    // 判断字符长度
    strlen(str, event) {
        if (!$(event.target).is("input")) {
            return;
        }
        let len = 0;
        for (let i = 0;i < str.length;i++) {
            const c = str.charCodeAt(i);
            // 单字节加1
            if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
                len++;
            }
            else {
                len += 2;
            }
        }
        return len;
    }

    forbiddenEditorItem(event) {
        const itemurl = event.target.classList.contains('self-item-url-input') ? $(event.target) : $(event.target).closest('.info-text-input-box').find('.self-item-url-input');
        const itemname = event.target.classList.contains('self-item-name-input') ? $(event.target) : $(event.target).closest('.info-text-input-box').find('.self-item-name-input');
        const eidtorBtn = $(event.target).closest('.item').find('.item-edit-btn');
        if (itemurl.val().length === 0 || itemname.val().length === 0) {
            eidtorBtn.addClass('item-no-add')
        } else {
            eidtorBtn.removeClass('item-no-add')
        }
    }

    forbiddenAdd(event) {
        const link = this.addURL.value;
        const linkName = this.addName.value;
        if (link.length === 0 || linkName.length === 0) {
            this.selfAddBtn.classList.add('noacitve');
            this.canAdd = false;
        } else {
            this.selfAddBtn.classList.remove('noacitve');
            this.canAdd = true;
        }
    }

    // 编辑
    async editorItem(event) {
        debugger
        component.xl.openControlTool();// http://jira.xuelebj.net/browse/CLASSROOM-7156
        if ($(event.target).hasClass('item-no-add')) {
            return;
        }
        clearTimeout(this.editorTimer)
        this.editorTimer = setTimeout(async () => {
            const that = this;
            const thisUrl = $(event.target).closest('.item').find('.self-item-url-input').val();
            const thisnName = $(event.target).closest('.item').find('.self-item-name-input').val();
            const id = $(event.target).closest('.item').attr('data-id');
            const color = $(event.target).closest('.item').attr('data-color');
            const token = this.token;
            const nowIndex = $('.itembox .item').index($(event.target).closest('.item'))
            if (event.target.classList.contains('item-edit-btn')) {
                if (event.target.classList.contains('toeditor')) {
                    if (!this.isURL(thisUrl)) {
                        $('.self-warn-info').show().html('网址格式错误，请重新输入').delay(3000).fadeOut();
                        return;
                    }
                        $('.self-warn-info').hide();

                    try {
                        const res = await commonApi.tokenLinks('PUT', {
                            linkName: thisnName,
                            link: thisUrl,
                            linkLogoColor: color,
                            id: id
                        }, token)
                        const data = res.data;
                        if (data.state === 1) {
                            that.selfArr = that.selfArr.map((item) => {
                                if (item.id == id) {
                                    return {
                                        id: id,
                                        link: thisUrl,
                                        linkName: thisnName,
                                        linkLogoColor: color,
                                        createTime: +new Date()
                                    }
                                }
                                    return item
                            })
                            component.vue.$store.commit("setData", { selfArr: that.selfArr });
                            component.allAppSettingArr.splice(component.allAppSettingLength + nowIndex, 1, {
                                id: id,
                                link: thisUrl,
                                linkName: thisnName,
                                linkLogoColor: color,
                                createTime: +new Date()
                            })
                            component.allAppSettingObj[id] = {
                                id: id,
                                link: thisUrl,
                                linkName: thisnName,
                                linkLogoColor: color,
                                createTime: +new Date()
                            }
                            component.vue.$store.commit("setData", { selfArr: that.selfArr });
                            // that.renderItemUrl(component.loginData.selfArr);
                            $('.self-footer-li[data-appid="' + id + '"]').attr('data-link', thisUrl).find('span').html(thisnName);
                            $('#customAppsCom').find('li[data-appid="' + id + '"]').find('.components-plan-div').attr('data-src', thisUrl).find('p').html(thisnName)
                            event.target.classList.remove('toeditor')
                            event.target.innerText = '编辑';
                            $('.self-app-li[data-appid="' + id + '"]').attr('data-bigicon', thisnName);
                            $('.self-app-li[data-appid="' + id + '"]').find('.components-photo p').html(thisUrl);
                            $('.self-app-li[data-appid="' + id + '"]').find('span').html(thisUrl);
                            $(event.target).closest('.item').find('.info-text-input-box').hide();
                            $(event.target).closest('.item').find('.info-text-box').show();
                            $(event.target).closest('.item').find('.info-text-box-url').html(thisUrl);
                            $(event.target).closest('.item').find('.info-text-box-name').html(thisnName);
                        } else {
                            $('.self-warn-info').show().html(data.message).delay(3000).fadeOut();
                        }
                    } catch (e) {
                        $('.self-warn-info').show().html('网络异常').delay(3000).fadeOut();
                    }
                } else {
                    event.target.classList.add('toeditor')
                    event.target.innerText = '完成';
                    $(event.target).closest('.item').find('.info-text-input-box').show();
                    $(event.target).closest('.item').find('.info-text-box').hide();
                }
            }
        }, 100);
    }

    // 添加url
    async appendUrlItem() {
        const linkName = $('.addname').val();
        const link = $('.addurl').val();
        const rgb = `rgb(${this.colorArr[0]},${this.colorArr[1]},${this.colorArr[2]})`;
        const linkLogoColor = this.colorHex(rgb);
        const userId = this.userId;
        const schoolId = this.schoolId;
        const token = this.token;
        const that = this;
        clearTimeout(this.editorTimer);
        setTimeout(async () => {
            if (!this.isURL(link)) {
                $('.self-warning-info').show().html('网址格式错误，请重新输入');
                $('.self-add-pic p').html('');
                $('.addurl').val('');
                $('.addname').val('');
                return;
            }
                $('.self-warning-info').hide();

            if (linkName == '' || link == '') {
                return;
            }
            if (that.allNum >= that.maxItemNum) {
                $('.addurl').val('');
                $('.addname').val('');
                $('.self-add-pic p').html('');
                $('.self-warning-info').show().html('最多只支持添加50个外部链接');
                $('.self-add-btn').addClass('noacitve');
                this.canAdd = false;
            } else {
                this.canAdd = true;
            }
            if (this.canAdd) {
                try {
                    const res = await commonApi.tokenLinks('POST', {
                        userId,
                        schoolId,
                        linkName,
                        link,
                        linkLogoColor
                    }, token)
                    const data = res.data;
                    if (data.state === 1) {
                        const a = that.selfArr;
                        a.push({
                            id: data.id,
                            link,
                            linkName,
                            linkLogoColor,
                            createTime: +new Date()
                        })
                        component.vue.$store.commit("setData", { selfArr: a });
                        component.allAppSettingArr.push({
                            id: data.id,
                            link,
                            linkName,
                            linkLogoColor,
                            createTime: +new Date()
                        })
                        component.allAppSettingObj[data.id] = {
                            id: data.id,
                            link,
                            linkName,
                            linkLogoColor,
                            createTime: +new Date()
                        }
                        // component.vue.$store.commit("setData", { selfArr: that.selfArr });
                        that.renderItemUrl(component.loginData.selfArr);
                        that.randomColor();
                        $('.add-item-box').show();
                        $('.splite-line').show();
                        $('.self-warning-info').hide();
                        $('.addurl').val('');
                        $('.addname').val('');
                        $('.self-add-pic p').html('');
                    } else {
                        $('.addurl').val('');
                        $('.addname').val('');
                        $('.self-warn-info').show().html(data.message).delay(3000).fadeOut();
                    }
                } catch (e) {
                    $('.self-warn-info').show().html('网络异常').delay(3000).fadeOut();
                }
            }
        }, 100)
    }

    // 删除
    async removeItem(event) {
        if (!event.target || event.target.id != "controlCode") { component.xl.openControlTool(); }
        if (event.target.classList.contains('item-delete-btn')) {
            const id = $(event.target).closest('.item').attr('data-id');
            const token = this.token;
            const that = this;
            try {
                const res = await commonApi.deleteLinks(token, id);
                const data = res.data;
                if (data.state === 1) {
                    let deletItemNum = 0
                    that.selfArr.forEach((item, i) => {
                        if (item.id == id) {
                            deletItemNum = i;
                        }
                    })

                    $('.self-footer-li[data-appid="' + id + '"]').remove();
                    $('#customAppsCom').find('li[data-appid="' + id + '"]').removeAttr("data-bigicon").attr("data-appid", "").html("空位");
                    that.selfArr.splice(deletItemNum, 1)

                    component.allAppSettingArr.splice(component.allAppSettingLength + deletItemNum, 1)
                    delete component.allAppSettingObj[id];
                    console.log(that.selfArr, component.allAppSettingArr, component.allAppSettingObj)
                    console.log(component.customApps.customApps)
                    const customApps = component.customApps.customApps && component.customApps.customApps.map((item) => {
                        const temp = item.map((val) => {
                            if (val == id) {
                                return ""
                            }
                                return val
                        })
                        return temp;
                    })
                    // console.log(component.customApps.customApps)
                    component.vue.$store.commit("setData", { selfArr: that.selfArr,
appGroups: customApps });
                    that.renderItemUrl(component.loginData.selfArr);
                    that.getPageNum();
                } else {
                    $('.self-warn-info').show().html(data.message).delay(3000).fadeOut();
                }
            } catch (e) {
                $('.self-warn-info').show().html('网络异常').delay(3000).fadeOut();
            }
        }
    }
}
