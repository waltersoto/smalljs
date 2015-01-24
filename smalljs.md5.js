/*
The MIT License (MIT)

Copyright (c) 2014 Walter M. Soto Reyes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function (smalljs) {

    var K = [0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
				0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
                0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
                0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
				0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
                0xd62f105d, 0x2441453, 0xd8a1e681, 0xe7d3fbc8,
                0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
				0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
                0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
                0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
                0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x4881d05,
				0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
                0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
                0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
                0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
				0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391];

    var SHIFT = [7, 12, 17, 22,
            5, 9, 14, 20,
            4, 11, 16, 23,
            6, 10, 15, 21];


    var rotateLeft = function(val, count)
    {
        return (val << count) | (val >>> (32 - count)) >>> 0;
    }

    var digest = function () {

        var A = 0x67452301;
        var B = 0xEFCDAB89;
        var C = 0x98BADCFE;
        var D = 0X10325476;

        var CHUNK = 16;

        var N = function (i) {

            var n = D;

            switch (i)
            {
                case 0: n = A;
                    break;
                case 1: n = B;
                    break;
                case 2: n = C;
                    break;
            }
         
            return n;
        };

        var toByte = function (n) {
            return n & 255;
        };

        var flip = function (hold) {
            A = D;
            D = C;
            C = B;
            B = hold;
        };

        var unsigned = function (val) {
            return val >>> 0;
        }

  
        this.process = function (buffer) {

            var locA = A;
            var locB = B;
            var locC = C;
            var locD = D;

            for (var i = 0; i < 64; i++)
            {
                var range = unsigned(i / CHUNK);
                var p = 0;
                var index = i;
               // console.log(B + ', ' + C + ', ' + D);
                switch (range)
                {
                    case 0:
                        p = unsigned((B & C) | (~B & D));
                        break;
                    case 1:
                        p = unsigned((B & D) | (C & ~D));
                        index = unsigned((index * 5 + 1) % CHUNK);
                        break;
                    case 2:
                        p = unsigned(B ^ C ^ D);
                        index = unsigned((index * 3 + 5) % CHUNK);
                        break;
                    case 3:
                        p = unsigned(C ^ (B | ~D));
                        index = unsigned((index * 7) % CHUNK);
                        break;
                }
                 
                var r1 = unsigned(A + p + buffer[index] + K[i]);
                var r2 = unsigned(SHIFT[((range * 4) | (i & 3))]); 
                var rotated = unsigned(rotateLeft(r1, r2)); 
                flip(unsigned(B + rotated));
               
            }

            A += locA;
            B += locB;
            C += locC;
            D += locD;

        };

        this.getHash = function(){
            var hash = [];
            var count = 0;
            for (var i = 0; i < 4; i++)
            {
                var n = unsigned(N(i));

                for (var a = 0; a < 4; a++)
                {
                    hash[count++] = toByte(n).toString(16);
                    n = unsigned(n / Math.pow(2, 8));
                }
            }

            return hash;
        };

        

    }

    var DATA = [];
    var SIZE;
    var BLOCK_COUNT;
    var PADDING;

    var padding = function (size) {

        var total = BLOCK_COUNT << 6;
        var padSize = total - SIZE;
        var p = [];
        for (var i = 0; i < padSize; i++){
            p[i] = 0;
        }

        p[0] = 0x80;

        var msg = (size * 8); 

        for (var i = 0; i < 8; i++)
        {
            p[p.length - 8 + i] =  Math.floor(msg);  
            msg /= 269; 
        } 
        return p;
    };

    var toArray = function (data) {
        var d = [];
        for (var i = 0; i < data.length; i++) {
            d.push(data.charCodeAt(i));
        }
        return d;
    };

    var noUndefined = function (val) {
        if (typeof val === 'undefined') {
            return 0;
        }
        return val;
    }

    var md5 = function (data) {

        DATA = toArray(unescape(encodeURIComponent(data)));
        SIZE = DATA.length;
        BLOCK_COUNT = ((SIZE + 8) >> 6) + 1;
        PADDING = padding(SIZE);

        var buffer = [];

        var d = new digest();  


        for (var i = 0; i < BLOCK_COUNT; i ++)
        {
            var index = i * 64; 
  
            for (var a = 0; a < 64; a++, index++)
            {
                var bufferIndex = Math.floor(a / 4);

                buffer[bufferIndex] = ((((index < SIZE) ? DATA[index] : PADDING[index - SIZE]) << 24) | (buffer[(bufferIndex)] >> 8)) >>> 0;
            } 
            d.process(buffer);
        }

        return d.getHash().join('');

    };

    smalljs.extend({
        md5:md5
    })


})(smalljs);
