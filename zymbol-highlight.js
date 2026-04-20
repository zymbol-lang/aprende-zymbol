/* Zymbol syntax highlighter — ported directly from web/playground.html
   Produces spans with classes t-kw t-op t-str t-num t-cmt t-fn t-id t-punct
   Applied by the docsify plugin hook in index.html */

function zyEsc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Returns [html, inBlockComment] — caller threads block-comment state between lines.
function zyHighlightLine(line, inBlockComment) {
  var out = '', i = 0;
  var s = line, len = s.length;

  // Continue a block comment that started on a previous line
  if (inBlockComment) {
    var end = s.indexOf('*/');
    if (end === -1) return ['<span class="t-cmt">' + zyEsc(line) + '</span>', true];
    out += '<span class="t-cmt">' + zyEsc(s.slice(0, end + 2)) + '</span>';
    i = end + 2;
    inBlockComment = false;
    if (i >= len) return [out, false];
  }

  // Full-line // comment (fast path)
  if (i === 0 && /^\s*\/\//.test(s)) {
    return ['<span class="t-cmt">' + zyEsc(line) + '</span>', false];
  }

  while (i < len) {
    // Inline // comment — rest of line
    if (s[i] === '/' && s[i+1] === '/') {
      out += '<span class="t-cmt">' + zyEsc(s.slice(i)) + '</span>'; break;
    }

    // Block comment /* ... */
    if (s[i] === '/' && s[i+1] === '*') {
      var bend = s.indexOf('*/', i + 2);
      if (bend === -1) {
        out += '<span class="t-cmt">' + zyEsc(s.slice(i)) + '</span>';
        inBlockComment = true; break;
      }
      out += '<span class="t-cmt">' + zyEsc(s.slice(i, bend + 2)) + '</span>';
      i = bend + 2; continue;
    }

    // Strings
    if (s[i] === '"') {
      var j = i + 1;
      while (j < len && s[j] !== '"') { if (s[j] === '\\') j++; j++; }
      out += '<span class="t-str">' + zyEsc(s.slice(i, j + 1)) + '</span>';
      i = j + 1; continue;
    }
    if (s[i] === "'") {
      var j = i + 1;
      while (j < len && s[j] !== "'") { if (s[j] === '\\') j++; j++; }
      out += '<span class="t-str">' + zyEsc(s.slice(i, j + 1)) + '</span>';
      i = j + 1; continue;
    }

    // Numbers (including base literals)
    if (/\d/.test(s[i]) && (i === 0 || !/\w/.test(s[i-1]))) {
      if (s[i] === '0' && i+1 < len && /[boxd]/i.test(s[i+1])) {
        var pfx = s[i+1].toLowerCase();
        var cs = pfx==='b' ? /[01]/ : pfx==='o' ? /[0-7]/ : pfx==='d' ? /\d/ : /[0-9a-fA-F]/;
        var j = i + 2;
        while (j < len && cs.test(s[j])) j++;
        out += '<span class="t-num">' + zyEsc(s.slice(i, j)) + '</span>';
        i = j; continue;
      }
      var j = i;
      while (j < len && /[\d.]/.test(s[j])) j++;
      out += '<span class="t-num">' + zyEsc(s.slice(i, j)) + '</span>';
      i = j; continue;
    }

    // ##ErrorType — error type specifiers
    if (s[i] === '#' && s[i+1] === '#' && i+2 < len && /[A-Za-z_]/.test(s[i+2])) {
      var j = i + 2;
      while (j < len && /[A-Za-z0-9_]/.test(s[j])) j++;
      out += '<span class="t-kw">' + zyEsc(s.slice(i, j)) + '</span>';
      i = j; continue;
    }

    // Numeral mode token: #XY# (any Unicode digit pair)
    if (s[i] === '#') {
      var _nmDig = function(cp) {
        if (cp === undefined) return false;
        var ch = String.fromCodePoint(cp);
        return /^\p{Nd}$/u.test(ch) || (cp >= 0xF8F0 && cp <= 0xF8F9);
      };
      var _cp1 = s.codePointAt(i + 1);
      if (_nmDig(_cp1)) {
        var _j1 = i + 1 + String.fromCodePoint(_cp1).length;
        var _cp2 = s.codePointAt(_j1);
        if (_nmDig(_cp2)) {
          var _j2 = _j1 + String.fromCodePoint(_cp2).length;
          if (s[_j2] === '#') {
            out += '<span class="t-kw">' + zyEsc(s.slice(i, _j2 + 1)) + '</span>';
            i = _j2 + 1; continue;
          }
        }
      }
    }

    // Two-char operators / keywords
    var two = s.slice(i, i+2);
    if (two === '>>') { out += '<span class="t-op">&gt;&gt;</span>'; i+=2; continue; }
    if (two === '<<') { out += '<span class="t-op">&lt;&lt;</span>'; i+=2; continue; }
    if (two === '<~') { out += '<span class="t-kw">&lt;~</span>';    i+=2; continue; }
    if (two === '<#') { out += '<span class="t-kw">&lt;#</span>';    i+=2; continue; }
    if (two === '_?') { out += '<span class="t-kw">_?</span>';       i+=2; continue; }
    if (two === '??') { out += '<span class="t-kw">??</span>';       i+=2; continue; }
    if (two === '!?') { out += '<span class="t-kw">!?</span>';       i+=2; continue; }
    if (two === ':=') { out += '<span class="t-op">:=</span>';       i+=2; continue; }
    if (two === ':!') { out += '<span class="t-kw">:!</span>';       i+=2; continue; }
    if (two === ':>') { out += '<span class="t-kw">:&gt;</span>';    i+=2; continue; }
    if (two === '::') { out += '<span class="t-op">::</span>';       i+=2; continue; }
    if (two === '..') { out += '<span class="t-op">..</span>';       i+=2; continue; }
    if (two === '==') { out += '<span class="t-op">==</span>';       i+=2; continue; }
    if (two === '<>') { out += '<span class="t-op">&lt;&gt;</span>'; i+=2; continue; }
    if (two === '<=') { out += '<span class="t-op">&lt;=</span>';    i+=2; continue; }
    if (two === '>=') { out += '<span class="t-op">&gt;=</span>';    i+=2; continue; }
    if (two === '&&') { out += '<span class="t-op">&amp;&amp;</span>'; i+=2; continue; }
    if (two === '||') { out += '<span class="t-op">||</span>';       i+=2; continue; }
    if (two === '->') { out += '<span class="t-kw">-&gt;</span>';    i+=2; continue; }
    if (two === '><') { out += '<span class="t-op">&gt;&lt;</span>'; i+=2; continue; }
    if (two === '|>') { out += '<span class="t-op">|&gt;</span>';    i+=2; continue; }
    if (two === '#>') { out += '<span class="t-kw">#&gt;</span>';    i+=2; continue; }
    if (two === '#?') { out += '<span class="t-op">#?</span>';       i+=2; continue; }
    if (two === '@!') { out += '<span class="t-kw">@!</span>';       i+=2; continue; }
    if (two === '@>') { out += '<span class="t-kw">@&gt;</span>';    i+=2; continue; }
    if (two === '#0') { out += '<span class="t-num">#0</span>';      i+=2; continue; }
    if (two === '#1') { out += '<span class="t-num">#1</span>';      i+=2; continue; }
    if (two === '++') { out += '<span class="t-op">++</span>';       i+=2; continue; }
    if (two === '--') { out += '<span class="t-op">--</span>';       i+=2; continue; }
    if (two === '+=') { out += '<span class="t-op">+=</span>';       i+=2; continue; }
    if (two === '-=') { out += '<span class="t-op">-=</span>';       i+=2; continue; }
    if (two === '*=') { out += '<span class="t-op">*=</span>';       i+=2; continue; }
    if (two === '/=') { out += '<span class="t-op">/=</span>';       i+=2; continue; }
    if (two === '%=') { out += '<span class="t-op">%=</span>';       i+=2; continue; }
    if (two === '^=') { out += '<span class="t-op">^=</span>';       i+=2; continue; }

    // Single-char keywords / operators
    var one = s[i];
    if (one === '?') { out += '<span class="t-kw">?</span>';   i++; continue; }
    if (one === '@') { out += '<span class="t-kw">@</span>';   i++; continue; }
    if (one === '¶') { out += '<span class="t-kw">¶</span>';   i++; continue; }
    if (one === '_' && (i+1 >= len || !/\w/.test(s[i+1]))) {
      out += '<span class="t-kw">_</span>'; i++; continue;
    }
    if (one === '!') { out += '<span class="t-op">!</span>';   i++; continue; }
    if (one === '|') { out += '<span class="t-op">|</span>';   i++; continue; }
    if (one === '\\') {
      if (s[i+1] === '\\') { out += '<span class="t-kw">\\\\</span>'; i+=2; continue; }
      out += '<span class="t-kw">\\</span>'; i++; continue;
    }
    if (one === '$') {
      var three = s.slice(i, i+3);
      if (three==='$+[' || three==='$-[' || three==='$~~' || three==='$!!') {
        out += '<span class="t-op">' + zyEsc(three) + '</span>'; i+=3; continue;
      }
      if (three==='$--' || three==='$??') {
        out += '<span class="t-op">' + zyEsc(three) + '</span>'; i+=3; continue;
      }
      if (i+1 < len && /[#+\-~?\[<>|!]/.test(s[i+1])) {
        out += '<span class="t-op">' + zyEsc(s.slice(i, i+2)) + '</span>'; i+=2; continue;
      }
      out += '<span class="t-op">$</span>'; i++; continue;
    }
    if (one === '<') { out += '&lt;'; i++; continue; }
    if (one === '>') { out += '&gt;'; i++; continue; }
    if (one === '&') { out += '&amp;'; i++; continue; }
    if (one === '+' || one === '-' || one === '*' || one === '/' ||
        one === '%' || one === '^' || one === '=') {
      out += '<span class="t-op">' + zyEsc(one) + '</span>'; i++; continue;
    }
    if (one === ':' || one === ',' ||
        one === '{' || one === '}' ||
        one === '[' || one === ']' ||
        one === '(' || one === ')' ||
        one === ';') {
      out += '<span class="t-punct">' + zyEsc(one) + '</span>'; i++; continue;
    }

    // Identifiers — Unicode-aware (mirrors the Zymbol lexer)
    var _cp0 = s.codePointAt(i);
    if (_cp0 !== undefined) {
      var _ch0 = String.fromCodePoint(_cp0);
      var _opRx = /[\s"'><!=+\-*/%^&|?:.,;()\[\]{}@~#$¶\\]/u;
      if (!_opRx.test(_ch0) && !/^\p{Nd}$/u.test(_ch0)) {
        var j = i + _ch0.length;
        while (j < len) {
          var _cp2 = s.codePointAt(j);
          if (_cp2 === undefined) break;
          var _ch2 = String.fromCodePoint(_cp2);
          if (_opRx.test(_ch2)) break;
          j += _ch2.length;
        }
        var word = s.slice(i, j);
        var k = j; while (k < len && s[k] === ' ') k++;
        var isFn = k < len && s[k] === '(';
        out += isFn
          ? '<span class="t-fn">' + zyEsc(word) + '</span>'
          : '<span class="t-id">' + zyEsc(word) + '</span>';
        i = j; continue;
      }
    }

    out += zyEsc(one); i++;
  }
  return [out, inBlockComment];
}

function zyHighlightCode(code) {
  var inBlockComment = false;
  return code.split('\n').map(function(line) {
    var result = zyHighlightLine(line, inBlockComment);
    inBlockComment = result[1];
    return result[0];
  }).join('\n');
}

window.zyHighlightCode = zyHighlightCode;
