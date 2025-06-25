const { InferenceClient } = require("@huggingface/inference");
const { v4: uuidv4 } = require("uuid");
const prisma = require("../../prisma/prisma");
const { uploadFile } = require("../utils/googleDrive");
const GOOGLE_DRIVE_FOLDER_ID = process.env.GDRIVEKEY;

const chat = async (req, res) => {
  try {
    const client = new InferenceClient(process.env.HF_ACCESS_TOKEN);
    const { input } = req.body;
    const user = req.userLogin;
    await prisma.chat.create({
      data: {
        userId: user.id,
        role: "user",
        message: input,
      },
    });
    const response = await client.chatCompletion({
      provider: "fireworks-ai",
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
    });
    await prisma.chat.create({
      data: {
        userId: user.id,
        role: "ai",
        message: response.choices[0].message.content,
      },
    });

    return res.status(200).json({
      message: "Success Generate",
      result: response.choices[0].message.content,
      accessToken: req.accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to generate" });
  }
};
const image = async (req, res) => {
  try {
    const client = new InferenceClient(process.env.HF_ACCESS_TOKEN);
    const { input } = req.body;
    const user = req.userLogin;
    const response = await client.textToImage({
      provider: "nebius",
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: input,
      parameters: { num_inference_steps: 40 },
    });
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploaded = await uploadFile(
      buffer,
      `image-${uuidv4()}.png`,
      "image/png",
      GOOGLE_DRIVE_FOLDER_ID
    );

    await prisma.chat.create({
      data: {
        userId: user.id,
        role: "user",
        message: input,
      },
    });

    await prisma.chat.create({
      data: {
        userId: user.id,
        role: "ai",
        isImage: true,
        imageUrl: uploaded.webViewLink,
      },
    });

    return res.status(200).json({
      message: "Success Generate Image",
      result: uploaded.webViewLink,
      accessToken: req.accessToken,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Failed to generate" });
  }
};

const getChat = async (req, res) => {
  try {
    const user = req.userLogin;
    const result = await prisma.chat.findMany({ where: { userId: user.id } });

    if (result.length <= 0) {
      return res.status(404).json({ message: "No chat" });
    }

    return res
      .status(200)
      .json({ message: "Success Get Chat", result: result });
  } catch (error) {
    return res.status(500).json({ message: "Failed Get Chat" });
  }
};

module.exports = { chat, image, getChat };
