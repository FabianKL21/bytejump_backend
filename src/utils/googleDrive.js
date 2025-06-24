const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const streamifier = require("streamifier");

const SCOPES = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.CONFIGGDRIVE),
  scopes: SCOPES,
});

const drive = google.drive({
  version: "v3",
  auth,
});

const uploadFile = async (buffer, fileName, mimeType, folderId) => {
  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType: mimeType,
    body: streamifier.createReadStream(buffer),
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id, webViewLink, webContentLink",
  });

  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return response.data;
};

module.exports = {
  uploadFile,
};
