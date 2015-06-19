#! /usr/bin/env/node

'use strict';

var statusBit = 1 << 7;
var noteOnBit = 1 << 4;
var statusMask = 0xF;
var notes = 'C C# D D# E F F# G G# A A# B'.split(' ');

if (process.argv.length < 3) {
  console.log('Usage: %s <byte> [<byte2> ...]', process.argv[1]);
  process.exit(2)
}

var recs = []

for (let i = 2; i < process.argv.length; i++) {
  let x = parseInt(process.argv[i]);
  if (x < 0 || x > 255) {
    console.log('error: %d not in range [0, 255]', x);
    process.exit(1);
  }
  let rec = {
    inputDecimal: x,
    inputBinary: binaryPadded(x),
    isStatusByte: false,
    isDataByte: false,
    isNoteOn: false,
    isNoteOff: false,
    note: null,
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
  }
  recs.push(rec);
}

console.log(JSON.stringify(recs, null, 2));

function binaryPadded(x) {
  var res = x.toString(2);
  var padLength = 8 - res.length;
  return charRepeat("0", padLength) + res;
}

function charRepeat(c, n) {
  return Array(n+1).join(c);
}
