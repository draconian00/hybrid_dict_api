const express = require('express');
const router = express.Router();
// const controller = require('./translate.controller');
const request = require('request');

const KEYS = require('../../config/keyfile');

const cld = require('cld');

const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();

const client_id = KEYS.NAVER_client_id;
const client_secret = KEYS.NAVER_client_secret;

router.post('/', (req, res) => {
  const query = req.body.content;

  if (!query.length) {
    let response = {
      "message": {
        "text" : "검색어 오류 입니다. 다시 시도해 주세요."
      }
    }
    return res.json(response);
  }
  const type = req.body.type || '';
  if (type !== "text") {
    let response = {
      "message": {
        "text" : "텍스트만 입력할 수 있습니다. 다시 시도해 주세요."
      }
    }
    return res.json(response);
  }

  let api_url = 'https://openapi.naver.com/v1/papago/n2mt';

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
    } else if (lngDetect.languages[0].code === 'en') {
      source = lngDetect.languages[0].code;
      target = 'ko';
    }
  }

  let options = {
      url: api_url,
      form: {'source':source, 'target':target, 'text':query},
      headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
   };

  request.post(options, function (error, response, body) {
    console.log(error, body);
    if (!error && response.statusCode == 200) {
      // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      body_json = JSON.parse(body);
      let translatedText = body_json.message.result.translatedText;

      let response = {
        "message": {
          "text" : translatedText
        }
      }
      return res.json(response);
    } else {
      let response = {
        "message": {
          "text" : "번역기 오류 입니다. 다시 시도해 주세요."
        }
      }
      return res.json(response);
    }
  });
});

module.exports = router;