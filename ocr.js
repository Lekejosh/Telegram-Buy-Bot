const tesseract = require("node-tesseract-ocr")
const ffmpeg = require('ffmpeg')
const path = require('path')
const fileManager = require('./fileManager')
let extractText = async (imagePath) => {
    let extractedText = 'Empty'
    const config = {
        lang: "eng",
        oem: 1,
        psm: 3,
    }
    await tesseract.recognize(imagePath, config)
        .then(text => {
            extractedText = text
        })
        .catch(err => {
            console.log("Error:", err.message)
        })
    return extractedText
}

let videoOCR = async (videoPath, fileUniqueID, frame) => {
  let extractedText = 'Empty'
  let data = {text : extractedText, frame: frame}
  const imageName = `${fileUniqueID}.jpg`
  const imagePath = path.resolve(__dirname, 'tmp/images', imageName)

  try {
    let process = new ffmpeg(videoPath);
    return await process.then(video => {
      return new Promise((resolve, reject) => {
        video.addCommand('-ss', frame)
        video.addCommand('-vframes', '1')
        video.save(imagePath, async (err, file) => {
          if (!err) {
            extractedText = await extractText(imagePath)
            fileManager.deleteFile(imagePath)
            data.text = extractedText
            resolve(data);
          } else {
            console.log('Error: ' + err)
            reject(data);
          }
        })
      });
    })
  } catch (err) {
    console.log(err.code)
    console.log(err.msg)
    return data
  }
}

module.exports = { extractText, videoOCR }