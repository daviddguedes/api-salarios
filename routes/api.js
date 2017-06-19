const express = require('express');
const router = express.Router();
const Salario = require('../models/Salarios');
const lineReader = require('line-reader');
const fs = require('fs');
var rp = require('request-promise');

let i = 0;

router.use(function (req, res, next) {
	console.log('Something is happening.');
	next();
});

router.get('/', function (req, res, next) {
	res.json({ message: 'Api Express' });
});

router.get('/import', function (req, res) {
	let objeto = {
		requests: []
	}
	const caminho = __dirname + '/teste.txt';
	lineReader.eachLine(caminho, function (line, last) {

		let str = line;
		let arr = str.split("|");

		let obj = {
			"method": "POST",
			"path": "/salarios/classes/Pessoal",
			"body": {
				"cd_ugestora": arr[0],
				"de_ugestora": arr[1],
				"de_cargo": arr[2],
				"de_tipocargo": arr[3],
				"cd_cpf": arr[4],
				"dt_mesanorefencia": arr[5],
				"no_servidor": arr[6],
				"vl_vantagens": arr[7],
				"de_uorcamentaria": arr[8]
			}
		}
		objeto.requests.push(obj);	
		i++;

		if (last) {
			console.log("linha: " + i);
			var options = {
				method: 'POST',
				uri: 'http://localhost:1337/salarios/batch',
				headers: {
					'X-Parse-Application-Id': 'ESSE_APP_ID',
					'X-Parse-REST-API-Key': 'ESSE_REST_KEY'
				},
				body: objeto,
				json: true
			};
			rp(options)
				.then(function (parsedBody) {
					res.json({ message: 'Importado com sucesso!' });
				})
				.catch(function (err) {
					res.json(objeto);
				});
		}	

	});
});

module.exports = router;