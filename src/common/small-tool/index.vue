<template>
    <div id="smallToolBox" class="toolBox toolicon transRight0">
        <!--左侧按钮-->
        <div class="toolicon-left toolicon-left-btn" @click="hideSmallTool"></div>
        <div class="toolicon-left1 toolicon-left-btn" @click="showSmallTool" ondragstart="return false"></div>
        <!--右侧内容-->
        <button id="showQrCode" class="qrCodeEnter" @click="showQrCode">扫码下载，手机授课</button>
        <div class="footer more toolicon-right" >
            <div @click="()=>handleBtn(item.dataBtn)" :key="index" v-for="(item, index) in buttonList" v-bind:class="item.className" :data-button="item.dataBtn">
            <span class="moreIcon">
                <i :class="['iconfont',item.iconfont]"></i>
            </span>
            <span class="moretext">{{item.text}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      buttonList: [// 小工具按钮列表
        {
          className:{'screen-record':true,"disable":!this.isRecordAble,"noneActive":!this.isRecordActive},
          iconfont:"icon-luzhi",
          dataBtn:'screen-record',
          text:'录微课'
        },
        {
          className:[],
          dataBtn:'drawing',
          iconfont:"icon-baiban",
          text:'小白板'
        },
        {
          className:[],
          iconfont:"icon-webdiymengban",
          dataBtn:'spotlight',
          text:'聚光灯'
        },
        {
          className:[],
          iconfont:"icon-jianpan",
          dataBtn:'osk',
          text:'软键盘'
        },
        {
          className:[],
          iconfont:"icon-qiangda",
          dataBtn:'responder',
          text:'抢答'
        },
        {
          className:[],
          iconfont:"icon-toupiao",
          dataBtn:'vote',
          text:'投票'
        },
        {
          className:[],
          iconfont:"icon-jiandao",
          dataBtn:'screen-snap',
          text:'截图'
        },
        {
          className:['unlock'],
          iconfont:"",
          dataBtn:'lock-pad-small-tool',
          text:'解锁'
        },

      ]
    }
  },
  computed: {
    isRecordAble() {
        return this.$store.state.isRecordAble;
    },
    isRecordActive() {
        return this.$store.state.isRecordActive;
    },
  },
  methods: {
    // 点击小工具内的icon
    handleBtn(btnName) {
      this.$emit('smallBtnClick', btnName)
    },
    // 通知app.vue 隐藏小工具
    hideSmallTool() {
      this.$emit('hideTool')
    },
    // 通知app.vue 显示小工具
    showSmallTool() {
      this.$emit('showTool')
    },
    showQrCode() {
      this.$emit('showQrCode', true)
    }
  }
}
</script>
<style lang="less" scoped>
#opacityMask {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .4);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
  display: none;
}
.fullScreenSetStyle .toolBox {
  z-index: 1;
}
.toolBox {
  position: absolute;
  right: -304px;
  bottom: 138px;
  min-height: 166px;
  width: 304px;
  z-index: 2020;
  user-select: none;
  background: #1e252c;
}
body.windowxl .toolBox .more>[data-button=screen-snap] {
  display: none;
}
.toolBox .more>[data-button=lock-pad-small-tool] {
  display: none;
}
@media all and (max-width: 1024px) {
  .toolBox .more>[data-button=lock-pad-small-tool] {
    display: block;
  }
}
@media all and (max-width: 1279px) {/*http://jira.xuelebj.net/browse/CLASSROOM-7158*/
  body.windowxl .toolBox .more>[data-button=screen-snap] {
    display: block;
  }
}
.toolBox .qrCodeEnter {
  width: 200px;
  height: 34px;
  background: #2262e4 url(./images/qrcodePhone.png) no-repeat 32px center/14px;
  border-radius: 17px;
  color: #fff;
  border: none;
  padding: 0;
  margin: 0;
  outline: none;
  cursor: pointer;
  margin-left: 38px;
  text-indent: 60px;
  text-align: left;
  font-size: 12px;
  margin-top: 24px;
}
.toolBox.toolBoxReplace .qrCodeEnter {
  margin-left: 64px;
}
.toolBoxReplace {
  position: absolute;
  left: -305px;
}
.toolBoxReplace>.footer.more {
  padding-left: 50px!important;
}
.toolBoxReplace > .toolicon-left-btn {
  width: 26px;
  height: 52px;
  color: #fff;
  cursor: pointer;
  position: absolute;
  right: -24px;
  left: auto;
  transform: scale(-1,1);
}
.toolBoxReplace > .toolicon-left1 {
  transform: scale(1,1);
  background: url(./images/toolshow2.png) no-repeat left bottom/contain;

}
.toolBoxReplace .toolicon-right {
  float: right;
}
.toolBox>.footer.more>div {
  float: left;
}
.toolBox>.footer.newRight>[data-button=minimize] {
    padding: 0 0px;
}
.toolBox>.footer.newRight>[data-button=pickup] {
    padding: 17px 1px;
}
.toolBox>.footer.newRight>[data-button=screen-snap] {
    padding: 17px 1px;
}
.toolBox>.footer.newRight>[data-button=lock-pad] {
    padding: 17px 4px;
}
.toolBox>.footer.newRight>[data-button=fullscreen] {
    padding: 17px 1px;
}

