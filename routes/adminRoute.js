const adminController = require('../controllers/adminController')
const chartController = require('../controllers/chartsController')
const chatController = require('../controllers/chatController')
const express = require('express')
const route = express.Router()
var { multerInstance, multerInstanceFile } = require("../middleware/uploadImage");

//! Get homepage, Charts
route.get('/home', chartController.total)

//!Chat Room socket
route.get('/login_chat', chatController.loginChat) 
route.get('/chat_room', chatController.chatRoom)

//! Information Admin
//* Get information
route.get('/get_all_information', adminController.get_all_information)
//* Update information
route.get('/update_information/:id', adminController.update_information)
route.post('/updateInformation', multerInstance, adminController.updateInformation)

//! Search 
route.get('/search_admin', adminController.search_admin)
route.get('/search_staff', adminController.search_staff)
route.get('/search_manager', adminController.search_manager)
route.get('/search_business_unit', adminController.search_business_unit)
route.get('/search_request_type', adminController.search_request_type)
//*Search for Request of Staff
route.get('/search_staff_request/:id', adminController.search_staff_request)

//! Display list of users accounts, Request Types and business Units
route.get('/list_all_admins', adminController.list_all_admins)
route.get('/list_all_staffs', adminController.list_all_staffs)
route.get('/list_all_managers', adminController.list_all_managers)
route.get('/list_all_request_types', adminController.list_all_request_types)
route.get('/list_all_business_units', adminController.list_all_business_units)

//! Create Request For Staff
//*List request 
route.get('/list_all_requests_staff/:id', adminController.list_all_requests)
//* Add request 
route.get('/add_request/:id', adminController.add_request)
route.post('/addRequest', adminController.addRequest)
//*Read request
route.get('/read_request/:id', adminController.read_request)
//* Update request 
route.get('/update_request/:id', adminController.update_request)
route.post('/updateRequest',multerInstanceFile, adminController.updateRequest)
//* Delete request 
route.delete('/deleteRequest', adminController.deleteRequest)

//!Download Excel
route.get('/download/:id', adminController.download)

//! add accounts, topics and business units 
//* Admin
route.get("/add_admin", adminController.add_admin);
route.post('/addAdmin', adminController.addAdmin)

//* Staff
route.get("/add_staff", adminController.add_staff);
route.post('/addStaff', adminController.addStaff)

//*Manager
route.get('/add_manager', adminController.add_manager)
route.post('/addManager', adminController.addManager)

//*Business Unit
route.get('/add_business_unit', adminController.add_business_unit)
route.post('/addBusinessUnit', adminController.addBusinessUnit)

//* Request Type
route.get('/add_request_type', adminController.add_request_type)
route.post('/addRequestType', adminController.addRequestType)

//!Update accounts, topics and business units 
//*Admin
route.get('/update_admin/:id', adminController.update_admin)
route.put('/updateAdmin', adminController.updateAdmin)

//*Staff
route.get('/update_staff/:id', adminController.update_staff)
route.put('/updateStaff', adminController.updateStaff)

//*Manager
route.get('/update_manager/:id', adminController.update_manager)
route.put('/updateManager', adminController.updateManager)

//*Business Unit 
route.get('/update_business_unit/:id', adminController.update_business_unit)
route.put('/updateBusinessUnit', adminController.updateBusinessUnit)

//*Request Type
route.get('/update_request_type/:id', adminController.update_request_type)
route.put('/updateRequestType', adminController.updateRequestType)

//! Delete accounts, topics and business units
//*Admin
route.delete('/deleteAdmin', adminController.deleteAdmin)
//*Staff
route.delete('/deleteStaff', adminController.deleteStaff)
//*Manager
route.delete('/deleteManager', adminController.deleteManager)
//*Business Unit
route.delete('/deleteBusinessUnit', adminController.deleteBusinessUnit)
//*Request Type
route.delete('/deleteRequestType', adminController.deleteRequestType)

module.exports = route
