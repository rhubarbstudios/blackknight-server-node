import Visitor from './Visitor';
import Boom from 'boom';
import {spawn, exec} from 'child_process';

import path from 'path';

import fs from 'fs';


console.log(process.cwd());

let USERNAME = 'Roberto Lewis';
let PASSWORD = 'hackster01';

function createDataFile(visitor) {
  return new Promise((resolve, reject) => {
    console.log('visitor: ', visitor);
    // Check if a current file exists
    let file = path.resolve('data/' + visitor.id + '.json');
    console.log('file: ', file);
    fs.exists(file, exists => {
      if (exists) {
        console.log('exists!');
        reject();
      } else {
        fs.writeFile(file, JSON.stringify(visitor), err => {
          if (err) {
            reject(err);
          } else {
            resolve(file);
          }
        });
      }
    });
  });
}

function updateEasyLobby(file) {
  return new Promise((resolve, reject) => {

    let child = spawn('casperjs', ['es5/lib/casper.js', '--file=' + file]);

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', data => {
      console.log('data: ', data);
    });

    child.on('exit', code => {
      console.log('exit: ', code);
      resolve();
    });
  });

  // casper.start('https://easylobby.usbanktower.com/')
  //   .then(function() {
  //     this.echo(this.getHTML('h1#foobar'));
  //   });
  //
  // casper.run();
}

// look at https://stackoverflow.com/questions/18160635/scrape-a-webpage-and-navigate-by-clicking-buttons
//
// function logIn() {
//   return new Promise((resolve, reject) => {
//     phantom.create(ph => {
//       ph.createPage(page => {
//         page.set('onResourceReceived', function(res) {
//           // console.log('Resource received: ', res);
//           // console.log('cookies: ', page.cookies);
//           page.get('cookies', function(cookies) {
//             cookieJar.push(cookies);
//           });
//         });
//
//         page.open('https://easylobby.usbanktower.com/', () => {
//           page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', () => {
//             page.evaluate(function(USERNAME, PASSWORD) {
//               $('input#ctl00_MainContentPlaceHolder_TxtUserID').val(USERNAME);
//               $('input#ctl00_MainContentPlaceHolder_txtPassword').val(PASSWORD);
//               $('#ctl00_MainContentPlaceHolder_btnLogin').click();
//             }, function(result) {
//               console.log('title: ', result);
//               ph.exit();
//               resolve();
//             }, USERNAME, PASSWORD);
//           });
//         });
//       });
//     });
//   });
// }
//
// function getVisitorList() {
//   return new Promise((resolve, reject) => {
//     phantom.create(ph => {
//       ph.createPage(page => {
//         // page.set('onResourceReceived', function(res) {
//         //   // console.log('Resource received: ', res);
//         //   // console.log('cookies: ', page.cookies);
//         //   page.get('cookies', function(cookies) {
//         //     console.log('cookies2?: ', cookies);
//         //   });
//         // });
//         cookieJar.forEach(cookie => {
//           ph.addCookie(cookie);
//           console.log('cookie: ', cookie);
//         });
//
//
//         page.open('https://easylobby.usbanktower.com/PreRegister.aspx', () => {
//           page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', () => {
//             page.evaluate(function() {
//               return $('h2').text();
//             }, function(result) {
//               console.log('title: ', result);
//               ph.exit();
//               resolve();
//             });
//           });
//         });
//       });
//     });
//   });
// }
//
// function updateEasyLobby(visitor) {
//   return new Promise((resolve, reject) => {
//     logIn()
//       .then(getVisitorList);
//   });
// }

