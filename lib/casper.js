/* eslint-disable */



var fs = require('fs');
var utils = require('utils');
var casper = require('casper').create({
  verbose: true,
  logLevel: 'debug',
  pageSettings: {
    userAgent: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)'
  }
});

var file = casper.cli.get('file');
console.log('file: ', file);

// casper.options.onResourceRequested = function(C, requestData, request) {
//   console.log('REQUESTED');
//   utils.dump(requestData.headers);
// };
// casper.options.onResourceReceived = function(C, response) {
//   console.log('RECEIVED');
//   utils.dump(response.headers);
// };

phantom.cookiesEnabled = true;

var USERNAME = 'Roberto Lewis';
var PASSWORD = 'hackster01';

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

function logIn() {
  casper.start('https://easylobby.usbanktower.com/', function() {
    var h2 = this.fetchText('h2');
    this.echo('h2: ' + h2);
  });

  casper.then(function() {
    this.wait(1000);
  });

  casper.then(function() {
    this.echo('Browser Cookie: ' + this.evaluate(function() {
      return document.cookie;
    }));
    this.echo('insie then' + USERNAME);
    this.fillSelectors("form#aspnetForm", {
      'input#ctl00_MainContentPlaceHolder_TxtUserID': USERNAME,
      'input#ctl00_MainContentPlaceHolder_txtPassword': PASSWORD,
      'input[name="ctl00$MainContentPlaceHolder$CookiesJavascriptEnabled"]': true
    });


    var formValues = this.getFormValues('form#aspnetForm');
    console.log('formValues: ', formValues);
    for (var prop in formValues) {
      console.log('formValues[' + prop + ']: ', formValues[prop]);
    }

    console.log('IsCookiesJavascriptEnabled function: ', this.evaluate(function() {
      window.IsCookiesJavascriptEnabled = function() {};
      return window.IsCookiesJavascriptEnabled;
    }));

    console.log('logging in');
    this.click('input#ctl00_MainContentPlaceHolder_btnLogin');




    this.echo('Browser Cookie: ' + this.evaluate(function() {
      return document.cookie;
    }));

  });

  casper.then(function() {
    this.wait(2000);
  });
}

function createRegistration() {
  casper.then(function() {
    var h2 = this.fetchText('h2');
    this.echo('h2: ' + h2);
    this.fillSelectors("form#aspnetForm", {
      'input#ctl00_MainContentPlaceHolder_MainTab__ctl0_1_Txt_0': 'Charles',
      'input#ctl00_MainContentPlaceHolder_MainTab__ctl0_2_Txt_0': 'Dudley'
    });


    console.log('saving visit');
    this.click('input#ctl00_MainContentPlaceHolder_ApplyBtn');
  });

  casper.then(function() {
    this.wait(2000);
  });

  casper.then(function() {
    console.log('error: ', this.fetchText('#ctl00_MainContentPlaceHolder_Error_Label'));
  });
}

logIn();
createRegistration();
// casper.thenOpen('https://easylobby.usbanktower.com/ViewHistory.aspx');
// casper.thenOpen('https://easylobby.usbanktower.com/Preregister.aspx');





// utils.dump(casper.steps.map(function(step) {
//   return step.toString();
// }));

casper.run(function() {
  this.exit();
});
