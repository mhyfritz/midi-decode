#! /usr/bin/env node

'use strict';

var statusBit = 1 << 7;
var noteOnBit = 1 << 4;
var statusMask = 0xF;
var notes = 'C C# D D# E F F# G G# A A# B'.split(' ');

if (require.main === module) {
  main();
} else {
  module.exports = {
    parseByte: parseByte
  };
}

function parseByte(x) {
  if (x < 0 || x > 255) {
    throw new ByteException(x);
  }
  var rec = {
    inputDecimal: x,
    inputBinary: paddedByteString(x),
    isStatusByte: false,
    isDataByte: false,
    isNoteOn: false,
    isNoteOff: false,
    note: null,
    octave: null
  };
  if (x & statusBit) {
    rec.isStatusByte = true;
    if (x & noteOnBit) {
      rec.isNoteOn = true;
    } else {
      rec.isNoteOff = true;
    }
    rec.value = x & statusMask; 
  } else {
    rec.isDataByte = true;
    rec.value = x;
    rec.note = notes[x % notes.length];
    rec.octave = Math.floor(x / notes.length);
  }
  return rec;
}

function paddedByteString(x) {
  var res = x.toString(2);
  var padLength = 8 - res.length;
  return stringRepeat('0', padLength) + res;
}

function stringRepeat(s, n) {
  return Array(n + 1).join(s);
}
function ByteException(value) {
  this.value = value;
  this.message = 'not in range [0, 255]';
  this.toString = function() {
    return 'ByteException: ' + this.value + ' ' + this.message;
  };
}

function main() {
  if (process.argv.length < 3) {
    console.log('Usage: %s <byte> [<byte2> ...]', process.argv[1]);
    process.exit(2)
  }

  var recs = [];
  var i;
  var x;

  for (i = 2; i < process.argv.length; i++) {
    x = parseInt(process.argv[i], 10);
    try {
      recs.push(parseByte(x));
    } catch (e) {
      console.log(e.toString());
      process.exit(1);
    }
  }

  console.log(JSON.stringify(recs, null, 2));
}
