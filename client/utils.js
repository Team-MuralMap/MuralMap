const options = {
  day: "numeric",
  month: "short",
  year: "numeric",
};
const shortDateFormatter = new Intl.DateTimeFormat("en-GB", options);

export function convertDateShort(isoDate) {
  const dateObj = new Date(isoDate);
  return shortDateFormatter.format(dateObj);
}
