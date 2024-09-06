const fs = require("fs");
const path = require("path");
const {
  getRandomElement,
  generateRandomNumber,
  generateHeadliner,
  generateVenue,
  generateBoxOffice,
  generateEmail,
  generateDate,
  generateRandomBoolean,
  generateAccountId,
  generateSection,
  generateRandomRow,
} = require("./lib/utils");

// Ensure the outputs directory exists
const outputDir = path.join(__dirname, "./output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Used to create relationships
let numOfEvents = 0;
let numOfTicketsets = 0;

const generateEventsSql = (numRecords) => {
  let sql = `INSERT INTO admin_inventory.events (account_id, headliner, event_date, venue, city, state_code, high_risk)\nVALUES\n`;

  for (let i = 0; i < numRecords; i++) {
    // Venues is given as an object which needs to be destructured
    const venueObj = generateVenue();

    const account_id = generateAccountId();
    const headliner = generateHeadliner();
    const event_date = generateDate(-2, 12);
    const venue = venueObj.venue;
    const city = venueObj.city;
    const state_code = venueObj.stateCode;
    const high_risk = generateRandomBoolean();

    numOfEvents++; // Used to maintain relationships

    sql += `('${account_id}','${headliner}','${event_date}','${venue}','${city}','${state_code}',${high_risk})${
      i === numRecords - 1 ? " ON CONFLICT DO NOTHING;" : ","
    }\n`;
  }

  return sql;
};

const generateOrdersSQL = (numRecords) => {
  let sql = `INSERT INTO admin_inventory.orders (event_id, box_office, status_id, stock_type_id, seat_note_id, purchase_number, order_number, invoice_number, transfer_email, flipper_email)\nVALUES\n`;

  for (let i = 0; i < numRecords; i++) {
    const event_id = generateRandomNumber(1, numOfEvents);
    const box_office = generateBoxOffice();
    const status_id = generateRandomNumber(1, 32);
    const stock_type_id = generateRandomNumber(1, 6);
    const seat_note_id = generateRandomNumber(1, 4);
    const purchase_number = `PO${generateRandomNumber(100000, 999999)}`;
    const order_number = generateRandomNumber(100000, 999999);
    const invoice_number = `${generateRandomNumber(
      23,
      25
    )}-${generateRandomNumber(100000, 999999)}`;
    const transfer_email = generateEmail();
    const flipper_email = generateEmail();

    numOfTicketsets++;

    sql += `('${event_id}','${box_office}',${status_id},${stock_type_id},${seat_note_id},'${purchase_number}','${order_number}','${invoice_number}','${transfer_email}','${flipper_email}')${
      i === numRecords - 1 ? " ON CONFLICT DO NOTHING;" : ","
    }\n`;
  }

  return sql;
};

const generateSeatsSQL = () => {
  let sql = `INSERT INTO admin_inventory.seats (order_id, section, row, seat)\nVALUES\n`;

  for (let i = 0; i < numOfTicketsets; i++) {
    // Get the current order ID (sequentially)
    const order_id = i + 1;

    const section = generateSection(); // Function to generate a random section
    const row = generateRandomRow(); // Function to generate a random row
    const startSeat = generateRandomNumber(1, 5); // Random starting seat
    const endSeat = generateRandomNumber(startSeat, 8); // Random ending seat, ensuring it's >= startSeat

    for (let seat = startSeat; seat <= endSeat; seat++) {
      sql += `('${order_id}', '${section}', '${row}', ${seat})${
        i === numOfTicketsets - 1 && seat === endSeat
          ? " ON CONFLICT DO NOTHING;"
          : ",\n"
      }`;
    }
  }

  // Remove the trailing comma and add the final statement if necessary
  if (sql.endsWith(",\n")) {
    sql = sql.slice(0, -2) + " ON CONFLICT DO NOTHING;\n";
  }

  return sql;
};

// 1
const eventsSQL = generateEventsSql(750); // Generate the events first
fs.writeFileSync(
  path.join(outputDir, "populate_event_test_data_output.sql"),
  eventsSQL
); // Write the SQL to a file

// 2
const ordersSql = generateOrdersSQL(10000); // Then generate orders
fs.writeFileSync(
  path.join(outputDir, "populate_orders_test_data_output.sql"),
  ordersSql
); // Write the SQL to a file

// 3
const seatsSQL = generateSeatsSQL(); // Lastly generate seats
fs.writeFileSync(
  path.join(outputDir, "populate_seats_test_data_output.sql"),
  seatsSQL
); // Write the SQL to a file

console.log("SQL files generated in the outputs folder");
