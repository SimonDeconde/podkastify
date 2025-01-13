import { format, isSameDay } from "date-fns";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const replaceAll = (
  str: string,
  mapObj: { [index: string]: string }
): string => {
  var re = new RegExp(Object.keys(mapObj).join("|"), "gi");

  Object.keys(mapObj).map((key) => {
    str = str.replace(key, mapObj[key]);
  });

  return str;
};

export const getEmailRelevantName = (email: string): string => {
  const emailParts = email.split(/[@\+]/);
  return emailParts[1];
};

export const getIdSafe = (string: string): string => {
  return string.replace(/\W/g, "_").toLowerCase();
};

export const formatDateTimeSpan = (fromDt: Date, toDt: Date): string => {
  if (isSameDay(fromDt, toDt)) {
    return `${format(fromDt, `E, LLL d, y`)} - ${format(
      fromDt,
      "ha"
    )} to ${format(toDt, "ha")}`;
  }

  return `${format(fromDt, "E, LLL d, y ha")} - ${format(
    toDt,
    "E, LLL d, y ha"
  )}`;
};

export const formatDateTime = (dt: Date): string => {
  return `${format(dt, "E, LLL d, y ha")}`;
};
