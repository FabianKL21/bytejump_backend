const { default: axios } = require("axios");

const getTags = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.DEVELOPER_API}/tags`);

    if (response.data.length <= 0) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res
      .status(200)
      .json({ message: "Success get data", result: response.data });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get data" });
  }
};
const getArticles = async (req, res) => {
  try {
    const { tags } = req.query;
    let response;

    if (tags) {
      response = await axios.get(
        `${process.env.DEVELOPER_API}/articles?tags=${tags}`
      );
    } else {
      response = await axios.get(`${process.env.DEVELOPER_API}/articles`);
    }
    if (response.data.length <= 0) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res
      .status(200)
      .json({ message: "Success get data", result: response.data });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get data" });
  }
};
const getArticlesTop = async (req, res) => {
  try {
    const { top } = req.params;

    if (top < 1) {
      return res.status(400).json({ message: "The Top At Least 1" });
    }

    const response = await axios.get(
      `${process.env.DEVELOPER_API}/articles?top=${top}`
    );

    if (response.data.length <= 0) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res
      .status(200)
      .json({ message: "Success get data", result: response.data });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get data" });
  }
};

module.exports = { getTags, getArticles, getArticlesTop };
