import {
    clear_creeps,
    count_cost,
    getCreeps,
    getCreepsBySpawn,
    getCreepsByRoom,
    getCreepsByCategory,
    watchSpawn,
    watchCreeps
} from "./watch";
import { trans2, transAll, transFree, transFulled, transPart, recover, recoverAll, recoverByCategory } from "./trans";
import { getRoomSpawnEnergy, getRoomExtensionEnergy, logSpawnStatus } from "./status";
import { test } from "./cmd";

export default {
    // test
    test,
    // get
    getCreeps,
    getCreepsByCategory,
    getCreepsBySpawn,
    getCreepsByRoom,
    // watch
    watchSpawn,
    watchCreeps,
    clear_creeps,
    count_cost,

    // trans
    trans2,
    transAll,
    transFree,
    transFulled,
    transPart,
    recover,
    recoverAll,
    recoverByCategory,

    // status
    getRoomSpawnEnergy,
    getRoomExtensionEnergy,
    logSpawnStatus
};
