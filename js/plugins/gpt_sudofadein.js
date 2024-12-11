(function() {
    if (isFirstLogin) {
    var _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        // 흰색으로 화면 덮기
        this._whiteScreen = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        this._whiteScreen.bitmap.fillAll('black'); // 흰색으로 변경
        this._whiteScreen.opacity = 255;
        this.addChild(this._whiteScreen);

        // 3초 후에 페이드아웃 시작
        setTimeout(() => {
            var fadeOutSpeed = 2; // 페이드아웃 속도 (숫자가 작을수록 느림)
            var fadeOutInterval = setInterval(() => {
                this._whiteScreen.opacity -= fadeOutSpeed;
                if (this._whiteScreen.opacity <= 0) {
                    this.removeChild(this._whiteScreen); // 페이드아웃이 완료되면 흰색 화면 제거
                    clearInterval(fadeOutInterval);
                }
            }, 16); // 프레임마다 업데이트 (약 60FPS)
        }, 2000); // 3초 후에 페이드아웃 시작
    };
}
})();
