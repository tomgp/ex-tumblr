import fs from 'node:fs';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import path from 'node:path';

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function downloadFile(url, fileName){
  try{
    console.log('downloading ', url, 'to', fileName)
    const res = await fetch(url);
    if (!fs.existsSync("downloads")){
      fs.mkdirSync("downloads");
    }
    const destination = path.resolve("./downloads", fileName);
    const fileStream = fs.createWriteStream(destination, { flags: 'wx' });
    await finished(Readable.fromWeb(res.body).pipe(fileStream));
    console.log('got: ', url);
  }catch(err){
    console.log(err)
  }
};

let images = JSON.parse(fs.readFileSync('downloads/imageList.json','utf-8'))
  .filter(d=>!d.downloaded);

for(let i = 0; i<images.length; i++){
  console.log(i / images.length);
  downloadFile(images[i].url, images[i].filename)
  images[i].downloaded = true;
  fs.writeFileSync('downloads/imageList.json', JSON.stringify(images, null,' '))
  await sleep(500);
}