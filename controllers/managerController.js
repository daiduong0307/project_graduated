const Manager = require('../models/managerModel')
const RoleUser = require('../models/roleUserModel')
const RequestType = require('../models/requestTypeModel')
const Request = require('../models/requestModel')
const BusinessUnit = require('../models/businessUnitModel')
const Staff = require('../models/staffModel')
const Excel = require('exceljs')
const cron = require('node-cron')
const { alertApproval } = require("../middleware/sendingEmail");

// exports.managerHomePage = async (req, res) => {
//     const checkManager = await Manager.findOne({ account_id: req.session.userId })
//     res.render("managerViews/manager_home", {
//         Manager: checkManager,
//     });
// }

//!Search
//* Search for requests of Staff
exports.search_staff_request = async (req, res) => {
    const perPage = 5
    const page = req.query.p || 1

    const { TimeFrom, TimeTo, RT_Id, search, Staff_Id } = req.query;

    let regExSearch = "";
    if (!search) {
        regExSearch = null;
    } else {
        regExSearch = new RegExp(search, "i")
    }

    const checkManager = await Manager.findOne({ account_id: req.session.userId })
        .populate('businessUnit_id')
    const requestType = await RequestType.find({})
    if (checkManager.businessUnit_id) {
        const staff = await Staff.find({ businessUnit_id: checkManager.businessUnit_id })
        const request = await Request.find({
            businessUnit_id: checkManager.businessUnit_id,
            $or: [
                { reason: regExSearch },
                { status: regExSearch },
                { owner_id: Staff_Id },
                { requestType_id: RT_Id },
                { startDateOff: { $gte: TimeFrom, $lte: TimeTo } }
            ]

        }).populate('owner_id')
            .populate('requestType_id')
            .populate('businessUnit_id')
            .skip((perPage * page) - perPage)
            .limit(perPage)
        const count = await Request.find({ businessUnit_id: checkManager.businessUnit_id }).countDocuments()
            .populate('owner_id')
            .populate('requestType_id')
            .populate('businessUnit_id')

        res.render("managerViews/manager_list_all_requests", {
            Requests: request,
            Manager: checkManager,
            RequestType: requestType,
            Staff: staff,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage)
            }
        })

    }
}
//*Search for BU
exports.search_business_unit = async (req, res) => {
    const perPage = 5
    const page = req.query.p || 1

    const { TimeFrom, TimeTo, BU_Id, search } = req.query;

    let regExSearch = "";
    if (!search) {
        regExSearch = null;
    } else {
        regExSearch = new RegExp(search, "i")
    }
    const checkManager = await Manager.findOne({ account_id: req.session.userId })
        .populate('businessUnit_id')
    // let search = new RegExp(req.body.search, "i")
    const businessUnit = await BusinessUnit.find({
        $or: [
            { name: regExSearch },
            { description: regExSearch },
            { _id: BU_Id },
            { createdAt: { $gte: TimeFrom, $lte: TimeTo } }
        ]
    }).populate("amountRequests_id")
        .skip((perPage * page) - perPage)
        .limit(perPage)
    const count = await BusinessUnit.find({}).countDocuments()
        .populate("amountRequests_id")

    try {
        res.render("managerViews/manager_list_business_units", {
            BusinessUnit: businessUnit,
            Manager: checkManager,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage)
            }
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//*Search for Request Type
exports.search_request_type = async (req, res) => {
    const perPage = 5
    const page = req.query.p || 1

    const { TimeFrom, TimeTo, RT_Id, search } = req.query;

    let regExSearch = "";
    if (!search) {
        regExSearch = null;
    } else {
        regExSearch = new RegExp(search, "i")
    }
    const checkManager = await Manager.findOne({ account_id: req.session.userId })
        .populate('businessUnit_id')
    // let search = new RegExp(req.body.search, "i")
    const requestType = await RequestType.find({
        $or: [
            { name: regExSearch },
            { description: regExSearch },
            { _id: RT_Id },
            { createdAt: { $gte: TimeFrom, $lte: TimeTo } }
        ]
    }).skip((perPage * page) - perPage)
        .limit(perPage)
    const count = await RequestType.find({}).countDocuments()

    try {
        res.render("managerViews/manager_list_request_types", {
            RequestType: requestType,
            Manager: checkManager,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage)
            }
        })
    } catch (e) {
        res.status(400).send(e)
    }
}

