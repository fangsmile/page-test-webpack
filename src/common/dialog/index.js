/**
 * @file dialog再封装一层，便于使用
 * @author yuanwei (yuanwei@xueleyun.com)
 * @since Do not edit
 */
import DialogBox from './dialog';
import './index.css';

export default class Dialog {
    /**
     * 回调判断
     * @param {*} func
     */
    static callback(func) {
        if (typeof func === 'function') { func(); }
    }

    /**
     * 通用的alert
     * @param {string}} content 内容
     * @param {*} c
     */
    static alert(content, c) {
        const dialog = DialogBox.init({
            title: {
                text: '',
                style: 'display:none'
            },
            content: {
                text: content,
                style: 'margin-top: 50px;'
            },
            type: 'alert',
            className: 'common-alert',
            confirm: () => {
                dialog.close();
                this.callback(c);
            }
        });
    }

    /**
     * 备课模式提示框
     */
    static showBeike(c) {
        const dialog = DialogBox.init({
            title: {
                text: '',
                style: 'display:none'
            },
            content: {
                text: '备课模式下不支持该功能，如有需要请使用授课模式。',
                style: 'margin-top: 50px;'
            },
            type: 'alert',
            className: 'beike',
            confirm: () => {
                dialog.close();
                this.callback(c);
            }
        });
    }

    /**
     * 需要购买AIclass的提示
     */
    static showBuy(c) {
        const dialog = DialogBox.init({
            title: {
                text: '请开通AIclass',
            },
            content: {
                text: '此功能仅供已购买AIclass的学校使用，如有需要请开通AIclass。'
            },
            type: 'alert',
            className: 'buy',
            confirm: () => {
                dialog.close();
                this.callback(c);
            },
        });
    }

    /**
     * 对应之前的nows类 显示浏览器的支持性
     * @param {*} callback 下载的逻辑
     */
    static showSupport(c) {
        const dialog = DialogBox.init({
            title: {
                text: '浏览器不支持平板教学',
            },
            content: {
                text: '如需要支持平板教学，请下载AIclass客户端，或安装最新的谷歌浏览器。',
            },
            actions: [{
                text: '下载客户端',
                type: 'confirm',
                confirm: () => {
                    dialog.close();
                    this.callback(c);
                }
            }, {
                text: '确定',
                type: 'cancel',
                confirm: () => {
                    dialog.close();
                }
            }]
        });
    }

    /**
     * 退出
     * @param {*} callback 退出的逻辑
     */
    static showQuit(c) {
        const dialog = DialogBox.init({
            title: {
                text: '退出AIclass授课系统',
            },
            content: {
                text: '确认退出AIclass授课系统？',
            },
            actions: [{
                text: '取消',
                type: 'cancel',
                confirm: () => {
                    dialog.close();
                }
            }, {
                text: '退出',
                type: 'confirm',
                confirm: () => {
                    dialog.close();
                    this.callback(c);
                }
            }]
        });
    }

    /**
    * 保存的提示
    * @param {*} notSaveCallback 不保存的逻辑
    * @param {*} saveCallback 保存的逻辑
    */
    static showSave(n, ns, s) {
        const dialog = DialogBox.init({
            title: {
                text: '退出AIclass授课系统',
            },
            content: {
                text: '当前有未保存内容，是否保存？',
            },
            actions: [{
                text: '取消',
                type: 'cancel',
                confirm: () => {
                    dialog.close();
                    this.callback(n);
                }
            }, {
                text: '不保存',
                type: 'confirm',
                confirm: () => {
                    dialog.close();
                    this.callback(ns);
                }
            }, {
                text: '保存',
                type: 'confirm',
                confirm: () => {
                    dialog.close();
                    this.callback(s);
                }
            }]
        });
    }

    /**
     * 未登录提示
     */
    static showNotlogin(c) {
        const dialog = DialogBox.init({
            title: {
                text: '登录提示',
            },
            content: {
                text: '登录后方可使用此功能。'
            },
            type: "alert",
            className: "nologin",
            confirm: () => {
                dialog.close();
                this.callback(c);
            },
        });
    }

    /**
     * 未保存提示
     */
    static showNotsave(c) {
        const dialog = DialogBox.init({
            title: {
                text: '登录提示',
            },
            content: {
                text: '登录后方可使用此功能。'
            },
            type: 'alert',
            className: 'cannotsave',
            confirm: () => {
                dialog.close();
                this.callback(c);
            },
        });
    }

