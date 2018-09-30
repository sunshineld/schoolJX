import config from '@/config'
import req from 'axios'
import {Message} from 'element-ui'
import getBrowserInfo from './getBrowserInfo'
import nodeUrl, { resolve } from 'url'
import qs from 'qs'
import store from '@/store/'

// ie post方式无法下载

const browserInfo = getBrowserInfo()
function remove (node) {
    if (browserInfo.name === getBrowserInfo.IE) {
        node.removeNode(true)
    } else {
        node.remove()
    }
}
// function setFrameDOM () {
//     let frameName = 'exportFile'
//     let a
//     if (!(a = document.getElementById(frameName))) {
//         a = document.createElement('iframe')        
//     }

//     a.id = frameName
//     a.name = frameName
//     // a.src = "about:blank"
//     // a.style.display = 'none'
//     a.style = "position:absolute; top:0px; left:0px;width:0px;height:0px;";
//     document.body.appendChild(a)
//     return frameName
// }

export default (url, params={}, options) => {
    options = options || {}
    options = Object.assign({}, {
        type: 'post',
        showLoading:true,
    }, options)
    let parseUrl = nodeUrl.parse(url, true, true)
    let URL;
    // 二种url类型
    if (Object.prototype.toString.call(url) === '[object Object]') {
        // 老方法
        // 弃用
        URL = (url.base || config.BASEURL) + (url.querystring || '')
    } else {
        // URL = config.BASEURL + url
        let t = ''
        if (!parseUrl.protocol) {
            if (!parseUrl.host) {
                t = config.BASEURL
            } else {
                t = `//${parseUrl.host}`
            }
        } else {
            t = `${parseUrl.protocol}//${parseUrl.host}`
        }
        t += parseUrl.pathname
        URL = t
    }

    console.log('exportFile', `URL: ${URL}; params: ${JSON.stringify(params)}`)
    return new Promise((resolve, reject) => {
        // 查询接口情况
        if(options.showLoading){
            store.commit('startLoad')
        }
        if (options.type.toUpperCase() === 'GET') {
            req.request({
                method: 'HEAD',
                url: `${URL}?${qs.stringify(params)}`,
            })
            .then(res => {
                // let frameName = setFrameDOM();

                if(options.showLoading){
                    store.commit('endLoad')
                }

                window.open(`${URL}?${qs.stringify(params)}`)
                // window.open(`${URL}?${qs.stringify(params)}`, frameName)
                resolve()
            })
            .catch(err => {
                if(options.showLoading){
                    store.commit('endLoad')
                }

                Message.error('资源错误')                
                reject(err)
            })
        } else {
            req.request({
                method: 'HEAD',
                url: URL
            })
            .then(res => {
                // let frameName = setFrameDOM();
                
                if(options.showLoading){
                    store.commit('endLoad')
                }

                if (res.status != 200) {
                    Message.error('接口错误')
                    return
                }
                var temp_form = document.createElement("form") 
                temp_form.action = URL
                temp_form.target = "_blank"
                // temp_form.target = frameName
                temp_form.method = options.type 
                temp_form.style.display = "none"
                for (var x in params) { 
                    var opt = document.createElement("textarea") 
                    opt.name = x 
                    opt.value = params[x] 
                    temp_form.appendChild(opt) 
                }
                document.body.appendChild(temp_form) 
                temp_form.submit()
                remove(temp_form)
                resolve()
            })
            .catch(err => {
                if(options.showLoading){
                    store.commit('endLoad')
                }
                Message.error('资源错误')
                reject(err)
            })
        }
    })
}