// function logObject(obj) {
//   console.log('obj: ', obj);
// }
//
// function loadLoginPage(spooky) {
//   spooky.start();
//   spooky.open('https://easylobby.usbanktower.com');
//   // spooky.open('https://easylobby.usbanktower.com/default.aspx', {
//   //     method: 'post',
//   //     data: {
//   //       'ctl00$MainContentPlaceHolder$TxtUserID': USERNAME,
//   //       'ctl00$MainContentPlaceHolder$txtPassword': PASSWORD
//   //     }
//   // });
//
//   spooky.then([
//     {
//       USERNAME: USERNAME,
//       PASSWORD: PASSWORD
//     },
//     function() {
//       this.fill('form#aspnetForm', {
//         'ctl00$MainContentPlaceHolder$TxtUserID': USERNAME,
//         'ctl00$MainContentPlaceHolder$txtPassword': PASSWORD
//       }, true);
//     }
//   ]);
//
//   spooky.then(function(res) {
//     function log(obj) {
//       for (let prop in obj) {
//         if (typeof obj[prop] === 'object') {
//           log(obj[prop]);
//         } else {
//           console.log(prop + ': ' + obj[prop]);
//         }
//       }
//     }
//
//     log(res);
//   });
//
//   // spooky.waitFor(function () {
//   //   return this.getCurrentUrl().indexOf('/PreRegister.aspx') !== -1;
//   // });
//
//   // spooky.end();
//   // spooky.then(function() {
//   //   this.open('https://easylobby.usbanktower.com/PreRegister.aspx');
//   // });
//
//   spooky.then(function() {
//     console.log('inside this then');
//     console.log('this.getCurrentUrl(): ', this.getCurrentUrl());
//     this.emit('hello', 'Hello, from ' + this.evaluate(function() {
//       let h2 = document.querySelector('h2')
//       return h2.innerHTML;
//     }));
//   });
// }
//
// function updateEasyLobby(visitor) {
//   return new Promise((resolve, reject) => {
//     let spooky = new Spooky({
//       child: {
//         // transport: 'http'
//         'ignore-ssl-errors': true
//       },
//       casper: {
//         logLevel: 'debug',
//         verbose: true,
//         // clientScripts: ['lib/jquery.min.js'],
//         clientScripts: [path.join(__dirname, '../../lib/', 'jquery.min.js')],
//         // options: {
//         //   // clientScripts: [path.join(__dirname, '../../lib/', 'jquery.min.js')]
//         //
//         // },
//         pageSettings: {
//           loadImages: false
//         }
//       }
//     }, (err) => {
//       if (err) {
//         let e = new Error('Failed to initialize SpookyJS');
//         e.details = err;
//         throw e;
//       }
//
//       loadLoginPage(spooky);
//
//       spooky.run();
//     });
//
//     spooky.on('error', (e, stack) => {
//       console.error(e);
//
//       if (stack) {
//         console.log(stack);
//       }
//     });
//
//     spooky.on('hello', greeting => {
//       console.log(greeting);
//     });
//
//     spooky.on('log', log => {
//       if (log.space === 'remote') {
//         console.log(log.message.replace(/ \- .*/, ''));
//       }
//     });
//
//     spooky.on('console', line => {
//       console.log(line);
//     });
//   });
// }

//
//
// function evaluateLoginPage(page) {
//   return new Promise((resolve, reject) => {
//     page.open('https://easylobby.usbanktower.com/', () => {
//       page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', (err) => {
//         if (err) {
//           return reject(err);
//         }
//         setTimeout(() => {
//           console.log('evaluating login page');
//           return page.evaluate(() => {
//             let title = $('h2').text();
//             $('input#ctl00_MainContentPlaceHolder_TxtUserID').val(USERNAME);
//             $('input#ctl00_MainContentPlaceHolder_txtPassword').val(PASSWORD);
//             $('#ctl00_MainContentPlaceHolder_btnLogin').click();
//             return {
//               foo: 'bar',
//               title: title
//             };
//           }, (err, result) => {
//             resolve(page);
//           });
//         }, 5000);
//       });
//     });
//   });
// }
//
// function navigateToViewRegistrations(page) {
//   return new Promise((resolve, reject) => {
//     page.open('https://easylobby.usbanktower.com/ViewHistory.aspx', () => {
//       page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', () => {
//         console.log('cookies: ', driver.cookies);
//         setTimeout(() => {
//           console.log('evaluating post login page');
//           return page.evaluate(() => {
//             let title = $('h2').text();
//             return {
//               foo: 'bar',
//               title: title
//             };
//           }, (err, result) => {
//             console.log('result: ', result);
//             resolve(page);
//           });
//         }, 5000);
//       });
//     });
//   });
// }
//
// function updateEasyLobby(visitor) {
//   return new Promise((resolve, reject) => {
//     driver.create({
//       path: require('phantomjs').path,
//       parameters: {
//         'load-images': 'no',
//         'local-to-remote-url-access': 'yes',
//         'cookies-file': 'cookies.txt'
//       }
//     }, (err, browser) => {
//       if (err) {
//         return reject(err);
//       }
//       return browser.createPage((err, page) => {
//         if (err) {
//           return reject(err);
//         }
//         page.set('onError', msg => {
//           console.log('error> ', msg);
//         });
//
//         evaluateLoginPage(page)
//           .then(navigateToViewRegistrations);
//       });
//     });
//   });
// }


export default {
  getVisitors(request, reply) {
    Visitor.find().sort('firstName')
      .then((visitors) => {
        reply(visitors);
      });
  },

  getVisitor(request, reply) {
    console.log('Visitor.findById: ', Visitor.findById(request.params.id).then);

    Visitor.findById(request.params.id)
      .then(reply)
      .catch(() => {
        return reply(Boom.notFound());
      });
  },

  saveVisitor(request, reply) {
    let v = request.payload;

    if (v.dates) {
      v.from = v.dates.from;
      v.to = v.dates.to;
      delete v.dates;
    }

    if (v.from > v.to) {
      return reply(Boom.conflict('Invalid date range'));
    }

    Visitor.findOneAndUpdate({ email: v.email }, v, { upsert: true, new: true })
      .then(createDataFile)
      .then(updateEasyLobby)
      .then(reply)
      .catch(e => {
        return reply(Boom.badImplementation(e));
      });
  }
};
