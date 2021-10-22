const Staff = require('../models/staffModel')
const Request = require('../models/requestModel')
const BusinessUnit = require('../models/businessUnitModel')
const RequestType = require('../models/requestTypeModel')
const RoleUser = require('../models/roleUserModel')
const Manager = require('../models/managerModel')
const WorkingTime = require('../models/workingTimeModel')
const { sendMail, alertLogRequest } = require("../middleware/sendingEmail");
const { file } = require('googleapis/build/src/apis/file')
const Excel = require('exceljs')
const cron = require('node-cron')



exports.staffHomePage = async (req, res) => {
    // res.render("staffdashboard/staff_home");
    res.send("i'm staff")
}

//!Search
//* Search for requests of Staff
exports.search_staff_request = async (req, res) => {
    const perPage = 5
    const page = req.query.p || 1

    const { TimeFrom, TimeTo, RT_Id, search } = req.query;

    let regExSearch = "";
    if (!search) {
        regExSearch = null;
    } else {
        regExSearch = new RegExp(search, "i")
    }
    const staff = await Staff.findOne({ account_id: req.session.userId }).populate('businessUnit_id')
    const request = await Request.find({
        owner_id: staff._id,
        $or: [
            { reason: regExSearch },
            { status: regExSearch },
            { requestType_id: RT_Id },
            { startDateOff: { $gte: TimeFrom, $lte: TimeTo } }
        ]
    }).populate('requestType_id')
        .populate('businessUnit_id')
        .skip((perPage * page) - perPage)
        .limit(perPage)
    const count = await Request.find({ owner_id: staff._id }).countDocuments()
        .populate('requestType_id')
        .populate('businessUnit_id')

    const requestType = await RequestType.find({})
    try {
        res.render("staffViews/staff_list_all_requests", {
            Request: request,
            RequestType: requestType,
            Staff: staff,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage)
            }
        })
    } catch (e) {
        res.status(400).send(e)
    }
}


