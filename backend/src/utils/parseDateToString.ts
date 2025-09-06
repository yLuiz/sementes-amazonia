import * as moment from "moment";

export const parseDateToString = (date: Date | string): string => {
  if (!date) return '';

  const momentDate = moment(date);
  return momentDate.isValid() ? momentDate.format('YYYY-MM-DD HH:mm:ss') : '';
};
