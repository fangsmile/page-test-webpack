<template>
  <div
    @click="showDownLoad"
    id="openDownload"
    :class="['openDownload',isLoading?'hasLoading':'']"
    ondragstart="return false"
  ></div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { AppType, DownCourseStatus, OpenDownloadPageFrom } from "asset/js/enums";
@Component({

})
export default class extends Vue {
  @Prop({
    type: Number,
    default: DownCourseStatus.noLoading,
  })
  downCourseStatus: DownCourseStatus;

  @Prop({
    type: Boolean,
    default: false,
  })
  isDragBody: boolean;

  get isLoading() {
    return this.downCourseStatus == DownCourseStatus.loading;
  }

  showDownLoad() {
    if (this.isDragBody) { return; }
    this.$bus.emit(
    "dispatch",
    { id: "",
path: "downCourseware",
isShow: true,
type: AppType.cover },
    OpenDownloadPageFrom.coreDownBtn);
  }
}
</script>
<style lang="less" scoped>
#openDownload {
  width: 52px;
  height: 52px;
  background: url(~asset/img/download.png) no-repeat center/contain;
  position: absolute;
  left: calc(100% - 70px);
  top: calc(100% - 170px);
  z-index: 2020;
  cursor: pointer;
  user-select: none;
  &.hasLoading {
    background: url(~asset/img/download.gif) no-repeat center/contain;
  }
}
</style>
