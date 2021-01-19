<!--
 * @file
 * @author yuanwei (yuanwei@xueleyun.com)
 * @since 2020-09-02 16:50:16
-->
<style src="./index.css"></style>
<template>
  <div id="fullscreenTool" @click="fullSceenEvent" class="fullscreenTool">
    <button id="moveFullscreenTool" data-button="switchToolFull"></button>
    <ul id="fullscreenToolList">
        <li class="fullTool" id="fullFeedBack" data-button="openApp" data-appid="00000104"><span class="tollIcon"></span><span>随堂反馈</span></li>
        <li class="fullTool" id="fullRollcall" data-button="openApp" data-appid="00000102"><span class="tollIcon"></span><span>随机选人</span></li>
        <li class="fullTool" id="fullScore" data-button="openApp" data-appid="00000105"><span class="tollIcon"></span><span>学习评分</span></li>
        <li class="fullTool" id="fullTimer" data-button="openApp" data-appid="00000101"><span class="tollIcon"></span><span>计时器</span></li>
        <li class="fullTool" id="fullRobResponder" data-button="responder"><span class="tollIcon"></span><span>抢答</span></li>
        <li class="fullTool" id="fullVote" data-button="vote"><span class="tollIcon" ></span><span>投票</span></li>
        <li class="fullTool" id="fullRecord" :class="{'disable':!isRecordAble,'noneActive':!isRecordActive}" data-button="screen-record"><span class="tollIcon"></span><span>录微课</span></li>
        <li class="fullTool" id="fullScreencast"  data-button="openApp" data-appid="00000103"><span class="tollIcon"></span><span>屏幕分享</span></li>
        <li class="fullTool unlock" id="fullLockScreen" data-button="lockPadFull"><span class="tollIcon"></span><span class="toolName">已解锁</span></li>
    </ul>
  </div>
</template>
<script>
import { AppId } from 'asset/js/enums';
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { State } from "vuex-class";
@Component({
  name: 'full-screen'
})
export default class extends Vue {
  @State((state) => state) gData;

  fullScreenApps = [];

  excludeApps = [AppId.timer];

  // isExitFullscreenFromChild = false;
  // isEnterFullscreenFromChild = false;
  created() {
    this.$bus.on(this.$BusEvent.full_screen, (dom, type, appId) => {
      // this.callback = callback;
      this.onOpenFullscreen(type, appId);
    });
  }

  destroyed() {
    this.$bus.off(this.$BusEvent.full_screen);
  }

  get isRecordAble() {
    return this.$store.state.isRecordAble
  }

  get isRecordActive() {
    return this.$store.state.isRecordActive
  }

  mounted() {
    this.onFullscreenchange(this.init);
  }

  activated() {
    console.log('full-screen activated')
  }

  onFullscreenchange(callback) {
    document.addEventListener('fullscreenchange', callback);

    document.addEventListener('webkitfullscreenchange', callback);

    document.addEventListener('mozfullscreenchange', callback);

    document.addEventListener('MSFullscreenChange', callback);
    // document.addEventListener('customFullScreenChange', callback);
  }

  init() {
    // debugger
    var fullScreenElement = this.getFullscreenElement();

    if (!fullScreenElement) { // 退出全屏
        console.log('退出全屏')
        this.changeFullScreenState(false);
        const dontSet = ["courseware", "createCourseware"]
        if (dontSet.indexOf(this.$router.currentRoute.name) == -1) {
          this.$store.commit('setData', { isShowFooter: true });
        }
        if (this.fullScreenApps.length) {
          [...this.fullScreenApps].forEach((app) => {
            this.$bus.emit(this.$BusEvent.exit_fullscreen + "_" + app, 2)
          });
        }
    } else { // 进入全屏
        console.log('进入全屏')
        this.changeFullScreenState(true);
        this.$store.commit('setData', { isShowFooter: false });

        // this.isEnterFullscreenFromChild = true;
        if (this.fullScreenApps.length) {
          [...this.fullScreenApps].forEach((app) => {
            this.$bus.emit(this.$BusEvent.on_fullscreen + "_" + app, 1)
          });
        }

        // q(".loading").setAttribute("fullHeight","");
    }
}

  changeFullScreenState(isFullScreen) {
    this.$emit("change_fullscreen_state", isFullScreen);
  }

