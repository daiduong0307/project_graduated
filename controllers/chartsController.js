const RoleUser = require("../models/roleUserModel");
const Admin = require("../models/adminModel");
const Staff = require("../models/staffModel");
const Manager = require("../models/managerModel");
const BusinessUnit = require("../models/businessUnitModel");
const RequestType = require("../models/requestTypeModel");
const Request = require("../models/requestModel");

//! Chart For Admin 
exports.total = async (req, res) => {
    const getAdmin = await Admin.findOne({ account_id: req.session.userId }).populate("account_id")
    const count_BU = await BusinessUnit.countDocuments()
    const count_RT = await RequestType.countDocuments()
    const count_Staff = await Staff.countDocuments()
    const count_Manager = await Manager.countDocuments()

    blogPostData(function (result) {
        var month_data = result.month_data;
        var number_of_posts_data = result.number_of_posts_data;
        console.log(month_data, number_of_posts_data);

        blogPostDataLineChart(function (result) {
            var month_data_line = result.month_data_line;
            var number_of_posts_data_line = result.number_of_posts_data_line;
            console.log(month_data_line, number_of_posts_data_line)

            try {
                res.render("adminViews/admin_home", {
                    count_BU: count_BU,
                    count_RT: count_RT,
                    count_Staff: count_Staff,
                    count_Manager: count_Manager,
                    Admin: getAdmin,
                    datai: JSON.stringify(number_of_posts_data),
                    labeli: JSON.stringify(month_data),
                    dataiLine: JSON.stringify(number_of_posts_data_line),
                    labeliLine: JSON.stringify(month_data_line)
                })
            } catch (e) {
                res.status(400).send(e)
            }
        })
    });
}
//Bar Chart
async function blogPostData(callback) {
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.setFullYear() - 1))

    const data = await Request.aggregate([
        { $match: { createdAt: { $gte: lastYear }, status: 'Approved' } },
        {
            $project: {
                month: { $month: '$createdAt' },
            },
        },
        {
            $group: {
                _id: '$month',
                total: { $sum: 1 },
            },
        },
    ])
    getSomeData(data, callback)

}

function getSomeData(postData, callback) {

    month_data = [];
    number_of_posts_data = [];
    var i = 0;
    postData.forEach(function (content, callback) {

        for (var key in content) {
            //console.log('key: '+key, ', value: '+ content[key]);
            if (key == '_id') {
                month_data[i] = content[key];
            }
            if (key == 'total') {
                number_of_posts_data[i] = content[key];
            }
        }
        i++;
    });
    var callBackString = {};
    callBackString.month_data = month_data;
    callBackString.number_of_posts_data = number_of_posts_data
    // callBackString.Staff_name_data = Staff_name_data
    //return data;
    callback(callBackString);
}

//Line chart
async function blogPostDataLineChart(callback) {
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.setFullYear() - 1))

    const data = await Request.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
            $project: {
                month: { $month: '$createdAt' },
            },
        },
        {
            $group: {
                _id: '$month',
                total: { $sum: 1 },
            },
        },
    ])
    getSomeDataLineChart(data, callback)

}

function getSomeDataLineChart(postData, callback) {

    month_data_line = [];
    number_of_posts_data_line = [];
    var i = 0;
    postData.forEach(function (content, callback) {

        for (var key in content) {
            //console.log('key: '+key, ', value: '+ content[key]);
            if (key == '_id') {
                month_data_line[i] = content[key];
            }
            if (key == 'total') {
                number_of_posts_data_line[i] = content[key];
            }
        }
        i++;
    });
    var callBackString = {};
    callBackString.month_data_line = month_data_line;
    callBackString.number_of_posts_data_line = number_of_posts_data_line
    // callBackString.Staff_name_data = Staff_name_data
    //return data;
    callback(callBackString);
}

