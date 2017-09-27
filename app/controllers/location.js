var util = require('../utils/util');
var path = require('path');
var Country = require('../models/country');
var Region = require('../schemas/region');
var TJO = require('translate-json-object')();

exports.country = function(req, res) {
  filePath = path.join(__dirname, '../countries.json');
  var start = 250;
  var end = 300;

  util.stringFromFile(filePath, function(err, data) {
    if (data) {

      var result = [];
      var jsonCountries = JSON.parse(data);

      TJO.init({
        yandexApiKey: 'trnsl.1.1.20170721T044606Z.2adc312fc45cbcf4.c2d25460edd0c4104d44a364d0d54c050891a72b'
      });

      var nationalities = [];
      jsonCountries.slice(start, end).forEach(function(country) {
        nationalities.push(country.nationality);
      });

      TJO.translate(nationalities, 'es')
        .then(function(data) {
          data.forEach(function(value, key) {
            var country = new Country({
              iso: jsonCountries[start + key].alpha_2_code,
              name: jsonCountries[start + key].en_short_name,
              area_code: jsonCountries[start + key].num_code,
              nationality: value
            });
            country.save(function(err, data) {
              if (err) {
                console.log(err)
              }
              console.log(key);
            })
          });
        }).catch(function(err) {
          console.log('error ', err)
        });
    }
  })
}

exports.locations = function(req, res) {
  filePath = path.join(__dirname, '../communes.json');
  util.stringFromFile(filePath, function(err, data) {

    if (data) {

      var result = [];
      var jsonCommunes = JSON.parse(data);
      jsonCommunes.push({});
      var region = {
        provinces: []
      };
      var regions = [];
      var commune = {};

      jsonCommunes.forEach(function(zone, index) {
        if (region.name != zone.region) {
          if (!region.name) {
            region = {
              provinces: []
            };
            region.name = zone.region;
            region.provinces.push({
              name: zone.province,
              communes: [{
                name: zone.commune
              }]
            });
          } else { //save
            regions.push(region);
            region = {
              provinces: []
            };
          }
        } else {
          var idx = idxOfProvince(region.provinces, zone.province);
          if (idx != -1) {
            region.provinces[idx].communes.push({
              name: zone.commune
            });
          } else {
            region.provinces.push({
              name: zone.province,
              communes: [{
                name: zone.commune
              }]
            });
          }
        }
      });


      regions.forEach(function(reg, index) {
        var newRegion = new Region(reg);
        newRegion.save(function(err, data) {});
      });
    }
  });
}

function idxOfProvince(array, province) {
  var idx = -1;
  array.forEach(function(obj, i) {
    if (obj.name == province) {
      idx = i;
    }
  });
  return idx;
}

exports.countries = function(req, res) {
  Country.list(function(err, countries) {
    if (err) {
      return util.errorResponse(res, 'INTERNAL_ERROR', err);
    }
    return util.okResponse(res, 200, {
      countries: countries
    });
  })
}

exports.regions = function(req, res) {
  Region.find({}, function(err, data) {
    if (err) {
      return util.errorResponse(res, 'INTERNAL_ERROR', err);
    }
    return util.okResponse(res, 200, {
      regions: data
    });
  });
}

exports.addComune = function(req, res) {
  var region = req.body.region;
  var province = req.body.province;
  var commune = {
    name: req.body.commune
  };

  console.log("region", region)
  console.log("commune", commune)
  console.log("province", province)


  Region.update({
    "name": region,
    "provinces.name": province
  }, {
    $push: {
      "provinces.$.communes": commune
    }
  }, function(err, data) {

    return res.json({
      data: data
    });
  })


}