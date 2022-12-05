const ytdl = require("ytdl-core"); // npm install ytdl-core
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg"); // npm install fluent-ffmpeg

// Function to download a YouTube video as an MP4 file
async function downloadVideo(url) {
  // Extract the video ID from the URL
  const videoId = ytdl.getURLVideoID(url);
  
  // Download the video
  const videoStream = ytdl(url, {
    quality: "highestvideo",
    filter: "videoandaudio"
  });
  
  // Write the video to a file
  const fileStream = fs.createWriteStream(`./${videoId}.mp4`);
  videoStream.pipe(fileStream);
  
  // Convert the video to an MP3 file
  const audioStream = ffmpeg(videoStream)
    .audioCodec("libmp3lame")
    .audioBitrate(192)
    .format("mp3");
  // Write the MP3 file to disk
  const audioFileStream = fs.createWriteStream(`./${videoId}.mp3`);
  audioStream.pipe(audioFileStream);

  // Wait for the download to finish
  await new Promise((resolve, reject) => {
    fileStream.on("finish", resolve);
    fileStream.on("error", reject);
  });


  // Wait for the download to finish
  await new Promise((resolve, reject) => {
    audioFileStream.on("finish", resolve);
    audioFileStream.on("error", reject);
  });
  
  console.log(`Successfully downloaded ${videoId}.mp4`);
}

const url = process.argv[2]
if(!url) return console.log('Missing url')

// Example usage: download a YouTube video as an MP4 file
downloadVideo(url);