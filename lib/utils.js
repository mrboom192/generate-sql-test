const {
  HEADLINERS,
  VENUES,
  BOX_OFFICES,
  HIGH_RISK_MESSAGES,
  EMAIL_BETWEEN,
  EMAIL_SITES,
  FIRST_NAMES,
  LAST_NAMES,
  ACCOUNT_IDS,
} = require("./constants");

const generateRandomBoolean = () => Math.random() < 0.5;

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateRandomNumber = (min, max) =>
  Math.round(Math.random() * (max - min) + min);

const escapeString = (str) => str.replace(/'/g, "''");

const generateHeadliner = () => escapeString(getRandomElement(HEADLINERS));

const generateAccountId = () => getRandomElement(ACCOUNT_IDS);

const generateVenue = () => {
  const venueObj = getRandomElement(VENUES);
  return {
    venue: escapeString(venueObj.venue),
    city: escapeString(venueObj.city),
    stateCode: escapeString(venueObj.stateCode),
  };
};

const generateBoxOffice = () => escapeString(getRandomElement(BOX_OFFICES));

const getRandomHighRiskMessage = () =>
  Math.random() < 0.5
    ? escapeString(getRandomElement(HIGH_RISK_MESSAGES))
    : null;

const generateRandomName = () =>
  escapeString(
    `${getRandomElement(FIRST_NAMES)} ${getRandomElement(LAST_NAMES)}`
  );

const generateEmail = () => {
  return `${generateRandomName()
    .toLowerCase()
    .replace(/ /g, getRandomElement(EMAIL_BETWEEN))}${getRandomElement([
    "",
    generateRandomNumber(0, 9999),
  ])}@${getRandomElement(EMAIL_SITES)}.com`;
};

const generatePastDate = () => {
  const now = new Date();
  const past = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime())
  ).toISOString();
};

const generateDate = (minMonths = 1, maxMonths = 3) => {
  const currentDate = new Date(); // Get the current date
  const startDate = new Date(currentDate.getTime()); // Create a new date object from the current date
  const endDate = new Date(currentDate.getTime()); // Create another new date object for the end date

  // Set the date to minMonths into the past
  startDate.setMonth(currentDate.getMonth() + minMonths);

  // Set the date to maxMonths into the past
  endDate.setMonth(currentDate.getMonth() + maxMonths);

  // Generate a random date between startDate and endDate
  const timeDifference = endDate.getTime() - startDate.getTime();
  const randomTime = Math.random() * timeDifference;

  const randomPastDate = new Date(startDate.getTime() + randomTime);
  return randomPastDate.toISOString();
};

const generateSection = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 3; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return escapeString(result);
};

const generateRandomRow = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return escapeString(
    letters.charAt(Math.floor(Math.random() * letters.length))
  );
};

module.exports = {
  getRandomElement,
  generateRandomNumber,
  generateHeadliner,
  generateVenue,
  generateBoxOffice,
  getRandomHighRiskMessage,
  generateRandomName,
  generateEmail,
  generatePastDate,
  generateDate,
  generateRandomBoolean,
  generateAccountId,
  generateSection,
  generateRandomRow,
  escapeString,
};
