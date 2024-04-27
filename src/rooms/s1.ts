import Flag, { FlagArg, FnListItem } from "utils/flag";
import CreepUtil from "utils/creep/utils";
import harvester from "role/harvester";
import upgrader from "role/upgrader";
import builder from "role/builder";

const run = () => {
    const SPAWN_NAME = "s1";
    let WATCH_QUEUE: [string, string, number, BodyPartConstant[]][] = [];
    if (Memory.spawnTicks[SPAWN_NAME]) {
        Memory.spawnTicks[SPAWN_NAME] = false;
    }

    let harvesters = CreepUtil.getCreepsBySpawn(SPAWN_NAME, harvester.role, null);
    let upgraders = CreepUtil.getCreepsBySpawn(SPAWN_NAME, upgrader.role, null);
    let builders = CreepUtil.getCreepsBySpawn(SPAWN_NAME, builder.role, null);
    // ================================== 手动操作区 ==================================

    const NEED_HARVEST = true;
    const NEED_UPGRADE = true;
    const NEED_BUILD = true;

    WATCH_QUEUE.push([SPAWN_NAME, harvester.role, 1, [WORK, CARRY, MOVE]]);
    WATCH_QUEUE.push([SPAWN_NAME, upgrader.role, 2, [WORK, CARRY, MOVE]]);
    WATCH_QUEUE.push([SPAWN_NAME, builder.role, 1, [WORK, CARRY, MOVE]]);

    const HARVESTER_GROUP: FnListItem[] = [
        {
            number: 1,
            flags: {
                source_flag: "e1"
            } as FlagArg
        }
    ];

    const UPGRADER_GROUP: FnListItem[] = [
        {
            number: 2,
            flags: {
                source_flag: "e1",
                target_flag: "c1"
            } as FlagArg
        }
    ];

    const BUILDER_GROUP: FnListItem[] = [
        {
            number: 1,
            flags: {
                source_flag: "e1"
            } as FlagArg
        }
    ];

    // ================================== 手动操作区 ==================================
    CreepUtil.watchCreeps(WATCH_QUEUE);

    if (NEED_HARVEST) {
        Flag.run(harvesters, HARVESTER_GROUP, harvester.run);
    }

    if (NEED_UPGRADE) {
        Flag.run(upgraders, UPGRADER_GROUP, upgrader.run);
    }

    if (NEED_BUILD) {
        Flag.run(builders, BUILDER_GROUP, builder.run);
    }

    return {
        name: SPAWN_NAME,
        spawn_energy: CreepUtil.getRoomSpawnEnergy(SPAWN_NAME),
        extension_energy: CreepUtil.getRoomExtensionEnergy(SPAWN_NAME),
        all_creeps: [harvesters, upgraders, builders]
    } as RoomData;
};
export default run;
