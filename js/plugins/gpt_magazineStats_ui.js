(function() {
    var _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createStatBars(); // 스탯 바 추가
    };

    Scene_Map.prototype.createStatBars = function() {
        this._statBars = [];

        // 4개의 새 스탯
        var stats = ['popularity', 'novelty', 'maniac', 'sensitivity', 'worldview'];
        var startX = Graphics.width - 110; // 우측 상단에서 시작할 X 좌표
        var startY = 10; // 상단에서 시작할 Y 좌표

        // 파티 리더를 제외한 첫 번째 파티원에 대해 스탯 바 생성
        if ($gameParty.members().length > 1) { // 리더를 제외한 파티원이 존재할 때만 실행
            var actor = $gameParty.members()[1]; // 리더를 제외한 첫 번째 파티원
            for (var i = 0; i < stats.length; i++) {
                var statBar = new Sprite_StatBar(actor, stats[i]);
                statBar.x = startX; // 우측 정렬
                statBar.y = startY + i * 25; // 상단에서 수직으로 정렬
                statBar.opacity = 225; // 기본 투명도 50%
                this._spriteset.addChild(statBar);
                this._statBars.push(statBar);
            }
        }
    };

    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this.updateStatBarsOpacity(); // 플레이어가 움직일 때마다 투명도 업데이트
    };

    Scene_Map.prototype.updateStatBarsOpacity = function() {
        var playerX = $gamePlayer.screenX();
        var playerY = $gamePlayer.screenY();

        for (var i = 0; i < this._statBars.length; i++) {
            var statBar = this._statBars[i];
            var dx = Math.abs(statBar.x + statBar.width / 2 - playerX);
            var dy = Math.abs(statBar.y + statBar.height / 2 - playerY);
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) { // 플레이어가 가까이 다가왔을 때
                statBar.opacity = Math.max(38, statBar.opacity - 5); // 투명도를 서서히 낮춤 (15%로)
            } else {
                statBar.opacity = Math.min(225, statBar.opacity + 5); // 기본 투명도로 되돌림 (50%)
            }
        }
    };

    // Sprite_StatBar 정의
    function Sprite_StatBar(actor, statName) {
        this.initialize.apply(this, arguments);
    }

    Sprite_StatBar.prototype = Object.create(Sprite.prototype);
    Sprite_StatBar.prototype.constructor = Sprite_StatBar;

    Sprite_StatBar.prototype.initialize = function(actor, statName) {
        Sprite.prototype.initialize.call(this);
        this._actor = actor;
        this._statName = statName;
        this._segments = 5; // 스탯 바를 5개의 칸으로 나눔
        this._segmentWidth = Math.floor(50 / this._segments); // 각 칸의 너비 설정
        this.bitmap = new Bitmap(this._segmentWidth * this._segments + 50, 24); // 스탯 바를 그릴 비트맵 크기 설정 (텍스트 영역 포함)
        this.refresh();
    };

    Sprite_StatBar.prototype.refresh = function() {
        this.bitmap.clear();
        this.updateStat();
        this.drawStatName();
    };

    Sprite_StatBar.prototype.updateStat = function() {
        var value = this._actor[this._statName]();
        var rate = value / 100; // 스탯 비율 계산
        var filledSegments = Math.floor(rate * this._segments); // 채워질 칸 수 계산
        this.drawBackground();
        this.drawSegments(filledSegments);
        this.drawBorder(); // 테두리 그리기
    };

    Sprite_StatBar.prototype.drawBackground = function() {
        var width = this.bitmap.width - 50; // 배경의 너비 (텍스트 영역 제외)
        var height = this.bitmap.height - 14; // 배경의 높이 (텍스트 영역 제외)
        var color = 'rgba(0, 0, 0, 0.5)'; // 반투명 검은색

        // 스탯 바 배경 그리기
        this.bitmap.fillRect(50, 14, width, height, color);
    };

    Sprite_StatBar.prototype.drawSegments = function(filledSegments) {
        var color = '#00ff00'; // 채워진 칸의 색상 (초록색)
        var emptyColor = '#404040'; // 빈 칸의 색상 (회색)
        var radius = 1; // 둥근 모서리를 위한 반지름 설정

        for (var i = 0; i < this._segments; i++) {
            var x = 50 + i * this._segmentWidth + 1;
            var isFilled = i < filledSegments;
            var segmentColor = isFilled ? color : emptyColor;

            if (i === 0) {
                // 첫 번째 칸은 좌측만 둥글게
                this.bitmap.drawRoundRect(x, 15, this._segmentWidth - 2, this.bitmap.height - 16, radius, 0, 0, radius, segmentColor);
            } else if (i === this._segments - 1) {
                // 마지막 칸은 우측만 둥글게
                this.bitmap.drawRoundRect(x, 15, this._segmentWidth - 2, this.bitmap.height - 16, 0, radius, radius, 0, segmentColor);
            } else {
                // 나머지 칸은 일반 사각형
                this.bitmap.fillRect(x, 15, this._segmentWidth - 2, this.bitmap.height - 16, segmentColor);
            }
        }
    };

    Sprite_StatBar.prototype.drawBorder = function() {
        var context = this.bitmap._context;
        context.imageSmoothingEnabled = false; // 이미지 스무딩 해제
        context.strokeStyle = '#000000'; // 검은색 테두리
        context.lineWidth = 1; // 테두리 두께
        context.strokeRect(50, 14, this.bitmap.width - 50, this.bitmap.height - 14); // 테두리 그리기
        this.bitmap._baseTexture.update(); // 텍스처 갱신
    };

    Sprite_StatBar.prototype.drawStatName = function() {
        this.bitmap.fontSize = 12; // 폰트 크기 설정

        // 한글 표기를 위한 매핑
        var statNamesKor = {
            popularity: '화제성',
            novelty: '참신함',
            maniac: '매니악',
            sensitivity: '감수성',
            worldview: '세계관'
        };

        var statDisplayName = statNamesKor[this._statName] || this._statName;
        var yOffset = 10.5; // 텍스트의 Y 좌표를 더 내림으로써 텍스트와 게이지의 위치를 조정
        var textWidth = this.bitmap.measureTextWidth(statDisplayName); // 텍스트 너비 측정
    var textX = this.bitmap.width - 50 - textWidth - 5; // 50은 게이지의 시작 X 좌표, 5는 텍스트와 게이지 사이의 여백
    this.bitmap.drawText(statDisplayName, textX, yOffset, textWidth, 15, 'left');
    };

    Sprite_StatBar.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.refresh(); // 스탯 바를 매 프레임 업데이트
    };

    // 둥근 모서리를 위한 커스텀 함수 추가
    Bitmap.prototype.drawRoundRect = function(x, y, width, height, tlRadius, trRadius, brRadius, blRadius, color) {
        var context = this._context;
        context.save();
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(x + tlRadius, y);
        context.lineTo(x + width - trRadius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + trRadius);
        context.lineTo(x + width, y + height - brRadius);
        context.quadraticCurveTo(x + width, y + height, x + width - brRadius, y + height);
        context.lineTo(x + blRadius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - blRadius);
        context.lineTo(x, y + tlRadius);
        context.quadraticCurveTo(x, y, x + tlRadius, y);
        context.closePath();
        context.fill();
        context.restore();
        this._baseTexture.update(); // 텍스처 갱신
    };
})();
