// 有可能会出现网络卡住导致应用获取的config是旧的
import HTTP from './http'

export default new Promise(async function (res, rej) {
    // 图片前缀
    let imagePrefix
    try {
        imagePrefix = (await HTTP.request('/Logreg/imagePrefix'))
            .res.data.prefix

        res({
            imagePrefix
        })
    } catch (error) {
        rej(new Error('图片前缀获取失败'))
    }
})