var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var googleFinance = require('google-finance');
var _ = require('lodash');
var app     = express();

app.get('/getData', function(req, res){

  console.log(req.query.from);
  console.log(req.query.to);
  console.log(req.query.ticker);

  fromR = req.query.from;
  toR = req.query.to;
  tickerR = req.query.ticker;

  googleFinance.historical({
    symbol:tickerR,//+req.ticker
    from: fromR, //req.from
    to: toR //req.to
  }, function (err, quotes) {
      console.log(""+quotes[2].date);
      months = {'Jan':1, 'Feb':2, 'Mar': 3, 'Apr': 4,
      'May':5, 'Jun':6, 'Jul':7, 'Aug':8, 'Sep':9,'Oct':10,
      'Nov':11, 'Dec':12};
      x = [];
      y = [];
      for(i = 0; i < quotes.length; i++){
        dateUnparsed = ""+quotes[i].date;
        dateSplit = dateUnparsed.split(" ");
        dateParsed = "" + _.get(months, dateSplit[1]) + "_"
          + dateSplit[2] + "_" + dateSplit[3];

        close = quotes[i].close;
        x = _.concat(x,dateParsed);
        y = _.concat(y,close);

      }

      res.send({
        x:x,
        y:y,
        high: Math.max.apply(Math,y),
        low: Math.min.apply(Math,y)
      });
      //res.send(quotes);

  });

})

// app.get('/scrape', function(req, res){
//
//
//
// })

app.listen('5000');

console.log('Magic happens on port 8081');

exports = module.exports = app;
