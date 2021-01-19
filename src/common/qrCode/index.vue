<template>
  <div id="qrCodeBox" class="qrCodeBox display-none" style="display: none;">
    <p class="qrCodeTittle">使用微信小程序或者学乐云教学，开始移动授课</p>
    <ul class="qrCodeContent">
      <li class="qrCodeInfo">
        <p class="qrCodeName">授课小程序</p>
        <p class="qrCodeImg">
          <img src alt="二维码" />
          <span class="qrLogo"></span>
        </p>
        <p class="qrCodeAct">微信扫一扫</p>
        <p class="qrCodeEffact">关联账号，开始移动授课</p>
      </li>
      <li class="qrCodeInfo">
        <p class="qrCodeName">学乐云教学</p>
        <p class="qrCodeImg">
          <img src="./images/components-qrcode3.png" alt="二维码" />
        </p>
        <p class="qrCodeAct">下载学乐云教学</p>
        <p class="qrCodeEffact">打开教学-授课助手</p>
      </li>
    </ul>
  </div>
</template>
<style lang="less" scoped>
#qrCodeBox {
  width: 400px;
  background: #fff;
  color: #000;
  font-size: 12px;
  position: absolute;
  z-index: 2020;
  border-radius: 4px;
  overflow: hidden;
  left: 0;
  top: 0;
  box-shadow: 2px 3px 5px 0 rgba(0, 0, 0, 0.28);
  user-select: none;

  p {
    margin: 0;
    padding: 0;
  }
  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .qrCodeTittle {
    width: 100%;
    text-align: center;
    color: #2262e4;
    font-weight: 700;
    height: 44px;
    line-height: 44px;
    border-bottom: 1px solid #ededed;
  }
  .qrCodeContent {
    padding: 0 34px;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }
  .qrCodeContent .qrCodeInfo {
    float: left;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 22px 0 24px;
    width: 166px;
  }
  .qrCodeContent .qrCodeInfo .qrCodeName {
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    color: #212121;
    margin: 0 0 20px 0;
    line-height: 16px;
  }
  .qrCodeContent .qrCodeInfo .qrCodeImg {
    width: 110px;
    height: 110px;
    background: #fff;
    position: relative;
  }
  .qrCodeContent .qrCodeInfo .qrCodeImg img {
    width: 100%;
    height: 100%;
    object-position: center;
    object-fit: contain;
  }
  .qrCodeContent .qrCodeInfo .qrCodeImg .qrLogo {
    display: block;
    width: 34px;
    height: 34px;
    background: url(./images/qrLogo.png) no-repeat center/contain;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .qrCodeContent .qrCodeInfo .qrCodeAct {
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    color: #212121;
    margin: 24px 0 12px 0;
    line-height: 14px;
  }
  .qrCodeContent .qrCodeInfo .qrCodeEffact {
    font-size: 12px;
    line-height: 12px;
    font-weight: 500;
    text-align: center;
    color: #999;
  }
}
</style>
