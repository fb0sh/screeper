export const trans2 = (creep: Creep, category: string) => {
    creep.say(`${creep.memory.role}->${category}`);
    creep.memory.last_role = creep.memory.role;
    creep.memory.role = category;
};

export const transAll = (creeps: Creep[], category: string) => {
    creeps.forEach(creep => {
        trans2(creep, category);
    });
};

export const transFulled = (creeps: Creep[], category: string) => {
    let cs: Creep[] = [];
    creeps.forEach(creep => {
        if (creep.store.getFreeCapacity() == 0) {
            cs.push(creep);
        }
    });
    transAll(cs, category);
};

export const transFree = (creeps: Creep[], category: string) => {
    let cs: Creep[] = [];
    creeps.forEach(creep => {
        if (creep.store.getUsedCapacity() == 0) {
            cs.push(creep);
        }
    });
    transAll(cs, category);
};

export const transPart = (creeps: Creep[], category: string, number: number) => {
    let cs = [];
    for (let i = 0; i < number && i < creeps.length; i++) {
        cs.push(creeps[i]);
    }
    transAll(cs, category);
};

export const recover = (creep: Creep) => {
    if (creep.memory.last_role) {
        creep.say(`R|${creep.memory.role}->${creep.memory.last_role}`);
        creep.memory.role = creep.memory.last_role;
    }
};

export const recoverAll = (creeps: Creep[]) => {
    creeps.forEach(creep => {
        recover(creep);
    });
};

export const recoverByCategory = (creeps: Creep[], category: string) => {
    recoverAll(_.filter(creeps, creep => creep.memory.role == category));
};
