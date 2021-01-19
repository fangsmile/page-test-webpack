/**
 * @file
 * @author yuanwei (yuanwei@xueleyun.com)
 * @since Do not edit
 */
// import './index.css'
import defaultIcon from './img/icon-default.png'
let timer
let pageLoadingIcon
let pageLoadingName

export default class PageLoading {
  static init() {
    // const style = `background: url(${defaultIcon}) center no-repeat;`
    // const loading = `<div class="page-loading" id="pageLoading">
    //                 <div class=icon id="pageLoadingIcon" style="${style}"></div>
    //                 <div class=name id="pageLoadingName">AIclass</div>
    //                 <div class=ellipsis></div>
    //               </div>`
    // document.body.insertAdjacentHTML('beforeend', loading)
    pageLoadingIcon = document.querySelector('#pageLoadingIcon')
    pageLoadingName = document.querySelector('#pageLoadingName')
  }

  static show(icon, text, delay = 0) {
    pageLoadingIcon.style.background = `url(${icon || defaultIcon}) center/68px no-repeat`
    pageLoadingName.innerText = text || 'AIclass'
    if (!delay) {
      // console.error('show loading')
      return document.querySelector('#pageLoading').style.display = 'block'
    }
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      // console.error('show loading')
      document.querySelector('#pageLoading').style.display = 'block'
    }, delay)
  }

  static hide(delay = 0) {
    if (!delay) {
      // console.error('hide loading')
      return document.querySelector('#pageLoading').style.display = 'none'
    }
    if (timer) {
      clearTimeout(timer)
      // console.error('hide loading')
      return timer = null
    }
    setTimeout(() => {
      // console.error('hide loading')
      document.querySelector('#pageLoading').style.display = 'none'
    }, delay)
  }
}
