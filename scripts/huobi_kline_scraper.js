var https = require('https');
var prompt = require('prompt');
var ObjectsToCsv = require('objects-to-csv');


class KlineScrapper {
	// class property

	constructor() {
	}

	initScrapper() {
		prompt.start()

		let getMarketData = this.getMarketData;

		prompt.get(['symbol', 'period', 'size', 'filename'], function (err, result) {
			if (err) {
				console.log("Prompt method error", err);
			}
			getMarketData(result)
		});
	}

	getMarketData(result) {
		let options = {
			host: 'api.huobi.pro',
			port: 443,
			path: `/market/history/kline?period=${result.period}&size=${result.size}&symbol=${result.symbol}`,
			method: 'GET'
		}

		var filename = result.filename;

		let callback = function (response) {
			var str = ''
			response.on('data', function (chunk) {
				str += chunk;
			});

			response.on('end', function () {
				let obj = JSON.parse(str);  
				const csv = new ObjectsToCsv(obj.data);
				csv.toDisk(`./${filename}.csv`)
			});
		}
		var req = https.request(options, callback);

		req.on('error', function (e) {
			console.log('problem with request: ' + e.message);
		});

		req.end();
	};

}

const klineScrapper = new KlineScrapper;
klineScrapper.initScrapper();

