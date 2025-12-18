const JP_LOCALE = "ja-JP";
const JP_TIMEZONE = "Asia/Tokyo";

export const formatDateJP = (date: string | Date) => {
  return new Date(date).toLocaleString(JP_LOCALE, {
    timeZone: JP_TIMEZONE,
  });
};
