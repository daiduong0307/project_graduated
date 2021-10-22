const RoleUser = require("../models/roleUserModel");
const Admin = require("../models/adminModel");
const Staff = require("../models/staffModel");
const Manager = require("../models/managerModel");
const BusinessUnit = require("../models/businessUnitModel");
const RequestType = require("../models/requestTypeModel");
const Request = require("../models/requestModel");
const Excel = require('exceljs')
const { adminAproved } = require("../middleware/sendingEmail");
const { admin } = require("googleapis/build/src/apis/admin");


//! This field for Search
//* Search for Admin
exports.search_admin = async (req, res) => {
    const perPage = 5
    const page = req.query.p || 1

    const { TimeFrom, TimeTo, search, Admin_Id } = req.query;

    let regExSearch = "";
    if (!search) {
        regExSearch = null;
    } else {
        regExSearch = new RegExp(search, "i")
    }
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const searchAdmin = await RoleUser.find({ role: "admin" })
    console.log(searchAdmin)
    const admin = await Admin.find({
        $or: [
            { name: regExSearch },
            { email: regExSearch },
            { account_id: Admin_Id },
            { createdAt: { $gte: TimeFrom, $lte: TimeTo } }
        ]
    }).populate({
        path: "account_id",
        // match: {
        //     $or: [
        //         { name: { $regex: search } },
        //     ]
        // }
    }).skip((perPage * page) - perPage)
        .limit(perPage)
    const count = await Admin.countDocuments()

    try {
        res.render("adminViews/admin_list_admins", {
            ListAdmin: admin,
            SearchAdmin: searchAdmin,
            Admin: getAdmin,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage)
            }
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//* Search for Staff
exports.search_staff = async (req, res) => {
    const perPage = 5
    const page = req.query.p || 1

    const { TimeFrom, TimeTo, BU_Id, search } = req.query;

    let regExSearch = "";
    if (!search) {
        regExSearch = null;
    } else {
        regExSearch = new RegExp(search, "i")
    }
    const businessUnit = await BusinessUnit.find({})
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const staff = await Staff.find({
        $or: [
            { name: regExSearch },
            { email: regExSearch },
            { businessUnit_id: BU_Id },
            { createdAt: { $gte: TimeFrom, $lte: TimeTo } }
        ]
    }).populate({
        path: "account_id",
        // match: {
        //     $or: [
        //         { name: { $regex: search } },
        //     ]
        // }
    }).populate("businessUnit_id")
        .skip((perPage * page) - perPage)
        .limit(perPage)
    const count = await Staff.countDocuments()

    try {
        res.render("adminViews/admin_list_staffs", {
            Staff: staff,
            Admin: getAdmin,
            BusinessUnit: businessUnit,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage)
            }
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//* Search for manager
exports.search_manager = async (req, res) => {
    const perPage = 5
    const page = req.query.p || 1

    const { TimeFrom, TimeTo, BU_Id, search } = req.query;

    let regExSearch = "";
    if (!search) {
        regExSearch = null;
    } else {
        regExSearch = new RegExp(search, "i")
    }
    const businessUnit = await BusinessUnit.find({})
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const manager = await Manager.find({
        $or: [
            { name: regExSearch },
            { email: regExSearch },
            { businessUnit_id: BU_Id },
            { createdAt: { $gte: TimeFrom, $lte: TimeTo } }
        ]
    }).populate("account_id")
        .populate("businessUnit_id")
        .skip((perPage * page) - perPage)
        .limit(perPage)
    const count = await Manager.countDocuments()

    try {
        res.render("adminViews/admin_list_managers", {
            Manager: manager,
            Admin: getAdmin,
            BusinessUnit: businessUnit,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage)
            }
        })
    } catch (e) {
        res.status(400).send(e)
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

    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const businessUnit = await BusinessUnit.find({
        $or: [
            { name: regExSearch },
            { description: regExSearch },
            { _id: BU_Id },
            { createdAt: { $gte: TimeFrom, $lte: TimeTo } }
        ]
    }).skip((perPage * page) - perPage)
        .limit(perPage)
    const count = await BusinessUnit.countDocuments()

    try {
        res.render("adminViews/admin_list_business_units", {
            BusinessUnit: businessUnit,
            Admin: getAdmin,
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

    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const requestType = await RequestType.find({
        $or: [
            { name: regExSearch },
            { description: regExSearch },
            { _id: RT_Id },
            { createdAt: { $gte: TimeFrom, $lte: TimeTo } }
        ]
    }).skip((perPage * page) - perPage)
        .limit(perPage)
    const count = await RequestType.countDocuments()

    try {
        res.render("adminViews/admin_list_request_types", {
            RequestType: requestType,
            Admin: getAdmin,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage)
            }
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//* Seach for Request of Staff
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
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const _id = req.params.id
    const staff = await Staff.findOne({ _id: _id }).populate('businessUnit_id')
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
    const count = await Staff.countDocuments()

    const requestType = await RequestType.find({})
    try {
        res.render("adminViews/admin_list_all_requests_staff", {
            Request: request,
            RequestType: requestType,
            Staff: staff,
            Admin: getAdmin,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage)
            }
        })
    } catch (e) {
        res.status(400).send(e)
    }
}

//! This field for Admin
//* List all admin
exports.list_all_admins = async (req, res) => {
    const perPage = 5
    const page = req.query.p || 1

    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const admin = await Admin.find({})
        .populate("account_id")
        .populate("businessUnit_id")
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
    const count = await Admin.countDocuments()

    const searchAdmin = await RoleUser.find({ role: "admin" })
    try {
        res.render("adminViews/admin_list_admins", {
            ListAdmin: admin,
            SearchAdmin: searchAdmin,
            Admin: getAdmin,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage)
            }
        })
    } catch (error) {
        res.status(400).send(error)
    }
}
//* Add admin
//GET
exports.add_admin = async (req, res) => {
    const msg = req.query.msg
    try {
        res.render("adminViews/admin_add_admin", {
            err: msg
        }
        )
    } catch (e) {
        res.status(400).send(e)
    }

}
//POST
exports.addAdmin = async (req, res, next) => {
    const {
        username,
        password,
        name,
        email,
        fullName,
        phoneNumber,
        age,
        dayOfBirth }
        = req.body;

    const existUser = await RoleUser.findOne({ username: username, role: "admin" })
    const emailExist = await Admin.findOne({ email: email })
    if (existUser) {
        const errExistUsername = "Username has already exist !!!";
        return res.redirect(`/admin/add_admin?msg=${errExistUsername}`);
    }
    if (emailExist) {
        const emailExist = "Email has already exist !!!";
        return res.redirect(`/admin/add_staff?msg=${emailExist}`);
    }
    try {
        const newUser = await new RoleUser({
            username: username,
            password: password,
            role: "admin"
        })
        await newUser.save()

        const userAcc = await RoleUser.findOne({ username: username })
        const newAdmin = await new Admin({
            name: name,
            email: email,
            fullName: fullName,
            phoneNumber: phoneNumber,
            age: age,
            dayOfBirth: dayOfBirth,
            account_id: userAcc._id
        })
        const saveAdmin = await newAdmin.save()

        return res.redirect(`/admin/list_all_admins`);
    } catch (error) {
        res.status(400).send(error)
    }

}
//*Update Admin account
//GET
exports.update_admin = async (req, res) => {
    const _id = req.params.id
    const msg = req.params.msg
    const adminAcc = await Admin.findOne({ _id: _id }).populate("account_id")
    try {
        res.render("adminViews/admin_update_admin", {
            Admin: adminAcc,
            err: msg
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//PUT
exports.updateAdmin = async (req, res) => {
    const {
        admin_id,
        username,
        name,
        email,
        fullName,
        phoneNumber,
        age,
        dayOfBirth
    } = req.body;

    const existUser = await RoleUser.findOne({ username: username, role: "admin" })
    const emailExist = await Admin.findOne({ email: email })
    if (existUser) {
        const errExistUsername = "Username has already exist !!!";
        return res.redirect(`/admin/update_admin/${admin_id}?msg=${errExistUsername}`);
    }
    if (emailExist) {
        const emailExist = "Email has already exist !!!";
        return res.redirect(`/admin/update_admin/${admin_id}?msg=${emailExist}`);
    }

    const newValueRole = {}
    if (username) newValueRole.username = username

    const newValueAdmin = {}
    if (name) newValueAdmin.name = name
    if (email) newValueAdmin.email = email
    if (fullName) newValueAdmin.fullName = fullName
    if (phoneNumber) newValueAdmin.phoneNumber = phoneNumber
    if (age) newValueAdmin.age = age
    if (dayOfBirth) newValueAdmin.dayOfBirth = dayOfBirth

    try {
        const admin = await Admin.findOne({ _id: admin_id })
        const roleUpdate = await RoleUser.findOneAndUpdate(
            { _id: admin.account_id },
            { $set: newValueRole },
            { new: true, useFindAndModify: false }
        )

        const adminUpdate = await Admin.findOneAndUpdate(
            { _id: admin_id },
            { $set: newValueAdmin },
            { new: true, useFindAndModify: false }
        )

        res.redirect(`/admin/update_admin/${admin_id}`)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}
//* Delete admin account
exports.deleteAdmin = async (req, res) => {
    const { _id } = req.body

    const admin = await Admin.findOne({ _id: _id })
    const roleUser = await RoleUser.findOne({ _id: admin.account_id })

    try {
        await admin.remove()
        await roleUser.remove()
        res.redirect(`/admin/list_all_admins`)
    } catch (e) {
        res.status(400).send(e)
    }

}
//! Admin information
//* get information 
exports.get_all_information = async (req, res) => {
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    if (!getAdmin) {
        res.status(401).send("unable to get information")
    }

    try {
        res.render("adminViews/admin_get_information", {
            Admin: getAdmin
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
    const adminAcc = await Admin.findOne({ _id: _id }).populate("account_id")
    try {
        res.render("adminViews/admin_update_information", {
            Admin: adminAcc,
            err: msg
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//PUT
exports.updateInformation = async (req, res) => {
    const {
        admin_id,
        password,
        name,
        email,
        fullName,
        phoneNumber,
        age,
        dayOfBirth
    } = req.body;

    const emailExist = await Admin.findOne({ email: email })

    if (emailExist) {
        const emailExist = "Email has already exist !!!";
        return res.redirect(`/admin/update_information?msg=${emailExist}`);
    }

    const newValueRole = {}
    if (password) newValueRole.password = password

    const newValueAdmin = {}
    if (name) newValueAdmin.name = name
    if (email) newValueAdmin.email = email
    if (fullName) newValueAdmin.fullName = fullName
    if (phoneNumber) newValueAdmin.phoneNumber = phoneNumber
    if (age) newValueAdmin.age = age
    if (dayOfBirth) newValueAdmin.dayOfBirth = dayOfBirth
    if (req.file) {
        const avatar = req.file.filename;
        newValueAdmin.avatar = avatar;
    }

    try {
        const admin = await Admin.findOne({ _id: admin_id })
        const roleUpdate = await RoleUser.findOneAndUpdate(
            { _id: admin.account_id },
            { $set: newValueRole },
            { new: true, useFindAndModify: false }
        )

        const adminUpdate = await Admin.findOneAndUpdate(
            { _id: admin_id },
            { $set: newValueAdmin },
            { new: true, useFindAndModify: false }
        )

        res.redirect(`/admin/get_all_information`)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

//! This field for Staff
//* list of Staff 
exports.list_all_staffs = async (req, res) => {
    const perPage = 5
    const page = req.query.p || 1

    const staff = await Staff.find({})
        .populate("account_id")
        .populate("businessUnit_id")
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
    const count = await Staff.countDocuments()

    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const businessUnit = await BusinessUnit.find({})
    try {
        res.render("adminViews/admin_list_staffs", {
            Staff: staff,
            BusinessUnit: businessUnit,
            Admin: getAdmin,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage)
            }
        })
    } catch (error) {
        res.status(400).send(error)
    }
}
//* Adding new staff account
//GET
exports.add_staff = async (req, res) => {
    const msg = req.query.msg
    const businessUnit = await BusinessUnit.find({})
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    try {
        res.render("adminViews/admin_add_staff", {
            businessUnit: businessUnit,
            Admin: getAdmin,
            err: msg
        })
    } catch (e) {
        res.status(400).send(e)
    }

}
//POST
exports.addStaff = async (req, res, next) => {
    const {
        username,
        password,
        name,
        email,
        fullName,
        phoneNumber,
        age,
        dayOfBirth,
        BU_Id } = req.body;

    const userExist = await RoleUser.findOne({ username: username, role: "staff" })
    const emailExist = await Staff.findOne({ email: email })
    // const ageValidate = await Staff.findOne({ age: age })
    if (userExist) {
        const existUsername = "Username has already exist !!!";
        return res.redirect(`/admin/add_staff?msg=${existUsername}`);
    }
    if (emailExist) {
        const emailExist = "Email has already exist !!!";
        return res.redirect(`/admin/add_staff?msg=${emailExist}`);
    }
    // if (ageValidate <= 15 || ageValidate >= 50) {
    //     const ageValidate = " Please input your real age !!!";
    //     return res.redirect(`/admin/add_staff?msg=${ageValidate}`);
    // }
    try {
        const newUser = await new RoleUser({
            username: username,
            password: password,
            role: "staff"
        })
        await newUser.save()

        const userAcc = await RoleUser.findOne({ username: username })
        const newStaff = await new Staff({
            name: name,
            email: email,
            fullName: fullName,
            phoneNumber: phoneNumber,
            age: age,
            dayOfBirth: dayOfBirth,
            businessUnit_id: BU_Id,
            account_id: userAcc._id
        })

        const saveStaff = await newStaff.save()
        //push into BU
        const businessUnit = await BusinessUnit.findOne({ _id: saveStaff.businessUnit_id })
        await businessUnit.staff_id.push(saveStaff)
        await businessUnit.save()

        // res.status(201).send( saveStaff)
        return res.redirect(`/admin/list_all_staffs`);

    } catch (error) {
        res.status(400).send(error)
    }


};
//* Update Staff account
//GET
exports.update_staff = async (req, res) => {
    const _id = req.params.id
    const msg = req.query.msg
    const staffAcc = await Staff.findOne({ _id: _id }).populate("businessUnit_id").populate("account_id")
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const businessUnit = await BusinessUnit.find({})
    try {
        res.render("adminViews/admin_update_staff", {
            Staff: staffAcc,
            businessUnit: businessUnit,
            Admin: getAdmin,
            err: msg
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//PUT
exports.updateStaff = async (req, res) => {
    const {
        staff_id,
        username,
        name,
        email,
        fullName,
        phoneNumber,
        age,
        dayOfBirth,
        BU_Id } = req.body;

        const existUser = await RoleUser.findOne({ username: username, role: "admin" })
        const emailExist = await Staff.findOne({ email: email })
        if (existUser) {
            const errExistUsername = "Username has already exist !!!";
            return res.redirect(`/admin/update_staff/${staff_id}?msg=${errExistUsername}`);
        }
        if (emailExist) {
            const emailExist = "Email has already exist !!!";
            return res.redirect(`/admin/update_staff/${staff_id}?msg=${emailExist}`);
        }

    const newValueRole = {}
    if (username) newValueRole.username = username

    const newValueStaff = {}
    if (name) newValueStaff.name = name
    if (email) newValueStaff.email = email
    if (fullName) newValueStaff.fullName = fullName
    if (phoneNumber) newValueStaff.phoneNumber = phoneNumber
    if (age) newValueStaff.age = age
    if (dayOfBirth) newValueStaff.dayOfBirth = dayOfBirth
    if (BU_Id) newValueStaff.businessUnit_id = BU_Id

    try {
        const staff = await Staff.findOne({ _id: staff_id })
        const roleUpdate = await RoleUser.findOneAndUpdate(
            { _id: staff.account_id },
            { $set: newValueRole },
            { new: true, useFindAndModify: false }
        )
        // const businessUnit = await BusinessUnit.findOne({ _id: staff.businessUnit_id })
        // if (businessUnit) {
        //     //pop out of old BU 
        //     const oldBusinessUnit = await BusinessUnit.findOneAndUpdate(
        //         { staff_id: staff._id, },
        //         { $pull: { staff_id: staff._id } },
        //         { safe: true, upsert: true }
        //     )
        // }

        const staffUpdate = await Staff.findOneAndUpdate(
            { _id: staff_id },
            { $set: newValueStaff },
            { new: true, useFindAndModify: false }
        )
        //push into new BU
        const newBusinessUnit = await BusinessUnit.findOne({ _id: staffUpdate.businessUnit_id })
        await newBusinessUnit.staff_id.push(staffUpdate)
        await newBusinessUnit.save()

        res.redirect(`/admin/update_staff/${staff_id}`)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}
//*Delete Staff
exports.deleteStaff = async (req, res) => {
    const { _id } = req.body

    const staff = await Staff.findOne({ _id: _id })
    const roleUser = await RoleUser.findOne({ _id: staff.account_id })
    const request = await Request.findOne({ _id: staff.request_id })

    if (request !== null) {
        await request.remove()
    }

    try {
        //pop out of old BU 
        const businessUnit = await BusinessUnit.findOneAndUpdate(
            { staff_id: staff._id, },
            { $pull: { staff_id: staff._id } },
            { safe: true, upsert: true }
        )
        await staff.remove()
        await roleUser.remove()

        res.redirect(`/admin/list_all_staffs`)
    } catch (e) {
        res.status(400).send(e)
    }

}
//! create Request for Staff
//* List all request 
exports.list_all_requests = async (req, res) => {
    const perPage = 5
    const page = req.query.p || 1

    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const _id = req.params.id
    const { msg } = req.query
    const staff = await Staff.findOne({ _id: _id })
    const request = await Request.find({ owner_id: _id })
        .populate('requestType_id')
        .populate('businessUnit_id')
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
    const count = await Request.countDocuments()

    const requestType = await RequestType.find({})
    try {
        res.render("adminViews/admin_list_all_requests_staff", {
            Request: request,
            RequestType: requestType,
            Staff: staff,
            Admin: getAdmin,
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
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const requestType = await RequestType.find({})
    const businessUnit = await BusinessUnit.find({})
    const _id = req.params.id
    const staff = await Staff.findOne({ _id: _id })
    try {
        res.render("adminViews/admin_add_request", {
            requestType: requestType,
            Staff: staff,
            Admin: getAdmin,
            BusinessUnit: businessUnit
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//POST
exports.addRequest = async (req, res) => {
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const { _id } = req.body
    const {
        reason,
        startDateOff,
        endDateOff,
        requestType_id,
        BU_Id
    } = req.body

    const staff = await Staff.findOne({ _id: _id })
    if (!staff) {
        res.status(401).send("unable to create request")
    }

    try {
        const newRequest = await new Request({
            reason: reason,
            startDateOff: startDateOff,
            endDateOff: endDateOff,
            requestType_id: requestType_id,
            owner_id: staff._id,
            status: 'Approved',
            businessUnit_id: BU_Id
        })

        const saveRequest = await newRequest.save()
        await staff.request_id.push(saveRequest)
        await staff.save()

        //push into BU
        const businessUnit = await BusinessUnit.findOne({ _id: saveRequest.businessUnit_id })
        await businessUnit.request_id.push(saveRequest)
        await businessUnit.save()

        //!Send Email
        const manager = await Manager.findOne({ businessUnit_id: saveRequest.businessUnit_id })
        await adminAproved(manager.email, staff.name ,getAdmin.name)
            .then((result) => {
                console.log("Email sent...", result);
            })
            .catch((err) => {
                console.log(err.message);
            });

        res.redirect(`/admin/list_all_requests_staff/${staff._id}`)
    } catch (e) {
        res.status(400).send(e)
    }
}
//*Read Request
//GET
exports.read_request = async (req, res) => {
    const _id = req.params.id
    const request = await Request.findOne({ _id: _id }).populate('requestType_id').populate({
        path: "owner_id",
        populate: 'businessUnit_id'
    })
    const staff = await Staff.findOne({ request_id: request._id })
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const requestType = await RequestType.find({ _id: request.requestType_id })

    try {
        res.render("adminViews/admin_read_request", {
            Request: request,
            Staff: staff,
            RequestType: requestType,
            Admin: getAdmin,
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//*Update Request
//GET
exports.update_request = async (req, res) => {
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const _id = req.params.id
    const request = await Request.findOne({ _id: _id }).populate('requestType_id').populate({
        path: "owner_id",
        populate: 'businessUnit_id'
    })
    const staff = await Staff.findOne({ _id: request.owner_id })
    const requestType = await RequestType.find({ _id: request.requestType_id })

    // if (request.status == 'Approved' || request.status == 'Denied') {
    //     const msg = "The request cannot be updated or deleted once it has been approved or Denied "
    //     return res.redirect(`/admin/list_all_requests_staff/${staff._id}?msg=${msg}`)
    // } else {
    try {
        res.render("adminViews/admin_update_request", {
            Request: request,
            RequestType: requestType,
            Admin: getAdmin,
            Staff: staff
        })
    } catch (e) {
        res.status(400).send(e)
    }
    // }
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

        res.redirect(`/admin/update_request/${request_id}`)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}
//*Delete Request
exports.deleteRequest = async (req, res) => {
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const { _id } = req.body
    const request = await Request.findOne({ _id: _id })

    // if (request.status == 'Approved' || request.status == 'Denied') {
    //     const msg = "The request cannot be updated or deleted once it has been approved or Denied "
    //     return res.redirect(`/admin/list_all_requests_staff/${staff._id}?msg=${msg}`)
    // } else {
    // //pop out of old BU 
    // const businessUnit = await BusinessUnit.findOneAndUpdate(
    //     { request_id: request._id, },
    //     { $pull: { request_id: request._id } },
    //     { safe: true, upsert: true }
    // )
    //pop out of Staff
    const staff = await Staff.findOneAndUpdate(
        { request_id: request._id, },
        { $pull: { request_id: request._id } },
        { safe: true, upsert: true }
    )
    try {
        await request.remove()
        res.redirect(`/admin/list_all_requests_staff/${staff._id}`)
    } catch (e) {
        res.status(400).send(e)
    }
    // }
}

//! this field for manager
//* List all manager 
exports.list_all_managers = async (req, res) => {
    const perPage = 5
    const page = req.query.p || 1

    const manager = await Manager.find({})
        .populate("account_id")
        .populate("businessUnit_id")
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
    const count = await Manager.countDocuments()

    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const businessUnit = await BusinessUnit.find({})
    // const businessUnit = await BusinessUnit.find({}).populate({
    //     path: "amountRequest_id",
    //     populate: {path: "topic_id"}
    // })

    try {
        res.render("adminViews/admin_list_managers", {
            Manager: manager,
            BusinessUnit: businessUnit,
            Admin: getAdmin,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage)
            }
        })
    } catch (error) {
        res.status(400).send(error)
    }
}
//* Add manager
//GET
exports.add_manager = async (req, res) => {
    const msg = req.query.msg
    const businessUnit = await BusinessUnit.find({})
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    try {
        res.render("adminViews/admin_add_manager", {
            businessUnit: businessUnit,
            Admin: getAdmin,
            err: msg
        })
    } catch (e) {
        res.status(400).send(e)
    }

}
//POST
exports.addManager = async (req, res, next) => {
    const {
        username,
        password,
        name,
        email,
        fullName,
        phoneNumber,
        age,
        dayOfBirth,
        BU_Id } = req.body;

    const existUser = await RoleUser.findOne({ username: username, role: "manager" })
    const emailExist = await Manager.findOne({ email: email })
    // const ageValidate = await Manager.findOne({ age: age })
    if (existUser) {
        const existUsername = "Username has already exist !!!";
        return res.redirect(`/admin/add_manager?msg=${existUsername}`);
    }
    if (emailExist) {
        const emailExist = "Email has already exist !!!";
        return res.redirect(`/admin/add_manager?msg=${emailExist}`);
    }
    // if (ageValidate <= 15 || ageValidate >= 50) {
    //     const ageValidate = " Please input your real age !!!";
    //     return res.redirect(`/admin/add_manager?msg=${ageValidate}`);
    // }
    try {
        const newUser = await new RoleUser({
            username: username,
            password: password,
            role: "manager"
        })
        await newUser.save()

        const userAcc = await RoleUser.findOne({ username: username })
        const newManger = await new Manager({
            name: name,
            email: email,
            fullName: fullName,
            phoneNumber: phoneNumber,
            age: age,
            dayOfBirth: dayOfBirth,
            businessUnit_id: BU_Id,
            account_id: userAcc._id
        })
        const saveManager = await newManger.save()
        //push into BU
        const businessUnit = await BusinessUnit.findOne({ _id: saveManager.businessUnit_id })
        await businessUnit.manager_id.push(saveManager)
        await businessUnit.save()

        return res.redirect(`/admin/list_all_managers`);

    } catch (error) {
        res.status(400).send(error)
    }

}
//*Update Manager account
//GET
exports.update_manager = async (req, res) => {
    const _id = req.params.id
    const msg = req.query.msg
    const managerAcc = await Manager.findOne({ _id: _id }).populate("businessUnit_id").populate("account_id")
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const businessUnit = await BusinessUnit.find({})
    try {
        res.render("adminViews/admin_update_manager", {
            Manager: managerAcc,
            businessUnit: businessUnit,
            Admin: getAdmin,
            err: msg
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//PUT
exports.updateManager = async (req, res) => {
    const {
        manager_id,
        username,
        name,
        email,
        fullName,
        phoneNumber,
        age,
        dayOfBirth,
        BU_Id } = req.body;

        const existUser = await RoleUser.findOne({ username: username, role: "admin" })
        const emailExist = await Manager.findOne({ email: email })
        if (existUser) {
            const errExistUsername = "Username has already exist !!!";
            return res.redirect(`/admin/update_manager/${manager_id}?msg=${errExistUsername}`);
        }
        if (emailExist) {
            const emailExist = "Email has already exist !!!";
            return res.redirect(`/admin/update_manager/${manager_id}?msg=${emailExist}`);
        }

    const newValueRole = {}
    if (username) newValueRole.username = username

    const newValueManager = {}
    if (name) newValueManager.name = name
    if (email) newValueManager.email = email
    if (fullName) newValueManager.fullName = fullName
    if (phoneNumber) newValueManager.phoneNumber = phoneNumber
    if (age) newValueManager.age = age
    if (dayOfBirth) newValueManager.dayOfBirth = dayOfBirth
    if (BU_Id) newValueManager.businessUnit_id = BU_Id

    try {
        const manager = await Manager.findOne({ _id: manager_id })
        const roleUpdate = await RoleUser.findOneAndUpdate(
            { _id: manager.account_id },
            { $set: newValueRole },
            { new: true, useFindAndModify: false }
        )
        // const businessUnit = await BusinessUnit.findOne({ _id: manager.businessUnit_id })
        // if (businessUnit) {
        //     //pop out of old BU 
        //     const oldBusinessUnit = await BusinessUnit.findOneAndUpdate(
        //         { manager_id: manager._id, },
        //         { $pull: { manager_id: manager._id } },
        //         { safe: true, upsert: true }
        //     )

        // }

        const managerUpdate = await Manager.findOneAndUpdate(
            { _id: manager_id },
            { $set: newValueManager },
            { new: true, useFindAndModify: false }
        )
        //push into new BU
        const newBusinessUnit = await BusinessUnit.findOne({ _id: managerUpdate.businessUnit_id })
        await newBusinessUnit.manager_id.push(managerUpdate)
        await newBusinessUnit.save()

        res.redirect(`/admin/update_manager/${manager_id}`)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}
//* Delete manager account
exports.deleteManager = async (req, res) => {
    const { _id } = req.body

    const manager = await Manager.findOne({ _id: _id })
    const roleUser = await RoleUser.findOne({ _id: manager.account_id })

    try {
        //pop out of old BU 
        const businessUnit = await BusinessUnit.findOneAndUpdate(
            { manager_id: manager._id, },
            { $pull: { manager_id: manager._id } },
            { safe: true, upsert: true }
        )
        await manager.remove()
        await roleUser.remove()
        res.redirect(`/admin/list_all_managers`)
    } catch (e) {
        res.status(400).send(e)
    }

}

//!this field for business unit 
//* list all business unit 
exports.list_all_business_units = async (req, res) => {
    const perPage = 5
    const page = req.query.p || 1

    const businessUnit = await BusinessUnit.find({})
        .populate("amountRequests_id")
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
    const count = await BusinessUnit.countDocuments()

    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    try {
        res.render("adminViews/admin_list_business_units", {
            BusinessUnit: businessUnit,
            Admin: getAdmin,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage)
            }
        })
    } catch (error) {
        res.status(400).send(error)
    }

}
//* Add more business unit 
//GET
exports.add_business_unit = async (req, res) => {
    const msg = req.query.msg
    const businessUnit = await BusinessUnit.find({}).populate("amountRequests_id")
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    try {
        res.render("adminViews/admin_add_business_unit", {
            businessUnit: businessUnit,
            Admin: getAdmin,
            err: msg
        })
    } catch (error) {
        res.status(400).send(error)
    }

}
//POST
exports.addBusinessUnit = async (req, res) => {
    const existBusinessUnit = await BusinessUnit.findOne({ name: req.body.name })
    if (existBusinessUnit) {
        const errExistBU = "Business Unit has already exist !!!";
        return res.redirect(`/admin/add_business_unit?msg=${errExistBU}`);
    }
    try {
        const newBusinessUnit = await new BusinessUnit({
            name: req.body.name,
            description: req.body.description
        })
        newBusinessUnit.save()
        return res.redirect(`/admin/list_all_business_units`);
    } catch (e) {
        res.status(400).send(e)
    }
}
//* Update Business Unit 
//GET
exports.update_business_unit = async (req, res) => {
    const _id = req.params.id
    const msg = req.query.msg
    const businessUnit = await BusinessUnit.findOne({ _id: _id }).populate("amountRequests_id").populate("staff_id")
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    try {
        res.render("adminViews/admin_update_business_unit", {
            businessUnit: businessUnit,
            Admin: getAdmin,
            err: msg
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//PUT
exports.updateBusinessUnit = async (req, res) => {

    const {
        businessUnit_id,
        name,
        description
    } = req.body

    const existBusinessUnit = await BusinessUnit.findOne({ name: name })
    if (existBusinessUnit) {
        const errExistBU = "Business Unit has already exist !!!";
        return res.redirect(`/admin/update_business_unit/${businessUnit_id}?msg=${errExistBU}`);
    }

    const newValue = {}
    if (name) newValue.name = name
    if (description) newValue.description = description

    try {
        const businessUnit = await BusinessUnit.findOne({ _id: businessUnit_id })
        const businessUnitUpdate = await BusinessUnit.findOneAndUpdate(
            { _id: businessUnit._id },
            { $set: newValue },
            { new: true, useFindAndModify: false }
        )

        res.redirect(`/admin/update_business_unit/${businessUnit_id}`)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}
//* Delete Business Unit 
exports.deleteBusinessUnit = async (req, res) => {
    const { _id } = req.body

    const businessUnit = await BusinessUnit.findOne({ _id: _id })
    const request = await Request.findOne({ businessUnit_id: _id })
    // const staff = await Staff.findOne({ request_id: request._id })

    try {
        const deleteBusinessUnit = await BusinessUnit.findOneAndDelete({ _id: _id })
        if (request) {
            const deleteRequest = await Request.deleteMany({ businessUnit_id: _id })
            const staff = await Staff.findOneAndUpdate(
                { request_id: request._id, },
                { $pull: { request_id: request._id } },
                { safe: true, upsert: true }
            )

        }
        res.redirect(`/admin/list_all_business_units`)
    } catch (e) {
        res.status(400).send(e)
    }

}

//!this field for Request Type
//* List all Request Types
exports.list_all_request_types = async (req, res) => {
    const perPage = 5
    const page = req.query.p || 1

    const requestType = await RequestType.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
    const count = await RequestType.countDocuments()

    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    try {
        res.render("adminViews/admin_list_request_types", {
            RequestType: requestType,
            Admin: getAdmin,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage)
            }
        })
    } catch (error) {
        res.status(400).send(error)
    }
}
//* Add more Request Type
//GET
exports.add_request_type = async (req, res) => {
    const msg = req.query.msg
    const requestType = await RequestType.find({})
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    try {
        res.render("adminViews/admin_add_request_type", {
            requestType: requestType,
            Admin: getAdmin,
            err: msg
        })
    } catch (error) {
        res.status(400).send(error)
    }
}
//POST
exports.addRequestType = async (req, res) => {
    const existRequestType = await RequestType.findOne({ name: req.body.name })
    if (existRequestType) {
        const existRequestType = "Request Type has already exist !!!";
        return res.redirect(`/admin/add_request_type?msg=${existRequestType}`);
    }
    try {
        const newRequestType = await new RequestType({
            name: req.body.name,
            description: req.body.description
        })
        newRequestType.save()

        return res.redirect(`/admin/list_all_request_types`);
    } catch (e) {
        res.status(400).send(e)
    }
}
//*Update Request Type
//GET
exports.update_request_type = async (req, res) => {
    const _id = req.params.id
    const msg = req.query.msg
    const requestType = await RequestType.findOne({ _id: _id })
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    try {
        res.render("adminViews/admin_update_request_type", {
            requestType: requestType,
            Admin: getAdmin,
            err: msg
        })
    } catch (e) {
        res.status(400).send(e)
    }
}
//PUT
exports.updateRequestType = async (req, res) => {

    const {
        requestType_id,
        name,
        description
    } = req.body

    const existRequestType = await RequestType.findOne({ name: req.body.name })
    if (existRequestType) {
        const existRequestType = "Request Type has already exist !!!";
        return res.redirect(`/admin/update_request_type/${requestType_id}?msg=${existRequestType}`);
    }

    const newValue = {}
    if (name) newValue.name = name
    if (description) newValue.description = description

    try {
        const requestType = await RequestType.findOne({ _id: requestType_id })
        const requestTypeUpdate = await RequestType.findOneAndUpdate(
            { _id: requestType._id },
            { $set: newValue },
            { new: true, useFindAndModify: false }
        )

        res.redirect(`/admin/update_request_type/${requestType_id}`)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}
//*Delete Request Type
exports.deleteRequestType = async (req, res) => {
    const { _id } = req.body

    const requestType = await RequestType.findOne({ _id: _id })
    const request = await Request.findOne({ requestType_id: requestType._id })

    try {
        await requestType.remove()
        // await request.remove()

        res.redirect(`/admin/list_all_request_types`)
    } catch (e) {
        res.status(400).send(e)
    }

}

//! Download Excel
exports.download = async (req, res) => {
    try {
        const _id = req.params.id
        const request = await Request.find({ owner_id: _id })
            .populate('requestType_id')
            .populate('businessUnit_id')
            .sort({ createdAt: -1 })
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

    } catch (e) {
        res.status(400).send(e)
    }
}









