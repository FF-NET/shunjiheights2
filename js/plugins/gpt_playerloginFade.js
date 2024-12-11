/*:
 * @plugindesc Adds a white fade-in and fade-out effect when the player enters the map for the first time, prevents movement for the first 3 seconds, and initializes variables and switches.
 * @author YourName
 */

(function() {
    window.isFirstLogin = true; // 처음 로그인인지 확인하는 플래그를 전역 변수로 설정

    // Scene_Map의 초기화 함수 수정
    
    var _Scene_Map_prototype_initialize = Scene_Map.prototype.initialize;
    Scene_Map.prototype.initialize = function() {
        if (isFirstLogin) {
            // 초기화 시점에서 화면을 하얗게 덮음
            
            $gameScreen.startTint([255, 255, 255, 255], 0);  // 즉시 흰색으로 덮음
        }
        _Scene_Map_prototype_initialize.call(this);
        
    };

    // Scene_Map의 start 함수 수정
    var _Scene_Map_prototype_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_prototype_start.call(this);

        if (isFirstLogin) {
            isFirstLogin = false; // 첫 로그인이 완료된 후 플래그를 false로 설정

            // 3초 동안 움직이지 못하게 설정
                        // 플레이어의 움직임을 막기 위해 일시적으로 입력을 비활성화
                        $gamePlayer._canMove = false;

            setTimeout(() => {
                // 플레이어를 특정 맵의 15, 15 위치로 이동하고 페이드아웃
                const mapId = 1; // 이동할 맵 ID를 설정
                const x = 17;
                const y = 13;
                $gamePlayer.reserveTransfer(mapId, x, y, $gamePlayer.direction(), 0);
                
                // 60프레임 동안 흰색에서 원래 화면으로 페이드아웃
                $gameScreen.startTint([0, 0, 0, 0], 60);
                
                // 3초 후에 캐릭터를 다시 움직일 수 있게 설정
                setTimeout(() => {
                    $gamePlayer._canMove = true;
                }, 3000);
            }, 1000); // 1초 대기 후 실행

            // 모든 변수 초기화
            for (let i = 1; i < $dataSystem.variables.length; i++) {
                $gameVariables.setValue(i, 0);
            }

            // 모든 스위치 초기화
            for (let i = 1; i < $dataSystem.switches.length; i++) {
                $gameSwitches.setValue(i, false);
            }

            // 게임 맵상의 모든 NPC 이벤트 초기화
            if ($gameMap) {
                $gameMap.events().forEach(function(event) {
                    if (event) {
                        event.refresh();  // 각 이벤트를 새로 고침하여 상태를 초기화
                    }
                });

                // 미니맵 갱신을 위해 모든 마커 제거 후 다시 생성
                if (SceneManager._scene instanceof Scene_Map) {
                    SceneManager._scene.forceRefresh();  // 미니맵 마커들을 다시 생성하여 갱신
                }
            }
        }
    };
})();
