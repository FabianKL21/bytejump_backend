const checkRole = (allowrole) => {
  return (req, res, next) => {
    const userRole = req.userLogin.user_role;

    if (userRole === allowrole) {
      next();
    } else {
      return res.status(403).json({ message: "Invalid Role" });
    }
  };
};

module.exports = checkRole;
