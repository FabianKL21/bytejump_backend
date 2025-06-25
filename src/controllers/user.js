const prisma = require("../../prisma/prisma");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("../utils/googleDrive");
const GOOGLE_DRIVE_FOLDER_ID = process.env.GDRIVEKEY;

const updatePersonalData = async (req, res) => {
  try {
    const yangLogin = req.userLogin;
    const { user_email, user_password, user_nama } = req.body;

    const user = await prisma.user.findFirst({
      where: { user_email: yangLogin.user_email },
    });
    if (!user) {
      return res.status(401).json({ message: "not Login" });
    }

    let hashPassword;
    if (user_password) {
      hashPassword = await bcryptjs.hash(user_password, 10);
    }
    const result = await prisma.user.update({
      where: { id: user.id },
      data: {
        user_email: user_email || user.user_email,
        user_password: hashPassword || user.user_password,
        user_nama: user_nama || user_nama,
      },
      select: {
        id: true,
        user_email: true,
        user_nama: true,
        user_role: true,
        user_avatar: true,
        user_balance: true,
      },
    });

    const accessToken = jwt.sign(result, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "6h",
    });

    const refreshToken = jwt.sign(result, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "24h",
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        user_refresh_token: refreshToken,
      },
    });
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // JANGAN true dulu, karena http://localhost akan gagal
      sameSite: "lax", //  "lax" cukup untuk localhost & masih oke di deploy
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
    });

    return res.status(200).json({
      message: "Success update data",
      result: { data: result, accessToken: accessToken },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed To update Data" });
  }
};
const updateProfpic = async (req, res) => {
  try {
    const yangLogin = req.userLogin;
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
    const result = await prisma.user.update({
      where: { id: yangLogin.id },
      data: {
        user_avatar: url,
      },
      select: {
        id: true,
        user_email: true,
        user_nama: true,
        user_role: true,
        user_avatar: true,
        user_balance: true,
      },
    });

    const accessToken = jwt.sign(result, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "6h",
    });

    const refreshToken = jwt.sign(result, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "24h",
    });

    await prisma.user.update({
      where: { id: yangLogin.id },
      data: {
        user_refresh_token: refreshToken,
      },
    });
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 1000,
    // });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // JANGAN true dulu, karena http://localhost akan gagal
      sameSite: "lax", //  "lax" cukup untuk localhost & masih oke di deploy
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
    });

    return res.status(200).json({
      message: "Success update data",
      result: { data: result, accessToken: accessToken },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed update profile picture" });
  }
};

const topup = async (req, res) => {
  try {
    return res.status(200).json({ message: "hahaha" });
  } catch (error) {
    return res.status(500).json({ message: "hahahaha" });
  }
};

module.exports = { updatePersonalData, updateProfpic, topup };
