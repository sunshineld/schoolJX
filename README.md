## API

API地址在 /static/config.js 中的req_api

## ueditor

### 图片地址

通过 /Logreg/imagePrefix API来获取真实地址

### 服务器地址

默认服务器地址是API地址

也可以更改

    // 在index.html中配置window.SERVER_BASE_URL
    // 默认值
    window.SERVER_BASE_URL = req_api + '/';