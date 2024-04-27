export interface FnRunFlag {
    (creeps: Creep[], flags: FlagArg): any;
}

export interface FlagArg {
    spawn: string;

    source_flag: string;
    target_flag: string;

    // for order
    option_order: string[];
}

export interface FnListItem {
    number: number;
    flags: FlagArg;
}

const get_flag_names = () => {
    let flag_names = [];
    for (let flag_name in Game.flags) {
        flag_names.push(flag_name);
    }
    return flag_names.sort();
};

const run = (creeps: Creep[], fn_list: FnListItem[], f: FnRunFlag) => {
    let idx = 0;
    fn_list.forEach(fn_item => {
        let each_creeps = [];
        let { number, flags } = fn_item;

        for (let i = 0; i < number && idx < creeps.length; i++, idx++) {
            let creep = creeps[idx];
            each_creeps.push(creep);
        }

        f(each_creeps, flags);
    });
};

export default {
    get_flag_names,
    run
};
