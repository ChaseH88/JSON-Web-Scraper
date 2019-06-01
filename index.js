const request = require("request");
const cheerio = require("cheerio");
var fs = require('fs');

const site = "https://docs.google.com/spreadsheets/d/1G7Ng3eZJgmPD9-eQX-yc63AvDfznggNY5FT2wy19588/pubhtml/sheet?headers=false&gid=1321988985";

let data = [];

request(site, (err, res, html) => {
  if(!err && res.statusCode === 200){
    const $ = cheerio.load(html);
    const rows = $("table.waffle>tbody>tr[style]").each(function(i){
      let el = $(this).find("td");
      
      // Grab the data from the page
      let name = el.eq(0).text(),
          city = el.eq(1).text(),
          state = el.eq(2).text(),
          country = el.eq(3).text(),
          description = el.eq(4).text();
      if(name !== ""){
        // assemble the data
        let obj = [{ name, city, state, country, description }];
        // add to data array
        data.push(obj);
      }
    });
  }
  // write the data to the file
  let fileName ="data.json";
  fs.writeFile(fileName, JSON.stringify(data), 'utf8', () => {
    if(err){
      console.log(err);
    }
    console.log(`Data has been successfully written to: ${fileName}`);
  });
});

