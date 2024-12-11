(function() {
    var _Window_Message_update = Window_Message.prototype.update;
    Window_Message.prototype.update = function() {
        _Window_Message_update.call(this);
        if (this._isShakeEffectRequested()) {
            this._shakeEffect = { powerX: 5, powerY: 5, duration: 30 };
        }
        this.updateShakeEffect();
    };

    Window_Message.prototype._isShakeEffectRequested = function() {
        var speaker = $gameMessage.speakerName();
        return speaker && speaker[0] === 'S';
    };

    Window_Message.prototype.updateShakeEffect = function() {
        if (this._shakeEffect) {
            this._shakeEffect.duration--;
            if (this._shakeEffect.duration > 0) {
                this.x += Math.randomInt(this._shakeEffect.powerX) - (this._shakeEffect.powerX / 2);
                this.y += Math.randomInt(this._shakeEffect.powerY) - (this._shakeEffect.powerY / 2);
            } else {
                this._shakeEffect = null;
                this.returnToDefaultPosition(); // 대화가 끝나면 원래의 위치로 돌아가도록 함
            }
        }
    };

    Window_Message.prototype.returnToDefaultPosition = function() {
        this.x = Graphics.boxWidth / 2 - this.width / 2;
        this.y = Graphics.boxHeight - this.height;
    };
})();
