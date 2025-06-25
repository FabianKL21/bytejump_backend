const prisma = require("../../prisma/prisma");

const checkOwner = async (req, res, next) => {
  try {
    const owner = req.userLogin.user_nama;
    const { id } = req.params;

    const forum = await prisma.forum.findFirst({ where: { id: id } });

    if (!forum) {
      return res.status(404).json({ message: "Forum not found" });
    }

    if (forum.forum_publisher !== owner) {
      return res.status(403).json({ message: "You are not owner" });
    }

    req.forum = forum;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Failed check owner" });
  }
};

module.exports = checkOwner;
