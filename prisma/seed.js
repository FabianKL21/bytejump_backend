const { faker } = require("@faker-js/faker");
const prisma = require("./prisma");
const bcryptjs = require("bcryptjs");

const generateMember = async () => {
  await prisma.user.deleteMany();

  for (let i = 0; i < 20; i++) {
    const user_nama = faker.person.firstName();
    const user_email = `${user_nama.toLowerCase()}@gmail.com`;
    const hashPassword = await bcryptjs.hash("12345678", 10);

    await prisma.user.create({
      data: {
        user_nama: user_nama,
        user_email: user_email,
        user_password: hashPassword,
        user_avatar:
          "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
        user_refresh_token: null,
        user_role: faker.helpers.arrayElement(["member", "admin"]),
      },
    });
  }

  console.log("Done seeding 20 users!");
};

generateMember().catch((e) => {
  console.error(e);
  process.exit(1);
});
