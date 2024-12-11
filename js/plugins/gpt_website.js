/*:
 * @target MZ
 * @plugindesc Opens a specific website in the default web browser during gameplay.
 * @help
 * Use the Plugin Command "Open Website" to open a specific website URL in the default browser.
 *
 * @command openWebsite
 * @text Open Website
 * @desc Opens a specific URL in the default web browser.
 *
 * @arg url
 * @type string
 * @text Website URL
 * @desc The URL of the website to open.
 * @default https://www.example.com
 */

(() => {
    const pluginName = "OpenWebsitePlugin";

    PluginManager.registerCommand(pluginName, "openWebsite", args => {
        const url = String(args.url);

        // NW.js 환경에서 실행 중인지 확인
        if (typeof require !== 'undefined' && typeof process !== 'undefined') {
            const gui = require('nw.gui');
            if (gui && gui.Shell) {
                gui.Shell.openExternal(url);
            } else {
                console.error("NW.js 환경에서 Shell 모듈을 찾을 수 없습니다.");
            }
        } else {
            // 웹 브라우저 환경에서 새 탭으로 URL 열기
            const newTab = window.open(url, "_blank");
            if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
                alert("팝업이 차단되었습니다. 브라우저의 팝업 차단 설정을 확인해주세요.");
            }
        }
    });
})();
