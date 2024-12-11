(function() {
    var _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createExpBars();
    };

    Scene_Map.prototype.createExpBars = function() {
        this._expBars = [];
        if ($gameParty.members().length > 1) { // 플레이어를 제외한 파티 멤버가 있을 경우에만 생성
            for (let i = 1; i < $gameParty.members().length; i++) { // 1번 인덱스부터 시작하여 플레이어를 제외한 파티원 처리
                let actor = $gameParty.members()[i];
                let expBar = new Sprite_ExpBar(actor);
                this._spriteset.addChild(expBar); // 스프라이트셋에 Exp 바 추가
                this._expBars.push(expBar);
            }
        }
    };

    // Sprite_ExpBar 정의
    function Sprite_ExpBar() {
        this.initialize.apply(this, arguments);
    }

    Sprite_ExpBar.prototype = Object.create(Sprite.prototype);
    Sprite_ExpBar.prototype.constructor = Sprite_ExpBar;

    Sprite_ExpBar.prototype.initialize = function(actor) {
        Sprite.prototype.initialize.call(this);
        this._actor = actor; // 특정 액터를 받아서 설정
        this._segments = 5; // Exp 바를 5개의 칸으로 나눔
        this._segmentWidth = Math.floor(40 / 1 / this._segments); // 각 칸의 너비 설정 (전체 너비 기준)
        this.bitmap = new Bitmap(this._segmentWidth * this._segments, 6); // Exp 바를 그릴 비트맵 크기 설정
        this.update();
    };

    Sprite_ExpBar.prototype.update = function() {
        Sprite.prototype.update.call(this);
        if ($gameParty.members().length > 1) { // 파티에 플레이어를 제외한 멤버가 있을 경우에만 업데이트
            this.updatePosition();
            this.updateExp();
        } else {
            if (this.parent) {
                this.parent.removeChild(this); // 파티 멤버가 없어지면 Exp 바 제거
            }
        }
    };

    Sprite_ExpBar.prototype.updatePosition = function() {
        if ($gameParty.members().length <= 1) return; // 플레이어를 제외한 파티 멤버가 없을 경우 위치 업데이트 중단

        var screenX, screenY;
        var index = $gameParty.members().indexOf(this._actor);

        if (index > 0) { // 플레이어를 제외한 파티원에 대해서만 위치 설정
            var followerIndex = index - 1;
            screenX = $gamePlayer._followers.follower(followerIndex).screenX(); // 팔로워의 화면 X 좌표
            screenY = $gamePlayer._followers.follower(followerIndex).screenY(); // 팔로워의 화면 Y 좌표

            this.x = screenX - this.width / 2; // Exp 바의 X 좌표를 팔로워의 X 좌표에 맞춤
            this.y = screenY - 70; // Exp 바의 Y 좌표를 팔로워의 머리 위로 설정
        }
    };

    Sprite_ExpBar.prototype.updateExp = function() {
        this.bitmap.clear();
        if (this._actor) {
            var currentExp = this._actor.currentExp();
            var nextLevelExp = this._actor.nextLevelExp();
            var rate = currentExp / nextLevelExp; // 경험치 비율 계산
            var filledSegments = Math.floor(rate * this._segments); // 채워질 칸 수 계산
            this.drawBackground();
            this.drawSegments(filledSegments);
            this.drawBorder(); // 테두리 그리기
        }
    };

    Sprite_ExpBar.prototype.drawBackground = function() {
        var width = this.bitmap.width; // 배경의 너비
        var height = this.bitmap.height; // 배경의 높이
        var color = 'rgba(0, 0, 0, 0.5)'; // 반투명 검은색

        // Exp 바 배경 그리기
        this.bitmap.fillRect(0, 0, width, height, color);
    };

    Sprite_ExpBar.prototype.drawSegments = function(filledSegments) {
        var color = '#00ff00'; // 채워진 칸의 색상 (초록색)
        var emptyColor = '#404040'; // 빈 칸의 색상 (회색)

        for (var i = 0; i < this._segments; i++) {
            var x = i * this._segmentWidth + 1;
            if (i < filledSegments) {
                this.bitmap.fillRect(x, 1, this._segmentWidth - 2, this.bitmap.height - 2, color);
            } else {
                this.bitmap.fillRect(x, 1, this._segmentWidth - 2, this.bitmap.height - 2, emptyColor);
            }
        }
    };

    Sprite_ExpBar.prototype.drawBorder = function() {
        var context = this.bitmap._context;
        context.strokeStyle = '#000000'; // 검은색 테두리
        context.lineWidth = 1; // 테두리 두께
        context.strokeRect(0, 0, this.bitmap.width, this.bitmap.height); // 테두리 그리기
        this.bitmap._baseTexture.update(); // 텍스처 갱신
    };

    // 파티 멤버 변경 시 Exp 바 업데이트
    var _Game_Party_addActor = Game_Party.prototype.addActor;
    Game_Party.prototype.addActor = function(actorId) {
        _Game_Party_addActor.call(this, actorId);
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager._scene.createExpBars(); // 파티 멤버 추가 시 Exp 바 생성
        }
    };

    var _Game_Party_removeActor = Game_Party.prototype.removeActor;
    Game_Party.prototype.removeActor = function(actorId) {
        _Game_Party_removeActor.call(this, actorId);
        if (SceneManager._scene instanceof Scene_Map) {
            if (SceneManager._scene._expBars) {
                SceneManager._scene._expBars.forEach(function(expBar) {
                    expBar.parent.removeChild(expBar); // 파티 멤버가 없으면 Exp 바 제거
                });
                SceneManager._scene._expBars = [];
            }
            if ($gameParty.members().length > 1) {
                SceneManager._scene.createExpBars(); // 파티 멤버가 남아있으면 새로운 Exp 바 생성
            }
        }
    };

})();
