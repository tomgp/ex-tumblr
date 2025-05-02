import fs from 'node:fs';
import * as cheerio from 'cheerio';

let pages = fs.readdirSync('page');
console.log(pages)

let imageURLs = [];

let total = 0;

pages.forEach((dir,i)=>{
  console.log('page', i)
  let html = fs.readFileSync(`page/${dir}/index.html`,'utf-8');
  let $ = cheerio.load(html);
  let images = $('img').each((count,e)=>{
    total ++;
    console.log('   image', count)
    let url = e.attribs.src;
    let URLElements = url.split('/');
    let filename = URLElements[URLElements.length-1];
    imageURLs.push({
      url,
      filename,
      downloaded:false
    });
  });
})

fs.writeFileSync('downloads/imageList.json', JSON.stringify(imageURLs,null,' '))
console.log(`${total} images listed`)