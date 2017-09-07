const express = require('express');
const router = express.Router();
// const controller = require('./translate.controller');
const request = require('request');
const cheerio = require('cheerio');

const KEYS = require('../../config/keyfile');

const cld = require('cld');

const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();

const client_id = KEYS.NAVER_client_id;
const client_secret = KEYS.NAVER_client_secret;

let url = 'https://translate.google.co.kr/#en/ko/test';

router.get('/:query', (req, res) => {
  let api_url = 'https://openapi.naver.com/v1/papago/n2mt';
  let query = req.params.query || '';

  console.log(query);

  if (!query.length) {
    return res.status(400).json({error: 'Incorrect query'});
  }

  let lngDetect;
  let source, target;

  if (query.length < 3) {
    source = 'ko';
    target = 'en';
  } else {
    cld.detect(query, (err, result) => {
      lngDetect = result;
    });

    if (lngDetect === undefined) {
      source = 'en';
      target = 'ko';
    } else if (lngDetect.languages[0].code === 'ko') {
      source = lngDetect.languages[0].code;
      target = 'en';
    }
  }

  let options = {
      url: api_url,
      form: {'source':source, 'target':target, 'text':query},
      headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
   };

  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      res.end(body);
    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
});

module.exports = router;