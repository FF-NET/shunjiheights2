(() => {
    // 캐릭터의 체력바를 그리는 함수
    function drawCharacterHealth(characterId) {
        // 그래픽 컨텍스트 가져오기
        const context = Graphics._renderer && Graphics._renderer.context;
        if (!context) return; // 그래픽 컨텍스트가 유효하지 않은 경우 처리

        // 캐릭터를 가져옵니다.
        const character = $gameMap.event(characterId);
        if (!character || character.hp <= 0) return; // 캐릭터가 유효하지 않거나 체력이 0 이하인 경우 처리

        // 화면의 중심 좌표 계산
        const screenWidth = Graphics.width;
        const screenHeight = Graphics.height;
        const centerX = screenWidth / 2;
        const centerY = screenHeight / 2;

        // 체력바를 그릴 위치 계산
        const width = 100; // 체력바의 기본 폭
        const height = 10; // 체력바의 높이
        const x = centerX - width / 2;
        const y = centerY - height / 2;

        // 캐릭터의 현재 체력과 최대 체력을 가져옵니다.
        const currentHealth = character.hp;
        const maxHealth = character.mhp;

        // 현재 체력에 따른 체력바의 폭 계산
        const healthBarWidth = (currentHealth / maxHealth) * width;

        // 체력바를 그립니다.
        context.save();
        context.fillStyle = '#ff0000'; // 체력바의 색상을 설정합니다. 여기에서는 빨간색으로 설정하였습니다.
        context.fillRect(x, y, width, height); // 기본 체력바를 그립니다.
        context.fillStyle = '#00ff00'; // 현재 체력에 따른 체력바의 색상을 설정합니다. 여기에서는 초록색으로 설정하였습니다.
        context.fillRect(x, y, healthBarWidth, height); // 현재 체력에 따른 체력바를 그립니다.
        context.restore();
    }

    // 맵이 로드될 때 실행되는 함수
    const _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
    Scene_Map.prototype.createSpriteset = function() {
        _Scene_Map_createSpriteset.call(this);
        // 여기에서 체력바를 그리는 함수를 호출합니다.
        // 현재 파티의 리더(주요 캐릭터)의 ID를 가져와 체력바를 그립니다.
        drawCharacterHealth($gameParty.leader().actorId());
    };
})();
