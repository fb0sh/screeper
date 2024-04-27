import mainloop from "mainloop";
import { ErrorMapper } from "utils/ErrorMapper";

declare global {
    interface D {
        [key: string]: boolean;
    }
    interface RoomData {
        name: string;
        spawn_energy: number;
        extension_energy: number;
        all_creeps: Creep[][];
    }
    interface Memory {
        // for room spawn once in a tick
        spawnTicks: D;
        uuid: number;
        log: any;
    }

    interface CreepMemory {
        role: string;
        spawn: string;
        last_role: string;

        // for harvester upgrader 本职工作
        working: boolean;

        // for harvester builder
        target_id: string;
    }

    // Syntax for adding proprties to `global` (ex "global.log")
    namespace NodeJS {
        interface Global {
            log: any;
        }
    }
    var cmd: any;
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
import CreepUtil from "utils/creep/utils";
global.cmd = CreepUtil;
Memory.spawnTicks = {};

export const loop = ErrorMapper.wrapLoop(mainloop);
