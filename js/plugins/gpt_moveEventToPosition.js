/*:
 * @target MZ
 * @plugindesc Forcefully moves a specified event to the given coordinates during gameplay.
 * @help
 * Use the Plugin Command "Move Event To Position" to move a specific event by its ID to the desired x, y coordinates.
 *
 * @command moveEventToPosition
 * @text Move Event To Position
 * @desc Forcefully moves a specified event to the given x, y coordinates.
 *
 * @arg eventId
 * @type number
 * @text Event ID
 * @desc The ID of the event to move.
 * @default 1
 *
 * @arg targetX
 * @type number
 * @text Target X
 * @desc The X coordinate to move the event to.
 * @default 0
 *
 * @arg targetY
 * @type number
 * @text Target Y
 * @desc The Y coordinate to move the event to.
 * @default 0
 */

(() => {
    const pluginName = "ForceMoveEvent";

    PluginManager.registerCommand(pluginName, "moveEventToPosition", args => {
        const eventId = Number(args.eventId);
        const targetX = Number(args.targetX);
        const targetY = Number(args.targetY);
        const event = $gameMap.event(eventId);

        if (event) {
            // 이벤트를 지정된 좌표로 강제로 이동
            event.locate(targetX, targetY);

            // 경로 탐색 데이터를 초기화하여 위치를 즉시 반영
            event._x = targetX;
            event._y = targetY;
            event._realX = targetX;
            event._realY = targetY;
            event._targetX = targetX;
            event._targetY = targetY;

            // 맵을 리프레시하여 변경사항을 반영
            event.refresh();
        } else {
            console.warn(`Event ID ${eventId} not found on the current map.`);
        }
    });
})();
