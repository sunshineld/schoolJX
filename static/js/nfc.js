(function(){
    function nfcFunc() {
        try{
            this.object = new ActiveXObject("myActiveX.PcscActiveX");
        }catch(e) {}
        this.dynSQL = "";
        this.lastCode = "";
        this.currentCode = "";
        this.times = 0;
    }
    nfcFunc.prototype.init = function() {
        var isNFC = false;
        if (this.object != null) {
            isNFC = true;
        }   
        return isNFC;
    }
    nfcFunc.prototype.read = function() {
        try {
            console.log("开始读卡。。。。。。")
            this.dynSQL = this.object.ConnectToReader("ACS ACR122 0");
            this.dynSQL = this.object.Transmit("FFCA000000", 5, 6).replace(/ /g, "");
            console.log("----------",this.dynSQL);
            if (this.dynSQL.length >= 12 && this.dynSQL.substring(this.dynSQL.length - 4) == "9000") {
                this.dynSQL = this.dynSQL.substring(0, this.dynSQL.length - 4);
            }
            return this.dynSQL;
        } catch(e) {}
    }
    window.nfc = function() {
        return new nfcFunc();
    }
})();
window.NFC = nfc();
window.onunload = function() {
    if(window.NFC.object != null) {
        window.NFC.object = null;
    }
}
var nfcObject = window.NFC.object;