const XLSX = require('xlsx');
const fs = require('fs');

// Function to read Excel file and parse to JSON
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

// Specify the path to your Excel file
const filePath = 'test-excel.xlsx';

// Call the function and get the JSON data
const jsonData = excelToJson(filePath);

const filteredJSONData = jsonData.filter((item) => {
  if(item['months'] === 1 && !item['status']) {
    return true
  } else {
    return false
  }
}).map((item) => {
    return item['orderNumber']
});

console.log(filteredJSONData);
const dataString = filteredJSONData.join(',');

// Optionally, write the JSON data to a file
fs.writeFileSync('output.txt', dataString);
