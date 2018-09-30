(function () {
    // Biokey实例
    var Biokey_case = null;
    // 消息回调
    var eventsMap = {};

    // 指纹构造函数
    function Biokey (nodeId) {
        // 单例
        if (Biokey_case) {
            return Biokey_case;
        } else {
            Biokey_case = this;
        }

        this.object = document.getElementById(nodeId); //获得指纹Object对象
        this.debug  = false;
        this.Biokey_Count = 0;   //指纹模块数量
        this.Biokey_Indx = 0;    //指纹模块序号
        this.Biokey_SensorSN = ""; //指纹模块序列号
        this.Biokey_DBHandle  = 0; //指纹模块内存句柄
        this.Biokey_VerifyScore = 8; //指纹比对分数
        this.Biokey_TemplateCount=0; //当前内存指纹数量
    }
    // 观察者(订阅)
    // eventName 事件名称
    // callback 回调参数
    Biokey.prototype.onEvent = function (eventName, callback) {
        var item = eventsMap[eventName];

        if (!item) {
            item = [];
            eventsMap[eventName] = item;
        }
        item.push(callback); 
        return callback;
    }
    // 观察者(发送)
    // eventName 事件名称
    // args 参数(只能传递一个参数)
    Biokey.prototype.emitEvent = function (eventName, args) {
        var item = eventsMap[eventName];

        if (!item) {
            // if (this.debug) {
            //     console.error('[Biokey.emit]event is empty');
            // }
            return;
        }
        for (var i = 0, max = item.length; i < max; ++i) {
            item[i](args);
        }
    }
    // 观察者(删除)
    // eventName 事件名称
    // callback 回调参数
    Biokey.prototype.removeEvent = function (eventName, callback) {
        var item = eventsMap[eventName];
        var findListIndex;

        if (!item) {
            if (this.debug) {
                console.error('[Biokey.removeEvent]event is empty');
            }
            return;
        }        
        findListIndex = item.indexOf(callback);
        if (findListIndex === -1) {
            // console.error('[Biokey.removeEvent]callback not find');
        } else {
            item.splice(findListIndex, 1);
        }
    }

    //打印调试信息
    Biokey.prototype.qDebug = function (text){
        if(biokey.debug){
            var debugNode = document.getElementById("BiokeyDebug");
            if (!debugNode) {
                var t = document.createElement('div');
                t.id = 'BiokeyDebug';
                t.style.color = '#fff';
                t.style.position = 'fixed';
                t.style.top = 0;
                t.style.left = 0;
                t.style['background-color'] = 'rgb(100,0,0)';
                document.body.appendChild(t);
                debugNode = t;
            }
            debugNode.innerHTML+=text + "<br />";
        }
        console.log(text);
    }
    //初始化指纹阅读器
    Biokey.prototype.init = function () {
        // if (ctx === null || ctx === void 0) {
        //   console.error('Biokey init function args is empty');
        //   return;
        // }
        // this.Biokey_ctx = ctx;

        var bRet = false;
        try{
            if(this.object.InitEngine()===0){
                bRet = true;
                this.Biokey_Count = this.object.SensorCount;
                //设置指纹所得计算版本为10,配合硬件SDK及1.0.不设置默认是9，这是一个坑。
                this.object.FPEngineVersion = "10";
                //设置指纹阅读器序号为第一个
                this.object.SensorIndex = this.Biokey_Indx;
                this.Biokey_SensorSN = this.object.SensorSN;
                this.Biokey_DBHandle = this.object.CreateFPCacheDB();
                // this.qDebug("数量：" + this.Biokey_Count);
                // this.qDebug("下标" + this.Biokey_Indx);
                // this.qDebug("序列号：" + this.Biokey_SensorSN);
                // this.qDebug("DB句柄：" + this.Biokey_DBHandle);
                // this.qDebug("内存指纹数量：" + this.Biokey_TemplateCount);
                // this.qDebug("初始化成功...");
            }else{
                // this.qDebug("初始化失败...");
            }
        }catch(e){
            // this.qDebug("初始化失败..." + e);
        }
        return bRet;
    }
    //卸载指纹阅读器，释放资源
    Biokey.prototype.dispose = function () {
        try{this.object.CancelCapture();console.log("CancelCapture");}catch(e){}
        try{this.object.CancelEnroll();console.log("CancelEnroll");}catch(e){}
        try{this.object.FreeFPCacheDBEx(this.Biokey_DBHandle);console.log("FreeFPCacheDBEx");}catch(e){}
        try{this.object.EndEngine();console.log("EndEngine");}catch(e){}
        this.Biokey_Count = 0;
        this.Biokey_Indx = 0;
        this.Biokey_DBHandle = 0;
        this.Biokey_SensorSN = "";
        this.Biokey_TemplateCount = 0;
        // this.qDebug("数量：" + this.Biokey_Count);
        // this.qDebug("下标" + this.Biokey_Indx);
        // this.qDebug("序列号：" + this.Biokey_SensorSN);
        // this.qDebug("DB句柄：" + this.Biokey_DBHandle);
        // this.qDebug("内存指纹数量：" + this.Biokey_TemplateCount);
    }
    //开始注册指纹
    Biokey.prototype.startReg = function (count) {
        count = count || 3;
        this.stopReg();
        try{
            this.object.EnrollCount = count;
            this.object.BeginEnroll();
            return true;
        }catch(e){
            this.qDebug(e);
            return false;
        }
    }
    //停止注册指纹
    Biokey.prototype.stopReg = function () {
        try{
            this.object.CancelEnroll();
            console.log(1, this.object.CancelEnroll())
            
            return true;
        }catch(e){
            this.qDebug(e);
            return false;
        }
    }
    //开始比对指纹
    Biokey.prototype.startVerify = function () {
        this.stopVerify();
        try{this.object.BeginCapture();return true;}catch(e){this.qDebug(e);return false;}
    }
    //停止比对指纹
    Biokey.prototype.stopVerify = function () {
        try{this.object.CancelCapture();return true;}catch(e){this.qDebug(e);return false;}
    }
    //添加内存指纹
    Biokey.prototype.addTemplateStr = function (id,finger) {
        var iRet = 0;
        try { iRet = this.object.AddRegTemplateStrToFPCacheDB(this.object.Biokey_DBHandle,id,finger); } catch (e) { }
        if(iRet>0)this.Biokey_TemplateCount++;
        return (iRet>0)?true:false;
    }
    //移除内存指纹
    Biokey.prototype.removeTemplateStr = function (id) {
        var iRet = 0;
        try { iRet = this.object.RemoveRegTemplateFromFPCacheDB(this.Biokey_DBHandle,id); } catch (e) { }
        if(iRet>0) {
            this.Biokey_TemplateCount--;
        }
        return (iRet>0)?true:false;
    }

    // 简写
    Biokey.prototype.on = Biokey.prototype.onEvent;
    Biokey.prototype.remove = Biokey.prototype.removeEvent;
    Biokey.prototype.emit = Biokey.prototype.emitEvent;

    window.BiokeyFunc = function (nodeId) {
        return new Biokey(nodeId);
    }
})();
window.biokey = BiokeyFunc('Biokey');
var BiokeyNODE = window.biokey.object;
// window.onunload = function() {
//     window.biokey.dispose();
// };
//监听组合按键CTRL+D,输出和不输出调试信息到界面上
document.onkeydown = function(e) {
    var keyCode = e.keyCode || e.which || e.charCode;
    var ctrlKey = e.ctrlKey || e.metaKey;
    if(ctrlKey && keyCode == 68) {
      biokey.debug = !biokey.debug;
      e.preventDefault();
    return false;
    }
}
