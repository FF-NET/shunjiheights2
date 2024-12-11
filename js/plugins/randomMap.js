(function() {
    'use strict';

    var randomMapIds = [6,7,8,9,10,11,12]; // 여기에 랜덤하게 이동할 맵의 ID를 넣어주세요.

    function getRandomMapId() {
        return randomMapIds[Math.floor(Math.random() * randomMapIds.length)];
    }

    function goToRandomMap() {
        var mapId = getRandomMapId();
        if ($gamePlayer) {
            $gamePlayer.reserveTransfer(mapId, 0, 0, 0, 2); // 여기서는 맵 ID를 기반으로 플레이어를 이동시킵니다.
            SceneManager.goto(Scene_Map);
        } else {
            setTimeout(goToRandomMap, 100); // $gamePlayer가 초기화될 때까지 대기
        }
    }

    // 게임 부팅 시 자동으로 호출되는 함수
    function bootRandomMap() {
        setTimeout(goToRandomMap, 100); // 게임 시작 후 잠시 후에 랜덤 맵으로 이동
    }

    bootRandomMap();
})();