//!Chart For Manager
exports.chartManager = async (req, res) => {
        const checkManager = await Manager.findOne({ account_id: req.session.userId }).populate('businessUnit_id')
        // const getUser = await RoleUser.findOne({ username: req.query.username, role: "manager" })
        // const getManager = await Manager.findOne({account_id: getUser._id}).populate('businessUnit_id')
        // console.log(checkManager)
        // console.log(getUser)

        if (checkManager.businessUnit_id) {
            //for search
            const count_staff = await Staff.find({ businessUnit_id: checkManager.businessUnit_id }).countDocuments()
            const count_request = await Request.find({ businessUnit_id: checkManager.businessUnit_id }).countDocuments()
            const count_request_approved = await Request.find({businessUnit_id: checkManager.businessUnit_id , status: 'Approved'}).countDocuments()
            const count_request_denied = await Request.find({businessUnit_id: checkManager.businessUnit_id , status: 'Denied'}).countDocuments()

  
            blogPostDataManager(function (result) {
                var month_data = result.month_data;
                var number_of_posts_data = result.number_of_posts_data;
                console.log(month_data, number_of_posts_data);

                blogPostDataLineChartManager(function (result) {
                    var month_data_line = result.month_data_line;
                    var number_of_posts_data_line = result.number_of_posts_data_line;
                    console.log(month_data_line, number_of_posts_data_line)
            
                    try {
                        res.render("managerViews/manager_home", {
                            count_Request: count_request,
                            count_Staff: count_staff,
                            Manager: checkManager,
                            count_request_approved: count_request_approved,
                            count_request_denied: count_request_denied,
                            datai: JSON.stringify(number_of_posts_data),
                            labeli: JSON.stringify(month_data),
                            dataiLine: JSON.stringify(number_of_posts_data_line),
                            labeliLine: JSON.stringify(month_data_line)
                        })
                    } catch (error) {
                        res.status(400),send(error)
                    }
                })
            });
        }
}


//Bar Chart
async function blogPostDataManager(callback) {
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.setFullYear() - 1))


    const data = await Request.aggregate([
        { $match: { createdAt: { $gte: lastYear }, status: 'Approved' } },
        {
            $project: {
                month: { $month: '$createdAt' },
            },
        },
        {
            $group: {
                _id: '$month',
                total: { $sum: 1 },
            },
        },
    ])
    getSomeDataManager(data, callback)

}

function getSomeDataManager(postData, callback) {

    month_data = [];
    number_of_posts_data = [];
    var i = 0;
    postData.forEach(function (content, callback) {

        for (var key in content) {
            //console.log('key: '+key, ', value: '+ content[key]);
            if (key == '_id') {
                month_data[i] = content[key];
            }
            if (key == 'total') {
                number_of_posts_data[i] = content[key];
            }
        }
        i++;
    });
    var callBackString = {};
    callBackString.month_data = month_data;
    callBackString.number_of_posts_data = number_of_posts_data
    // callBackString.Staff_name_data = Staff_name_data
    //return data;
    callback(callBackString);
}

//Line chart
async function blogPostDataLineChartManager(callback) {
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.setFullYear() - 1))

    const data = await Request.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
            $project: {
                month: { $month: '$createdAt' },
            },
        },
        {
            $group: {
                _id: '$month',
                total: { $sum: 1 },
            },
        },
    ])
    getSomeDataLineChartManager(data, callback)

}

function getSomeDataLineChartManager(postData, callback) {

    month_data_line = [];
    number_of_posts_data_line = [];
    var i = 0;
    postData.forEach(function (content, callback) {

        for (var key in content) {
            //console.log('key: '+key, ', value: '+ content[key]);
            if (key == '_id') {
                month_data_line[i] = content[key];
            }
            if (key == 'total') {
                number_of_posts_data_line[i] = content[key];
            }
        }
        i++;
    });
    var callBackString = {};
    callBackString.month_data_line = month_data_line;
    callBackString.number_of_posts_data_line = number_of_posts_data_line
    // callBackString.Staff_name_data = Staff_name_data
    //return data;
    callback(callBackString);
}
