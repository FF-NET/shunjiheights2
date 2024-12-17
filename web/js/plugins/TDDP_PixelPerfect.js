//=============================================================================
// RPG Maker MZ - Pixel Perfect scaling
//=============================================================================

/*:
* @plugindesc 1.1.1 Enable pixel perfect scaling mode for your game, including text rendering.
* @author Galenmereth / TDD
* @help Optionally add an ingame menu option for your players to turn off or on the pixel perfect mode
* @url https://github.com/TorD/mz-plugins
*
* @param enableIngameOptions
* @text Enable ingame option
* @desc Toggle if you want to display an ingame option for players to turn on/off pixel perfect mode ingame
* @type boolean
* @default false
* 
* @param labels
* @text Ingame option labels
* 
* @param en
* @parent labels
* @text EN - English
* @type text
* @default Pixel Perfect Mode
* 
* @param ja
* @parent labels
* @text JA - Japanese
* @type text
* @default ピクセルパーフェクトモード
* 
* @param zh
* @parent labels
* @text ZH - Chinese
* @type text
* @default 像素完美模式
* 
* @param ko
* @parent labels
* @text KO - Korean
* @type text
* @default 픽셀 퍼펙트 모드
* 
* @param ru
* @parent labels
* @text RU - Russian
* @type text
* @default Режим Pixel Perfect
*/

(() => {
    'use strict';

    ////////////////////////////////////////////////////////////////////////////
    // Fetch parameters
    ////////////////////////////////////////////////////////////////////////////
    const script = document.currentScript;
    let name = script.src.split('/');
    name = name[name.length - 1].replace('.js', '');

    const params = PluginManager.parameters(name);

    function usePixelPerfectMode() {
        return params.enableIngameOptions == "false" || ConfigManager.TDDP_pixelPerfectMode == true;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Bitmap extensions
    ////////////////////////////////////////////////////////////////////////////
    const _Bitmap_prototype_initialize = Bitmap.prototype.initialize;
    Bitmap.prototype.initialize = function(width, height) {
        _Bitmap_prototype_initialize.call(this, width, height);
        this._smooth = !usePixelPerfectMode();
    };

    const _Bitmap_prototype_drawText = Bitmap.prototype.drawText;
    Bitmap.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align) {
        const context = this._context;
        const smooth = this._smooth;
        if (!smooth) {
            context.imageSmoothingEnabled = false; // Disable smoothing for pixel perfect text rendering
        }
        _Bitmap_prototype_drawText.call(this, text, x, y, maxWidth, lineHeight, align);
        if (!smooth) {
            context.imageSmoothingEnabled = true; // Restore smoothing
        }
    };

    ////////////////////////////////////////////////////////////////////////////
    // Graphics extensions
    ////////////////////////////////////////////////////////////////////////////
    const _Graphics__createCanvas = Graphics._createCanvas;
    Graphics._createCanvas = function() {
        _Graphics__createCanvas.call(this);
        this.TDDP_updateCanvasImageRenderingMode();
    };

    const _Graphics__updateCanvas = Graphics._updateCanvas;
    Graphics._updateCanvas = function() {
        _Graphics__updateCanvas.call(this);
        this.TDDP_updateCanvasImageRenderingMode();
    };

    Graphics.TDDP_updateCanvasImageRenderingMode = function() {
        this._canvas.style.imageRendering = usePixelPerfectMode() ? 'pixelated' : '';
    };

    if (params.enableIngameOptions == "true") {
        ////////////////////////////////////////////////////////////////////////////
        // Window_Options extensions - only if ingame options enabled in plugin params
        ////////////////////////////////////////////////////////////////////////////
        const _Window_Options_prototype_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
        Window_Options.prototype.addGeneralOptions = function() {
            _Window_Options_prototype_addGeneralOptions.call(this);

            let label = params.en; // default is english
            if ($gameSystem.isJapanese()) {
                label = params.ja;
            } else if ($gameSystem.isChinese()) {
                label = params.zh;
            } else if ($gameSystem.isKorean()) {
                label = params.ko;
            } else if ($gameSystem.isRussian()) {
                label = params.ru;
            }

            this.addCommand(label, "TDDP_pixelPerfectMode");
        };

        const _Window_Options_prototype_setConfigValue = Window_Options.prototype.setConfigValue;
        Window_Options.prototype.setConfigValue = function(symbol, volume) {
            _Window_Options_prototype_setConfigValue.call(this, symbol, volume);

            if (symbol == 'TDDP_pixelPerfectMode') Graphics.TDDP_updateCanvasImageRenderingMode();
        };

        ////////////////////////////////////////////////////////////////////////////
        // ConfigManager extensions - only if ingame options enabled in plugin params
        ////////////////////////////////////////////////////////////////////////////
        const _ConfigManager_makeData = ConfigManager.makeData;
        ConfigManager.makeData = function() {
            const config = _ConfigManager_makeData.call(this);
            config.TDDP_pixelPerfectMode = this.TDDP_pixelPerfectMode;
            return config;
        };

        const _ConfigManager_applyData = ConfigManager.applyData;
        ConfigManager.applyData = function(config) {
            _ConfigManager_applyData.call(this, config);
            this.TDDP_pixelPerfectMode = this.readFlag(config, "TDDP_pixelPerfectMode", true);
        };
    }
})();
