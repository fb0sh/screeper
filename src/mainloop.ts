import Flag from "utils/flag";
import CreepUtil from "utils/creep/utils";
import room_s1 from "rooms/s1";

const mainloop = () => {
    CreepUtil.clear_creeps();

    let s1_data = room_s1();
    CreepUtil.logSpawnStatus(s1_data);

    // print all flags
    let all_flag_names = Flag.get_flag_names();
    if (all_flag_names.length != 0) {
        console.log(`[*] Flags: ${all_flag_names}`);
    }
};

export default mainloop;
