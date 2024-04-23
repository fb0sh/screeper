import { errorMapper } from "./modules/errorMapper";

const mainloop = () => {
  console.log(123);
};

export const loop = errorMapper(mainloop);
