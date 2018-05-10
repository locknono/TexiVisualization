function getChinaPrvLocationData(SystemName) {
  
  if(SystemName=='GDP'){
    return new Promise(function (resolve, reject) {
      //place.json
      d3.json("data/place.json", data => {
        data.sites.map(element => {
          element.lng=parseFloat(element.lng);
          element.lat=parseFloat(element.lat);
        });
        resolve(data);
      });
    });
  }else if(SystemName=='Air'){
    return new Promise(function (resolve, reject) {
      d3.json("data/site.json", data => {
        data.sites.map(element => {
          element.lng=parseFloat(element.lng);
          element.lat=parseFloat(element.lat);
        });
        resolve(data);
      });
    });
  }else if(SystemName=='Wenzhou'){
    return new Promise(function (resolve, reject) {
      d3.json("data/Wenzhou.json", data => {
        data.sites.map(element => {
          element.lng=parseFloat(element.lng);
          element.lat=parseFloat(element.lat);
        });
        resolve(data);
      });
    });
  }
}

function getChinaGDPData(SystemName) {
  //GDP_2013.csv
  if(SystemName=='GDP'){
    return new Promise(function (resolve, reject) {
      d3.csv("data/GDP_2013.csv", data => {
        resolve(data);
      });
    });
  }else if(SystemName=='Air'){
    return new Promise(function (resolve, reject) {
      d3.csv("data/avgAirData0604.csv", data => {
        resolve(data);
      });
    });
  }
  else if(SystemName=='Wenzhou'){
    return new Promise(function (resolve, reject) {
      d3.csv("data/Wenzhou.csv", data => {
        resolve(data);
      });
    });
  }
 
}


function getComData(SystemName) {
  //GDP_2013.csv
  if(SystemName=='Wenzhou'){
    return new Promise(function (resolve, reject) {
      d3.csv("data/edgeData.csv", data => {
        resolve(data);
      });
    });
  }
}