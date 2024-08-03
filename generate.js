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
const { v4: uuidv4 } = require("uuid");

// Ensure the outputs directory exists
const outputDir = path.join(__dirname, "./output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Used to create relationships
const eventIds = [];
const orderIds = [];

const generateEventsSql = (numRecords) => {
  let sql = `INSERT INTO admin_inventory.events (id, account_id, headliner, event_date, venue, city, state_code, high_risk)\nVALUES\n`;

  for (let i = 0; i < numRecords; i++) {
    // Venues is given as an object which needs to be destructured
    const venueObj = generateVenue();

    const id = uuidv4();
    const account_id = generateAccountId();
    const headliner = generateHeadliner();
    const event_date = generateDate(-2, 12);
    const venue = venueObj.venue;
    const city = venueObj.city;
    const state_code = venueObj.stateCode;
    const high_risk = generateRandomBoolean();

    eventIds.push(id); // Used to maintain relationships

    sql += `('${id}','${account_id}','${headliner}','${event_date}','${venue}','${city}','${state_code}',${high_risk})${
      i === numRecords - 1 ? " ON CONFLICT DO NOTHING;" : ","
    }\n`;
  }

  return sql;
};

const generateOrdersSQL = (numRecords) => {
  let sql = `INSERT INTO admin_inventory.orders (id, event_id, box_office, status_id, stock_type_id, seat_note_id, purchase_number, order_number, invoice_number, transfer_email, flipper_email)\nVALUES\n`;

  for (let i = 0; i < numRecords; i++) {
    const id = uuidv4();
    const event_id = getRandomElement(eventIds);
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

    orderIds.push(id);

    sql += `('${id}','${event_id}','${box_office}',${status_id},${stock_type_id},${seat_note_id},'${purchase_number}','${order_number}','${invoice_number}','${transfer_email}','${flipper_email}')${
      i === numRecords - 1 ? " ON CONFLICT DO NOTHING;" : ","
    }\n`;
  }

  return sql;
};

const generateSeatsSQL = (numRecords) => {
  let sql = `INSERT INTO admin_inventory.seats (order_id, section, row, seat)\nVALUES\n`;

  for (let i = 0; i < numRecords; i++) {
    if (orderIds.length === 0) {
      break; // Stop generating seats if orderIds is empty
    }

    const order_id = getRandomElement(orderIds);
    // Remove the selected order_id from orderIds
    orderIds.splice(orderIds.indexOf(order_id), 1);

    const section = generateSection();
    const row = generateRandomRow();
    const startSeat = generateRandomNumber(1, 30); // Random starting seat
    const endSeat = generateRandomNumber(startSeat, 32); // Random ending seat, ensuring it is >= startSeat

    for (let seat = startSeat; seat <= endSeat; seat++) {
      sql += `('${order_id}','${section}','${row}',${seat})${
        i === numRecords - 1 && seat === endSeat
          ? " ON CONFLICT DO NOTHING;"
          : ","
      }\n`;
    }
  }

  // Remove the trailing comma if the loop was exited early
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
const seatsSQL = generateSeatsSQL(25000); // Lastly generate seats
fs.writeFileSync(
  path.join(outputDir, "populate_seats_test_data_output.sql"),
  seatsSQL
); // Write the SQL to a file

console.log("SQL files generated in the outputs folder");
