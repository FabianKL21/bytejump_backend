const { InferenceClient } = require("@huggingface/inference");
const prisma = require("../../prisma/prisma");

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
      provider: "groq",
      model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B",
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
    const response = await client.textToImage({
      provider: "nebius",
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: input,
      parameters: { num_inference_steps: 40 },
    });
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.set("Content-Type", response.type);
    return res.status(200).send(buffer);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Failed to generate" });
  }
};

module.exports = { chat, image };
