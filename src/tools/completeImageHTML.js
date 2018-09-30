import config from '../config.js'

export default (HTML) => {
    if (HTML.indexOf('src="http') !== -1 || HTML.indexOf('src="//') !== -1) {
        return HTML
    }
    return HTML.replace(/src="(\/)?/ig, 'src="' + config.IMGURL + '/')
}