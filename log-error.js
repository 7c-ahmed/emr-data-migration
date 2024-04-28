const fs = require('fs');
const path = require('path');
function createFileOrAppendData(orderId, message) {
    const currentDate = new Date().toISOString().slice(0, 10);
    const fileName = `${currentDate}.txt`;
    const filePath = path.join(__dirname, fileName);
    if (fs.existsSync(filePath)) {
        fs.appendFileSync(filePath, `${orderId} - ${message || 'Unable to sync data.'}\n`, 'utf-8');
    } else {
        fs.writeFileSync(filePath, `${orderId} - ${message || 'Unable to sync data.'}\n`, 'utf-8');
    }
}

function logError(orderId, message) {
    createFileOrAppendData(orderId, message);
}

module.exports = { logError }