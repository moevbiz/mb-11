const axios  = require('axios');
const seed   = require('../../../utils/save-seed.js');


// Once a google sheet is "published to the web" we can access its JSON
// via a URL of this form. We just need to pass in the ID of the sheet
// which we can find in the URL of the document.
const sheetID = "1XN9AyaFrvrVdw53PUFvCFSBElc0u35Eb4ZHnncdS91w";
const googleSheetUrl = `https://spreadsheets.google.com/feeds/list/${sheetID}/od6/public/values?alt=json`;

module.exports = () => {
  return new Promise((resolve, reject) => {

    console.log(`Requesting data from ${googleSheetUrl}`);

    axios.get(googleSheetUrl)
      .then(response => {
        // massage the data from the Google Sheets API into
        // a shape that will more convenient for us in our SSG.
        var data = {
          "content": [],
          "types": [],
        };
        var years = []
        response.data.feed.entry.forEach(item => {
          function yearDisplay(item) {
            if (years.includes(item.gsx$year.$t)) {
              return false
            } else {
              if (item.gsx$visible.$t === "TRUE") {
                years.push(item.gsx$year.$t)
                return true
              }
              return false
            }
          }
          data.content.push({
            "year": item.gsx$year.$t,
            "name": item.gsx$name.$t,
            "link": item.gsx$url.$t,
            "type": item.gsx$type.$t,
            "tech": item.gsx$tech.$t,
            "long": item.gsx$long.$t,
            "mark": item.gsx$highlight.$t,
            "visible": item.gsx$visible.$t,
            "yearDisplay": yearDisplay(item)
          })
          if (!data.types.includes(item.gsx$type.$t)) {
            data.types.push(item.gsx$type.$t)
          }
        });

        data.types.sort()

        // stash the data locally for developing without
        // needing to hit the API each time.
        seed(JSON.stringify(data), `${__dirname}/../dev/sheet.json`);

        // resolve the promise and return the data
        resolve(data);

      })

      // uh-oh. Handle any errrors we might encounter
      .catch(error => {
        console.log('Error :', error);
        reject(error);
      });
  })
}
