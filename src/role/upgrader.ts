import { FnRunFlag } from "utils/flag";
import { harvest } from "./harvester";
const role = "upgrader";

const change_state = (creep: Creep) => {
    if (creep.store[RESOURCE_ENERGY] == 0 && creep.memory.working) {
        creep.memory.working = false;
        creep.say("To harvest");
    }

    if (creep.store.getFreeCapacity() == 0 && !creep.memory.working) {
        creep.memory.working = true;
        creep.say("To upgrade");
    }
};

const upgrade = (creep: Creep, target_flag: Flag) => {
    let controller = target_flag.room?.controller;
    if (controller) {
        let n = creep.upgradeController(controller);
        switch (n) {
            case OK:
                break;
            case ERR_NOT_IN_RANGE:
                creep.moveTo(controller, { visualizePathStyle: { stroke: "#0000FF" } });
                break;
            default:
                console.log(`[-] (upgrader>run>harvest) move to ${n}`);
        }
    } else {
        console.log(`[-] (upgrader>run>upgrade) can't find controller in ${target_flag.name}`);
    }
};

const run: FnRunFlag = (creeps, flags) => {
    let { source_flag, target_flag } = flags;
    let source_target_flag: Flag | null = Game.flags[source_flag];
    if (!source_target_flag) {
        console.log(`[-] pls set the flag ${source_flag}`);
        return;
    }

    let controller_target_flag: Flag | null = Game.flags[target_flag];
    if (!source_target_flag) {
        console.log(`[-] pls set the flag ${target_flag}`);
        return;
    }

    if (source_flag && target_flag) {
        creeps.forEach(creep => {
            creep.say("⏫️");
            change_state(creep);
            if (creep.memory.working) {
                upgrade(creep, controller_target_flag as Flag);
            } else {
                harvest(creep, source_target_flag as Flag);
            }
        });
    } else {
        console.log(`[-] (upgrader>run) source_flag: ${source_flag} target_flag: ${target_flag}`);
    }
};

export default {
    run,
    role
};
