/*:
 * @target MZ
 * @plugindesc Adds a volume control button to the bottom right corner of the game screen. Clicking the button will reduce the game volume step by step.
 * @author ChatGPT
 *
 * @help This plugin adds a small icon to the bottom right corner of the screen.
 * Clicking this icon will reduce the game's volume in steps: 100%, 75%, 50%, 25%, and 0%.
 */

(function() {
    let clickCount = 0;
    const volumeLevels = [1, 0.75, 0.5, 0.25, 0]; // 100%, 75%, 50%, 25%, 0% (mute)
    
    // 아이콘 경로를 배열로 설정 (각각의 볼륨에 대응)
    const iconPaths = [
        'img/icon/sound100.png', // 100% 아이콘
        'img/icon/sound75.png',  // 75% 아이콘
        'img/icon/sound50.png',  // 50% 아이콘
        'img/icon/sound25.png',  // 25% 아이콘
        'img/icon/sound0.png'    // 0% (음소거) 아이콘
    ];
    
    // Create and style the mute button icon
    const muteIcon = new Image();
    muteIcon.src = iconPaths[0]; // 초기 아이콘 경로 (100% 볼륨)
    muteIcon.style.position = 'absolute';
    muteIcon.style.bottom = '10px';
    muteIcon.style.right = '10px';
    muteIcon.style.width = '56px';
    muteIcon.style.height = '56px';
    muteIcon.style.zIndex = '1000';
    muteIcon.style.cursor = 'pointer';
    muteIcon.style.opacity = '0';  // 초기 투명도 (완전히 투명)
    muteIcon.style.transition = 'opacity 1s ease';  // 1초 동안 페이드인 효과
    muteIcon.title = 'Click to adjust volume';

    document.body.appendChild(muteIcon);

    // 3초 후 페이드인 효과
    setTimeout(function() {
        muteIcon.style.opacity = '1';  // 완전히 불투명하게 설정
    }, 3000); // 3000 밀리초 = 3초 후에 페이드인 시작

    muteIcon.addEventListener('click', function(event) {
        // Prevent character movement
        event.stopPropagation();
        event.preventDefault();

        clickCount = (clickCount + 1) % volumeLevels.length;
        const newVolume = volumeLevels[clickCount];
        
        // Adjust BGM, BGS, ME, and SE volumes
        AudioManager.bgmVolume = newVolume * 100;
        AudioManager.bgsVolume = newVolume * 100;
        AudioManager.meVolume = newVolume * 100;
        AudioManager.seVolume = newVolume * 100;

        console.log(`Volume set to ${newVolume * 100}%`);

        // Change the icon to reflect the current volume level
        muteIcon.src = iconPaths[clickCount];
    });

    // Prevent the game map from processing the click
    muteIcon.addEventListener('mousedown', function(event) {
        event.stopPropagation();
        event.preventDefault();
        TouchInput._onMouseDown = function() {};
    });

    muteIcon.addEventListener('mouseup', function(event) {
        event.stopPropagation();
        event.preventDefault();
        TouchInput._onMouseUp = function() {};
    });

})();
