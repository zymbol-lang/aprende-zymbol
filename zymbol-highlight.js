/* PrismJS language definition for Zymbol (.zy)
   Loaded after prism-core; defines Prism.languages.zymbol so the autoloader
   finds it already registered and skips the CDN fetch. */

Prism.languages.zymbol = {

  /* // single-line comment */
  'comment': {
    pattern: /\/\/.*/,
    greedy: true
  },

  /* "string with {interpolation}" */
  'string': {
    pattern: /"(?:[^"\\]|\\.)*"/,
    greedy: true,
    inside: {
      'interpolation': {
        pattern: /\{[^}]*\}/,
        inside: { 'punctuation': /[{}]/ }
      }
    }
  },

  /* Boolean literals: #1  #0 */
  'boolean': /\#[10](?!\w)/,

  /* Pilcrow — newline marker in output */
  'pilcrow': /¶/,

  /* Numeric literals (integer and float) */
  'number': /\b\d+(?:\.\d+)?\b/,

  /* ── I/O and flow keywords (longest-match first) ── */
  'keyword': [
    /* output / input */
    { pattern: />>|<</, alias: 'io' },
    /* return */
    { pattern: /<~/, alias: 'return' },
    /* loop variants: @@ (indexed), @ (plain) */
    { pattern: /@@|@/ },
    /* conditional: ?? (match), ? (if) */
    { pattern: /\?\?|\?/ },
    /* try / catch / finally */
    { pattern: /!\?|:!|:>/ },
    /* lambda arrow */
    { pattern: /->/ },
    /* pilcrow — also a keyword for line-ending in output */
  ],

  /* ── Builtin operators ── */
  'builtin': [
    /* higher-order: map $>  filter $|  reduce $<  update $~  propagate $!! */
    { pattern: /\$(?:!!|[>|<~])/ },
    /* pipe */
    { pattern: /\|>/ },
    /* type inspect: #?  type cast: #| */
    { pattern: /\#[?|]/ },
    /* module export #>  import <# */
    { pattern: /\#>|<\#/ },
    /* shell exec <\ \>  file include </ /> */
    { pattern: /<\\|\\>|<\/|\/>/ },
  ],

  /* Arithmetic and comparison operators */
  'operator': /[+\-*\/%^]=?|[<>]=?|[=!]=|&&|\|\||[&|^~!]|=/,

  /* Structural punctuation */
  'punctuation': /[{}()\[\],;:.]/,

  /* Identifiers (catch-all — coloured as plain variable) */
  'variable': /\b[a-zA-ZÀ-ÿ_]\w*\b/,
};

/* Also register under the alias "zy" so ```zy fences work too */
Prism.languages.zy = Prism.languages.zymbol;
