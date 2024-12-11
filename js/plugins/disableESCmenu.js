/*:
 * @plugindesc Prevents accessing menu with ESC key
 * @help This plugin prevents the player from accessing the menu by pressing the ESC key.
 */

(function() {
    'use strict';

    // Override the function that handles ESC key press in Scene_Map
    Scene_Map.prototype.processEscape = function() {
        // Do nothing when ESC key is pressed
    };

    // Override the function that opens the menu in Scene_Map
    Scene_Map.prototype.callMenu = function() {
        // Do nothing when menu is called
    };

    // Override the function that handles ESC key press in Scene_Battle
    Scene_Battle.prototype.processEscape = function() {
        // Do nothing when ESC key is pressed
    };

    // Override the function that opens the menu in Scene_Battle
    Scene_Battle.prototype.callMenu = function() {
        // Do nothing when menu is called
    };
})();
