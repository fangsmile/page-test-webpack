/**
 * @file 教案
 * @author yuanwei (yuanwei@xueleyun.com)
 * @since 2020-06-04 15:02:18
 */
import './index.css';
import $ from 'jquery';
import Dialog from '../dialog';
import lessonPlanApi from 'api/lessonPlan';
export default class LessonPlanDialog {
    constructor() {
        // this.getLessonList()
        $(LessonPlanTemp.getContainerTemp()).appendTo('body');
        this.dom = {};
        this.dom.container = $('#lessonPlan-container');
        this.dom.content = this.dom.container.find('.lessonPlan-content');
        this.dom.detail = this.dom.container.find('.lessonPlan-detail');
        this.dom.firstPage = this.dom.container.find('.first-page');
        this.dom.secondPage = this.dom.container.find('.second-page');
        this.isBind = false;
        this.addEvent();
    }

    getLessonList() {
        lessonPlanApi.getList().then((res) => {
            console.log(res)
        })
    }

    addEvent() {
        // 查看
        this.dom.container.on('click', '.check', () => {
            console.log('查看')
           this.showPage(2);
        })
        // 取消绑定
        this.dom.container.on('click', '.cancel-bind', () => {
            console.log('取消绑定')
            this.showDialog('更改绑定', '当前已有绑定教案，是否确认更改绑定？', () => {

            })
        })
        // 绑定
        this.dom.container.on('click', '.bind-plan', () => {
            console.log('绑定')
            this.showDialog('更改绑定', '当前已有绑定教案，是否确认更改绑定？', () => {

            })
        })
        // 后退
        this.dom.container.on('click', '.back-first', () => {
            console.log('后退')
            this.showPage(1);
        })
        // 关闭
        this.dom.container.on('click', '.lessonPlan-close', () => {
            console.log('关闭')
            this.close();
        })
    }

    showDialog(text, content, callback) {
        Dialog.init({
            type: 'confirm',
            className: 'lessonPlan-dialog',
            style: "min-height: 194px;",
            title: {
                text: text,
                style: "color: #212121;font-size: 20px;"
            },
            content: {
                text: content
            },
            confirm() {
                callback && callback();
            }
        })
    }

    showPage(pageNumber) {
        if (pageNumber === 1) {
            this.dom.content.show();
            this.dom.detail.hide();
            this.dom.firstPage.show();
            this.dom.secondPage.hide();
        }
        if (pageNumber === 2) {
            this.dom.content.hide();
            this.dom.detail.show();
            this.dom.firstPage.hide();
            this.dom.secondPage.show();
        }
    }

    close() {
        this.dom.container.remove();
    }
}

class LessonPlanTemp {
    static getContainerTemp() {
        return `<div id="lessonPlan-container"><div class="lessonPlan-box">${this.getHeaderTemp()}<div class="lessonPlan-content">${this.getPlanListTemp([1, 2, 3, 4, 5])}</div><div class="lessonPlan-detail">${this.getDetailTemp()}</div></div></div>`
    }

    static getHeaderTemp() {
        return '<div class="lessonPlan-header"><div class="first-page"><span>教案</span><span>课件与教案实行一对一绑定，课件共建、共享后其他教师可同时查看绑定教案</span></div><div class="second-page"><span class="back-first"></span><span>教案列表</span></div><span class="lessonPlan-close"></span></div>';
    }

    static getPlanItemTemp() {
        return `<div class="lessonPlan-item"><h3>2020年第一次模拟考教案</h3><div class="item-content">
        这是关于2020年第一次模拟考的教案这是关于2020年第一次模拟考的教案这是关于2020年第一次模拟考的教案这是关于2020年第一次模拟考的教案
         </div><div class="item-footer"><span class="time">2020年5月10日 12:12</span><div><a class="check">查看</a><a class="cancel-bind">取消绑定</a></div></div><div class="bind"></div></div>`;
    }

    static getDetailTemp() {
        return `<h3>2020年第一次模拟考教案</h3><p>
        这是关于2020年第一次模拟考的教案这是关于2020年第一次模拟考的教案这是关于2020年第一次模拟考的教案这是关于2020年第一次
        考的教案这是关于2020年第一次模拟考的教案这是关于2020年第一次模拟考的教案这是关于2020年第一次模拟考的教案这是关于2020年第
        一次模拟这是关于2020年第一次模拟考的教案这是关于2020年第一次模拟考的教案这是关于2020年第一次模拟考的教案这是关于2020年第
        一次模拟这是关于2020年第一次模拟考的教案这是关于2020年第一次模拟考的教案这是关于2020年第一次模拟考的教案这是关于2020年第
        一次模拟考的教案考的教案考的教案模拟这是关于2020年第一次模拟考的教案这是关于2020年第一次模拟考的教案这是关于2020年第一次
        模拟考的教案这是关于2020年第一次模拟这是关于2020年第一次模拟考的教案这是关于2020年第一次模拟考的教案这是关于2020年第一次
        模拟考的教案这是关于2020年第一次模拟考的教案考的教案考的教案
        </p><div class="bind"></div><div class="lessonPlan-save">保存</div></div>`;
    }

    static getPlanListTemp(arr) {
        return arr.map((e) => {
            return this.getPlanItemTemp()
        }).join('')
    }
}
window.LessonPlanDialog = function() {
    new LessonPlanDialog();
}