.toolBox>.footer.more>[data-button]{
    height: 48px;
    width: 40px;
    margin: 0 19px;
    margin-bottom: 22px;
}
.toolBox>.footer.more>[data-button].hide{
    display: none;
}
.toolBox>.footer.more>[data-button]>.moreIcon{
    background: none;//url(./images/spriteMore_copy.png) 0 0 content-box content-box no-repeat;
    height: 34px;
    display: block;
    width: 100%;
    text-align: center;
    line-height: 34px;
    .iconfont{
        color: #fff;
        pointer-events: none;
        font-size: 23px;
        display: block;
    }
}
.toolBox>.footer.more>[data-button].hide {
  display: none;
}
.toolBox>.footer.more>[data-button]>.moreIcon {
  background: url(./images/spriteMore_copy.png) 0 0 content-box content-box no-repeat;
  height: 34px;
  display: block;
  width: 100%;
}
.toolBox>.footer.more>[data-button=screen-snap]>.moreIcon{
}
.toolBox>.footer.more>[data-button=lock-pad-small-tool]{
    color: #fff;
    .iconfont{
        color: #fff;
        &::before{
            content:"\e61f";
        }
    }
}
.toolBox>.footer.more>.unlock[data-button=lock-pad-small-tool]{
    color: #63C44F;
    .iconfont{
        color: #63C44F;
        &::before{
            content:"\e611";
        }
    }
}
.toolBox>.footer.more>.unlock[data-button=lock-pad-small-tool]>.moreIcon{
}
.toolBox>.footer.more>[data-button=drawing]>.moreIcon{
    .iconfont{
        font-size: 27px;
    }
}
.toolBox>.footer.more>[data-button=responder]>.moreIcon{
}
.toolBox>.footer.more>[data-button=spotlight]>.moreIcon{
}
.toolBox>.footer.more>[data-button=screen-record]>.moreIcon{
    .iconfont{
        font-size: 20px;
    }
}

.toolBox>.footer.more>[data-button=lock-pad].yes {
    padding: 0 4px;
}

.toolBox>.footer.more>[data-button=osk]>.moreIcon{
}
.toolBox>.footer.more>[data-button=vote]>.moreIcon{
}

.toolBox>.footer.more>[data-button=screen-record].disable>.moreIcon{
    color: #424444;
}
.toolBox>.footer.more>[data-button=screen-record].noneActive>.moreIcon{
    color: #424444;
}
.toolicon-left-btn {
  width: 26px;
  height: 52px;

  color: #fff;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  left: -24px;
}
.toolicon-left {
  background: url(./images/toolhide.png) no-repeat;
  background-size: contain;
  background-position-y: bottom;
}
.toolicon-left1 {
  background: url(./images/toolshow.png) no-repeat;
  background-size: contain;
  background-position-y: bottom;
  display: none;
}

.toolicon-right {
  box-sizing: content-box;
  width: 270px;
  min-height: 140px;
  background: #1e252c!important;
  border-radius: 3px;
  /* padding-left: 0; */
  /* margin: 10px 0; */
  z-index: 5;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  display: block !important;
  padding-bottom: 6px;
  // padding-right: 50px;
}
.transRight0 {
  right: -40px;
  /* transition: all 0.5s; */
}
.transRight1 {
  left: -40px!important;
}
#bodyMask {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  position: absolute;
  z-index: 12;
  left: 0;
  top: 0;
  display: none;
}
#bodyMask.show {
  display: block;
}

</style>
