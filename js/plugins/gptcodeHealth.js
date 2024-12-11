(function() {
    var _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createPlayerHealthWindow();
    };

    Scene_Map.prototype.createPlayerHealthWindow = function() {
        this._playerHealthWindow = new Window_PlayerHealth();
        this.addChild(this._playerHealthWindow);
    };

    function Window_PlayerHealth() {
        this.initialize.apply(this, arguments);
    }

    Window_PlayerHealth.prototype = Object.create(Window_Base.prototype);
    Window_PlayerHealth.prototype.constructor = Window_PlayerHealth;

    Window_PlayerHealth.prototype.initialize = function() {
        var width = this.windowWidth();
        var height = this.windowHeight();
        var x = (Graphics.width - width) / 2;
        var y = 680; // Graphics.height / 2 - height / 2;
        Window_Base.prototype.initialize.call(this, new Rectangle(x, y, width, height));
        this._actor = $gameParty.leader();
        this._hpBarWidth = Math.floor((width - 20) / 3); // 너비를 3분의 1로 설정
        this.createBackground(); // 배경 생성
        this.refresh();
    };

    Window_PlayerHealth.prototype.windowWidth = function() {
        return 300;
    };

    Window_PlayerHealth.prototype.windowHeight = function() {
        return this.fittingHeight(1); // 높이를 1줄로 변경
    };

    Window_PlayerHealth.prototype.createBackground = function() {
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = new Bitmap(this.width, this.height);
        this._backgroundSprite.bitmap.fillAll('#3f74fa'); // 배경 색상 변경
        this.addChildToBack(this._backgroundSprite);
    };

    Window_PlayerHealth.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (this._actor.hp !== this._lastHp) {
            this.refresh();
        }
    };

    Window_PlayerHealth.prototype.refresh = function() {
        this.contents.clear();

        // 숫자와 그래프를 함께 표시
        var text = this._actor.name() + "'s HP: " + this._actor.hp + "/" + this._actor.mhp;
        var rate = this._actor.hp / this._actor.mhp;
        var fillW = Math.floor(this._hpBarWidth * rate);

        // 텍스트를 그립니다. 왼쪽 여백을 3px 주도록 수정
        this.drawText(text, 5, 0, this.contents.width, 'left');

        // 그래프를 텍스트 옆에 그립니다.
        var gaugeX = this.textWidth(text) + 15; // 텍스트의 폭에 맞게 조정
        var gaugeY = 0; // 위로 5px만큼 이동
        this.drawGauge(gaugeX, gaugeY, this._hpBarWidth, rate, '#ff0000', '#ffffff');

        this._lastHp = this._actor.hp;
    };

    Window_PlayerHealth.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
        var fillW = Math.floor(width * rate);
        var gaugeHeight = 12; // 그래프 게이지의 두께를 2배로 설정
        var gaugeY = y + (this.lineHeight() - gaugeHeight) / 2; // 중앙 정렬을 위해 y 위치 조정

        // 검은색 테두리 선 그리기
        this.contents.fillRect(x - 1, gaugeY - 1, width + 2, gaugeHeight + 2, '#000000');
        
        // 게이지 그리기
        this.contents.fillRect(x, gaugeY, width, gaugeHeight, '#000000');
        this.contents.gradientFillRect(x, gaugeY, fillW, gaugeHeight, color1, color2);
    };
})();
