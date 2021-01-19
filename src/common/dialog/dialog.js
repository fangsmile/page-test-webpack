/**
 * @file
 * @author yuanwei (yuanwei@xueleyun.com)
 * @since 2020-04-13 16:22:13
 */

import './dialog.css';

/**
 * @class DialogBox
 * @field type 可选 alert|confirm
 * @field title 标题
 * @field concent 内容
 * @field actions 动作
 * @description 统一的弹出框
 */
export default class DialogBox {
    constructor(options) {
        if (options.type && options.actions) { throw new Error('type 与 actions 不能并存'); }

        this.options = options;

        this.render();
        this.addEvents();
    }

    /**
     * 渲染生成并渲染dialog
     */
    render() {
        const options = this.options;
            const header = `<div class="dg-header ${options.title.className ? options.title.className : ''}" ${options.title.style ? 'style="' + options.title.style + '"' : ''}>${options.title ? options.title.text : ''}</div>`;
            const content = `<div class="dg-content ${options.content.className ? options.content.className : ''}" ${options.content.style ? 'style="' + options.content.style + '"' : ''}>${this.trustHtml(options.content.type, options.content.text)}</div>`;
            const footer = `<div class="dg-footer">${this.getFooterBtns()}</div>`;
            const container = `<div class="xl-dialog" ${options.style ? 'style="' + options.style + '"' : ''}>${header}${content}${footer}</div>`; // 容器
            const mask = `<div class="xl-dialog-mask ${options.className ? options.className : ''}">${container}</div>`;
        document.body.insertAdjacentHTML('beforeend', mask)

        this.container = document.querySelector('.xl-dialog-mask');
    }

    /**
     * 添加事件
     */
    addEvents() {
        const that = this;
            const options = that.options;
            const actions = this.container.getElementsByClassName('dg-btn');

        for (var i = 0;i < actions.length;i++) {
            (function (n) {
                actions[i].onclick = function (e) {
                    if (options.type && e.target.classList.contains('confirm')) { // 属于 alert|或者confirm
                        options.confirm && typeof (options.confirm) === 'function' && options.confirm(that.getFormValue());
                    }

                    if (options.actions && options.actions.length !== 0) { // 自定义按钮调用回调函数
                        options.actions[n].confirm && typeof (options.actions[n].confirm) === 'function' && options.actions[n].confirm(that.getFormValue())
                    }

                    if (e.target.classList.contains('cancel') || (options.type && that.formIsNull() !== 2)) {
                        // console.log('关闭了弹出框')
                        that.close();
                    }
                }
            })(i)
        }
    }

    formIsNull() {
        const value = this.getFormValue();
        if (value == null) { return 1; }
        const index = Object.values(value).findIndex((item) => !(item.trim()));
        if (index !== -1) { return 2; }
    }

    getFormValue() {
        const form = document.getElementsByTagName("form")[0];
        if (!form) { return null; }
        const formValue = {};
        for (let i = 0;i < form.length;i++) {
            const ele = form.elements[i];
            formValue[ele.name] = ele.value;
        }
        return formValue;
    }

    /**
     * 退出的时候删除元素
     */
    close() {
        const dialog = document.querySelector('.xl-dialog-mask');
        dialog && document.body.removeChild(dialog);
    }

    /**
     * 生成按钮模板
     * @param {*} type cancel|confirm
     * @param {*} text
     */
    getBtn(type, text, className, style) {
        return `<div class="dg-btn ${type} ${className || ''}" ${style ? 'style="' + style + '"' : ''}>${text}</div>`;
    }

    /**
     * 生成需要的content
     * @param {*} type text|html  默认html
     * @param {*} text
     */
    trustHtml(type = 'html', text) {
        if (type === 'text')
            { return this.replaceAll(text); }
        return text;
    }

    /**
     * 做一下字符串的转义
     * @param {*} str
     */
    static replaceAll(str) {
        const reg = /<|>/g;
        str = str.replace(reg, function ($1) {
            if ($1 == '<') {
                return '&lt;';
            }
                return '&gt;';
        });
        return str;
    }

    /**
     * 生成按钮
     */
    getFooterBtns() {
        switch (this.options.type) {
            case 'alert':
                return this.getBtn('confirm', '确定');
                break;
            case 'confirm':
                return this.getBtn('cancel', '取消') + this.getBtn('confirm', '确定');
                break;
            default:
                if (!this.options.actions || this.options.actions.length == 0) { throw new Error('按钮没有配置'); }
                return this.getActionsBtn();
                break;
        }
    }

    /**
     * 生成所有按钮
     */
    getActionsBtn() {
        return this.options.actions.map((item) => {
            return this.getBtn(item.type, item.text, item.className, item.style)
        }).join('')
    }

    /**
     *  实例
     * @param {*} options
     */
    static init(options) {
        this.instance = null;
        this.closeAll();
        if (!this.instance) { this.instance = new DialogBox(options); }
        return this.instance;
    }

    static closeAll() {
        const dialog = document.querySelector('.xl-dialog-mask');
        dialog && document.body.removeChild(dialog);
    }
}