    /**
     * 免登录点击确定的回调
     * @param {*} ns
     */
    static showIsTrialSave(ns) {
        const dialog = DialogBox.init({
            title: {
                text: '保存提示',
            },
            content: {
                text: '当前为试用模式，所有数据都将不会保存。'
            },
            type: 'alert',
            className: 'cannotsave',
            confirm: () => {
                dialog.close();
                this.callback(ns);
            },
        });
    }

    /**
     * 免登录点击底部保存按钮
     */
    static showIsTrialNotSave() {
        const dialog = DialogBox.init({
            title: {
                text: '保存提示',
            },
            content: {
                text: '当前为试用模式，所有数据都将不会保存。'
            },
            type: 'alert',
            className: 'cannotsave',
            confirm: () => {
                dialog.close();
            },
        });
    }

    /**
     * 终止录制的提示
     */
    static showScreenRecording(c) {
        const dialog = DialogBox.init({
            title: {
                text: '正在录课，请终止录制后下课',
            },
            content: {
                text: ''
            },
            type: 'alert',
            className: 'screenRecording',
            confirm: () => {
                dialog.close();
                this.callback(c);
            },
        });
    }

    /**
    * 无法发布的提示
    */
    static showNotPublish(c) {
        const dialog = DialogBox.init({
            title: {
                text: '无法发布练习',
            },
            content: {
                text: '当前模板包含答题器无法支持题型，请更改为平板答题模式后发出'
            },
            type: 'alert',
            className: 'publish',
            confirm: () => {
                dialog.close();
                this.callback(c);
            },
        });
    }

    /**
     * 上同一课程提示
     */
    static showSameClass(name, c1, c2) {
        const dialog = DialogBox.init({
            title: {
                text: '上课提醒',
            },
            content: {
                text: '你已经对' + name + '班级进行授课，点击确认开启新的课程，原先课程将直接下课，是否开启新课程？'
            },
            style: 'z-index:2000',
            actions: [{
                text: '取消',
                type: 'cancel',
                confirm: () => {
                    dialog.close()
                    this.callback(c2);
                }
            }, {
                text: '确定',
                type: 'confirm',
                confirm: () => {
                    dialog.close();
                    this.callback(c1);
                }
            }]
        });
    }

    /**
     * 打开离线课件
     */
    static showImportSecondCourse(c) {
        const dialog = DialogBox.init({
            title: {
                text: '打开离线课件',
            },
            content: {
                text: '已有课件正在授课，打开后原有课件新增内容将不会被保存，是否打开新课件？'
            },
            type: 'confirm',
            className: 'importSecondCourse',
            confirm: () => {
                dialog.close();
                this.callback(c);
            },
        });
    }

    /**
     * 退出离线授课
     * @param {*} callback
     */
    static showExitOffline(c) {
        const dialog = DialogBox.init({
            title: {
                text: '退出AIclass授课',
            },
            content: {
                text: '下课后课件新增内容将不会被保存'
            },
            type: 'confirm',
            className: 'exitOffline',
            confirm: () => {
                dialog.close();
                this.callback(c);
            },
        });
    }

    /**
     * 导出异常
     * @param {*} callback
     */
    static showImportError(c) {
        const dialog = DialogBox.init({
            className: 'importError',
            title: {
                text: '导入异常',
            },
            content: {
                text: '当前AIclass版本过低，离线授课部分功能将无法正常使用，请尽快安装最新版本！',
            },
            actions: [{
                text: '我知道了，继续授课',
                type: 'confirm',
                confirm: () => {
                    dialog.close();
                    this.callback(c);
                }
            }]
        });
    }

    /**
     * 网络无法连接
     */
    static showWsdown(c) {
        const dialog = DialogBox.init({
            title: {
                text: '网络无法连接',
            },
            content: {
                text: '平板教学暂时不可用，请检查网络连接或稍后再试。'
            },
            type: "alert",
            className: "wsdown",
            confirm: () => {
                dialog.close();
                this.callback(c);
            },
        });
    }

    /**
     * 抢课
     * @param {*} callback
     */
    static showInteractHint(str, c) {
        const dialog = DialogBox.init({
            title: {
                text: '授课提醒'
            },
            content: {
                text: `<div class="interactInfo">暂时无法开启对当前班级的互动授课</div> <h4 class="interactMainInfo">${str}</h4>`,
            },
            className: 'interactHint',
            actions: [{
                text: '我知道了',
                type: 'confirm',
                confirm: () => {
                    dialog.close();
                    this.callback(c);
                }
            }]
        });
    }

