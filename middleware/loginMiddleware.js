
exports.isAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin === true && req.session.userId) {
      return next();
    } else {
      // res.send('you must login as admin ')
      const msg =
        "You must be logged in with admin permission to view this page.";
      return res.redirect(`/?msg=${msg}`);
    }
  };
  
exports.isManager = (req, res, next) => {
    if (req.session && req.session.isManager === true && req.session.userId) {
      return next();
    } else {
      // res.send('you must login as manager ')
      const msg =
        "You must be logged in with manager permission to view this page.";
      return res.redirect(`/?msg=${msg}`);
    }
  };
  
exports.isStaff = (req, res, next) => {
    if (req.session && req.session.isStaff === true && req.session.userId) {
      return next();
    } else {
      // res.send('you must login as staff ')
      const msg =
        "You must be logged in with staff permission to view this page.";
      return res.redirect(`/?msg=${msg}`);
    }
  };
  
  

