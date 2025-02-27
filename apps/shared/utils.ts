import { format, formatDistanceToNowStrict, isSameDay } from "date-fns";

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
  return `${format(dt, "E, LLL d, y HH:mm:ss")}`;
};

export const formatDate = (dt: Date): string => {
  return `${format(dt, "E, LLL d, y")}`;
};

export const formatHhMmSsDuration = (seconds: number): string => {
  return new Date(seconds * 1000).toISOString().substr(11, 8);
};

export const timeAgo = (dt: Date): string => {
  return formatDistanceToNowStrict(dt) + ` ago`;
};

export const escapeXml = (
  unsafe: string | null | undefined
): string | null | undefined => {
  if (!unsafe) return unsafe;

  return (
    unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case "'":
          return "&apos;";
        case '"':
          return "&quot;";
        default:
          return c;
      }
    }) || ""
  );
};

/**
 * Helper type guard for filtering objects that are undefined or null. This is needed to
 * allow `array.filter` to narrow the types inside the array.
 *
 * Reference: https://github.com/microsoft/TypeScript/issues/16069
 */
export const isPresent = <T>(obj: T | undefined | null | void): obj is T =>
  obj !== undefined && obj !== null;
