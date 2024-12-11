(function() {
    var _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createNameLabel();
    };

    Scene_Map.prototype.createNameLabel = function() {
        this._nameLabel = new Sprite_NameLabel();
        this._spriteset.addChild(this._nameLabel); // Spriteset_Map에 이름표 추가
    };

    function Sprite_NameLabel() {
        this.initialize.apply(this, arguments);
    }

    Sprite_NameLabel.prototype = Object.create(Sprite.prototype);
    Sprite_NameLabel.prototype.constructor = Sprite_NameLabel;

    Sprite_NameLabel.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this._actor = $gameParty.members()[0]; // 첫 번째 파티 멤버 (주인공)으로 설정
        this._name = this._actor.name(); // 액터의 이름으로 설정
        this.bitmap = new Bitmap(200, 24); // 이름을 그릴 비트맵 크기 설정
        this.bitmap.fontFace = Window_Base.prototype.standardFontFace; // 기본 시스템 폰트 설정
        this.bitmap.fontSize = 12; // 폰트 크기 설정
        this.bitmap.textColor = "#ffffff"; // 폰트 색상 설정
        this.update();
    };

    Sprite_NameLabel.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updatePosition();
        this.updateText();
    };

    Sprite_NameLabel.prototype.updatePosition = function() {
        var screenX = $gamePlayer.screenX(); // 플레이어의 화면 X 좌표
        var screenY = $gamePlayer.screenY(); // 플레이어의 화면 Y 좌표
        this.x = screenX - this.width / 2; // 이름표의 X 좌표를 플레이어의 X 좌표에 맞춤
        this.y = screenY; // 이름표의 Y 좌표를 플레이어의 머리 위로 설정
    };

    Sprite_NameLabel.prototype.updateText = function() {
        this.bitmap.clear();
        var textWidth = this.bitmap.measureTextWidth(this._name); // 이름의 실제 너비 계산
        var textHeight = this.bitmap.fontSize + 8; // 텍스트 높이를 계산하여 배경 높이에 사용
        this.drawBackground(textWidth, textHeight);
        var x = (this.bitmap.width - textWidth) / 2; // 텍스트의 중앙 X 좌표 계산
        var y = (this.bitmap.height - textHeight) / 2; // 텍스트의 중앙 Y 좌표 계산
        this.bitmap.drawText(this._name, x, y, textWidth, textHeight, 'left'); // 중앙에 텍스트 그리기
    };

    Sprite_NameLabel.prototype.drawBackground = function(textWidth, textHeight) {
        var padding = 10; // 텍스트 양쪽에 여백을 추가
        var width = textWidth + padding * 2; // 텍스트 너비에 따라 배경 너비 동적 설정
        var height = textHeight; // 텍스트 높이에 맞게 배경 높이 설정
        var radius = height / 2; // 완전히 둥근 코너를 만들기 위해 높이의 절반으로 반지름 설정
        var color = 'rgba(0, 0, 0, 0.5)'; // 반투명 검은색

        // 중앙 정렬하여 둥근 네모 그리기
        this.bitmap.fillRoundRect((this.bitmap.width - width) / 2, (this.bitmap.height - height) / 2, width, height, radius, color);
    };

    Bitmap.prototype.fillRoundRect = function(x, y, width, height, radius, color) {
        var context = this._context;
        context.save();
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(x + width - radius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + radius);
        context.lineTo(x + width, y + height - radius);
        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        context.lineTo(x + radius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.closePath();
        context.fill();
        context.restore();
        this._baseTexture.update(); // 텍스처 갱신
    };
})();
