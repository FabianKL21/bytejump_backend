const prisma = require("../../prisma/prisma");
const { uploadFile } = require("../utils/googleDrive");
const fs = require("fs");
const GOOGLE_DRIVE_FOLDER_ID = process.env.GDRIVEKEY;
const addPost = async (req, res) => {
  try {
    const { post_title, post_author, post_short_desc, post_long_desc } =
      req.body;
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
    const result = await prisma.post.create({
      data: {
        post_title,
        post_author,
        post_short_desc,
        post_long_desc,
        post_banner: url,
        deletedAt: null,
      },
    });

    return res
      .status(201)
      .json({ message: "Success Create Post", result: result });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Failed To Add Post" });
  }
};
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findFirst({
      where: { id: id, deletedAt: null },
    });
    if (!post) {
      return res.status(404).json({ message: "The post is not found" });
    }
    const result = await prisma.post.update({
      where: { id: id },
      data: { deletedAt: new Date() },
    });
    return res
      .status(200)
      .json({ message: "Success Delete Post", result: result });
  } catch (error) {
    return res.status(500).json({ message: "Failed To delete Post" });
  }
};
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { post_title, post_author, post_short_desc, post_long_desc } =
      req.body;
    const post = await prisma.post.findFirst({
      where: { id: id, deletedAt: null },
    });
    if (!post) {
      return res.status(404).json({ message: "The post is not found" });
    }

    let url = post.post_banner;

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

      fs.unlinkSync(filePath);
    }

    const result = await prisma.post.update({
      where: { id: id },
      data: {
        post_title: post_title || post.post_title,
        post_author: post_author || post.post_author,
        post_short_desc: post_short_desc || post.post_short_desc,
        post_long_desc: post_long_desc || post.post_long_desc,
        post_banner: url,
      },
    });

    return res
      .status(200)
      .json({ message: "Success Update Post", result: result });
  } catch (error) {
    return res.status(500).json({ message: "Failed To update Post" });
  }
};
const updateView = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findFirst({
      where: { id: id, deletedAt: null },
    });

    if (!post) {
      return res.status(404).json({ message: "The post is not found" });
    }

    const result = await prisma.post.update({
      where: { id: id },
      data: {
        post_view: {
          increment: 1,
        },
      },
    });
    return res
      .status(200)
      .json({ message: "Success Update View Post", result: result });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update view" });
  }
};
const getPosts = async (req, res) => {
  try {
    const { view } = req.query;
    let result;
    if (view) {
      result = await prisma.post.findMany({
        where: { post_view: parseInt(view), deletedAt: null },
      });
    } else {
      result = await prisma.post.findMany({ where: { deletedAt: null } });
    }

    if (result.length <= 0) {
      return res.status(404).json({ message: "The posts are not found" });
    }
    return res
      .status(200)
      .json({ message: "Success Get Posts", result: result });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to Get Post", error: error });
  }
};
const getPostsByTitle = async (req, res) => {
  try {
    const { post_title } = req.params;
    const result = await prisma.post.findMany({
      where: {
        post_title: {
          contains: post_title,
          mode: "insensitive",
        },
        deletedAt: null,
      },
    });

    if (result.length <= 0) {
      return res.status(404).json({ message: "posts are not found" });
    }

    return res
      .status(200)
      .json({ message: "Success Get Posts", result: result });
  } catch (error) {
    return res.status(500).json({ message: "Failed to Get Post" });
  }
};

const getPostNewest = async (req, res) => {
  try {
    const result = await prisma.post.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    if (result.length <= 0) {
      return res.status(404).json({ message: "posts newest are not found" });
    }
    return res
      .status(200)
      .json({ message: "Success Get Posts", result: result });
  } catch (error) {
    return res.status(500).json({ message: "Failed to Get Post" });
  }
};

module.exports = {
  addPost,
  deletePost,
  updatePost,
  updateView,
  getPosts,
  getPostsByTitle,
  getPostNewest,
};