//! Manage Request 
//* List all Requests
exports.list_all_requests = async (req, res) => {
    const perPage = 5
    const page = req.query.p || 1

    const requestType = await RequestType.find({})
    const checkManager = await Manager.findOne({ account_id: req.session.userId }).populate('businessUnit_id')
    try {
        if (checkManager.businessUnit_id) {
            //for search
            const staff = await Staff.find({ businessUnit_id: checkManager.businessUnit_id })

            const request = await Request.find({ businessUnit_id: checkManager.businessUnit_id })
                .populate('owner_id')
                .populate('requestType_id')
                .populate('businessUnit_id')
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .sort({createdAt: -1})
            const count = await Request.find({ businessUnit_id: checkManager.businessUnit_id }).countDocuments()
                .populate('owner_id')
                .populate('requestType_id')
                .populate('businessUnit_id')

            res.render("managerViews/manager_list_all_requests", {
                Requests: request,
                Manager: checkManager,
                RequestType: requestType,
                Staff: staff,
                pagination: {
                    page: page,
                    pageCount: Math.ceil(count / perPage)
                }
            })
        }
    } catch (e) {
        res.status(400).send(e)
    }

}
//* Approved Requests
exports.approved_request = async (req, res) => {
    const { _id } = req.body
    const newValue = 'Approved'

    try {
        const request = await Request.findOne({ _id: _id })
        const requestUpdate = await Request.findOneAndUpdate(
            { _id: request._id },
            { $set: { status: newValue } },
            { new: true, useFindAndModify: false }
        )
        res.redirect(`/manager/list_all_requests`)
    } catch (e) {
        res.status(400).send(e)
    }

}
//* Denied Requests
exports.denied_request = async (req, res) => {
    const { _id } = req.body
    const newValue = 'Denied'

    try {
        const request = await Request.findOne({ _id: _id })
        const requestUpdate = await Request.findOneAndUpdate(
            { _id: request._id },
            { $set: { status: newValue } },
            { new: true, useFindAndModify: false }
        )
        res.redirect(`/manager/list_all_requests`)
    } catch (e) {
        res.status(400).send(e)
    }
}
//* Read Request
exports.read_request = async (req, res) => {
    const _id = req.params.id
    const request = await Request.findOne({ _id: _id }).populate('requestType_id').populate({
        path: "owner_id",
        populate: 'businessUnit_id'
    })
    const staff = await Staff.findOne({request_id: request._id})
    const checkManager = await Manager.findOne({ account_id: req.session.userId }).populate('businessUnit_id')
    const requestType = await RequestType.find({ _id: request.requestType_id })

    try {
        res.render("managerViews/manager_read_request", {
            Request: request,
            Manager: checkManager,
            Staff: staff,
            RequestType: requestType
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//! Request & Business Unit
//* list all business unit 
exports.list_all_business_units = async (req, res) => {
    const perPage = 5
    const page = req.query.p || 1

    const checkManager = await Manager.findOne({ account_id: req.session.userId })
    const businessUnit = await BusinessUnit.find({})
        .populate("amountRequests_id")
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({createdAt: -1})
    const count = await BusinessUnit.find({}).countDocuments()
        .populate("amountRequests_id")

    try {
        res.render("managerViews/manager_list_business_units", {
            BusinessUnit: businessUnit,
            Manager: checkManager,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage)
            }
        })
    } catch (error) {
        res.status(400).send(error)
    }

}
//* List all Request Types
exports.list_all_request_types = async (req, res) => {
    const perPage = 5
    const page = req.query.p || 1

    const checkManager = await Manager.findOne({ account_id: req.session.userId })
    const requestType = await RequestType.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({createdAt: -1})
    const count = await RequestType.find({}).countDocuments()

    try {
        res.render("managerViews/manager_list_request_types", {
            RequestType: requestType,
            Manager: checkManager,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage)
            }
        })
    } catch (error) {
        res.status(400).send(error)
    }
}

