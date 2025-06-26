const prisma = require("../../prisma/prisma");
const { uploadFile } = require("../utils/googleDrive");
const GOOGLE_DRIVE_FOLDER_ID = process.env.GDRIVEKEY;

const addForum = async (req, res) => {
  try {
    const { forum_title, forum_desc } = req.body;
    const forum_publisher = req.userLogin.user_nama;
    let url = "";
    if (req.file) {
      const buffer = req.file.buffer;
      const fileName = req.file.originalname;
      const mimeType = req.file.mimetype;

      const uploaded = await uploadFile(
        buffer,
        fileName,
        mimeType,
        GOOGLE_DRIVE_FOLDER_ID
      );

      url = uploaded.webViewLink;
    }

    const result = await prisma.forum.create({
      data: {
        forum_title: forum_title,
        forum_desc: forum_desc,
        forum_publisher: forum_publisher,
        forum_img: url,
      },
    });

    return res
      .status(201)
      .json({ message: "Success Add Forum", result: result });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Failed to add Forum" });
  }
};

const updateForum = async (req, res) => {
  try {
    const { forum_title, forum_desc } = req.body;
    const { id } = req.params;
    const forum = req.forum;

    let url = "";
    if (req.file) {
      const buffer = req.file.buffer;
      const fileName = req.file.originalname;
      const mimeType = req.file.mimetype;

      const uploaded = await uploadFile(
        buffer,
        fileName,
        mimeType,
        GOOGLE_DRIVE_FOLDER_ID
      );

      url = uploaded.webViewLink;
    }

    const result = await prisma.forum.update({
      where: { id: id },
      data: {
        forum_title: forum_title || forum.forum_title,
        forum_desc: forum_desc || forum.forum_desc,
        forum_img: url,
      },
    });

    return res
      .status(200)
      .json({ message: "Success Update Forum", result: result });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Failed to update Forum" });
  }
};

const giveLike = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.forum.findFirst({ where: { id: id } });
    if (!post) {
      return res.status(404).json({ message: "forum not found" });
    }

    const result = await prisma.forum.update({
      where: { id: id },
      data: {
        forum_like: { increment: 1 },
      },
    });

    return res
      .status(200)
      .json({ message: "Success give like", result: result });
  } catch (error) {
    return res.status(500).json({ message: "failed to give like" });
  }
};

const giveReply = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.forum.findFirst({ where: { id: id } });
    if (!post) {
      return res.status(404).json({ message: "forum not found" });
    }
    const user = req.userLogin;
    const { reply } = req.body;

    const newReply = {
      username: user.user_nama,
      date: new Date(),
      reply: reply,
    };

    const updatedReply = [...(post.forum_reply || []), newReply];

    const result = await prisma.forum.update({
      where: { id: id },
      data: {
        forum_reply: updatedReply,
      },
    });

    return res
      .status(200)
      .json({ message: "Success add reply", result: result });
  } catch (error) {
    return res.status(500).json({ message: "failed to give reply" });
  }
};

const deleteForum = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.forum.findFirst({ where: { id: id } });
    if (!post) {
      return res.status(404).json({ message: "forum not found" });
    }
    const result = await prisma.forum.update({
      where: { id: id },
      data: { deletedAt: new Date() },
    });

    return res
      .status(200)
      .json({ message: "Success Delete Forum", result: result });
  } catch (error) {
    return res.status(500).json({ message: "failed to delete forum" });
  }
};

const getAllForum = async (req, res) => {
  try {
    const result = await prisma.forum.findMany();
    const resultFilter = result.filter((item) => {
      return item.deletedAt === null || item.deletedAt === undefined;
    });

    return res
      .status(200)
      .json({ message: "success get all forum", result: resultFilter });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get data" });
  }
};

module.exports = {
  addForum,
  updateForum,
  giveLike,
  giveReply,
  deleteForum,
  getAllForum,
};
