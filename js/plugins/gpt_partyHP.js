(function() {
    var _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createHpBar();
    };

    Scene_Map.prototype.createHpBar = function() {
        this._hpBar = new Sprite_HpBar();
        this._spriteset.addChild(this._hpBar); // 스프라이트셋에 체력바 추가
    };

    function Sprite_HpBar() {
        this.initialize.apply(this, arguments);
    }

    Sprite_HpBar.prototype = Object.create(Sprite.prototype);
    Sprite_HpBar.prototype.constructor = Sprite_HpBar;

    Sprite_HpBar.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this._actor = $gameParty.members()[0]; // 첫 번째 파티 멤버 (주인공)으로 설정
        this.bitmap = new Bitmap(40, 6); // 체력바를 그릴 비트맵 크기 설정
        this.update();
    };

    Sprite_HpBar.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updatePosition();
        this.updateHp();
    };

    Sprite_HpBar.prototype.updatePosition = function() {
        var screenX = $gamePlayer.screenX(); // 플레이어의 화면 X 좌표
        var screenY = $gamePlayer.screenY(); // 플레이어의 화면 Y 좌표
        this.x = screenX - this.width / 2; // 체력바의 X 좌표를 플레이어의 X 좌표에 맞춤
        this.y = screenY - 70; // 체력바의 Y 좌표를 플레이어의 머리 위로 설정
    };

    Sprite_HpBar.prototype.updateHp = function() {
        this.bitmap.clear();
        if (this._actor) {
            var hpRate = this._actor.hp / this._actor.mhp; // 체력 비율 계산
            var barWidth = Math.floor(hpRate * this.bitmap.width); // 체력바의 너비 계산
            this.drawBackground();
            this.bitmap.fillRect(1, 1, barWidth - 2, this.bitmap.height - 2, '#ff0000'); // 체력바 그리기 (빨간색)
            this.drawBorder(); // 테두리 그리기
        }
    };

    Sprite_HpBar.prototype.drawBackground = function() {
        var width = this.bitmap.width; // 배경의 너비
        var height = this.bitmap.height; // 배경의 높이
        var color = 'rgba(0, 0, 0, 0.5)'; // 반투명 검은색

        // 체력바 배경 그리기
        this.bitmap.fillRect(0, 0, width, height, color);
    };

    Sprite_HpBar.prototype.drawBorder = function() {
        var context = this.bitmap._context;
        context.strokeStyle = '#000000'; // 검은색 테두리
        context.lineWidth = 1; // 테두리 두께
        context.strokeRect(0, 0, this.bitmap.width, this.bitmap.height); // 테두리 그리기
        this.bitmap._baseTexture.update(); // 텍스처 갱신
    };
})();