    /**
     * 抢课2
     * @param {*} callback
     */
    static showInteractHint2(str1, str2, c1, c2) {
        const dialog = DialogBox.init({
            title: {
                text: '授课提醒',
                style: "margin: 30px 28px 20px;"
            },
            content: {
                text: `<div class="interactHint2MessageBox">${str1}</div> <h4 class="interactReplyInfoSelf">${str2}</h4>`,
                style: "margin: 0"
            },
            className: 'interactHint2',
            actions: [{
                text: '获取互动授课权限',
                type: 'confirm',
                className: 'replyOk',
                confirm: () => {
                    dialog.close();
                    this.callback(c1);
                }
            }, {
                text: '放弃互动，继续授课',
                type: 'confirm',
                className: 'InteractConfirm',
                confirm: () => {
                    dialog.close();
                    this.callback(c2);
                }
            }]
        });
    }

    /**
    * 退出下载
    * @param {*} callback
    */
    static showWarnDownCourse(c) {
        const dialog = DialogBox.init({
            className: 'warnDownCourse',
            title: {
                text: '退出下载',
            },
            content: {
                text: '有课件正在下载，退出应用将中断下载，是否退出',
            },
            actions: [{
                text: '我知道了，继续授课',
                type: 'confirm',
                confirm: () => {
                    dialog.close();
                    this.callback(c);
                }
            }]
        });
    }

    /**
     * 新版本更新
     * @param {*} callback
     */
    static showUpdateServiceWorkerBox(c) {
        const dialog = DialogBox.init({
            title: {
                text: '有新版本可更新，是否要更新',
            },
            content: {
                text: ''
            },
            type: 'confirm',
            className: 'updateServiceWorkerBox',
            confirm: () => {
                dialog.close();
                this.callback(c);
            },
        });
    }

    /**
     * 断网提示
     * @param {*} callback
     */
    static showDisConnectTip(c) {
        const dialog = DialogBox.init({
            className: 'disConnectTip',
            title: {
                text: '网络连接断开，无法加载资源',
            },
            content: {
                text: '',
            },
            actions: [{
                text: '我知道了',
                type: 'confirm',
                confirm: () => {
                    dialog.close();
                    this.callback(c);
                }
            }]
        });
    }

    /**
     * Flash提示
     */
    static showUnuseflash(c) {
        const dialog = DialogBox.init({
            title: {
                text: '请升级你的操作系统',
            },
            content: {
                text: '当前系统不支持AIclass中的Flash资源播放，请升级操作系统至Windows7以上后使用'
            },
            type: 'alert',
            className: 'unuseflash',
            confirm: () => {
                dialog.close();
                this.callback(c);
            }
        });
    }

    /**
     * 30分钟自动下课
     * @param {*} text
     * @param {*} content
     * @param {*} btnStyle
     * @param {*} finish
     * @param {*} continueClass
     */
    static overTimeDialog(text, content, btnStyle, finish, continueClass) {
        return DialogBox.init({
            className: 'overTime-dialog',
            style: "min-height: 194px;",
            title: {
                text: text,
                style: "font-weight: bold;color: #333;font-size: 24px;"
            },
            content: {
                text: content,
                style: "color: #777;font-size: 18px;"
            },
            actions: [
                {
                    text: '立即下课',
                    type: 'confirm',
                    className: 'btn-test1',
                    style: btnStyle,
                    confirm: () => {
                        // dialog.close();
                        this.callback(finish);
                    }
                },
                {
                    text: '继续上课',
                    type: 'confirm',
                    className: 'btn-test2',
                    style: btnStyle,
                    confirm: () => {
                        // dialog.close();
                        this.callback(continueClass);
                    }
                }
            ]
        })
    }

    /**
  * 保存题目模板之前 - 提示框编辑
  * @param name 值
  * @param callback
  */
    static saveTemplate(name, callback) {
        const dialog = DialogBox.init({
            title: {
                text: "保存练习模板",
            },
            content: {
                text: `<div class="save-t-Content">
          <div class="save-t-c-left">
            <span class="save-t-c-msg">练习描述：</span>
            <span class="save-t-c-hint">输入练习要求</span>
          </div>
          <div class="save-t-c-right">
            <form onsubmit="return false;">
            <input
              type="text"
              name="saveTemplate"
              id="saveTemplateTip"
              value="${name}"
              maxlength="100"
              placeholder
            />
            <p class="tips">课件名称不能为空</p>
            </form>
          </div>
        </div>
        <div class="save-t-footer">
          <span class="save-t-f-hint">点击确定后，作业保存成功，上课时可在练习模板中直接发布</span>
        </div>`,
            },
            type: "confirm",
            className: "saveTemplateHint",
            confirm(data) {
                if (callback) {
                    callback(data, dialog);
                }
                // dialog.close();
            },
        });
    }

