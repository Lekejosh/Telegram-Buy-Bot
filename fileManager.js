const fs = require('fs')
const path = require('path')
const axios = require('axios')

const downloadFile = async (fileUrl, fileUniqueId, type) => {
  const fileDir = type === 'Image' ? 'images' : 'videos'
  const splitFileUrl = fileUrl.pathname
  const fileFormat = splitFileUrl[splitFileUrl.length - 1]
  const fileName = `${fileUniqueId}.${fileFormat}`
  const filePath = path.resolve(__dirname, `tmp/${fileDir}`, fileName)
  const writer = fs.createWriteStream(filePath)

  return axios({
    method: 'get',
    url: fileUrl.href,
    responseType: 'stream',
  }).then(response => {

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on('error', err => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) {
          resolve(writer.path);
        }
      });
    });
  });
}


const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      return
    }
    console.log('file deleted')
  })
}

module.exports = { downloadFile, deleteFile }