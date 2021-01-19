<style src="./css/style.css"></style>
<template>
  <div class="common-footer">
    <div class="xl-footer-hint" v-show="isShowHint" :style="footerHintStyle"></div>
    <div class="components-section components-web-client">
      <div class="components-bounced component-app-left" id="appListDivCom">
        <!-- 应用快捷区 -->
        <div class="components-temp-app" id="tempAppCom">
          <div class="components-title">
            <span id="customAppTitleCom">应用快捷区3</span>
            <span id="exitCom">退出</span>
          </div>
          <div class="components-content">
            <div class="components-left-btn" id="leftBtnCom"></div>
            <ul class="components-plan" id="customAppsCom">
              <!-- <li>空位</li>
                        <li>空位</li> -->
            </ul>
            <div class="components-right-btn" id="rightBtnCom"></div>
          </div>
        </div>
        <!-- 上课信息区 -->
        <div class="components-lesson-info" id="lessonInfoCom">
          <div class="components-head">
            <img id="" alt="" />
          </div>
          <div class="components-coueseware-info">
            <p class="classNameBox"><span id="classNameCom">获取数据</span><span id="changeClassFromOffline" class="changeClass">更换班级</span></p>
            <span id="unitNameCom">获取数据</span>
            <span id="changeLessonCom" style="margin-top: 6px;">更改课程</span>
          </div>
          <div class="components-quit-lesson closeComBtn" id="closeCom">
            <div class="conponents-quit-ican iconfont icon-guanji"></div>
            <span>下课</span>
          </div>
          <div class="conponents-info-help" id="infoCom">
            <li class="iconfont icon-xiazai" id="downloadCourseware" v-if="downPageReady" @click="openDownloadPage"></li>
            <li class="iconfont icon-zhiwei-quanbuzhiwei" id="helpCom"></li>
            <li class="iconfont icon-shezhi" id="settingCom"></li>
          </div>
        </div>
        <!-- 所有应用区 -->
        <div class="components-all-app" id="allAppCom">
          <div class="components-top">所有应用</div>
          <ul class="components-all-photo" id="appListCom">
            <div class="components-all-outer">
              <div class="components-all-photo-ul-box" data-origin="true">
                <span class="components-remove" id="removeCustomAppCom">移除</span>
              </div>
            </div>
          </ul>
          <div class="components-mask">
            <div class="components-mask-box">
              <div class="components-mask-box-logo"></div>
              <span class="setbook">登录云教学平台设置教材后重启客户端使用更多功能</span>
              <span class="setclass">登录云教学平台设置任课班级后重启客户端使用更多功能</span>
              <span class="setbookandclass">登录云教学平台设置任课班级和教材后重启客户端使用更多功能</span>
            </div>
          </div>
        </div>

        <div class="compnonents-downlode-aiclass" id="downlodeAIClass">
          点击下载AIclass客户端 >
        </div>
        <ul class="custom-page-list-box">
          <li class="active"></li>
        </ul>
        <div class="open-custom"></div>
      </div>
      <footer class="components-footer">
        <div class="components-user-login" id="userLoginCom">
          <div class="components-cha" id="characterCom">
            <div class="components-phone"></div>
          </div>
          <p class="userNameSchool">
            <span id="userNameCom">未登录</span>
            <span id="schoolNameCom"></span>
          </p>
          <span id="userNamePreview">未登录</span>
          <span id="userComPreview">更新时间</span>
        </div>
        <div class="components-the-more" id="theMoreCom">
          <ul id="theMoreUlCom">
            <li id="minimizeCom">
              <div class="components-btn"></div>
              <span>最小化</span>
            </li>
            <li id="helpCom">
              <div class="components-btn"></div>
              <span>帮助</span>
            </li>
            <li id="settingCom">
              <div class="components-btn"></div>
              <span>设置</span>
            </li>
            <li id="closeCom">
              <div class="components-btn"></div>
              <span>退出</span>
            </li>
          </ul>
        </div>
        <div class="components-tool-tab" id="toolTabCom">
          <ul class="components-left" id="taskAppListCom">
            <li data-appId="editApp">编辑</li>
          </ul>
          <div class="components-middle" id="mainMenuCom"></div>
          <div class="components-right" id="componentAppMenuCom">
            <keep-alive :include="footerCache">
              <component :is="toolPage" ref="comp" @onRender="renderCallback"></component>
            </keep-alive>
          </div>
        </div>

        <div class="components-tool-close" id="componentPreviewClose">
          返回
        </div>
        <div class="components-other-app" id="otherToolAppCom">
          <ul id="otherToolAppUlCom" class="components-common-relosotion">
            <li class="components-blackboard-writing iconfont " id="blackboardWriting"><span class="iconfont icon-banshu"></span>保存板书</li>
            <li class="components-pickup" id="pickUpCom"></li>
            <li class="components-video" id="screeRecordCom" :class="{'disable':!isRecordAble,'noneActive':!isRecordActive}">
              <span class="iconfont icon-luzhi"></span>
              录微课
            </li>
            <li class="components-screencut" id="screeSnapCom">
              <span class="iconfont icon-jiandao"></span>
            </li>
            <li class="components-drawing" id="drawingCom"><span class="iconfont icon-baiban"></span></li>
            <li class="components-spoting" id="spotlightCom"><span class="iconfont icon-webdiymengban"></span></li>
            <li class="components-lockscreen unlock" id="lockPadCom">
              <span class="iconfont"></span>
              <!-- <div class="lockscreenHintON">学生平板已解锁</div>
                        <div class="lockscreenHintOFF">学生平板已被锁定</div> -->
            </li>
            <li class="components-keyboard" id="keyboardCom"><span class="iconfont icon-jianpan"></span></li>
            <li class="components-fullscreen" id="fullscreenCom"><span class="iconfont icon-quanping"></span></li>
            <li class="components-minilize" id="minimizeCom"><span class="iconfont icon-tuichuquanping"></span></li>
          </ul>
          <ul class="components-small-resolution" id="smallResolution" style="display: none">
            <li class="components-video1" id="screeRecordCom1"></li>
            <li class="components-drawing1" id="drawingCom1"></li>
            <li class="components-spoting1" id="spotlightCom1"></li>
            <!-- <li class='components-responder1' id="responder1"></li> -->
            <li class="components-keyboard1" id="keyboardCom1"></li>
            <li class="components-screencut1" id="screeSnapCom1"></li>
            <!-- <li id='screeRecordCom1'></li> -->
            <!-- <li id="screeSnapCom1"></li> -->
            <!-- <li id="keyboardCom1"></li>
                    <li id="drawingCom1"></li>
                    <li id="spotlightCom1"></li> -->
            <!-- <li id="lockPadCom1"></li> -->
          </ul>
        </div>
      </footer>
      <!-- 框架-xp系统下 提示框-->
      <div class="components-notice" id="comNotice">
        此功能需安装AIclass客户端（win7以上版本）后使用
      </div>
      <!-- 开通智慧课堂提示框 -->
      <div class="open-smclass-sign" id="openSignCom">
        <div class="components-arrow" id="arrowCom"></div>
      </div>
      <div class="self-mask"></div>
      <div class="self-url-box">
        <div class="self-warn-info"></div>
        <div class="add-content">
          <div class="self-url-header">
            <div class="header-text">自定义链接</div>
            <div class="header-close-btn"></div>
          </div>
          <div class="self-editor-add">
            <div class="self-editor-add-content">
              <div class="self-add-pic"><p></p></div>
              <div class="self-add-form">
                <div class="self-add-form-url">
                  <span>网址</span>
                  <input type="text" class="addurl" placeholder="请输入网址" maxlength="1000" />
                </div>
                <div class="self-add-form-name">
                  <span>名称</span>
                  <input type="text" class="addname" placeholder="请输入链接名称" maxlength="60" />
                </div>
                <div class="self-warning-info">
                  最多只支持添加50个外部链接
                </div>
              </div>
              <div class="self-add-btn noacitve">添加</div>
            </div>
            <div class="splite-line"></div>
          </div>
        </div>
        <div class="add-item-box">
          <div class="self-url-header">
            <div class="header-text">已添加</div>
          </div>
          <div class="itembox"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { State } from "vuex-class";
