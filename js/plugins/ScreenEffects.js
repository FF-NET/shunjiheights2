/*:
 * @target MZ
 * @plugindesc 게임 화면의 컨트라스트와 CRT 스캔라인 효과를 조절합니다. [v1.0.1]
 * @author
 *
 * @param Contrast Level
 * @text 컨트라스트 수준
 * @type number
 * @decimals 2
 * @min 0
 * @max 4
 * @desc 적용할 컨트라스트 수준입니다. 1은 기본값이며, 1보다 크면 대비가 증가하고 작으면 대비가 감소합니다.
 * @default 1.0
 *
 * @help
 * ScreenContrast.js
 *
 * 이 플러그인은 게임 화면의 컨트라스트를 조절하고 CRT 스캔라인 효과를 적용할 수 있게 해줍니다.
 *
 * 플러그인 명령은 필요하지 않습니다. 인게임 옵션을 활성화한 경우, 설정 메뉴에서 효과를 켜거나 끌 수 있습니다.
 *
 * ===========================================================================
 * 사용 조건
 * ===========================================================================
 * 상업적 및 비상업적 프로젝트에서 자유롭게 사용 가능합니다.
 * 크레딧 표기는 선택사항입니다.
 *
 * ===========================================================================
 * 변경 기록
 * ===========================================================================
 * Version 1.0.1 - 쉐이더 코드 수정 및 필터 중복 적용 방지.
 * Version 1.0.0 - 초기 릴리스.
 */
 
