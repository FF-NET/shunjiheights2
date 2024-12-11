/*:
 * @plugindesc Automatically applies fade-in, fade-out effects and ensures all pictures are displayed above UI elements.
 * @author ChatGPT
 */

(function() {

    // 새로운 메소드 추가: 그림의 페이드인 및 페이드아웃 효과
    Game_Picture.prototype.fadeIn = function(duration) {
        this._fadeInDuration = duration;
        this._fadeOutDuration = 0;
        this._targetOpacity = 255;
    };

    Game_Picture.prototype.fadeOut = function(duration) {
        this._fadeOutDuration = duration;
        this._fadeInDuration = 0;
        this._targetOpacity = 0;
    };

    // 기존 update 메소드 확장: 페이드인/페이드아웃 효과 적용
    var _Game_Picture_update = Game_Picture.prototype.update;
    Game_Picture.prototype.update = function() {
        _Game_Picture_update.call(this);

        if (this._fadeInDuration > 0) {
            var d = this._fadeInDuration;
            this._opacity = (this._opacity * (d - 1) + this._targetOpacity) / d;
            this._fadeInDuration--;
        } else if (this._fadeOutDuration > 0) {
            var d = this._fadeOutDuration;
            this._opacity = (this._opacity * (d - 1) + this._targetOpacity) / d;
            this._fadeOutDuration--;
        }
    };

    // 기존 showPicture 함수 백업
    var _Game_Screen_showPicture = Game_Screen.prototype.showPicture;
    Game_Screen.prototype.showPicture = function(pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode) {
        // 투명도를 0으로 설정하여 처음에 보이지 않게 함
        _Game_Screen_showPicture.call(this, pictureId, name, origin, x, y, scaleX, scaleY, 0, blendMode);
        
        // 그림을 페이드인 시킴 (60 프레임 동안)
        this.picture(pictureId).fadeIn(30);

        // 그림을 최상단에 표시하기 위해 Sprite_Picture를 UI 위로 이동
        if (SceneManager._scene._spriteset) {
            var sprite = SceneManager._scene._spriteset._pictureContainer.children[pictureId - 1];
            SceneManager._scene.addChild(sprite);
        }
    };

    // 기존 erasePicture 함수 백업
    var _Game_Screen_erasePicture = Game_Screen.prototype.erasePicture;
    Game_Screen.prototype.erasePicture = function(pictureId) {
        var picture = this.picture(pictureId);
        if (picture) {
            // 그림을 페이드아웃 시킴 (60 프레임 동안)
            picture.fadeOut(30);

            // 페이드아웃 후 그림을 삭제하도록 딜레이 추가
            setTimeout(function() {
                _Game_Screen_erasePicture.call(this, pictureId);
            }.bind(this), 1000); // 60프레임 동안 페이드아웃 후 삭제
        }
    };

    // Sprite_Picture의 업데이트 함수 확장
    var _Sprite_Picture_update = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        _Sprite_Picture_update.call(this);
        if (this.picture()) {
            this.z = 9999; // 모든 그림의 z 값을 9999로 설정하여 최상단에 표시
        }
    };

})();
