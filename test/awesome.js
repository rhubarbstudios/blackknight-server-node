'use strict';

var Lab = require('lab');
var lab = exports.lab = Lab.script();
var server = require('server');
var Code = require('code');

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

// var assert = require('chai').assert;

describe('Awesome', function() {
  it('test', function(done) {
    expect('everything is awesome').to.equal('everything is awesome');
    done();
  });
});