//! Requests
//* List all request 
exports.list_all_requests = async (req, res) => {
    const perPage = 5
    const page = req.query.p || 1
    const { msg } = req.query

    const staff = await Staff.findOne({ account_id: req.session.userId }).populate('businessUnit_id')
    const request = await Request.find({ owner_id: staff._id })
        .populate('requestType_id')
        .populate('businessUnit_id')
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
    const count = await Request.find({ owner_id: staff._id }).countDocuments()
        .populate('requestType_id')
        .populate('businessUnit_id')

    const requestType = await RequestType.find({})

    try {
        res.render("staffViews/staff_list_all_requests", {
            Request: request,
            RequestType: requestType,
            Staff: staff,
            err: msg,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage)
            }
        })
    } catch (e) {
        res.status(400).send(e)
    }


}
//* Add Request 
//GET
exports.add_request = async (req, res) => {
    const requestType = await RequestType.find({})
    const staff = await Staff.findOne({ account_id: req.session.userId })
    try {
        res.render("staffViews/staff_add_request", {
            requestType: requestType,
            Staff: staff
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//POST
exports.addRequest = async (req, res) => {

    const {
        reason,
        startDateOff,
        endDateOff,
        requestType_id
    } = req.body


    const checkStaff = await Staff.findOne({ account_id: req.session.userId })
    if (!checkStaff) {
        res.status(401).send("unable to create request")
    }
    try {
        const newRequest = await new Request({
            reason: reason,
            startDateOff: startDateOff,
            endDateOff: endDateOff,
            requestType_id: requestType_id,
            owner_id: checkStaff._id,
            fileUpload: req.file.filename,
            businessUnit_id: checkStaff.businessUnit_id
        })
        const saveRequest = await newRequest.save()
        await checkStaff.request_id.push(saveRequest)
        await checkStaff.save()
        //push into BU
        const businessUnit = await BusinessUnit.findOne({ _id: saveRequest.businessUnit_id })
        await businessUnit.request_id.push(saveRequest)
        await businessUnit.save()

        res.redirect(`/staff/list_all_requests`)
        //!Send Email
        const manager = await Manager.findOne({ businessUnit_id: saveRequest.businessUnit_id })
        await sendMail(manager.email, checkStaff.name)
            .then((result) => {
                console.log("Email sent...", result);
            })
            .catch((err) => {
                console.log(err.message);
            });
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
    const staff = await Staff.findOne({ account_id: req.session.userId })
    const requestType = await RequestType.find({ _id: request.requestType_id })

    try {
        res.render("staffViews/staff_read_request", {
            Request: request,
            Staff: staff,
            RequestType: requestType
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//*Update Request
//GET
exports.update_request = async (req, res) => {
    const _id = req.params.id
    const request = await Request.findOne({ _id: _id }).populate('requestType_id').populate({
        path: "owner_id",
        populate: 'businessUnit_id'
    })
    const staff = await Staff.findOne({ account_id: req.session.userId })
    const requestType = await RequestType.find({ _id: request.requestType_id })

    if (request.status == 'Approved' || request.status == 'Denied') {
        const msg = "The request cannot be updated or deleted once it has been approved or Denied "
        return res.redirect(`/staff/list_all_requests?msg=${msg}`)
    }
    else {
        try {
            res.render("staffViews/staff_update_request", {
                Request: request,
                Staff: staff,
                RequestType: requestType
            })
        } catch (e) {
            res.status(400).send(e)
        }
    }

}
//PUT
exports.updateRequest = async (req, res) => {
    const {
        request_id,
        startDateOff,
        endDateOff,
        reason
    } = req.body

    const newValue = {}
    if (startDateOff) newValue.startDateOff = startDateOff
    if (endDateOff) newValue.endDateOff = endDateOff
    if (reason) newValue.reason = reason
    if (req.file) {
        const fileUpload = req.file.filename;
        newValue.fileUpload = fileUpload;
    }

    try {
        const request = await Request.findOne({ _id: request_id })
        const requestUpdate = await Request.findOneAndUpdate(
            { _id: request._id },
            { $set: newValue },
            { new: true, useFindAndModify: false }
        )

        res.redirect(`/staff/update_request/${request_id}`)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}
//*Delete Request
exports.deleteRequest = async (req, res) => {
    const { _id } = req.body
    const request = await Request.findOne({ _id: _id })

    if (request.status == 'Approved' || request.status == 'Denied') {
        const msg = "The request cannot be updated or deleted once it has been approved or Denied "
        return res.redirect(`/staff/list_all_requests?msg=${msg}`)
    }
    else {
        //pop out of old BU 
        const businessUnit = await BusinessUnit.findOneAndUpdate(
            { request_id: request._id, },
            { $pull: { request_id: request._id } },
            { safe: true, upsert: true }
        )
        //pop out of Staff
        const staff = await Staff.findOneAndUpdate(
            { request_id: request._id, },
            { $pull: { request_id: request._id } },
            { safe: true, upsert: true }
        )
        await request.remove()
        res.redirect(`/staff/list_all_requests`)

    }


}

//! Staff information
//* get information 
exports.get_all_information = async (req, res) => {
    const getStaff = await Staff.findOne({ account_id: req.session.userId }).populate("businessUnit_id").populate("account_id")
    if (!getStaff) {
        res.status(401).send("unable to get information")
    }

    try {
        res.render("staffViews/staff_get_information", {
            Staff: getStaff
        })

    } catch (e) {
        res.status(400).send(e)
    }

}
//* Update information
//GET
exports.update_information = async (req, res) => {
    const _id = req.params.id
    const { msg } = req.query
    const staffAcc = await Staff.findOne({ _id: _id }).populate("businessUnit_id").populate("account_id")
    try {
        res.render("staffViews/staff_update_information", {
            Staff: staffAcc,
            err: msg
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//PUT
exports.updateInformation = async (req, res) => {
    const {
        staff_id,
        password,
        name,
        email,
        fullName,
        phoneNumber,
        age,
        dayOfBirth
    } = req.body;

    const emailExist = await Staff.findOne({ email: email })

    if (emailExist) {
        const emailExist = "Email has already exist !!!";
        return res.redirect(`/staff/update_information/${staff_id}?msg=${emailExist}`);
    }

    const newValueRole = {}
    if (password) newValueRole.password = password

    const newValueStaff = {}
    if (name) newValueStaff.name = name
    if (email) newValueStaff.email = email
    if (fullName) newValueStaff.fullName = fullName
    if (phoneNumber) newValueStaff.phoneNumber = phoneNumber
    if (age) newValueStaff.age = age
    if (dayOfBirth) newValueStaff.dayOfBirth = dayOfBirth
    if (req.file) {
        const avatar = req.file.filename;
        newValueStaff.avatar = avatar;
    }

    try {
        const staff = await Staff.findOne({ _id: staff_id })
        const roleUpdate = await RoleUser.findOneAndUpdate(
            { _id: staff.account_id },
            { $set: newValueRole },
            { new: true, useFindAndModify: false }
        )

        const staffUpdate = await Staff.findOneAndUpdate(
            { _id: staff_id },
            { $set: newValueStaff },
            { new: true, useFindAndModify: false }
        )

        res.redirect(`/staff/get_all_information`)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

//! Download Excel
exports.download = async (req, res) => {
    const staff = await Staff.findOne({ account_id: req.session.userId }).populate('businessUnit_id')
    const request = await Request.find({ owner_id: staff._id })
        .populate('requestType_id')
        .populate('businessUnit_id')
        .then((objs) => {
            let requests = [];
            objs.forEach((obj) => {
                requests.push({
                    RT_name: obj.requestType_id.name,
                    reason: obj.reason,
                    startDateOff: obj.startDateOff,
                    endDateOff: obj.endDateOff,
                    status: obj.status,
                    BU_name: obj.businessUnit_id.name
                });
                console.log(requests)
            });


            let workbook = new Excel.Workbook();
            let worksheet = workbook.addWorksheet("requests");

            worksheet.columns = [
                { header: "Request Type", key: "RT_name", width: 50 },
                { header: "Reason", key: "reason", width: 25 },
                { header: "Start Date Off", key: "startDateOff", width: 25 },
                { header: "End Date Off", key: "endDateOff", width: 25 },
                { header: "Status", key: "status", width: 10 },
                { header: "Business Unit", key: "BU_name", width: 25 },
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

//! System automation - send Mail for remind log ticket request in every month in 27th at 13:30 
cron.schedule('30 13 27 * *', async () => {
    // var today = new Date();
    // var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // var dateTime = date + ' ' + time;

    // var date = new Date();
    // var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // console.log(lastDay)
    const staff = await Staff.find({})
        .then(allUsers => {
            for (let user of allUsers) {
                // // if (dateTime + (60)) {
                // if (lastDay) {
                //!Send Email
                alertLogRequest(user.email, user.name)
                    .then((result) => {
                        console.log("Email sent...", result);
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
            }
            // }
        })
})


// //! System automation - Date Working time
// exports.workingTime = async (req, res) => {
//     const staff = await Staff.findOne({ account_id: req.session.userId })
//     const workingTime = await WorkingTime.findOne({staff_id: staff._id})

//     var today = new Date();
//     var tomorrow = new Date().setDate(today.getDate() + 1);
//     console.log(today.getTime())
//     console.log(tomorrow)
//     console.log(staff.createdAt.getTime())

//     if( today >= staff.createdAt && today <= tomorrow ){
//         const request = await Request
//         .find({ _id: workingTime.staff_id })
//         .populate('owner_id')
//         .populate('requestType_id')
//         .populate('businessUnit_id')
//         .then(allRequests => {
//             for (let eachRequest of allRequests) {
//                 new WorkingTime({
//                     date: eachRequest.startDateOff,
//                     request_id: eachRequest._id,
//                     staff_id: eachRequest.owner_id,
//                     requestType_id: eachRequest.requestType_id
//                 })
//             }
//             console.log(allRequests)
//         })
//     }

// }