import ComponentTool from "./comp";
import { OpenDownloadPageFrom, AppType } from "asset/js/enums";

const blackboard = () => import("view/classroom/blackboard/components/footer/index.vue");
const mathTool = () => import("view/classroom/mathTool/components/footer/index.vue");
const geometryTool = () => import("view/classroom/geometryTool/components/footer/index.vue");
const functionTool = () => import("view/classroom/functionTool/components/footer/index.vue");
const work = () => import("view/classroom/work/components/footer/index.vue");
const physics = () => import("view/classroom/physics/components/footer/index.vue");
const chemistry = () => import("view/classroom/chemistry/components/footer/index.vue");
const classstat = () => import("view/classroom/classstat/component/footer.vue");
const index = () => import("./default.vue");

@Component({
  name: "CommonFooter",
  components: {
    blackboard,
    mathTool,
    geometryTool,
    functionTool,
    work,
    physics,
    chemistry,
    classstat,
    index
  },
})
export default class extends Vue {
  @State((state) => state) gData;

  component = null;

  toolPage = "";

  footerHintStyle= '';

  cacheList = {};

  isShowHint = false;

  // isShow = false;
  get footerCache() {
    const a = ['index'];
    for (var key in this.cacheList) {
      a.push(key + '-footer');
    }
    return a.join(',');
  }

