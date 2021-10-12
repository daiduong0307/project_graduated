const express = require('express')
const route = express.Router()
const managerController = require('../controllers/managerController')
const chartController = require('../controllers/chartsController')
var { multerInstance } = require("../middleware/uploadImage");

//! Home Page - Dashboard
route.get("/home", chartController.chartManager);

//!Search
route.get('/search_staff_request', managerController.search_staff_request)
route.get('/search_business_unit', managerController.search_business_unit)
route.get('/search_request_type', managerController.search_request_type)

//! Manage Request 
//* List all Requests of Staff in their Business Unit 
route.get('/list_all_requests', managerController.list_all_requests)
//* Accept Request
route.put('/approved_request', managerController.approved_request)
//* Reject Request
route.put('/denied_request', managerController.denied_request)
//* Read Request
route.get('/read_request/:id', managerController.read_request)

//! Display list of Request Types and business Units
route.get('/list_all_request_types', managerController.list_all_request_types)
route.get('/list_all_business_units', managerController.list_all_business_units)

//! Information
//* Get information
route.get('/get_all_information', managerController.get_all_information)
//* Update information
route.get('/update_information/:id', managerController.update_information)
route.post('/updateInformation', multerInstance, managerController.updateInformation)

//!Download Excel
route.get('/download', managerController.download)

module.exports = route