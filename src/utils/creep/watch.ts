import exp from "constants";

export const count_cost = (body: Array<BodyPartConstant>) => {
    let cost = 0;
    for (let b in body) {
        switch (body[b]) {
            case MOVE:
                cost += 50;
                break;
            case WORK:
                cost += 100;
                break;
            case CARRY:
                cost += 50;
                break;
            case ATTACK:
                cost += 80;
                break;
            case RANGED_ATTACK:
                cost += 150;
                break;
            case HEAL:
                cost += 250;
                break;
            case CLAIM:
                cost += 600;
                break;
            case TOUGH:
                cost += 10;
                break;
            default:
                break;
        }
    }

    return cost;
};

export const clear_creeps = () => {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log("[*] Clear the creep: " + name);
        }
    }
};

export const getCreeps = () => {
    return _.filter(Game.creeps).sort();
};

export const getCreepsBySpawn = (spawn: string, category: string, creeps: Creep[] | null) => {
    let source_creeps = getCreeps();
    if (creeps) {
        source_creeps = creeps;
    }

    let res_creeps = _.filter(source_creeps, creep => {
        if (category) {
            return creep.memory.role == category && creep.memory.spawn == spawn;
        } else {
            return creep.memory.spawn == spawn;
        }
    }).sort();

    return res_creeps;
};

export const getCreepsByRoom = (room_name: string, category: string, creeps: Creep[] | null) => {
    let room: Room = Game.rooms[room_name];
    let source_creeps = getCreeps();
    if (creeps) {
        source_creeps = creeps;
    }
    let res_creeps = _.filter(source_creeps, creep => {
        if (category) {
            return creep.memory.role == category && creep.room == room;
        } else {
            return creep.room == room;
        }
    }).sort();
    return res_creeps;
};

export const getCreepsByCategory = (category: string, creeps: Creep[] | null) => {
    let source_creeps = getCreeps();
    if (creeps) {
        source_creeps = creeps;
    }
    let res_creeps = _.filter(source_creeps, creep => {
        return creep.memory.role == category;
    }).sort();

    return res_creeps;
};

export const watchSpawn = (spawn: string, category: string, number: number, body: Array<BodyPartConstant>) => {
    let theSpawn: StructureSpawn = Game.spawns[spawn];
    if (theSpawn) {
        let creeps = getCreepsBySpawn(spawn, category, null);
        let cost = count_cost(body);

        if (creeps.length < number && !theSpawn.spawning && !Memory.spawnTicks[spawn]) {
            let creep_name = category + Game.time;
            let spawnStatus: ScreepsReturnCode = theSpawn.spawnCreep(body, creep_name, {
                memory: {
                    role: category,
                    spawn: spawn
                } as CreepMemory
            });
            switch (spawnStatus) {
                case OK:
                    console.log(`[*] (${spawnStatus}) Spawning new ${category} creep: ${creep_name}`);
                    Memory.spawnTicks[spawn] = true;
                    break;
                default:
                    console.log(`[-] (${spawnStatus}) ${category}: ${cost}`);
            }
        }
    } else {
        console.log(`[-] (watchSpawn) err spawn: ${spawn}`);
    }
    if (theSpawn.spawning) {
        let spawningCreep = Game.creeps[theSpawn.spawning.name];
        theSpawn.room.visual.text("🛠️" + spawningCreep.memory.role, theSpawn.pos.x + 1, theSpawn.pos.y, {
            align: "left",
            opacity: 0.8
        });
    }
    return getCreepsBySpawn(spawn, category, null).length >= number;
};

export const watchCreeps = (watch_queue: [string, string, number, BodyPartConstant[]][]) => {
    let watch_next = true;
    for (let i = 0; i < watch_queue.length && watch_next; i++) {
        let spawn = watch_queue[i][0];
        let category = watch_queue[i][1];
        let number = watch_queue[i][2];
        let body = watch_queue[i][3];
        watch_next = watchSpawn(spawn, category, number, body);
    }
};
