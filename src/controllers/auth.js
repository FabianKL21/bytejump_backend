const prisma = require("../../prisma/prisma");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const userSchema = require("../utils/userSchema");

const register = async (req, res) => {
  try {
    let inputanUser = await userSchema.validateAsync(req.body, {
      abortEarly: false,
    });

    const userExist = await prisma.user.findFirst({
      where: { user_email: inputanUser.user_email },
    });

    if (userExist) {
      return res.status(400).json({ message: "Email already exist" });
    }

    const hashPassword = await bcryptjs.hash(inputanUser.user_password, 10);

    const result = await prisma.user.create({
      data: {
        user_email: inputanUser.user_email,
        user_password: hashPassword,
        user_nama: inputanUser.user_nama,
        user_avatar:
          "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
        user_refresh_token: null,
      },
    });

    return res
      .status(200)
      .json({ message: "Success Add Member", result: result });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.details.map((detail) => detail.message) });
  }
};
const login = async (req, res) => {
  try {
    const { user_email, user_password } = req.body;
    const user = await prisma.user.findFirst({
      where: { user_email: user_email },
      select: {
        id: true,
        user_email: true,
        user_nama: true,
        user_role: true,
        user_password: true,
        user_avatar: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "The user is undefined" });
    }

    const checkPassword = await bcryptjs.compare(
      user_password,
      user.user_password
    );

    const userWithOutPassword = await prisma.user.findFirst({
      where: { user_email: user_email },
      select: {
        id: true,
        user_email: true,
        user_nama: true,
        user_role: true,
        user_avatar: true,
        user_balance: true,
      },
    });

    if (checkPassword) {
      const accessToken = jwt.sign(
        userWithOutPassword,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "6h",
        }
      );

      const refreshToken = jwt.sign(
        userWithOutPassword,
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "24h",
        }
      );

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { user_refresh_token: refreshToken },
      });

      //ini kode mu :
      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   maxAge: 24 * 60 * 60 * 1000,
      // });

      //setel ini pas production
      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   secure: true, // WAJIB untuk cross-origin di production (Railway pakai HTTPS)
      //   sameSite: "none", // WAJIB agar cookie dikirim cross-origin
      //   maxAge: 24 * 60 * 60 * 1000
      // });

      //setel ini pas localan
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // JANGAN true dulu, karena http://localhost akan gagal
        sameSite: "lax", //  "lax" cukup untuk localhost & masih oke di deploy
        maxAge: 24 * 60 * 60 * 1000, // 1 hari
      });

      return res
        .status(200)
        .json({ message: "Success Login", result: accessToken });
    } else {
      return res.status(401).json({ message: "Failed to login" });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Login Failed" });
  }
};
const refreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
      return res.status(401).json({ message: "Not Login" });
    }

    const user = await prisma.user.findFirst({
      where: { user_refresh_token: cookies.refreshToken },
      select: {
        id: true,
        user_email: true,
        user_nama: true,
        user_role: true,
        user_avatar: true,
      },
    });

    if (!user) {
      return res.status(403).json({ message: "The User is not found" });
    }
    jwt.verify(
      cookies.refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid Refresh Token" });
        } else {
          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "6h",
          });
          return res
            .status(200)
            .json({ message: "Refresh Token Success", result: accessToken });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
const logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
      return res.status(200).json({ message: "success logout" });
    }

    const refreshToken = cookies.refreshToken;
    const user = await prisma.user.findFirst({
      where: { user_refresh_token: refreshToken },
    });

    if (user) {
      const result = await prisma.user.update({
        where: { id: user.id },
        data: {
          user_refresh_token: null,
        },
      });
    }

    res.clearCookie("refreshToken", { httpOnly: true });
    return res.status(200).json({ message: "Success Logout" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports = { register, login, refreshToken, logout };
