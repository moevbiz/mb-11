const axios  = require('axios');
const seed   = require('../../../utils/save-seed.js');


// Once a google sheet is "published to the web" we can access its JSON
// via a URL of this form. We just need to pass in the ID of the sheet
// which we can find in the URL of the document.
const sheetID = "1XN9AyaFrvrVdw53PUFvCFSBElc0u35Eb4ZHnncdS91w";
const sheet = {
  sites: `https://spreadsheets.google.com/feeds/list/${sheetID}/1/public/values?alt=json`,
  tech: `https://spreadsheets.google.com/feeds/list/${sheetID}/2/public/values?alt=json`,
}

const getSites = () => {
  return axios.get(sheet.sites);
}

const getTech = () => {
  return axios.get(sheet.tech);
}

module.exports = () => {
  return new Promise((resolve, reject) => {

    Promise.all([getSites(), getTech()])
      .then(([sites, tech]) => {
        // massage the data from the Google Sheets API into
        // a shape that will more convenient for us in our SSG.
        var data = {
          "content": [],
          "types": [],
          "tech": [],
        };
        let years = [];
        tech.data.feed.entry.forEach(item => {
          data.tech.push({
            "name": item.gsx$tech.$t,
            "color": item.gsx$color.$t
          });
        })
        sites.data.feed.entry.forEach(item => {
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
            "type": item.gsx$type.$t.split(', '),
            "tech": item.gsx$tech.$t.split(', '),
            "long": item.gsx$long.$t,
            "mark": item.gsx$highlight.$t,
            "visible": item.gsx$visible.$t,
            "yearDisplay": yearDisplay(item)
          })
          item.gsx$type.$t.split(', ').forEach(type => {
            if (!data.types.includes(item.gsx$type.$t)) {
              data.types.push(type);
            }
          })
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
