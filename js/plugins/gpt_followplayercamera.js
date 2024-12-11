(function() {
    Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
        var x = this._realX;
        var y = this._realY;
        
        // 화면 크기에 따른 중앙 위치
        var centerX = Math.floor(Graphics.width / $gameMap.tileWidth() / 2);
        var centerY = Math.floor(Graphics.height / $gameMap.tileHeight() / 2);

        // 중앙에서 벗어난 범위 (2 타일 정도의 여유)
        var margin = 2;

        // 플레이어가 중앙에서 얼마나 벗어나 있는지 계산
        if (x < $gameMap.displayX() + centerX - margin) {
            $gameMap.scrollLeft($gameMap.displayX() + centerX - margin - x);
        } else if (x > $gameMap.displayX() + centerX + margin) {
            $gameMap.scrollRight(x - ($gameMap.displayX() + centerX + margin));
        }

        if (y < $gameMap.displayY() + centerY - margin) {
            $gameMap.scrollUp($gameMap.displayY() + centerY - margin - y);
        } else if (y > $gameMap.displayY() + centerY + margin) {
            $gameMap.scrollDown(y - ($gameMap.displayY() + centerY + margin));
        }
    };
})();
