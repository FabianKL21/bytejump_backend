const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const key = path.join(__dirname, "../config/gdrivekey.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.GoogleAuth({
  keyFile: key,
  scopes: SCOPES,
});

const drive = google.drive({
  version: "v3",
  auth,
});

const uploadFile = async (filePath, fileName, mimeType, folderId) => {
  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType: mimeType,
    body: fs.createReadStream(filePath),
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