    /**
     * 发送失败
     * @param str
     */
    static failPublish(str) {
        const dialog = DialogBox.init({
            title: {
                text: "",
            },
            content: {
                text: `<div class="save-t-Content">
          <h4>${str}</h4></div>`,
            },
            type: "alert",
            className: "publishWorkError",
            confirm(data) {
                dialog.close();
            },
        });
    }

    /**
     * 删除最后一道题
     * @param str1
     * @param str2
     * @param callback
     */
    static deleteLast(str1, str2, callback) {
        const dialog = DialogBox.init({
            title: {
                text: str1,
            },
            content: {
                text: `<div class="save-t-Content">
          <h4>${str2}</h4></div>`,
            },
            type: "confirm",
            className: "deleteQuestion",
            confirm(data) {
                console.log(data, "确认");
                if (callback) {
                    callback();
                }
                dialog.close();
            },
        });
    }

    /**
     *
     * @param str1 取消最后一道题
     * @param str2
     */
    static cancelLast(str1, str2) {
        const dialog = DialogBox.init({
            title: {
                text: str1,
            },
            content: {
                text: `<div class="save-t-Content">
          <h4>${str2}</h4></div>`,
            },
            type: "alert",
            className: "deleteQuestion",
            confirm(data) {
                dialog.close();
            },
        });
    }

    /**
   * 中间提示md条信息 3s消失
   */
    static centerprompt(str) {
        return DialogBox.init({
            title: {
                text: '',
                style: 'display:none'
            },
            content: {
                text: str,
                style: 'height: 64px; line-height: 64px;text-align: center;color: #fff; font-size: 18px;'
            },
            type: 'alert',
            className: 'screenrecordstart'
        });
    }

     /**
      * 5.8.4添加 提供给c++
     * 中间loading
     */
    static centerpromptLoading() {
        return DialogBox.init({
            title: {
                text: '',
                style: 'display:none'
            },
            content: {
                text: "",
                style: 'display:none'
            },
            type: 'alert',
            className: 'stopscreenrecordhint'
        });
    }

    /**
     * 录制失败
     */
    static showScreenRecordFail() {
        const dialog = DialogBox.init({
            title: {
                text: '录制失败'
            },
            content: {
                text: '录制时间过短，请录制5秒以上的视频'
            },
            type: 'alert',
            className: 'screenrecordfail',
            confirm() {
                dialog.close();
            },
        });
    }

    static close() {
        DialogBox.closeAll();
    }

    /**
     * 物理/化学 实验室 删除弹框
     */
    static showPhysicsTooltipDelet(c1) {
        const dialog = DialogBox.init({
            title: {
                text: '删除实验',
            },
            content: {
                text: ' 实验删除后不可恢复，是否确认删除？'
            },
            actions: [{
                text: '取消',
                type: 'cancel',
                confirm: () => {
                    dialog.close()
                }
            }, {
                text: '确定',
                type: 'confirm',
                confirm: () => {
                    dialog.close();
                    this.callback(c1);
                }
            }]
        });
    }

    /**
     * 物理/化学 实验室 分享失败
     * @param str
     */
    static physicsSharedState() {
        const dialog = DialogBox.init({
            title: {
                text: "分享失败",
            },
            content: {
                text: `已有相同资源被分享`,
            },
            type: "alert",
            confirm() {
                dialog.close();
            },
        });
    }

    /**
     * 物理/化学 实验室 资源分享
     * @param str
     */
    static physicsSharedSuccess() {
        const dialog = DialogBox.init({
            title: {
                text: "资源分享",
            },
            content: {
                text: `资源将在通过审核后分享给其他老师`,
            },
            type: "alert",
            confirm() {
                dialog.close();
            },
        });
    }

    /**
     * 资源库 删除弹框
     */
    static showDelSourceBox(c1) {
        const dialog = DialogBox.init({
            title: {
                text: '删除文件',
            },
            content: {
                text: '文件删除后不可恢复，是否确认'
            },
            className: 'del_source_box',
            actions: [{
                text: '取消',
                type: 'cancel',
                confirm: () => {
                    dialog.close()
                }
            }, {
                text: '确定',
                type: 'confirm',
                confirm: () => {
                    dialog.close();
                    this.callback(c1);
                }
            }]
        });
    }
}

window.Dialog = Dialog;
