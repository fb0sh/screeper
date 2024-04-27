import { FnRunFlag } from "utils/flag";
import { harvest } from "./harvester";
const role = "builder";

const find_build_target_id = (creep: Creep, spawn: string, option_order: string[], broken: string) => {
    let room = Game.spawns[creep.memory.spawn].room;
    if (spawn) {
        room = Game.spawns[spawn].room;
    }

    if (!option_order) {
        option_order = [STRUCTURE_EXTENSION, STRUCTURE_ROAD, STRUCTURE_STORAGE, STRUCTURE_CONTAINER, STRUCTURE_RAMPART];
    }

    let targets: ConstructionSite<BuildableStructureConstant>[] = [];
    option_order.forEach(structure_type => {
        targets = targets.concat(
            room
                .find(FIND_CONSTRUCTION_SITES, {
                    filter: structure => {
                        return structure.structureType == structure_type;
                    }
                })
                .sort((a, b) => {
                    let distA = creep.pos.getRangeTo(a);
                    let distB = creep.pos.getRangeTo(b);
                    return distA - distB;
                })
        );
    });

    if (broken) {
        let temp = [];
        for (let i = 0; i < targets.length; i++) {
            if (targets[i].id != broken) {
                temp.push(targets[i]);
            }
        }
        targets = temp;
    }

    if (targets[0]) {
        return targets[0].id;
    } else {
        return "";
    }
};

const change_state = (creep: Creep, spawn: string, option_order: string[]) => {
    if (creep.store.getFreeCapacity() == 0 && !creep.memory.working) {
        creep.memory.working = true;
        creep.say("To build");
    }

    if (creep.store[RESOURCE_ENERGY] == 0 && creep.memory.working) {
        creep.memory.working = false;
        creep.say("To harvest");
    }

    if (creep.memory.working && !creep.memory.target_id) {
        creep.memory.target_id = find_build_target_id(creep, spawn, option_order, "");
    }

    if (!creep.memory.working && creep.memory.target_id) {
        creep.memory.target_id = "";
    }
};

const build = (creep: Creep, spawn: string, option_order: string[]) => {
    let build_target: ConstructionSite<BuildableStructureConstant> | null = Game.getObjectById(creep.memory.target_id);
    if (build_target) {
        let n: -6 | -14 | CreepActionReturnCode = creep.build(build_target);
        switch (n) {
            case OK:
                break;
            case ERR_NOT_IN_RANGE:
                creep.moveTo(build_target, {
                    visualizePathStyle: { stroke: "#0000FF" }
                });
                break;
            case ERR_INVALID_TARGET:
                creep.memory.target_id = find_build_target_id(creep, spawn, option_order, creep.memory.target_id);
                break;
            default:
                console.log(`[-] (builder>run>build) :[${creep.name}] ${n}`);
        }
    } else {
        console.log(`[-] (builder>run>build) save_target: ${build_target} all error`);
    }
};

const run: FnRunFlag = (creeps, flags) => {
    let { source_flag, spawn, option_order } = flags;
    let source_target_flag: Flag | null = Game.flags[source_flag];
    if (!source_target_flag) {
        console.log(`[-] pls set the flag ${source_flag}`);
        return;
    }

    if (source_flag) {
        creeps.forEach(creep => {
            creep.say("🔨");
            change_state(creep, spawn, option_order);
            if (creep.memory.working) {
                build(creep, spawn, option_order);
            } else {
                harvest(creep, source_target_flag as Flag);
            }
        });
    } else {
        console.log(`[-] (harvester>run) source_flag: ${source_flag} not found~`);
    }
};

export default {
    run,
    role
};
