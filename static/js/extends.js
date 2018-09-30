(function (window) {
    // 自定义Set替换构造函数
    window.ISet = (function (arr) {
        function ISet (arr) {
            this.arr = [];
            this.size = 0;
            if (arr instanceof Array) {
                this.arr = arr.concat();
                this.size = arr.length;                
            }
        }
        ISet.prototype._setSize = function () {
            this.size = this.arr.length;
        }
        ISet.prototype._removeDuplicate = function (value) {
            if (!this.has(value)) {
                this.arr.push(value);
            }
        }

        ISet.prototype.add = function (value) {
            if (value === void 0) {
                console.warn('value is empty');
                return;
            }
            this._removeDuplicate(value);
            this._setSize();
            return this.getData();
        }
        ISet.prototype.has = function (value) {
            if (value === void 0) {
                return false;
            }
            return this.arr.indexOf(value) !== -1;
        }
        ISet.prototype.delete = function (value) {
            if (!this.has(value)) {
                return false;
            }
            this.arr.splice(this.arr.indexOf(value), 1);
            this._setSize();
            return true;
        }
        ISet.prototype.clear = function () {
            this.arr = [];
            this._setSize();
        }
        ISet.prototype.getData = function () {
            return this.arr.concat();
        }
        return ISet;
    })();
})(window)