//=============================================================================
// AutoSaveAndLoadPlugin.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Automatically saves and loads the game to/from Slot 1.
 * @url INSERT_URL_TO_YOUR_DOCUMENTATION_HERE
 * @orderAfter AnotherPluginName
 *
 * @help AutoSaveAndLoadPlugin.js
 *
 * This plugin automatically saves the game to Slot 1 whenever arrow keys are pressed,
 * and automatically loads the game from Slot 1 when the "Load" option is selected
 * from the title screen.
 */

(function() {
    // Add event listeners to detect arrow key inputs
    document.addEventListener('keydown', function(event) {
        // Check if the event is an arrow key press
        if ($gameMap && (event.code === 'ArrowUp' || event.code === 'ArrowDown' ||
             event.code === 'ArrowLeft' || event.code === 'ArrowRight')) {
            // Call the function to save the game
            autosaveGame(); 
        }    
    });
    
    document.addEventListener('click', handleTouchOrClick);
    document.addEventListener('touchstart', handleTouchOrClick);

    
    function handleTouchOrClick(event) {
        // Check if the event target is not an input field
        if (event.target.nodeName !== 'INPUT') {
            // Call the function to save the game
            autosaveGame();
        }
    }

function handleTouchOrClick(event) {
    // Check if the event target is not an input field
    if (event.target.nodeName !== 'INPUT') {
        // Call the function to save the game after a delay
        setTimeout(function() {
            autosaveGame();
        }, 1000); // 1000 milliseconds = 1 second
    }
}

function handleTouchOrClick(event) {
    // Check if the event target is not an input field
    if (event.target.nodeName !== 'INPUT') {
        // Call the function to save the game after a delay
        setTimeout(function() {
            autosaveGame();
        }, 2000); // 1000 milliseconds = 1 second
    }
}

function handleTouchOrClick(event) {
    // Check if the event target is not an input field
    if (event.target.nodeName !== 'INPUT') {
        // Call the function to save the game after a delay
        setTimeout(function() {
            autosaveGame();
        }, 3000); // 1000 milliseconds = 1 second
    }
}
    




    // Function to save the game
    function autosaveGame() {
        // Call RPG Maker MZ's save function
        $gameSystem.onBeforeSave();
        DataManager.saveGame(1); // Save to Slot 1
    }


    Scene_Load.prototype.create = function () {
        Scene_File.prototype.create.call(this);
        this._listWindow.hide();
        this._helpWindow.hide();
        this._backgroundSprite.filters = [];
    }

    // Override the title command function to disable slot selection window
    Scene_Load.prototype.start = function () {
        Scene_File.prototype.start.call(this);
        this.executeLoad(this.firstSavefileId());
    };

    Scene_Load.prototype.onLoadFailure = function () {
        SoundManager.playBuzzer();
        this.popScene();
    };
    

})();
