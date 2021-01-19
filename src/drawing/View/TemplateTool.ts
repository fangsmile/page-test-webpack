import { templateConfig } from '../TemplateConfig'

export class TemplateTool {
    isShow: false;
    container: HTMLElement;
    tabBox: HTMLElement; // tab容器
    bgBox: HTMLElement; // 背景容器
    prevBtn: HTMLElement; // 上一页按钮
    nextBtn: HTMLElement; // 下一页按钮
    templateConfigGroup: any;
    currentBGlist: Array<object>;
    currentBG: any;
    currentTabName: string;


    constructor() {

        this.container = <HTMLDivElement>document.getElementById("drawingContainer").querySelector("#template-tool-box");
        this.tabBox = <HTMLUListElement>document.getElementById("drawingContainer").querySelector("#tool-group-tab");
        this.bgBox = <HTMLUListElement>document.getElementById("drawingContainer").querySelector("#group-bg-box");
        this.prevBtn = document.getElementById("drawingContainer").querySelector("#prev-btn");
        this.nextBtn = document.getElementById("drawingContainer").querySelector("#next-btn");

        this.renderTab();
        this.initListener();
    }

    /**
     * 生成tab选项卡，默认第一个
     */
    renderTab() {
        let tabsStr = [];
        // 用Set去重，生成tab数组
        let tabNames = new Set(templateConfig.map(item => {
            return item.groupName;
        }))
        let firstKeMuTabName = "";
        // 遍历插入li       
        Array.from(tabNames).forEach((value: string, index) => {
            let currentBGlist = templateConfig.filter(item => item.groupName == value && item.isShow);
            if (currentBGlist.length >= 1 && value != "默认背景") {
                tabsStr.push(`<li >${value}</li>`);
                !firstKeMuTabName && (firstKeMuTabName = value);
            }
        });

        this.tabBox.innerHTML = tabsStr.join('');

        this.tabClickListener();
        //初始化第一个分类列表
        this.renderBGcontainer(firstKeMuTabName);
        this.currentTabName = "默认背景"
    }
    /**
     * 分组名称的点击事件
     */
    tabClickListener() {
        let ul = $(this.tabBox);
        ul.on('click', 'li', (e) => {
            if (this.currentTabName == (<HTMLElement>e.target).innerText)
                return false;
            this.currentTabName = (<HTMLElement>e.target).innerText;
            $(this.tabBox).children().removeClass('active');
            $(e.currentTarget).addClass('active');
            document.getElementById("drawingContainer").querySelector("#Default").classList.remove("active");
            this.renderBGcontainer((<HTMLElement>e.target).innerText);
        })
        // 默认显示第一个
        $(ul.children().get(0)).trigger('click');
    }
    /**
     * 渲染背景list
     * @param name 分组名称
     */
    renderBGcontainer(name: string) {
        let bgsStr = [];
        // 根据name分组得到list
        this.currentBGlist = templateConfig.filter(item => item.groupName == name && item.isShow)
        if (this.currentBGlist.length > 7) {
            $(this.prevBtn).show();
            $(this.nextBtn).show();
            $(this.prevBtn).attr("disabled", true);
            $(this.nextBtn).attr("disabled", false);
        } else {
            $(this.prevBtn).hide();
            $(this.nextBtn).hide();
            $(this.prevBtn).attr("disabled", false);
            $(this.nextBtn).attr("disabled", true);
        }
        this.currentBGlist.forEach((item: any) => {
            bgsStr.push(`<li data-name="${item.name}"><div><img src="${item.icon}" alt="" draggable="false"></div><p class="bg-desp">${item.desp}</p></li>`);
        });
        this.bgBox.innerHTML = bgsStr.join('');

        this.bgClickListener();
    }

    /**
     * 
     */
    bgClickListener() {
        let ul = $(this.bgBox);
        let that = this;
        ul.on('click', 'li', (e) => {
            if (!$(that.tabBox).children().hasClass("active")) {
                that.tabBox.querySelector("li").classList.add("active")
                that.currentTabName = that.tabBox.querySelector("li").innerHTML;
            }
            $(that.bgBox).children().removeClass('active');
            $(e.currentTarget).addClass('active');
            document.getElementById("drawingContainer").querySelector("#Default").classList.remove("active");
            //背景框消失
            $("#drawingContainer .template-tool-box").hide();
            document.getElementById("drawingContainer").querySelector("#background").classList.remove("active");
            if (window.drawing) {
                window.drawing.mainLogic.changeTemplate((<HTMLElement>e.currentTarget).dataset["name"]);
            }
        })
        // 默认显示第一个  http://jira.xuelebj.net/browse/CLASSROOM-6650
        // if(window.drawing){
        $(ul.children().get(0)).trigger('click');
        // $("#drawingContainer .template-tool-box").show();
        // document.getElementById("drawingContainer").querySelector("#background").classList.add("active");
        // }
    }

    /**
     * 事件监听
     */
    initListener() {

        // 上一页按钮事件
        $("#drawingContainer #prev-btn").click(() => {
            let scrollLeft = $(this.bgBox).scrollLeft();
            $(this.bgBox).animate({ 'scrollLeft': (scrollLeft - 1020 - 40) + 'px' }, 1000);
        })

        // 下一页按钮事件
        $("#drawingContainer #next-btn").click(() => {
            let scrollLeft = $(this.bgBox).scrollLeft();
            $(this.bgBox).animate({ 'scrollLeft': (scrollLeft + 1020 + 40) + 'px' }, 1000);
        })

        // // 监听滚动事件，设置相应的状态
        // $(this.bgBox).scroll((e) => {
        //     let scrollLeft = e.currentTarget.scrollLeft;
        //     let width = e.currentTarget.scrollWidth;

        //     (scrollLeft > 0) ? $(this.prevBtn).attr("disabled", false) : $(this.prevBtn).attr("disabled", true);

        //     (scrollLeft === (width - 1020)) ? $(this.nextBtn).attr("disabled", true) : $(this.nextBtn).attr("disabled", false);
        // })

        $("#drawingContainer #Default").click(() => {
            $("#drawingContainer .template-tool-box").hide();
            $(this.bgBox).children().removeClass('active');
            $(this.tabBox).children().removeClass('active');
            document.getElementById("drawingContainer").querySelector("#Default").classList.add("active");
            document.getElementById("drawingContainer").querySelector("#background").classList.remove("active");

            window.drawing.mainLogic.changeTemplate("Default");
            this.currentTabName = "默认背景"
        })
    }

    dragMove(e) {
        $(this.bgBox).scrollLeft(this.bgBox.scrollLeft + (-e.noRoteDiffX));
    }
}