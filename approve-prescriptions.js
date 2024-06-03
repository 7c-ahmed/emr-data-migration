/* 
  this js file is used to programitacally approve followup
  prescriptions based on the order number given
*/

const orderNumbersArray = [
 2689
];

const axios = require('axios');
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

// Connect to the database
connection.connect(async (err) => {
    if (err) {
        console.error('Error connecting to database: ', err);
        return;
    }

    try {

        // get order data from excel file
        // const filePath = 'test-excel.xlsx';
        // const jsonData = excelToJson(filePath);

        //parse the data and filter out the orders that have months = 1 and status = cancelled or updated
        // const filteredJSONData = jsonData.filter((item) => {
        //   if (item['months'] !== 1 && !item['status']) {
        //     return true
        //   } else {
        //     return false
        //   }
        // });

        //looping over order numbers to approve the corresponding prescriptions programmatically via api call
        console.log("total orders to sync: ", orderNumbersArray.length);
        for (let i = 0; i < orderNumbersArray.length; i++) {
            try {
                console.log(`${i+1}) approving order number ${orderNumbersArray[i]}`);
                // make api call to approve the prescription
                const payload = {
                    orderNumber: orderNumbersArray[i],
                    userId: "b32482a5-a153-4a09-9500-22d220066f33",
                    ip: "47.198.11.124"
                };
                const apiResponse = await makeApiCall(payload);
                await delay();
            } catch (error) {
                // logging order number in case of failure for tracking
                logError(orderNumbersArray[i], error.message);
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

async function makeApiCall(payload) {
    try {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://emr.rx.prod.sevencells.com/prescriptions/approvePrescriptionInternal',
            headers: { 
              'accept': 'application/json', 
              'accept-language': 'en-US,en;q=0.9', 
              'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZiZDBiMDk3LTFjMWEtNDUzNC05MTRhLWU0MWYyMGRiZjQwMSIsImVtYWlsIjoiYW5hdG9saXkuc2VyaGV5ZXYrM0BzZXZlbmNlbGxzLmNvbSIsImZpcnN0TmFtZSI6IlRlc3REb2N0b3IiLCJsYXN0TmFtZSI6IlRlc3RMYXN0TmFtZSIsImNyZWF0ZWRBdCI6IjIwMjMtMTEtMTVUMTQ6MTE6NTAuMDA1WiIsInVwZGF0ZWRBdCI6IjIwMjQtMDUtMzBUMTI6NDM6NTMuMDAwWiIsInR3b0ZhY3RvckF1dGhFbmFibGVkIjp0cnVlLCJyb2xlIjoiMjUzODgxMTktNGJjNy00OWIwLThkYWUtNDE0YTZmMmNjNzI3Iiwic3ViIjoiZmJkMGIwOTctMWMxYS00NTM0LTkxNGEtZTQxZjIwZGJmNDAxIiwiaWF0IjoxNzE3MDgxOTA2fQ.d8HaV7KpbAISXfHVKT0CEukO7KHlS1AbZdRnco9lqL4', 
              'cache-control': 'no-cache', 
              'content-type': 'application/json', 
            //   'origin': 'https://doctor-app.staging.sevencells.com', 
            //   'pragma': 'no-cache', 
            //   'referer': 'https://doctor-app.staging.sevencells.com/', 
            //   'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"', 
            //   'sec-ch-ua-mobile': '?0', 
            //   'sec-ch-ua-platform': '"Linux"', 
            //   'sec-fetch-dest': 'empty', 
            //   'sec-fetch-mode': 'cors', 
            //   'sec-fetch-site': 'same-site', 
            //   'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
            },
            data : JSON.stringify(payload)
          };
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error('Error making API call:', error.message);
        throw error;
    }
}

function delay() {
    return new Promise(resolve => setTimeout(resolve, 2000));
}