/*:
 * @target MZ
 * @plugindesc Adds custom stat modification commands for actors in events (e.g., sadness, love).
 * @author GPT
 * @help
 * This plugin allows you to increase or decrease custom stats for actors via event commands.
 *
 * @command changeStat
 * @text Change Custom Stat
 * @desc Change a custom stat for a specified actor.
 *
 * @arg actorId
 * @text Actor ID
 * @desc The ID of the actor to modify. Select "None" to apply to all party members except the leader.
 * @type actor
 * @default 0
 * @option None
 * @value 0
 *
 * @arg statName
 * @text Stat Name
 * @desc The name of the custom stat to modify (e.g., sadness, love, courage).
 * @type select
 * @option Sadness
 * @value sadness
 * @option Reality
 * @value reality
 * @option Love
 * @value love
 * @option Courage
 * @value courage
 * @option Hope
 * @value hope
 * @option Diligence
 * @value diligence
 * @option Purity
 * @value purity
 * @option Karma
 * @value karma
 * @option Popularity
 * @value popularity
 * @option Novelty
 * @value novelty
 * @option Maniac
 * @value maniac
 * @option Sensitivity
 * @value sensitivity
 * @option Worldview
 * @value worldview
 *
 * @arg value
 * @text Value
 * @desc The amount to increase or decrease the stat by.
 * @type number
 * @min -999
 * @max 999
 * @default 0
 */

(() => {
    const pluginName = "gpt_tamagochi_statchange";

    PluginManager.registerCommand(pluginName, "changeStat", args => {
        const actorId = Number(args.actorId);
        const statName = args.statName;
        const value = Number(args.value);

        if (actorId === 0) {
            // actorId가 0일 경우, 파티의 모든 멤버 중 리더를 제외하고 스탯 변경 적용
            $gameParty.members().forEach(actor => {
                if (actor !== $gameParty.leader()) {
                    if (typeof actor["change" + statName.charAt(0).toUpperCase() + statName.slice(1)] === "function") {
                        actor["change" + statName.charAt(0).toUpperCase() + statName.slice(1)](value);
                    }
                }
            });
        } else {
            // 특정 Actor ID에 대해 스탯 변경 적용
            const actor = $gameActors.actor(actorId);
            if (actor && typeof actor["change" + statName.charAt(0).toUpperCase() + statName.slice(1)] === "function") {
                actor["change" + statName.charAt(0).toUpperCase() + statName.slice(1)](value);
            } else {
                console.error("Invalid actor ID or stat name.");
            }
        }
    });
})();
