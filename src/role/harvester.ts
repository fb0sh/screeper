import { FnRunFlag } from "utils/flag";
const role = "harvester";

const find_save_target_id = (creep: Creep, spawn: string, option_order: string[], broken: string) => {
    // 收集完资源去哪个spawn 的room保存 默认是创建它的spawn所在room
    // broken 已被其他creep占领的target
    let room = Game.spawns[creep.memory.spawn].room;
    if (spawn) {
        room = Game.spawns[spawn].room;
    }

    if (!option_order) {
        option_order = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_STORAGE];
    }

    let targets: AnyStructure[] = [];
    option_order.forEach(structure_type => {
        targets = targets.concat(
            room
                .find(FIND_STRUCTURES, {
                    filter: (structure: AnyStoreStructure) => {
                        return (
                            structure.structureType == structure_type &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                        );
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
        let temp: AnyStructure[] = [];
        targets.forEach(structure => {
            if (structure.id != broken) {
                temp.push(structure);
            }
        });

        targets = temp;
    }
    if (targets.length > 0) {
        return targets[0].id;
    } else {
        return "";
    }
};

const change_state = (creep: Creep, spawn: string, option_order: string[]) => {
    if (creep.store.getFreeCapacity() == 0 && !creep.memory.working) {
        creep.memory.working = true;
        creep.say("To save");
    }

    if (creep.store[RESOURCE_ENERGY] == 0 && creep.memory.working) {
        creep.memory.working = false;
        creep.say("To harvest");
    }

    if (creep.memory.working && !creep.memory.target_id) {
        creep.memory.target_id = find_save_target_id(creep, spawn, option_order, "");
    }

    if (!creep.memory.working && creep.memory.target_id) {
        creep.memory.target_id = "";
    }
};

const save = (creep: Creep, spawn: string, option_order: string[]) => {
    let save_target: AnyStoreStructure | null = Game.getObjectById(creep.memory.target_id);
    if (save_target) {
        let n: ScreepsReturnCode = creep.transfer(save_target, RESOURCE_ENERGY);
        switch (n) {
            case OK:
                break;
            case ERR_NOT_IN_RANGE:
                creep.moveTo(save_target, {
                    visualizePathStyle: {
                        stroke: "#ffffff"
                    }
                });
                break;
            case ERR_FULL:
                // 排除错误 以下一个为目标
                creep.memory.target_id = find_save_target_id(creep, spawn, option_order, creep.memory.target_id);
                break;

            default:
                console.log(`[-] (harvester>run>save) :[${creep.name}] ${n}`);
        }
    } else {
        console.log(`[-] (harvester>run>save) save_target: ${save_target} all fulled`);
    }
};

export const harvest = (creep: Creep, source_target_flag: Flag) => {
    let source: Source | null = source_target_flag.pos.findClosestByRange(FIND_SOURCES_ACTIVE);

    if (source) {
        let n: -5 | -6 | CreepActionReturnCode = creep.harvest(source);
        switch (n) {
            case OK:
                break;
            case ERR_NOT_IN_RANGE:
                creep.moveTo(source, {
                    visualizePathStyle: { stroke: "#ffaa00" }
                });
                break;
            case ERR_NOT_OWNER:
                console.log(`[-] this room was invalid : ${creep.room}`);
                break;
            case ERR_BUSY:
                break;
            case ERR_INVALID_TARGET:
                console.log(`[-] invalid_target ${creep.room} ${source_target_flag}`);
                break;
            default:
                console.log(`[-] (harvester>run>harvest):[${creep.name}] ${n}`);
        }
    } else {
        creep.say(`move to ${source_target_flag}`);
        let n: -2 | -5 | -7 | CreepMoveReturnCode = creep.moveTo(source_target_flag.pos, {
            visualizePathStyle: { stroke: "#FF0000" }
        });
        switch (n) {
            case OK:
                break;
            default:
                console.log(`[-][${creep.memory.role}] (harvest) move to ${n}`);
        }
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
            creep.say("🪓");
            change_state(creep, spawn, option_order);
            if (creep.memory.working) {
                save(creep, spawn, option_order);
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
