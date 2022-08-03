// Originally from
// https://github.com/danguer/blog-examples/blob/master/js/base64-binary.js
//
// License
/*
Copyright (c) 2011, Daniel Guerrero
All rights reserved.
Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL DANIEL GUERRERO BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const _keyStr =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function removePaddingChars(input) {
	const lkey = _keyStr.indexOf(input.charAt(input.length - 1));
	if (lkey == 64) {
		return input.substring(0, input.length - 1);
	}
	return input;
}

export function decodeBase64(
	input: string,
	arrayBuffer: Uint8Array
): Uint8Array {
	input = removePaddingChars(input);
	input = removePaddingChars(input);

	const bytes = (input.length / 4) * 3;

	let uarray;
	let chr1, chr2, chr3;
	let enc1, enc2, enc3, enc4;
	let i = 0;
	let j = 0;

	if (arrayBuffer) uarray = new Uint8Array(arrayBuffer);
	else uarray = new Uint8Array(bytes);

	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	for (i = 0; i < bytes; i += 3) {
		//get the 3 octects in 4 ascii chars
		enc1 = _keyStr.indexOf(input.charAt(j++));
		enc2 = _keyStr.indexOf(input.charAt(j++));
		enc3 = _keyStr.indexOf(input.charAt(j++));
		enc4 = _keyStr.indexOf(input.charAt(j++));

		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;

		uarray[i] = chr1;
		if (enc3 != 64) uarray[i + 1] = chr2;
		if (enc4 != 64) uarray[i + 2] = chr3;
	}

	return uarray;
}

export function encodeBase64(arrayBuffer) {
	let base64 = "";
	const encodings =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

	const bytes = new Uint8Array(arrayBuffer);
	const byteLength = bytes.byteLength;
	const byteRemainder = byteLength % 3;
	const mainLength = byteLength - byteRemainder;

	let a, b, c, d;
	let chunk;

	// Main loop deals with bytes in chunks of 3
	for (var i = 0; i < mainLength; i = i + 3) {
		// Combine the three bytes into a single integer
		chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

		// Use bitmasks to extract 6-bit segments from the triplet
		a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
		b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
		c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
		d = chunk & 63; // 63       = 2^6 - 1

		// Convert the raw binary segments to the appropriate ASCII encoding
		base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
	}

	// Deal with the remaining bytes and padding
	if (byteRemainder == 1) {
		chunk = bytes[mainLength];

		a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

		// Set the 4 least significant bits to zero
		b = (chunk & 3) << 4; // 3   = 2^2 - 1

		base64 += encodings[a] + encodings[b] + "==";
	} else if (byteRemainder == 2) {
		chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

		a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
		b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

		// Set the 2 least significant bits to zero
		c = (chunk & 15) << 2; // 15    = 2^4 - 1

		base64 += encodings[a] + encodings[b] + encodings[c] + "=";
	}

	return base64;
}
