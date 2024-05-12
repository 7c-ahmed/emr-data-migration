# EMR Data Migration Steps
This document contains detailed steps on the migration of emr data to prod along with relevant db scripts.


# Steps

## Step 1: Run Application Migration

Start the application to run its migration so that the orm can map the new columns made on to the database.

## Step 2: Execute raw SQL commands on database

Run the following sql commands on database

- UPDATE prescription_details SET  month  =  REPLACE(month, 'Month ', '') WHERE  month  LIKE  'Month %';
- UPDATE prescription_details SET parent_prescription_id = prescription_id WHERE parent_prescription_id IS  NULL;
- TRUNCATE  TABLE subscription_template;
- --Semaglutide
INSERT INTO subscription_template 
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('33f00637-80e3-45a9-a01d-fe9164db84dc', '1', 0, 1, '(Weeks 1-4)', '123ba87b-dfc2-4f0d-94a5-2d835c95fe6d', '123ba87b-dfc2-4f0d-94a5-2d835c95fe6d', 'feea4e11-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('33f00638-80e3-45a9-a01d-fe9164db84dc', '2', 0, 0, '(Weeks 5-8)', '123ba87b-dfc2-4f1d-94a5-2d835c95fe6d', '123ba87b-dfc2-4f1d-94a5-2d835c95fe6d', 'feea4e11-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('33f00639-80e3-45a9-a01d-fe9164db84dc', '3', 0, 0, '(Weeks 9-12)', '1c4ba87b-dfc2-4f2d-94a5-2d835c95fe6d', '1c4ba87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e11-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('33f00640-80e3-45a9-a01d-fe9164db84dc', '4', 0, 1, '(Weeks 13-16)', '1c5ba87b-dfc2-4f2d-94a5-2d835c95fe6d', '1c5ba87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e11-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('33f00641-80e3-45a9-a01d-fe9164db84dc', '5', 0, 0, '(Weeks 17-20)', '1c7ba87b-dfc2-4f2d-94a5-2d835c95fe6d', '1c7ba87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e11-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('33f00642-80e3-45a9-a01d-fe9164db84dc', '6', 0, 0, '(Weeks 21-24)', '1c7ba87b-dfc2-4f2d-94a5-2d835c95fe6d', '1c7ba87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e11-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('33f00643-80e3-45a9-a01d-fe9164db84dc', '7', 0, 1, '(Weeks 25-28)', '1c7ba87b-dfc2-4f2d-94a5-2d835c95fe6d', '1c7ba87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e11-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('33f00644-80e3-45a9-a01d-fe9164db84dc', '8', 0, 0, '(Weeks 29-32)', '1c7ba87b-dfc2-4f2d-94a5-2d835c95fe6d', '1c7ba87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e11-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('33f00645-80e3-45a9-a01d-fe9164db84dc', '9', 0, 0, '(Weeks 33-36)', '1c7ba87b-dfc2-4f2d-94a5-2d835c95fe6d', '1c7ba87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e11-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('33f00646-80e3-45a9-a01d-fe9164db84dc', '10', 0, 0, '(Weeks 37-40)', '1c7ba87b-dfc2-4f2d-94a5-2d835c95fe6d', '1c7ba87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e11-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('33f00647-80e3-45a9-a01d-fe9164db84dc', '11', 0, 0, '(Weeks 41-44)', '1c7ba87b-dfc2-4f2d-94a5-2d835c95fe6d', '1c7ba87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e11-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('33f00648-80e3-45a9-a01d-fe9164db84dc', '12', 0, 0, '(Weeks 45-48)', '1c7ba87b-dfc2-4f2d-94a5-2d835c95fe6d', '1c7ba87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e11-c125-4c24-a235-198ad7aeca74');

--Trizepatide

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('44f00637-80e3-45a9-a01d-fe9164db84dg', '1', 0, 1, '(Weeks 1-4)', '123ba87b-dfc2-4f0d-94a5-2d835c95fc6d', '123ba87b-dfc2-4f0d-94a5-2d835c95fc6d', 'feea4e22-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('44f00638-80e3-45a9-a01d-fe9164db84dg', '2', 0, 0, '(Weeks 5-8)', '1d3ca87b-dfc2-4f1d-94a5-2d835c95fe6d', '1d3ca87b-dfc2-4f1d-94a5-2d835c95fe6d', 'feea4e22-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('44f00639-80e3-45a9-a01d-fe9164db84dg', '3', 0, 0, '(Weeks 9-12)', '124bd87b-dfc2-4f2d-94a5-2d835c95fe6d', '124bd87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e22-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('44f00640-80e3-45a9-a01d-fe9164db84dg', '4', 0, 1, '(Weeks 13-16)', '126bd87b-dfc2-4f2d-94a5-2d835c95fe6d', '126bd87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e22-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('44f00641-80e3-45a9-a01d-fe9164db84dg', '5', 0, 0, '(Weeks 17-20)', '126bd87b-dfc2-4f2d-94a5-2d835c95fe6d', '126bd87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e22-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('44f00642-80e3-45a9-a01d-fe9164db84dg', '6', 0, 0, '(Weeks 21-24)', '126bd87b-dfc2-4f2d-94a5-2d835c95fe6d', '126bd87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e22-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('44f00643-80e3-45a9-a01d-fe9164db84dg', '7', 0, 1, '(Weeks 25-28)', '126bd87b-dfc2-4f2d-94a5-2d835c95fe6d', '126bd87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e22-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('44f00644-80e3-45a9-a01d-fe9164db84dg', '8', 0, 0, '(Weeks 29-32)', '126bd87b-dfc2-4f2d-94a5-2d835c95fe6d', '126bd87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e22-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('44f00645-80e3-45a9-a01d-fe9164db84dg', '9', 0, 0, '(Weeks 33-36)', '126bd87b-dfc2-4f2d-94a5-2d835c95fe6d', '126bd87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e22-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('44f00646-80e3-45a9-a01d-fe9164db84dg', '10', 0, 0, '(Weeks 37-40)', '126bd87b-dfc2-4f2d-94a5-2d835c95fe6d', '126bd87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e22-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('44f00647-80e3-45a9-a01d-fe9164db84dg', '11', 0, 0, '(Weeks 41-44)', '126bd87b-dfc2-4f2d-94a5-2d835c95fe6d', '126bd87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e22-c125-4c24-a235-198ad7aeca74');

INSERT INTO subscription_template
(id, month_number, need_blood_test, need_follow_up, week, variant_id, recomended_variant_id, product_id)
VALUES('44f00648-80e3-45a9-a01d-fe9164db84dg', '12', 0, 0, '(Weeks 45-48)', '126bd87b-dfc2-4f2d-94a5-2d835c95fe6d', '126bd87b-dfc2-4f2d-94a5-2d835c95fe6d', 'feea4e22-c125-4c24-a235-198ad7aeca74');

## Step 3: Execute Nodejs script

Run the nodejs script to add new prescription details for the weight loss orders