(() => {
    'use strict';

    const pluginName = 'ScreenContrast';

    const parameters = PluginManager.parameters(pluginName);
    const contrastLevel = Number(parameters['Contrast Level'] || 1.0);

    // ContrastFilter 클래스 정의
    class ContrastFilter extends PIXI.Filter {
        constructor(contrast = 1.0) {
            const fragmentSrc = `
                precision mediump float;
                varying vec2 vTextureCoord;
                uniform sampler2D uSampler;
                uniform float contrast;

                void main(void) {
                    vec4 color = texture2D(uSampler, vTextureCoord);
                    color.rgb = ((color.rgb - 0.5) * contrast) + 0.5;
                    gl_FragColor = color;
                }
            `;
            super(null, fragmentSrc, {
                contrast: contrast
            });
        }

        setContrast(value) {
            this.uniforms.contrast = value;
        }
    }

    // CRTScanlineFilter 클래스 정의
    class CRTScanlineFilter extends PIXI.Filter {
        constructor(intensity = 0.05, rgbShift = 0.002) {
            const vertexSrc = `
                precision mediump float;
                attribute vec2 aVertexPosition;
                attribute vec2 aTextureCoord;
                uniform mat3 projectionMatrix;
                varying vec2 vTextureCoord;

                void main(void) {
                    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
                    vTextureCoord = aTextureCoord;
                }
            `;

            const fragmentSrc = `
                precision mediump float;
                varying vec2 vTextureCoord;
                uniform sampler2D uSampler;
                uniform float intensity;
                uniform float rgbShift;

                void main(void) {
                    vec4 color = texture2D(uSampler, vTextureCoord);

                    // 스캔라인 효과: 홀수 줄을 어둡게
                    float scanline = mod(gl_FragCoord.y, 2.0) < 1.0 ? intensity : 0.0;
                    color.rgb -= scanline;

                    // RGB 채널 약간 이동
                    float r = texture2D(uSampler, vTextureCoord + vec2(rgbShift, 0.0)).r;
                    float g = texture2D(uSampler, vTextureCoord + vec2(-rgbShift, 0.0)).g;
                    float b = texture2D(uSampler, vTextureCoord + vec2(0.0, rgbShift)).b;
                    color = vec4(r, g, b, color.a);

                    gl_FragColor = color;
                }
            `;
            super(vertexSrc, fragmentSrc, {
                intensity: intensity,
                rgbShift: rgbShift
            });
        }

        setIntensity(value) {
            this.uniforms.intensity = value;
        }

        setRGBShift(value) {
            this.uniforms.rgbShift = value;
        }
    }

    // ContrastFilter 인스턴스 생성
    const contrastFilter = new ContrastFilter(contrastLevel);

    // CRTScanlineFilter 인스턴스 생성
    const crtScanlineFilter = new CRTScanlineFilter();

    // 전역 Graphics 스테이지에 필터 적용
    const _Graphics_initWebGL = Graphics._initWebGL;
    Graphics._initWebGL = function() {
        _Graphics_initWebGL.call(this);
        if (!this._screenEffectsApplied) {
            this._screenEffectsApplied = true;
            // 기존 필터 배열에 추가
            if (!this._stage.filters) {
                this._stage.filters = [];
            }
            this._stage.filters.push(contrastFilter);
            this._stage.filters.push(crtScanlineFilter);
            console.log("ScreenContrast Filter applied globally.");
        }
    };

    // 매 프레임마다 필터 업데이트
    const _Graphics_update = Graphics.update;
    Graphics.update = function() {
        if (this._stage.filters) {
            // 필터의 유니폼 값을 업데이트
            // 현재 대비 수준 유지
            contrastFilter.setContrast(contrastFilter.uniforms.contrast);
            // 현재 스캔라인 강도 및 RGB 이동 유지
            crtScanlineFilter.setIntensity(crtScanlineFilter.uniforms.intensity);
            crtScanlineFilter.setRGBShift(crtScanlineFilter.uniforms.rgbShift);
        }
        _Graphics_update.call(this);
    };

    // 플러그인 커맨드 등록
    PluginManager.registerCommand(pluginName, "SetContrast", args => {
        const newContrast = Number(args.contrast);
        if (contrastFilter) {
            contrastFilter.setContrast(newContrast);
            console.log(`Contrast set to ${newContrast}`);
        }
    });

    PluginManager.registerCommand(pluginName, "SetCRTScanlineIntensity", args => {
        const newIntensity = Number(args.intensity);
        if (crtScanlineFilter) {
            crtScanlineFilter.setIntensity(newIntensity);
            console.log(`CRT Scanline Intensity set to ${newIntensity}`);
        }
    });

    PluginManager.registerCommand(pluginName, "SetCRTRGBShift", args => {
        const newRGBShift = Number(args.rgbShift);
        if (crtScanlineFilter) {
            crtScanlineFilter.setRGBShift(newRGBShift);
            console.log(`CRT RGB Shift set to ${newRGBShift}`);
        }
    });

    // 인게임 옵션 활성화 시
    if (String(parameters['EnableIngameOptions'] || 'true') === 'true') {
        ////////////////////////////////////////////////////////////////////////////
        // Window_Options extensions - only if ingame options enabled in plugin params
        ////////////////////////////////////////////////////////////////////////////
        const _Window_Options_prototype_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
        Window_Options.prototype.addGeneralOptions = function() {
            _Window_Options_prototype_addGeneralOptions.call(this);

            // 컨트라스트 옵션 추가
            this.addCommand("Screen Contrast", "ScreenEffects_Contrast");

            // CRT 스캔라인 옵션 추가
            this.addCommand("CRT Scanline", "ScreenEffects_CRTScanline");
        };

        // 컨트라스트 및 CRT 스캔라인 상태 텍스트 표시
        const _Window_Options_prototype_statusText = Window_Options.prototype.statusText;
        Window_Options.prototype.statusText = function(symbol) {
            if (symbol === "ScreenEffects_Contrast") {
                return String(contrastFilter.uniforms.contrast.toFixed(2));
            }
            if (symbol === "ScreenEffects_CRTScanline") {
                return String(crtScanlineFilter.uniforms.intensity.toFixed(2));
            }
            return _Window_Options_prototype_statusText.call(this, symbol);
        };

        // 컨트라스트 및 CRT 스캔라인 설정 처리
        const _Window_Options_prototype_processOk = Window_Options.prototype.processOk;
        Window_Options.prototype.processOk = function() {
            const symbol = this.currentSymbol();
            if (symbol === "ScreenEffects_Contrast") {
                const newContrast = (contrastFilter.uniforms.contrast + 0.1) > 4.0 ? 0.0 : contrastFilter.uniforms.contrast + 0.1;
                contrastFilter.setContrast(newContrast);
                this.refresh();
            } else if (symbol === "ScreenEffects_CRTScanline") {
                const newIntensity = (crtScanlineFilter.uniforms.intensity + 0.01) > 1.0 ? 0.0 : crtScanlineFilter.uniforms.intensity + 0.01;
                crtScanlineFilter.setIntensity(newIntensity);
                this.refresh();
            } else {
                _Window_Options_prototype_processOk.call(this);
            }
        };
    }

})();