  onOpenFullscreen(value, appId) {
    const indexOfApp = this.fullScreenApps.indexOf(appId);
    const fullScreenElement = this.getFullscreenElement();
    if (value === 1) {
      console.log("全屏添加样式");
      if (indexOfApp <= -1) {
        this.requestFullscreen(document.body);
        document.body.classList.add("fullScreenSetStyle");
        this.fullScreenApps.push(appId);
      }
    } else if (value === 2) {
      console.log("退出全屏去除样式");
      if (indexOfApp > -1) {
        this.fullScreenApps.splice(indexOfApp, 1);
        if (!this.fullScreenApps.length) {
          document.body.classList.contains("fullScreenSetStyle") && document.body.classList.remove("fullScreenSetStyle");
          this.exitFullscreen(fullScreenElement);
        }
      }
    }
    this.switchShowTools(value);
  }

  getFullscreenElement() {
    console.log('fullscreenElement == ', document)
    return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.MSFullscreenElement || null;
  }

  requestFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    }
    else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
    else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
    else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen();
    }
}

  exitFullscreen(fullScreenElement) {
    if (!fullScreenElement) { return; }
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }

  switchShowTools(value) {
    if (this.fullScreenApps.length) {
      const isInclude = this.fullScreenApps.some((app) => { return this.excludeApps.includes(app) });
      this.showStartTool(false, this.gData.toolRight, false)
      if (isInclude) { // 计时器全屏不显示工具
          document.querySelector("#fullscreenTool").classList.remove("show");
      } else {
        if (this.gData.login.mode != "3") {
          document.querySelector("#fullscreenTool").classList.add("show");
        }
      }
    } else {
      document.querySelector("#fullscreenTool").classList.remove("show", "active");
      if (this.gData.login.mode != "3") {
        this.showStartTool(true, this.gData.toolRight, false);
      }
    }
}

fullSceenEvent(e) {
  let name;
  for (name = e.target;name && !name.dataset.button;name = name.parentElement) {}
  console.log(name, "11111111111111111")
  if (name) { switch (name.dataset.button) {
    case "switchToolFull":
      this.$bus.emit("fullscreen_tool", { name: "switchToolFull",
data: e.target })
      break;
    case "openApp":
      const appId = name.dataset.appid;
      this.$bus.emit("fullscreen_tool", { name: "openApp",
appId: appId })
      break;
    case "responder":
      this.$bus.emit("fullscreen_tool", { name: "openApp",
appId: "00000106" })
      break;
    case "vote":
      this.$bus.emit("fullscreen_tool", { name: "openApp",
appId: "00001009" })
      break;
    case "screen-record":
    case "lockPadFull":
      this.$bus.emit("fullscreen_tool", { name: name.dataset.button })
      break;
  } }
}

showStartTool(status, gDataRight, gDataSpread) {
    console.log('#########', status, gDataRight, gDataSpread);
    const tooBar = document.querySelector("#smallToolBox");
    const footMore = document.querySelector("#smallToolBox");
    const leftBtn1 = document.querySelector(".toolicon-left");
    const leftBtn2 = document.querySelector(".toolicon-left1");
    footMore.classList.remove("transRight0");
    footMore.classList.remove("transRight1");
    footMore.classList.remove("toolBoxReplace");
    if (status) {
        tooBar.style.display = 'block';
        leftBtn1.style.display = "block";
        leftBtn2.style.display = "none";
        if (gDataRight && gDataSpread) {
            leftBtn1.style.display = "block";
            leftBtn2.style.display = "none";
            footMore.classList.add("transRight0");
            footMore.classList.remove("transRight1");
        } else if (gDataRight && !gDataSpread) {
            leftBtn1.style.display = "none";
            leftBtn2.style.display = "block";
            footMore.classList.remove("transRight0");
            footMore.classList.remove("transRight1");
        } else if (!gDataRight && gDataSpread) {
            leftBtn1.style.display = "block";
            leftBtn2.style.display = "none";
            footMore.classList.add("transRight1");
            footMore.classList.remove("transRight0");
            footMore.classList.add("toolBoxReplace");
        } else if (!gDataRight && !gDataSpread) {
            leftBtn1.style.display = "none";
            leftBtn2.style.display = "block";
            footMore.classList.remove("transRight1");
            footMore.classList.remove("transRight0");
            footMore.classList.add("toolBoxReplace");
        }
    } else {
        tooBar.style.display = 'none';
    }
}
}
</script>
