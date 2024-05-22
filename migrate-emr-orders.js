/* 
  this js file is used to update the prescription details status
  to approved based on the number of months and order number to 
  approved as defined in the excel file 
*/


const XLSX = require('xlsx');
const fs = require('fs');
const mysql = require('mysql');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { logError } = require('./log-error');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_SCHEMA,
  port: process.env.DATABASE_PORT,
});

const getPrescriptionDetailsByOrderNumberQuery = `
SELECT pd.*
from
prescription_details pd
inner join prescriptions p on pd.parent_prescription_id = p.id
inner join orders o on p.order_id = o.id
where o.order_number = ?
AND CAST(pd.month AS SIGNED)<4
AND CAST(pd.month AS SIGNED)>1
ORDER BY CAST(pd.month AS SIGNED)`;

const updatePrescriptionDetailsStatusQuery = `
  UPDATE prescription_details
  SET status = ?
  WHERE id = ?;`;

// Connect to the database
connection.connect(async (err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
    return;
  }

  try {

    // get order data from excel file
    const filePath = 'test-excel.xlsx';
    const jsonData = excelToJson(filePath);

    //parse the data and filter out the orders that have months = 1 and status = cancelled or updated
    const filteredJSONData = jsonData.filter((item) => {
      if (item['months'] !== 1 && !item['status']) {
        return true
      } else {
        return false
      }
    });

    // { orderNumber: 810, name: 'darla mirabal', months: 3 },

    if (filteredJSONData && filteredJSONData.length > 0) {
      console.log("total orders to sync: ", filteredJSONData.length)
      //looping over the order numbers and updating respective prescription details
      for (let i = 0; i < filteredJSONData.length; i++) {
        try {
          await beginTransaction(connection);
          // fetching prescription details by order number sorted by ascending order of month
          const prescriptionDetails = await runQuery(getPrescriptionDetailsByOrderNumberQuery, connection, [filteredJSONData[i]['orderNumber']]);
          if (prescriptionDetails && prescriptionDetails.length > 0) {
            //looping over the prescription details and updating the status to approved based on the number of months to approved as defined in excel file
            for (let j = 0; j < filteredJSONData[i]['months']-1; j++) {
              const updateResults = await runQuery(updatePrescriptionDetailsStatusQuery, connection, [
                2,
                prescriptionDetails[j].id
              ]);
              console.log(`Updated prescription details for order number: ${filteredJSONData[i]['orderNumber']} and prescription detail id: ${prescriptionDetails[j].id}`)
            }
          }
          await commitTransaction(connection);
        } catch (error) {
          console.error('Error running query: ', error);
          await rollbackTransaction(connection);
          logError(filteredJSONData[i]['orderNumber'], error.message)
        }
      }
    }
  } catch (error) {
    console.error('Error running query: ', error);
  } finally {
    connection.end();
  }
});

function runQuery(query, connection, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });

  })
}

async function beginTransaction(connection) {
  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function commitTransaction(connection) {
  return new Promise((resolve, reject) => {
    connection.commit((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function rollbackTransaction(connection) {
  return new Promise((resolve, reject) => {
    connection.rollback((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function excelToJson(filePath) {
  // Read the Excel file
  const workbook = XLSX.readFile(filePath);

  // Get the first sheet name
  const sheetName = workbook.SheetNames[1];
  console.log("sheetname", sheetName)

  // Get the first sheet
  const sheet = workbook.Sheets[sheetName];

  // Convert sheet to JSON
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  return jsonData;
}