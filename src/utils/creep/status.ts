export const getRoomSpawnEnergy = (spawn: string) => {
    let theSpawn = Game.spawns[spawn];
    return theSpawn.store.energy;
};

export const getRoomExtensionEnergy = (spawn: string) => {
    let theSpawn = Game.spawns[spawn];
    let total = 0;
    let store_structures: AnyStoreStructure[] = theSpawn.room.find(FIND_STRUCTURES, {
        filter: structure => {
            return structure.structureType == STRUCTURE_EXTENSION;
        }
    });

    store_structures.forEach(structure => {
        total += structure.store.energy;
    });

    return total;
};

export const logSpawnStatus = (room_data: RoomData) => {
    let { name, spawn_energy, extension_energy, all_creeps } = room_data;
    let log = "|";
    all_creeps.forEach(creeps => {
        console.log(creeps.length);
        log += ` ${creeps[0].memory.role}: ${creeps.length} |`;
    });
    console.log(`(${name}) spawn_energy: ${spawn_energy} | extension_energy: ${extension_energy} ${log}`);
};