//! Manager information
//* get information 
exports.get_all_information = async (req, res) => {
    const getManager = await Manager.findOne({ account_id: req.session.userId }).populate("businessUnit_id").populate("account_id")
    if (!getManager) {
        res.status(401).send("unable to get information")
    }

    try {
        res.render("managerViews/manager_get_information", {
            Manager: getManager
        })

    } catch (e) {
        res.status(400).send(e)
    }

}
//* Update information
//GET
exports.update_information = async (req, res) => {
    const _id = req.params.id
    const managerAcc = await Manager.findOne({ _id: _id }).populate("businessUnit_id").populate("account_id")
    try {
        res.render("managerViews/manager_update_information", {
            Manager: managerAcc
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//PUT
exports.updateInformation = async (req, res) => {
    const {
        manager_id,
        password,
        name,
        email,
        fullName,
        phoneNumber,
        age,
        dayOfBirth
    } = req.body;

    const newValueRole = {}
    if (password) newValueRole.password = password

    const newValueManager = {}
    if (name) newValueManager.name = name
    if (email) newValueManager.email = email
    if (fullName) newValueManager.fullName = fullName
    if (phoneNumber) newValueManager.phoneNumber = phoneNumber
    if (age) newValueManager.age = age
    if (dayOfBirth) newValueManager.dayOfBirth = dayOfBirth
    if (req.file) {
        const avatar = req.file.filename;
        newValueManager.avatar = avatar;
    }

    try {
        const manager = await Manager.findOne({ _id: manager_id })
        const roleUpdate = await RoleUser.findOneAndUpdate(
            { _id: manager.account_id },
            { $set: newValueRole },
            { new: true, useFindAndModify: false }
        )

        const managerUpdate = await Manager.findOneAndUpdate(
            { _id: manager_id },
            { $set: newValueManager },
            { new: true, useFindAndModify: false }
        )

        res.redirect(`/manager/get_all_information`)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

//! Download Excel
exports.download = async (req, res) => {
    const checkManager = await Manager.findOne({ account_id: req.session.userId }).populate('businessUnit_id')
    try {
        if (checkManager.businessUnit_id) {
            const request = await Request.find({ businessUnit_id: checkManager.businessUnit_id })
                .populate('owner_id')
                .populate('requestType_id')
                .populate('businessUnit_id')
                .sort({createdAt: -1})
                .then((objs) => {
                    let requests = [];
                    objs.forEach((obj) => {
                        requests.push({
                            Requester: obj.owner_id.name,
                            RT_name: obj.requestType_id.name,
                            reason: obj.reason,
                            startDateOff: obj.startDateOff,
                            endDateOff: obj.endDateOff,
                            status: obj.status
                        });
                        console.log(requests)
                    });
        
        
                    let workbook = new Excel.Workbook();
                    let worksheet = workbook.addWorksheet("requests");
        
                    worksheet.columns = [
                        { header: "Requester", key: "Requester", width: 25 },
                        { header: "Request Type", key: "RT_name", width: 50 },
                        { header: "Reason", key: "reason", width: 25 },
                        { header: "Start Date Off", key: "startDateOff", width: 25 },
                        { header: "End Date Off", key: "endDateOff", width: 25 },
                        { header: "Status", key: "status", width: 10 },
                    ];
        
                    // Add Array Rows
                    worksheet.addRows(requests);
                    worksheet.autoFilter = 'A1:F1';
        
                    worksheet.eachRow(function (row, rowNumber) {
        
                        row.eachCell((cell, colNumber) => {
                            if (rowNumber == 1) {
                                // First set the background of header row
                                cell.fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: 'f5b914' }
                                }
                            }
                            // Set border of each cell 
                            cell.border = {
                                top: { style: 'thin' },
                                left: { style: 'thin' },
                                bottom: { style: 'thin' },
                                right: { style: 'thin' }
                            };
                        })
                        //Commit the changed row to the stream
                        row.commit();
                    });
                    res.setHeader(
                        "Content-Type",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    );
                    res.setHeader(
                        "Content-Disposition",
                        "attachment; filename=" + "requests.xlsx"
                    );
        
                    return workbook.xlsx.write(res).then(function () {
                        res.status(200).end();
                    });
                });
        }
    } catch (e) {
        res.status(400).send(e)
    }
}

//! System automation - send Mail for remind Manager to approve or reject ticket request in every month in 27th at 13:30 
cron.schedule('30 13 27 * *', async () => {
    const manager = await Manager.find({})
        .then(allUsers => {
            for (let user of allUsers) {
                    //!Send Email
                    alertApproval(user.email, user.name)
                        .then((result) => {
                            console.log("Email sent...", result);
                        })
                        .catch((err) => {
                            console.log(err.message);
                        });
                }
        })
})

