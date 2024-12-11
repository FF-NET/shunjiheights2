// 캐릭터 움직임 감지를 위한 이벤트 리스너를 등록합니다.
document.addEventListener('keydown', function(event) {
    // 방향키나 WASD 키를 눌렀을 때만 저장하도록 합니다.
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'w' || event.key === 'a' || event.key === 's' || event.key === 'd') {
        // 자동 저장을 실행합니다.
        SceneManager._scene.executeAutosave();
        // 세이브 데이터를 쿠키에 저장합니다.
        saveGameToCookie();
    }
});

// 게임을 쿠키에 저장하는 함수를 정의합니다.
function saveGameToCookie() {
    // 세이브 데이터를 쿠키에 저장합니다.
    const saveData = JSON.stringify($gameSystem);
    document.cookie = "autosaveData=" + saveData + "; path=/";
}

// 게임을 초기화하는 함수를 정의합니다.
function initializeGameFromCookie() {
    // 쿠키에서 세이브 데이터를 불러옵니다.
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith("autosaveData=")) {
            // 불러온 세이브 데이터를 게임 시스템에 적용합니다.
            $gameSystem = JSON.parse(cookie.substring("autosaveData=".length, cookie.length));
            break;
        }
    }
}

// 게임을 초기화합니다.
initializeGameFromCookie();
