const mysql = require('mysql');
require('dotenv').config();
// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: process.evn.DATABASE_HOST,
  user: process.evn.DATABASE_USERNAME,
  password: process.evn.DATABASE_PASSWORD,
  database: process.evn.DATABASE_SCHEMA,
  port: process.evn.DATABASE_PORT,
});

// Connect to the database
connection.connect(async (err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
    return;
  }
  console.log('Connected to database.');
  const getWeightLossOrderIdsQuery = `
  SELECT DISTINCT o.id as orderId
  from
  orders o
  inner join prescriptions p on p.order_id = o.id
  inner join products_variants pv on p.variant_id = pv.id
  inner join products p2 on pv.product_id = p2.id
  inner join categories c on p2.category_id = c.id
  where c.code = 'weight-loss' and o.subscription_type = 'One Time Purchase' and o.source = 'saleor'
  `;

  const getPrescriptionsByOrderIdQuery = `
  SELECT *
  from
  prescriptions p
  inner join products_variants pv on p.variant_id = pv.id
  inner join products p2 on pv.product_id = p2.id
  where p.order_id = ?`;

  const getPrescriptionDetailsByPrescriptionIdQuery = `
  SELECT *
  from
  prescription_details pd
  inner join products_variants pv on pd.recomended_variant_id = pv.id
  inner join products p on pv.product_id = p.id
  where pd.prescription_id = ?`;

  const getSubscriptionTemplateByProductIdQuery = `
  SELECT *
  from
  subscription_template st
  where st.product_id = ?
  ORDER BY CAST(st.month_number AS SIGNED);`;

  const getProductByPrescriptionIdQuery = `
  SELECT *
  from
  prescription p
  inner join products_variants pv on p.variant_id = pv.id
  inner join products p2 on pv.product_id = p2.id
  where p.id = ?`;

  const insertPrescriptionDetailsQuery = `
  INSERT INTO prescription_details (id, month, need_blood_test, need_follow_up, status, week, prescription_id, variant_id, recomended_variant_id, parent_prescription_id, order_id)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  const updatePrescriptionDetailsQuery = `
  UPDATE prescription_details
  SET recomended_variant_id = ?
  WHERE prescription_id = ? and month = ?;`;

  try {
    //finding all the orderIds for weight loss category
    const orderIds = (await runQuery(getWeightLossOrderIdsQuery, connection)).map(order => order.orderId);
    console.log('orderIds', orderIds.length);
    let mainPrescriptionsArray = [];
    //the orders can have multiple prescriptions due to add on products so we need to get the main prescriptions
    if (orderIds && orderIds.length && orderIds.length > 0) {
      for (let i = 0; i < orderIds.length; i++) {
        //getting all the prescriptions against a single orderId
        const prescriptions = await runQuery(getPrescriptionsByOrderIdQuery, connection, [orderIds[i]]);
        if (prescriptions && prescriptions.length && prescriptions.length > 0) {
          //getting the main prescription which has answers
          const mainPrescriptions = prescriptions.filter(prescription => prescription.has_answers === 1);
          mainPrescriptionsArray = [...mainPrescriptionsArray, ...mainPrescriptions];
        }
      }
      console.log('mainPrescriptionsArray', mainPrescriptionsArray.length);
      //find orderId that is not present in mainPrescriptionsArray
        const orderIdsNotPresent = orderIds.filter(orderId => !mainPrescriptionsArray.some(prescription => prescription.order_id === orderId));
        console.log('orderIdsNotPresent', orderIdsNotPresent);
    }
    // //once we retrieve main prescriptions, we need to add the next 9 months prescription details
    // if (mainPrescriptionsArray && mainPrescriptionsArray.length && mainPrescriptionsArray.length > 0) {
    //   for (let j = 0; j < mainPrescriptionsArray.length; j++) {
    //     //assuming that prescription details exist since the main prescription must have 3 months prescription details existing
    //     //finding subscription template by product id to insert the next 9 months prescription details
    //     const subscriptionTemplates = await runQuery(getSubscriptionTemplateByProductIdQuery, connection, [mainPrescriptionsArray[j].product_id]);
    //     if (subscriptionTemplates && subscriptionTemplates.length && subscriptionTemplates.length > 0) {
    //       for (let k =0; k < 3; k++) {
    //         const updateResults = await runQuery(updatePrescriptionDetailsQuery, connection, [
    //           subscriptionTemplates[k].recomended_variant_id,
    //           mainPrescriptionsArray[j].id,
    //           subscriptionTemplates[k].month_number
    //         ]);
    //       }
    //       //starting from 3rd index because the first 3 months are already existing in the main prescription
    //       for (let k = 3; k < subscriptionTemplates.length; k++) {
    //         const id = uuidv4();
    //         const insertResults = await runQuery(insertPrescriptionDetailsQuery, connection, [
    //           id,
    //           subscriptionTemplates[k].month_number,
    //           subscriptionTemplates[k].need_blood_test,
    //           subscriptionTemplates[k].need_follow_up,
    //           1,
    //           subscriptionTemplates[k].week,
    //           mainPrescriptionsArray[j].id,
    //           subscriptionTemplates[k].variant_id,
    //           subscriptionTemplates[k].recomended_variant_id,
    //           mainPrescriptionsArray[j].id,
    //           null
    //         ]);
    //         console.log("insertResults", insertResults);
    //       }
    //     }
    //   }
    // }
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