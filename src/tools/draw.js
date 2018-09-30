import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from "constants";

class Draw{
    constructor (node, groupNode) {
        if (node === null 
            || node === void 0
            || groupNode === null
            || groupNode === void 0
        ) {
            console.error('Draw args error');
            return
        }

        // html结点
        this._node = node
        // 包裹canvas(有滚动条)
        this._groupNode = groupNode
        // 基础舞台
        this._baseStage = null
        this._baseStageW = 0
        this._baseStageH = 0
        // 基础容器
        this._baseContainer = null
        // 当前状态
        this._canvasStatus = ''
        // canvas状态
        this._STATUS_MOVE = 'move'
        this._STATUS_BIG = 'big'
        this._STATUS_SMALL = 'small'
        this._STATUS_DRAW = 'draw'
        this._STATUS_CLEARDRAW = 'clearDraw'
        this._STATUS_TEXT = 'text'
        this._STATUS_CLEARTEXT = 'clearText'
        this._STATUS_UPDATE = 'update'
        this._canvasStatusList = [
            // 移动
            { status: this._STATUS_MOVE, callback: this._statusMove.bind(this) }, 
            // 放大
            { status: this._STATUS_BIG, callback: this._statusBig.bind(this) }, 
            // 缩小
            { status: this._STATUS_SMALL, callback: this._statusSmall.bind(this) }, 
            // 绘画
            { status: this._STATUS_DRAW, callback: this._statusDraw.bind(this) }, 
            // 橡皮擦
            { status: this._STATUS_CLEARDRAW, callback: this._statusClearDraw.bind(this) }, 
            // 文字
            { status: this._STATUS_TEXT, callback: this._statusText.bind(this) }, 
            // 清除文字
            { status: this._STATUS_CLEARTEXT, callback: this._statusClearText.bind(this) }, 
             // 刷新
            { status: this._STATUS_UPDATE, callback: this._statusUpdate.bind(this) }, 
        ]
        // 背景容器
        this._backgroundContainer = null
        // 背景图片
        // this._backgroundImage = options.backgroundImage

        // 图形容器
        this._shapeContainer = null
        // 图形列表
        this._shapeList = []
        
        // 线条
        this._line = null

        // 临时文本结点
        this._textNode = null
        // 文本容器
        this._textContainer = null
        // 文本列表
        this._textList = []
        // 
        this.pointX = 0
        this.pointY = 0

        this._init()
    }
    _init () {
        if (!this._node) {
            throw new Error('错误的结点')
        }
        this._baseStage = new createjs.Stage(this._node)
        this._baseContainer = new createjs.Container()
        this._backgroundContainer = new createjs.Container()
        this._shapeContainer = new createjs.Container()
        this._textContainer = new createjs.Container()

        this._baseContainer.addChild(
            this._backgroundContainer,
            this._shapeContainer,
            this._textContainer,
        )
        this._baseStageW = this._node.width
        this._baseStageH = this._node.height

        this._registerEvent()
        // 未知原因导致更新背景图片是无法清空背景容器
        // await this._setBackgroundImage()

        this._baseStage.addChild(this._baseContainer)
    }
    // 注册事件
    _registerEvent () {
        const nowXY = (e) => {
            const x = (e.stageX - this._baseContainer.x) / this._baseContainer.scaleX
            const y = (e.stageY - this._baseContainer.y) / this._baseContainer.scaleY

            return [x, y]
        }

        // 自动刷新
        createjs.Ticker.addEventListener("tick", e => {
            this._baseStage.update(e)
        })
        this._baseContainer.addEventListener('mousedown', e => {
            // console.log('mousedown', e.stageX, e.stageY)
            if (this._canvasStatus === this._STATUS_MOVE) {
                this.pointX = e.stageX - this._baseContainer.x
                this.pointY = e.stageY - this._baseContainer.y
            } else if (this._canvasStatus === this._STATUS_TEXT) {
                this._node.parentNode.appendChild(this._createTextInput(...nowXY(e)))
            }
        })
        this._baseContainer.addEventListener('pressmove', e => {
            // console.log('pressmove', e.stageX, e.stageY)
            if (this._canvasStatus === this._STATUS_MOVE) {
                this._baseContainer.x = e.stageX - this.pointX
                this._baseContainer.y = e.stageY - this.pointY

            } else if (this._canvasStatus === this._STATUS_DRAW) {
                this._setLine(...nowXY(e))
            }
        })
        this._baseContainer.addEventListener('pressup', e => {
            // console.log('pressup', e.stageX, e.stageY)
            if (this._canvasStatus === this._STATUS_DRAW) {
                this._stopLine()
            } else if (this._canvasStatus === this._STATUS_MOVE) {
                this._baseContainer.x = e.stageX - this.pointX
                this._baseContainer.y = e.stageY - this.pointY
            }
        })
    }
    // 设置背景
    // 并设置大小
    _setBackgroundImage () {
        // 测试
        if (!this._backgroundImage) {
            console.warn('没有背景图片')
            // reject()
            return
        }
        let img = this._backgroundImage
        let bitMap = new createjs.Bitmap(img)

        const ws = this._baseStageW / img.width
        const hs = this._baseStageH / img.height

        let offsetX = this._baseContainer.x
        let offsetY = this._baseContainer.y
        if (ws <= hs) {
            this._baseContainer.scaleX = this._baseContainer.scaleY = ws
            offsetY = (this._baseStageH - img.height * ws) / 2
        } else {
            this._baseContainer.scaleX = this._baseContainer.scaleY = hs
            offsetX = (this._baseStageW - img.width * hs) / 2
        }

        this._baseContainer.x = offsetX
        this._baseContainer.y = offsetY

        this._backgroundContainer.addChild(bitMap)

        this._groupNode.scrollTop = offsetY - 10
    }
    // 移动容器
    _moveContainer (container, x, y) {
        container.x = x
        container.y = y
    }
    // 设置线条
    _setLine (x, y) {
        if (this._line) {
            this._line.graphics.lineTo(x, y)
        } else {
            var line = new createjs.Shape()
            line.graphics
                .setStrokeStyle(2).beginStroke('#f00')
                .moveTo(x, y)
                .lineTo(x, y)
                // .endStroke()

            this._line = line
            this._shapeList.push(line)
            this._shapeContainer.addChild(line)
        }
    }
    // 停止线条
    _stopLine () {
        if (this._line) {
            this._line.graphics.endStroke()
            this._line = null
        }
    }
    _createTextInput (x, y) {
        if (this._textNode) {
            this._textNode.remove()
        }
        
        let inputNode = document.createElement('input')

        const submit = () => {
            let v = inputNode.value
            if (v) {
                this._setText(inputNode.value, x, y)
                this._textNode.remove()
            } else {
                alert('请填写文字')
            }
        }

        inputNode.type = 'text'
        inputNode.placeholder = '请输入文字'
        inputNode.style.padding = '5px 8px'
        inputNode.onkeydown = event => {
            if (event.keyCode === 13) {
                submit()
            }
        }

        let btnNode = document.createElement('button')
        btnNode.innerText = '确认'
        btnNode.style.padding = '5px 8px'
        btnNode.style.verticalAlign = 'middle'
        btnNode.onclick = event => {
            submit()
        }

        let inputNodeGroup = document.createElement('div')
        inputNodeGroup.style.position = 'absolute'
        inputNodeGroup.style.zIndex = 9999
        inputNodeGroup.style.top = '50%'
        inputNodeGroup.style.left = '40%'

        inputNodeGroup.appendChild(inputNode)
        inputNodeGroup.appendChild(btnNode)
        this._textNode = inputNodeGroup
        return inputNodeGroup
    }
    // 文本
    _setText (text, x, y) {
        let t = new createjs.Text(text, "20px Arial", "#ff7700")
        t.x = x
        t.y = y
        t.textBaseline = "alphabetic";
        this._textContainer.addChild(t)
    }
    // status move
    _statusMove () {
        //
    }
    // status big
    _statusBig () {
        let newScale = this._baseContainer.scaleX + 0.3
        this._baseContainer.scaleX = this._baseContainer.scaleY = newScale
    }
    // status small
    _statusSmall () {
        if (this._baseContainer.scaleX <= 1) {
            return
        }
        let newScale = this._baseContainer.scaleX - 0.3
        this._baseContainer.scaleX = this._baseContainer.scaleY = newScale
    }
    // status draw
    _statusDraw () {
        //
    }
    // status clearDraw
    _statusClearDraw () {
        this._baseContainer.removeChild(this._shapeContainer)
        this._shapeContainer = new createjs.Container()
        this._baseContainer.addChild(this._shapeContainer)
    }
    // status text
    _statusText () {
        //
    }
    // status clearText
    _statusClearText () {
        this._baseContainer.removeChild(this._textContainer)
        this._textContainer = new createjs.Container()
        this._baseContainer.addChild(this._textContainer)
    }
    // status update
    _statusUpdate () {
        // 暂停使用
        // this._baseContainer.removeChild(this._backgroundContainer)
        // this._backgroundContainer = new createjs.Container()
        // this._baseContainer.addChild(this._backgroundContainer)
        // setTimeout(() => {
        //     this._setBackgroundImage()
        // }, 100)
    }
    // 清除背景
    _clearBackgroundContainer () {
        this._backgroundContainer.removeAllChildren()
    }
    // 重置状态
    _transformToLoadingStatus () {
        const oldBaseContainerX = this._baseContainer.x
        const oldBaseContainerY = this._baseContainer.y
        const oldBaseContainerScaleX = this._baseContainer.scaleX
        const oldBaseContainerScaleY = this._baseContainer.scaleY
        const oldNodeWidth = this._node.width
        const oldNodeHeight = this._node.height

        const start = () => {
            this._baseContainer.x = 0
            this._baseContainer.y = 0
            this._baseContainer.scaleX = 1
            this._baseContainer.scaleY = 1
            this._node.width = this._backgroundContainer.getChildAt(0).image.width
            this._node.height = this._backgroundContainer.getChildAt(0).image.height
        }
        const end = () => {
            this._baseContainer.x = oldBaseContainerX
            this._baseContainer.y = oldBaseContainerY
            this._baseContainer.scaleX = oldBaseContainerScaleX
            this._baseContainer.scaleY = oldBaseContainerScaleY
            this._node.width = oldNodeWidth
            this._node.height = oldNodeHeight
        }

        return {
            start,
            end,
        }
    }
    /*
        设置状态
        移动 move
        放大 big
        缩小 small
        绘画 draw
        橡皮擦 clearDraw
        文字 text
        清除文字 clearText
        刷新 update
    */
    setStatus (status) {
        let result = false
        let callback = null
        this._canvasStatusList.forEach(item => {
            if (item.status === status) {
                result = true
                callback = item.callback
                this._canvasStatus = item.status
            }
        })
        if (!result) {
            console.warn('没有该状态')
            return
        }
        callback.call(this)
    }
    // 保存成base64
    save (callback = () => {}) {
        
        const transformToLoadingStatus = this._transformToLoadingStatus()

        transformToLoadingStatus.start()
        setTimeout(() => {
            // url base64
            // 测试
            const base64Content = this._baseStage.toDataURL('#f00')
            transformToLoadingStatus.end()
            callback(base64Content)
            // const _img = new Image()
            // _img.onload = () => {
            //     const t = document.createElement('div')
            //     t.appendChild(_img)
            //     document.body.appendChild(t)
            // }
            // _img.src = base64Content
        }, 500)
    }
    // 设置背景图片
    // @parmas img imgObj
    setBackgroundImage (img) {
        this._backgroundImage = img
        this._setBackgroundImage()
    }
    // 清除背景图片
    clearBackgroundImage () {
        this._clearBackgroundContainer();
    }
}

export default (node, groupNode) => {
    return new Draw(node, groupNode)
}