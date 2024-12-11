(function() {
    var _Scene_Map_prototype_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_prototype_start.call(this);

        if (isFirstLogin) {
            // 첫 로그인일 때는 1초 대기 후 네임태그 생성
            setTimeout(() => {
                this.createNpcNameLabels(true); // 첫 로그인일 경우 페이드인 애니메이션 적용
            }, 1060); // 페이드아웃 후 이름표 생성 (60프레임 = 1초 후)
        } else {
            // 첫 로그인 이후에는 바로 네임태그 생성 (페이드인 없음)
            this.createNpcNameLabels(false);
        }
    };

    Scene_Map.prototype.createNpcNameLabels = function(withFadeIn) {
        this._npcNameLabels = [];
        var events = $gameMap.events(); // 맵의 모든 이벤트(NPC 포함)를 가져옴
        for (var i = 0; i < events.length; i++) {
            var npcName = events[i].event().name; // 이벤트의 이름을 NPC의 이름으로 사용
            if (npcName && npcName !== "Custom Event" && !npcName.match(/^\[.*\]$/) && !npcName.match(/^\{.*\}$/)) {
                // 이름이 "Custom Event"가 아니고 [] 또는 {}로 감싸져 있지 않은 경우에만 네임태그 생성
                var nameLabel = new Sprite_NameLabel(npcName, events[i], withFadeIn);
                this._spriteset._tilemap.addChild(nameLabel); // Spriteset_Map의 타일맵 위에 이름표 추가
                this._npcNameLabels.push(nameLabel); // 이름표 스프라이트를 배열에 저장
            }
        }
    };

    function Sprite_NameLabel() {
        this.initialize.apply(this, arguments);
    }

    Sprite_NameLabel.prototype = Object.create(Sprite.prototype);
    Sprite_NameLabel.prototype.constructor = Sprite_NameLabel;

    Sprite_NameLabel.prototype.initialize = function(npcName, event, withFadeIn) {
        Sprite.prototype.initialize.call(this);
        this._name = npcName; // NPC의 이름으로 설정
        this._event = event; // 이벤트 객체 저장 (NPC 위치 추적용)
        this.bitmap = new Bitmap(200, 24); // 이름을 그릴 비트맵 크기 설정
        this.bitmap.fontFace = Window_Base.prototype.standardFontFace; // 기본 시스템 폰트 설정
        this.bitmap.fontSize = 12; // 폰트 크기 설정
        this.bitmap.textColor = "#ffffff"; // 폰트 색상 설정
        this.opacity = 0; // 처음에는 투명하게 설정

        this.updatePosition();
        this.updateText();

        if (withFadeIn) {
            this.fadeIn(); // 페이드인 애니메이션 시작
        } else {
            this.opacity = 255; // 페이드인이 없을 경우 바로 완전 불투명으로 설정
        }
    };

    Sprite_NameLabel.prototype.fadeIn = function() {
        var fadeSpeed = 5; // 투명도 증가 속도 (프레임당 5씩 증가)

        var fadeInterval = setInterval(() => {
            this.opacity += fadeSpeed;
            if (this.opacity >= 255) {
                this.opacity = 255;
                clearInterval(fadeInterval); // 투명도가 최대치에 도달하면 애니메이션 종료
            }
        }, 16); // 약 60FPS로 16ms마다 호출
    };

    Sprite_NameLabel.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updatePosition();
        this.updateText();
    };

    Sprite_NameLabel.prototype.updatePosition = function() {
        var screenX = this._event.screenX(); // NPC의 화면 X 좌표
        var screenY = this._event.screenY(); // NPC의 화면 Y 좌표
        this.x = screenX - this.bitmap.width / 2; // 이름표의 X 좌표를 NPC의 X 좌표에 맞춤
        this.y = screenY; // 
    };

    Sprite_NameLabel.prototype.updateText = function() {
        this.bitmap.clear();
        var textWidth = this.bitmap.measureTextWidth(this._name); // 이름의 실제 너비 계산
        var textHeight = this.bitmap.fontSize + 8; // 텍스트 높이를 계산하여 배경 높이에 사용
        this.drawBackground(textWidth, textHeight);
        var x = (this.bitmap.width - textWidth) / 2; // 텍스트의 중앙 X 좌표 계산
        var y = (this.bitmap.height - textHeight) / 2; // 텍스트의 중앙 Y 좌표 계산
        this.bitmap.drawText(this._name, x, y, textWidth, textHeight, 'left'); // 텍스트를 중앙에 그리기
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
