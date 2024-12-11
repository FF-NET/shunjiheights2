(function() {
    // Game_Actor 클래스 확장
    var _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        // 기존 스탯
        this._sadness = 0;
        this._reality = 0;
        this._love = 0;
        this._courage = 0;
        this._hope = 0;
        this._diligence = 0;
        this._purity = 0;
        this._karma = 0;
        // 새로운 스탯
        this._popularity = 0; // 화제성
        this._novelty = 0;    // 참신함
        this._maniac = 0;     // 매니악
        this._sensitivity = 0; // 감수성
        this._worldview = 0;  // 세계관
    };

    // 기존 스탯의 getter 및 setter
    Game_Actor.prototype.sadness = function() {
        return this._sadness;
    };
    Game_Actor.prototype.setSadness = function(value) {
        this._sadness = value.clamp(0, 999);
    };
    Game_Actor.prototype.reality = function() {
        return this._reality;
    };
    Game_Actor.prototype.setReality = function(value) {
        this._reality = value.clamp(0, 999);
    };
    Game_Actor.prototype.love = function() {
        return this._love;
    };
    Game_Actor.prototype.setLove = function(value) {
        this._love = value.clamp(0, 999);
    };
    Game_Actor.prototype.courage = function() {
        return this._courage;
    };
    Game_Actor.prototype.setCourage = function(value) {
        this._courage = value.clamp(0, 999);
    };
    Game_Actor.prototype.hope = function() {
        return this._hope;
    };
    Game_Actor.prototype.setHope = function(value) {
        this._hope = value.clamp(0, 999);
    };
    Game_Actor.prototype.diligence = function() {
        return this._diligence;
    };
    Game_Actor.prototype.setDiligence = function(value) {
        this._diligence = value.clamp(0, 999);
    };
    Game_Actor.prototype.purity = function() {
        return this._purity;
    };
    Game_Actor.prototype.setPurity = function(value) {
        this._purity = value.clamp(0, 999);
    };
    Game_Actor.prototype.karma = function() {
        return this._karma;
    };
    Game_Actor.prototype.setKarma = function(value) {
        this._karma = value.clamp(0, 999);
    };

    // 새로운 스탯의 getter 및 setter
    Game_Actor.prototype.popularity = function() {
        return this._popularity;
    };
    Game_Actor.prototype.setPopularity = function(value) {
        this._popularity = value.clamp(0, 999);
    };
    Game_Actor.prototype.novelty = function() {
        return this._novelty;
    };
    Game_Actor.prototype.setNovelty = function(value) {
        this._novelty = value.clamp(0, 999);
    };
    Game_Actor.prototype.maniac = function() {
        return this._maniac;
    };
    Game_Actor.prototype.setManiac = function(value) {
        this._maniac = value.clamp(0, 999);
    };
    Game_Actor.prototype.sensitivity = function() {
        return this._sensitivity;
    };
    Game_Actor.prototype.setSensitivity = function(value) {
        this._sensitivity = value.clamp(0, 999);
    };
    Game_Actor.prototype.worldview = function() {
        return this._worldview;
    };
    Game_Actor.prototype.setWorldview = function(value) {
        this._worldview = value.clamp(0, 999);
    };

    // 클램프 함수 (최소 및 최대 값을 설정)
    Number.prototype.clamp = function(min, max) {
        return Math.min(Math.max(this, min), max);
    };

    // 스탯 증가/감소 메서드
    Game_Actor.prototype.changePopularity = function(value) {
        this.setPopularity(this._popularity + value);
    };
    Game_Actor.prototype.changeNovelty = function(value) {
        this.setNovelty(this._novelty + value);
    };
    Game_Actor.prototype.changeManiac = function(value) {
        this.setManiac(this._maniac + value);
    };
    Game_Actor.prototype.changeSensitivity = function(value) {
        this.setSensitivity(this._sensitivity + value);
    };
    Game_Actor.prototype.changeWorldview = function(value) {
        this.setWorldview(this._worldview + value);
    };

})();
