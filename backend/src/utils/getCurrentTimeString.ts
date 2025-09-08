import * as moment from "moment";

export const getCurrentTimeString = (): string => {
    return moment().format("YYYY-MM-DD HH:mm:ss");
};