  get downPageReady() {
     return this.$store.state.downPageReady && this.$store.state.classState.teachTargetType === 1;
  }

  get isRecordAble() {
    return this.$store.state.isRecordAble
  }

  get isRecordActive() {
    return this.$store.state.isRecordActive
  }

  @Prop({
    type: Boolean,
    default: false,
  })
  isDragBody;

  /**
   * 点击菜单栏下载按钮  下载课件
   */
  openDownloadPage() {
    this.$bus.emit("dispatch", { id: "", path: "downCourseware", isShow: true, type: AppType.cover }, OpenDownloadPageFrom.coreMenu);
    window.component.componentBottomMenu.toggleAppListDiv(false);
  }

  changeClassFromOffline() {
    window.component.xl && component.xl.changeClassFromOffline(2);
    window.component.componentBottomMenu.toggleAppListDiv(false);
  }

  mounted() {
    this.$bus.on(this.$BusEvent.init_footer, () => {
      // debugger
      // console.log('init_footer')
      // this.isShow = true;
      window.component = new ComponentTool(this.gData, this);
      // if(!window.component){
      //   console.log('init_footer_1')
      //   window.component = new ComponentTool(this.gData, this);
      // }else{
      //   console.log('init_footer_1')
      //   window.component.loginData = this.gData;
      //   window.component.initUserInfo()
      // };
    });
    // data 对象
    // {
    //   name: 'AAA', ->组件名字
    //   onHide:Function, ->显示的时候的回调
    //   onRender: Function ->组件渲染完成的回调
    // }
    this.$bus.on(this.$BusEvent.show_footer_view, (data) => {
      if (!window.component) {
        window.component = new ComponentTool(this.gData, this);
      }
      if (!this.cacheList[data.name]) {
        this.$set(this.cacheList, data.name, {
          onRender: data.onRender ? data.onRender : null,
          onHide: data.onHide ? data.onHide : null,
        });
      }
      this.toolPage = data.name;
    });
    this.$bus.on(this.$BusEvent.show_footer_hint, (data, style) => {
      if (data) {
        this.footerHintStyle = style;
      }
      this.isShowHint = data;
    })
    this.$bus.on(this.$BusEvent.reset_footer, (data) => {
      console.log('reset_footer1', JSON.parse(JSON.stringify(this.cacheList)))
      this.toolPage = 'index';
      this.$set(this, 'cacheList', {});
      console.log('reset_footer2', JSON.parse(JSON.stringify(this.cacheList)))
      console.log('footerCache', JSON.parse(JSON.stringify(this.footerCache)))
      // console.log(JSON.parse(JSON.stringify(this.$children)))
      // console.log(this.$children.length)
    });
  }

  destroyed() {
    this.$bus.off(this.$BusEvent.show_footer_view);
    this.$bus.off(this.$BusEvent.show_footer_hint);
    this.$bus.off(this.$BusEvent.reset_footer);
    this.$bus.off(this.$BusEvent.init_footer);
  }

  renderCallback() {
    console.log('footer renderCallback')
    this.isShowHint = false;
    this.cacheList[this.toolPage] && this.cacheList[this.toolPage].onRender && this.cacheList[this.toolPage].onRender();
  }

  hideCallback() {
    console.log('footer hideCallback')
    this.cacheList[this.toolPage] && this.cacheList[this.toolPage].onHide && this.cacheList[this.toolPage].onHide();
  }
}
</script>
