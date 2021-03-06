define({ "api": [
  {
    "type": "get",
    "url": "/currencies",
    "title": "",
    "name": "getCurrencies",
    "group": "Currencies",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "-",
            "description": "<p>Список валют</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "-.abbr",
            "description": "<p>Аббревиатура валюты</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "-.name",
            "description": "<p>Полное название валюты</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "-.icon",
            "description": "<p>Иконка валюты</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  [\n   {\n     \"abbr\": \"ltc\",\n     \"name\": \"Litecoin\",\n     \"icon\": \"ltc.png\"\n   },\n   {\n     \"abbr\": \"btc\",\n     \"name\": \"Bitcoin\",\n     \"icon\": \"btc.png\"\n   }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/api/v1/currencies.js",
    "groupTitle": "Currencies"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./public/apidoc/main.js",
    "group": "_app_public_apidoc_main_js",
    "groupTitle": "_app_public_apidoc_main_js",
    "name": ""
  }
] });
