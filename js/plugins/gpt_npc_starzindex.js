(function() {
    var _Game_CharacterBase_screenZ = Game_CharacterBase.prototype.screenZ;
    Game_CharacterBase.prototype.screenZ = function() {
        var z = _Game_CharacterBase_screenZ.call(this);
        if (this instanceof Game_Event && this.event().name.match(/^\{.*\}$/)) {
            // 이름이 {}로 감싸진 NPC의 경우
            return 5; // 일반 타일보다 높은 Z 값을 설정
        }
        return z;
    };
})();
