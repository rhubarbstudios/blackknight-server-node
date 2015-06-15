'use strict';

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

var Hapi = require('hapi');
var Good = require('good');
// var constants = require('src/config/constants.js');
// var routes = require('src/routes/index.js');
var routes = [];
var host = process.env.BLACKKNIGHTSERVER_HOST;
var port = process.env.BLACKKNIGHTSERVER_PORT;
var server = new Hapi.Server({
  debug: (function() {
    if (process.env.NODE_ENV === 'staging' ||
        process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'test') {
      return { log: ['*'] };
    } else {
      return false;
    }
  })(),
  connections: {
    routes: {
      cors: {
        origin: ['*'],
        additionalExposedHeaders: ['X-User-Status']
      }
    }
  }
});
server.connection({ host: host, port: port });

// if (process.env.NODE_ENV === 'staging' ||
//     process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
//   var goodplugins = [];
//   goodplugins.push({
//     reporter: require('good-console'),
//     events: { log: '*', response: '*', request: '*' }
//   });
//   goodplugins.push({
//     reporter: require('good-file'),
//     events: { log: 'error', response: 'error', request: 'error', ops: 'error' },
//     config: './logs/server_log'
//   });
//   server.register({
//     register: Good,
//     options: {
//       reporters: goodplugins
//     }
//   }, function(err) {
//     if (err) {
//       throw err;
//     }
//   });
// }

var plugins = [];
if (process.env.NODE_ENV === 'development') {
  // plugins.push({register: require('lout')});
  // plugins.push({register: require('tv'), options: {'host': host, 'endpoint': '/console'}});
}

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

server.register(plugins, function(err) {
  if (err) {
    throw err; // something bad happened loading the plugin
  }

  for (var route in routes) {
    if (routes.hasOwnProperty(route)) {
      server.route(routes[route]);
    }
  }

  if (!module.parent) {
    server.start(function() {
      console.log('BlackKnight Server running at: ', server.info.uri);
    });
  }
});

module.exports = server;
