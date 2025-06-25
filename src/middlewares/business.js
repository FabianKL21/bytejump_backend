const prisma = require("../../prisma/prisma");
const jwt = require("jsonwebtoken");

const checkBalanceChat = (req, res, next) => {
  if (!req.userLogin) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const user = req.userLogin;

  if (user.user_balance < 50) {
    return res.status(402).json({ message: "Your Balance is Lacking" });
  }
  next();
};
const checkBalanceGambar = (req, res, next) => {
  if (!req.userLogin) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const user = req.userLogin;
  if (user.user_balance < 70) {
    return res.status(402).json({ message: "Your Balance is Lacking" });
  }
  next();
};

const kurangiBalanceChat = async (req, res, next) => {
  try {
    const user = req.userLogin;
    const result = await prisma.user.update({
      where: { id: user.id },
      data: { user_balance: { decrement: 50 } },
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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // JANGAN true dulu, karena http://localhost akan gagal
      sameSite: "lax", //  "lax" cukup untuk localhost & masih oke di deploy
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
    });

    req.accessToken = accessToken;
    next();
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Failed to reduce your balance" });
  }
};
const kurangiBalanceGambar = async (req, res, next) => {
  try {
    const user = req.userLogin;
    const result = await prisma.user.update({
      where: { id: user.id },
      data: { user_balance: { decrement: 75 } },
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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // JANGAN true dulu, karena http://localhost akan gagal
      sameSite: "lax", //  "lax" cukup untuk localhost & masih oke di deploy
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
    });

    req.accessToken = accessToken;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Failed to reduce your balance" });
  }
};

module.exports = {
  checkBalanceChat,
  checkBalanceGambar,
  kurangiBalanceChat,
  kurangiBalanceGambar,
};
