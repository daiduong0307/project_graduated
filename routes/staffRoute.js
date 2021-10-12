const express = require('express')
const route = express.Router()
const staffController = require('../controllers/staffController')
var { multerInstance, multerInstanceFile } = require("../middleware/uploadImage");

  // Get Homepage
route.get("/home", staffController.staffHomePage);

//!Search
route.get('/search_staff_request', staffController.search_staff_request)

//! Request
//*List request 
route.get('/list_all_requests', staffController.list_all_requests)
//* Add request 
route.get('/add_request', staffController.add_request)
route.post('/addRequest', multerInstanceFile , staffController.addRequest)
//*Read request
route.get('/read_request/:id', staffController.read_request)
//* Update request 
route.get('/update_request/:id', staffController.update_request)
route.post('/updateRequest',multerInstanceFile , staffController.updateRequest)
//* Delete request 
route.delete('/deleteRequest', staffController.deleteRequest)

//! Information
//* Get information
route.get('/get_all_information', staffController.get_all_information)
//* Update information
route.get('/update_information/:id', staffController.update_information)
route.post('/updateInformation', multerInstance ,staffController.updateInformation)

//!Download Excel
route.get('/download', staffController.download)

// //! System automation - Date Working time
// route.get('/working_time_report', staffController.workingTime)

module.exports = route