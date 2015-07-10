if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

import 'source-map-support/register';
import Hapi from 'hapi';
import API from './api';
import Good from 'good';
import GoodConsole from 'good-console';
import mongoose from 'mongoose';
let server;

function startDatabase() {
  return new Promise((resolve, reject) => {
    mongoose.connect('mongodb://localhost/blackknight');
    mongoose.connection.on('error', reject);
    mongoose.connection.once('open', resolve);
  });
}

function createServer() {
  let host = process.env.BLACKKNIGHTSERVER_HOST;
  let port = process.env.BLACKKNIGHTSERVER_PORT;
  server = new Hapi.Server({
    // debug: (() => {
    //   let debug = false;
    //   if (process.env.NODE_ENV === 'staging' ||
    //       process.env.NODE_ENV === 'development' ||
    //       process.env.NODE_ENV === 'test') {
    //     debug = { log: ['*'] };
    //   }
    //   return debug;
    // }()),
    // debug: {log: ['*']},
    connections: {
      routes: {
        cors: {
          origin: ['*']
        }
      }
    }
  });
  server.connection({ host: host, port: port });

  return Promise.resolve();
}

function loadPlugins() {
  let plugins = [];

  if (process.env.NODE_ENV === 'staging' ||
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test') {
    let goodplugins = [];

    goodplugins.push({
      reporter: GoodConsole,
      events: { log: '*', response: '*', request: '*' }
    });
  //   goodplugins.push({
  //     reporter: require('good-file'),
  //     events: { log: 'error', response: 'error', request: 'error', ops: 'error' },
  //     config: './logs/server_log'
  //   });

    plugins.push({
      register: Good,
      options: {
        reporters: goodplugins
      }
    });
  }

  return Promise.resolve(plugins);
}

function registerPlugins(plugins) {
  return new Promise((resolve, reject) => {
    server.register(plugins, err => {
      if (err) {
        reject(err); // something bad happened loading the plugin
      } else {
        resolve();
      }
    });
  });
}

function loadRoutes() {
  for (let route in API) {
    if (API.hasOwnProperty(route)) {
      server.route(API[route]);
    }
  }

  return Promise.resolve();
}

function startServer() {
  if (!module.parent) {
    server.start(() => {
      console.log('BlackKnight Server running at: ', server.info.uri);
    });
  }
}


// if (process.env.NODE_ENV === 'development') {
  // plugins.push({register: require('lout')});
  // plugins.push({register: require('tv'), options: {'host': host, 'endpoint': '/console'}});
// }

// server.register(require('hapi-auth-jwt2'), function(err) {
//   if (err) {
//     throw err;
//   }

//   server.auth.strategy('token', 'jwt', false, {
//     key: constants.application.secretKey,
//     validateFunc: function(decoded, request, callback) {
//       if (!decoded || !decoded.verified) {
//         return callback(null, false);
//       } else {
//         return callback(null, true);
//       }
//     }
//   });
//   server.auth.strategy('user', 'jwt', false, {
//     key: constants.application.secretKey,
//     validateFunc: function(decoded, request, callback) {
//       console.log(decoded);
//       if (!decoded || !decoded.verified || request.params.email !== decoded.email) {
//         return callback(null, false);
//       } else {
//         return callback(null, true);
//       }
//     }
//   });
//   server.auth.strategy('distributor', 'jwt', false, {
//     key: constants.application.secretKey,
//     validateFunc: function(decoded, request, callback) {
//       console.log(decoded);
//       if (!decoded || !decoded.verified || request.params.name !== decoded.distributor) {
//         return callback(null, false);
//       } else {
//         return callback(null, true);
//       }
//     }
//   });
//   server.auth.strategy('brand', 'jwt', false, {
//     key: constants.application.secretKey,
//     validateFunc: function(decoded, request, callback) {
//       console.log(decoded);
//       if (!decoded || !decoded.verified || request.params.name !== decoded.brand) {
//         return callback(null, false);
//       } else {
//         return callback(null, true);
//       }
//     }
//   });
//   server.auth.strategy('company', 'jwt', false, {
//     key: constants.application.secretKey,
//     validateFunc: function(decoded, request, callback) {
//       console.log(decoded);
//       if (!decoded || !decoded.verified || request.params.name !== decoded.company) {
//         return callback(null, false);
//       } else {
//         return callback(null, true);
//       }
//     }
//   });
// });

startDatabase()
  .then(createServer)
  .then(loadPlugins)
  .then(registerPlugins)
  .then(loadRoutes)
  .then(startServer)
  .catch(e => {
    console.log('error: ', e);
    throw new Error(e);
  });

module.exports = server;
