//
// showdown.js -- A javascript port of Markdown.
//
// Copyright (c) 2007 John Fraser.
//
// Original Markdown Copyright (c) 2004-2005 John Gruber
//   <http://daringfireball.net/projects/markdown/>
//
// Redistributable under a BSD-style open source license.
// See license.txt for more information.
//
// The full source distribution is at:
//
//        A A L
//        T C A
//        T K B
//
//   <http://www.attacklab.net/>
//
//
// Wherever possible, Showdown is a straight, line-by-line port
// of the Perl version of Markdown.
//
// This is not a normal parser design; it's basically just a
// series of string substitutions.  It's hard to read and
// maintain this way,  but keeping Showdown close to the original
// design makes it easier to port new features.
//
// More importantly, Showdown behaves like markdown.pl in most
// edge cases.  So web applications can do client-side preview
// in Javascript, and then build identical HTML on the server.
//
// This port needs the new RegExp functionality of ECMA 262,
// 3rd Edition (i.e. Javascript 1.5).  Most modern web browsers
// should do fine.  Even with the new regular expression features,
// We do a lot of work to emulate Perl's regex functionality.
// The tricky changes in this file mostly have the "attacklab:"
// label.  Major or self-explanatory changes don't.
//
// Smart diff tools like Araxis Merge will be able to match up
// this file with markdown.pl in a useful way.  A little tweaking
// helps: in a copy of markdown.pl, replace "#" with "//" and
// replace "$text" with "text".  Be sure to ignore whitespace
// and line endings.
//
//
// Showdown usage:
//
//   var text = "Markdown *rocks*.";
//
//   var converter = new Showdown.converter();
//   var html = converter.makeHtml(text);
//
//   alert(html);
//
// Note: move the sample code to the bottom of this
// file before uncommenting it.
//
//
// Showdown namespace
//
var Showdown={};Showdown.converter=function(){var a,b,c,d=0;this.makeHtml=function(d){return a=new Array,b=new Array,c=new Array,d=d.replace(/~/g,"~T"),d=d.replace(/\$/g,"~D"),d=d.replace(/\r\n/g,"\n"),d=d.replace(/\r/g,"\n"),d="\n\n"+d+"\n\n",d=F(d),d=d.replace(/^[ \t]+$/mg,""),d=f(d),d=e(d),d=h(d),d=D(d),d=d.replace(/~D/g,"$$"),d=d.replace(/~T/g,"~"),d};var e=function(c){var c=c.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|\Z)/gm,function(c,d,e,f,g){return d=d.toLowerCase(),a[d]=z(e),f?f+g:(g&&(b[d]=g.replace(/"/g,"&quot;")),"")});return c},f=function(a){a=a.replace(/\n/g,"\n\n");var b="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del",c="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math";return a=a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,g),a=a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm,g),a=a.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,g),a=a.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g,g),a=a.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,g),a=a.replace(/\n\n/g,"\n"),a},g=function(a,b){var d=b;return d=d.replace(/\n\n/g,"\n"),d=d.replace(/^\n/,""),d=d.replace(/\n+$/g,""),d="\n\n~K"+(c.push(d)-1)+"K\n\n",d},h=function(a){a=o(a);var b=t("<hr />");return a=a.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,b),a=a.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm,b),a=a.replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm,b),a=q(a),a=s(a),a=r(a),a=x(a),a=f(a),a=y(a),a},i=function(a){return a=u(a),a=j(a),a=A(a),a=m(a),a=k(a),a=B(a),a=z(a),a=w(a),a=a.replace(/  +\n/g," <br />\n"),a},j=function(a){var b=/(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;return a=a.replace(b,function(a){var b=a.replace(/(.)<\/?code>(?=.)/g,"$1`");return b=G(b,"\\`*_"),b}),a},k=function(a){return a=a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,l),a=a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,l),a=a.replace(/(\[([^\[\]]+)\])()()()()()/g,l),a},l=function(c,d,e,f,g,h,i,j){j==undefined&&(j="");var k=d,l=e,m=f.toLowerCase(),n=g,o=j;if(n==""){m==""&&(m=l.toLowerCase().replace(/ ?\n/g," ")),n="#"+m;if(a[m]!=undefined)n=a[m],b[m]!=undefined&&(o=b[m]);else{if(!(k.search(/\(\s*\)$/m)>-1))return k;n=""}}n=G(n,"*_");var p='<a href="'+n+'"';return o!=""&&(o=o.replace(/"/g,"&quot;"),o=G(o,"*_"),p+=' title="'+o+'"'),p+=">"+l+"</a>",p},m=function(a){return a=a.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,n),a=a.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,n),a},n=function(c,d,e,f,g,h,i,j){var k=d,l=e,m=f.toLowerCase(),n=g,o=j;o||(o="");if(n==""){m==""&&(m=l.toLowerCase().replace(/ ?\n/g," ")),n="#"+m;if(a[m]==undefined)return k;n=a[m],b[m]!=undefined&&(o=b[m])}l=l.replace(/"/g,"&quot;"),n=G(n,"*_");var p='<img src="'+n+'" alt="'+l+'"';return o=o.replace(/"/g,"&quot;"),o=G(o,"*_"),p+=' title="'+o+'"',p+=" />",p},o=function(a){function b(a){return a.replace(/[^\w]/g,"").toLowerCase()}return a=a.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,function(a,c){return t('<h1 id="'+b(c)+'">'+i(c)+"</h1>")}),a=a.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,function(a,c){return t('<h2 id="'+b(c)+'">'+i(c)+"</h2>")}),a=a.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,function(a,c,d){var e=c.length;return t("<h"+e+' id="'+b(d)+'">'+i(d)+"</h"+e+">")}),a},p,q=function(a){a+="~0";var b=/^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;return d?a=a.replace(b,function(a,b,c){var d=b,e=c.search(/[*+-]/g)>-1?"ul":"ol";d=d.replace(/\n{2,}/g,"\n\n\n");var f=p(d);return f=f.replace(/\s+$/,""),f="<"+e+">"+f+"</"+e+">\n",f}):(b=/(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g,a=a.replace(b,function(a,b,c,d){var e=b,f=c,g=d.search(/[*+-]/g)>-1?"ul":"ol",f=f.replace(/\n{2,}/g,"\n\n\n"),h=p(f);return h=e+"<"+g+">\n"+h+"</"+g+">\n",h})),a=a.replace(/~0/,""),a};p=function(a){return d++,a=a.replace(/\n{2,}$/,"\n"),a+="~0",a=a.replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,function(a,b,c,d,e){var f=e,g=b,j=c;return g||f.search(/\n{2,}/)>-1?f=h(E(f)):(f=q(E(f)),f=f.replace(/\n$/,""),f=i(f)),"<li>"+f+"</li>\n"}),a=a.replace(/~0/g,""),d--,a};var r=function(a){return a+="~0",a=a.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,function(a,b,c){var d=b,e=c;return d=v(E(d)),d=F(d),d=d.replace(/^\n+/g,""),d=d.replace(/\n+$/g,""),d="<pre><code>"+d+"\n</code></pre>",t(d)+e}),a=a.replace(/~0/,""),a},s=function(a){return a+="~0",a=a.replace(/\n```(.*)\n([^`]+)\n```/g,function(a,b,c){var d=b,e=c;return e=v(e),e=F(e),e=e.replace(/^\n+/g,""),e=e.replace(/\n+$/g,""),e="<pre><code class="+d+">"+e+"\n</code></pre>",t(e)}),a=a.replace(/~0/,""),a},t=function(a){return a=a.replace(/(^\n+|\n+$)/g,""),"\n\n~K"+(c.push(a)-1)+"K\n\n"},u=function(a){return a=a.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,function(a,b,c,d,e){var f=d;return f=f.replace(/^([ \t]*)/g,""),f=f.replace(/[ \t]*$/g,""),f=v(f),b+"<code>"+f+"</code>"}),a},v=function(a){return a=a.replace(/&/g,"&amp;"),a=a.replace(/</g,"&lt;"),a=a.replace(/>/g,"&gt;"),a=G(a,"*_{}[]\\",!1),a},w=function(a){return a=a.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,"<strong>$2</strong>"),a=a.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g,"<em>$2</em>"),a},x=function(a){return a=a.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,function(a,b){var c=b;return c=c.replace(/^[ \t]*>[ \t]?/gm,"~0"),c=c.replace(/~0/g,""),c=c.replace(/^[ \t]+$/gm,""),c=h(c),c=c.replace(/(^|\n)/g,"$1  "),c=c.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm,function(a,b){var c=b;return c=c.replace(/^  /mg,"~0"),c=c.replace(/~0/g,""),c}),t("<blockquote>\n"+c+"\n</blockquote>")}),a},y=function(a){a=a.replace(/^\n+/g,""),a=a.replace(/\n+$/g,"");var b=a.split(/\n{2,}/g),d=new Array,e=b.length;for(var f=0;f<e;f++){var g=b[f];g.search(/~K(\d+)K/g)>=0?d.push(g):g.search(/\S/)>=0&&(g=i(g),g=g.replace(/^([ \t]*)/g,"<p>"),g+="</p>",d.push(g))}e=d.length;for(var f=0;f<e;f++)while(d[f].search(/~K(\d+)K/)>=0){var h=c[RegExp.$1];h=h.replace(/\$/g,"$$$$"),d[f]=d[f].replace(/~K\d+K/,h)}return d.join("\n\n")},z=function(a){return a=a.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;"),a=a.replace(/<(?![a-z\/?\$!])/gi,"&lt;"),a},A=function(a){return a=a.replace(/\\(\\)/g,H),a=a.replace(/\\([`*_{}\[\]()>#+-.!])/g,H),a},B=function(a){return a=a.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi,'<a href="$1">$1</a>'),a=a.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,function(a,b){return C(D(b))}),a},C=function(a){function b(a){var b="0123456789ABCDEF",c=a.charCodeAt(0);return b.charAt(c>>4)+b.charAt(c&15)}var c=[function(a){return"&#"+a.charCodeAt(0)+";"},function(a){return"&#x"+b(a)+";"},function(a){return a}];return a="mailto:"+a,a=a.replace(/./g,function(a){if(a=="@")a=c[Math.floor(Math.random()*2)](a);else if(a!=":"){var b=Math.random();a=b>.9?c[2](a):b>.45?c[1](a):c[0](a)}return a}),a='<a href="'+a+'">'+a+"</a>",a=a.replace(/">.+:/g,'">'),a},D=function(a){return a=a.replace(/~E(\d+)E/g,function(a,b){var c=parseInt(b);return String.fromCharCode(c)}),a},E=function(a){return a=a.replace(/^(\t|[ ]{1,4})/gm,"~0"),a=a.replace(/~0/g,""),a},F=function(a){return a=a.replace(/\t(?=\t)/g,"    "),a=a.replace(/\t/g,"~A~B"),a=a.replace(/~B(.+?)~A/g,function(a,b,c){var d=b,e=4-d.length%4;for(var f=0;f<e;f++)d+=" ";return d}),a=a.replace(/~A/g,"    "),a=a.replace(/~B/g,""),a},G=function(a,b,c){var d="(["+b.replace(/([\[\]\\])/g,"\\$1")+"])";c&&(d="\\\\"+d);var e=new RegExp(d,"g");return a=a.replace(e,H),a},H=function(a,b){var c=b.charCodeAt(0);return"~E"+c+"E"}},typeof exports!="undefined"&&(exports=Showdown);

// Copyright (C) 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

window['PR_SHOULD_USE_CONTINUATION']=true;var prettyPrintOne;var prettyPrint;(function(){var win=window;var FLOW_CONTROL_KEYWORDS=["break,continue,do,else,for,if,return,while"];var C_KEYWORDS=[FLOW_CONTROL_KEYWORDS,"auto,case,char,const,default,"+"double,enum,extern,float,goto,int,long,register,short,signed,sizeof,"+"static,struct,switch,typedef,union,unsigned,void,volatile"];var COMMON_KEYWORDS=[C_KEYWORDS,"catch,class,delete,false,import,"+"new,operator,private,protected,public,this,throw,true,try,typeof"];var CPP_KEYWORDS=[COMMON_KEYWORDS,"alignof,align_union,asm,axiom,bool,"+"concept,concept_map,const_cast,constexpr,decltype,"+"dynamic_cast,explicit,export,friend,inline,late_check,"+"mutable,namespace,nullptr,reinterpret_cast,static_assert,static_cast,"+"template,typeid,typename,using,virtual,where"];var JAVA_KEYWORDS=[COMMON_KEYWORDS,"abstract,boolean,byte,extends,final,finally,implements,import,"+"instanceof,null,native,package,strictfp,super,synchronized,throws,"+"transient"];var CSHARP_KEYWORDS=[JAVA_KEYWORDS,"as,base,by,checked,decimal,delegate,descending,dynamic,event,"+"fixed,foreach,from,group,implicit,in,interface,internal,into,is,let,"+"lock,object,out,override,orderby,params,partial,readonly,ref,sbyte,"+"sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,"+"var,virtual,where"];var COFFEE_KEYWORDS="all,and,by,catch,class,else,extends,false,finally,"+"for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,"+"throw,true,try,unless,until,when,while,yes";var JSCRIPT_KEYWORDS=[COMMON_KEYWORDS,"debugger,eval,export,function,get,null,set,undefined,var,with,"+"Infinity,NaN"];var PERL_KEYWORDS="caller,delete,die,do,dump,elsif,eval,exit,foreach,for,"+"goto,if,import,last,local,my,next,no,our,print,package,redo,require,"+"sub,undef,unless,until,use,wantarray,while,BEGIN,END";var PYTHON_KEYWORDS=[FLOW_CONTROL_KEYWORDS,"and,as,assert,class,def,del,"+"elif,except,exec,finally,from,global,import,in,is,lambda,"+"nonlocal,not,or,pass,print,raise,try,with,yield,"+"False,True,None"];var RUBY_KEYWORDS=[FLOW_CONTROL_KEYWORDS,"alias,and,begin,case,class,"+"def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,"+"rescue,retry,self,super,then,true,undef,unless,until,when,yield,"+"BEGIN,END"];var SH_KEYWORDS=[FLOW_CONTROL_KEYWORDS,"case,done,elif,esac,eval,fi,"+"function,in,local,set,then,until"];var ALL_KEYWORDS=[CPP_KEYWORDS,CSHARP_KEYWORDS,JSCRIPT_KEYWORDS,PERL_KEYWORDS+
PYTHON_KEYWORDS,RUBY_KEYWORDS,SH_KEYWORDS];var C_TYPES=/^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)\b/;var PR_STRING='str';var PR_KEYWORD='kwd';var PR_COMMENT='com';var PR_TYPE='typ';var PR_LITERAL='lit';var PR_PUNCTUATION='pun';var PR_PLAIN='pln';var PR_TAG='tag';var PR_DECLARATION='dec';var PR_SOURCE='src';var PR_ATTRIB_NAME='atn';var PR_ATTRIB_VALUE='atv';var PR_NOCODE='nocode';var REGEXP_PRECEDER_PATTERN='(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*';function combinePrefixPatterns(regexs){var capturedGroupIndex=0;var needToFoldCase=false;var ignoreCase=false;for(var i=0,n=regexs.length;i<n;++i){var regex=regexs[i];if(regex.ignoreCase){ignoreCase=true;}else if(/[a-z]/i.test(regex.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi,''))){needToFoldCase=true;ignoreCase=false;break;}}
var escapeCharToCodeUnit={'b':8,'t':9,'n':0xa,'v':0xb,'f':0xc,'r':0xd};function decodeEscape(charsetPart){var cc0=charsetPart.charCodeAt(0);if(cc0!==92){return cc0;}
var c1=charsetPart.charAt(1);cc0=escapeCharToCodeUnit[c1];if(cc0){return cc0;}else if('0'<=c1&&c1<='7'){return parseInt(charsetPart.substring(1),8);}else if(c1==='u'||c1==='x'){return parseInt(charsetPart.substring(2),16);}else{return charsetPart.charCodeAt(1);}}
function encodeEscape(charCode){if(charCode<0x20){return(charCode<0x10?'\\x0':'\\x')+charCode.toString(16);}
var ch=String.fromCharCode(charCode);return(ch==='\\'||ch==='-'||ch===']'||ch==='^')?"\\"+ch:ch;}
function caseFoldCharset(charSet){var charsetParts=charSet.substring(1,charSet.length-1).match(new RegExp('\\\\u[0-9A-Fa-f]{4}'
+'|\\\\x[0-9A-Fa-f]{2}'
+'|\\\\[0-3][0-7]{0,2}'
+'|\\\\[0-7]{1,2}'
+'|\\\\[\\s\\S]'
+'|-'
+'|[^-\\\\]','g'));var ranges=[];var inverse=charsetParts[0]==='^';var out=['['];if(inverse){out.push('^');}
for(var i=inverse?1:0,n=charsetParts.length;i<n;++i){var p=charsetParts[i];if(/\\[bdsw]/i.test(p)){out.push(p);}else{var start=decodeEscape(p);var end;if(i+2<n&&'-'===charsetParts[i+1]){end=decodeEscape(charsetParts[i+2]);i+=2;}else{end=start;}
ranges.push([start,end]);if(!(end<65||start>122)){if(!(end<65||start>90)){ranges.push([Math.max(65,start)|32,Math.min(end,90)|32]);}
if(!(end<97||start>122)){ranges.push([Math.max(97,start)&~32,Math.min(end,122)&~32]);}}}}
ranges.sort(function(a,b){return(a[0]-b[0])||(b[1]-a[1]);});var consolidatedRanges=[];var lastRange=[];for(var i=0;i<ranges.length;++i){var range=ranges[i];if(range[0]<=lastRange[1]+1){lastRange[1]=Math.max(lastRange[1],range[1]);}else{consolidatedRanges.push(lastRange=range);}}
for(var i=0;i<consolidatedRanges.length;++i){var range=consolidatedRanges[i];out.push(encodeEscape(range[0]));if(range[1]>range[0]){if(range[1]+1>range[0]){out.push('-');}
out.push(encodeEscape(range[1]));}}
out.push(']');return out.join('');}
function allowAnywhereFoldCaseAndRenumberGroups(regex){var parts=regex.source.match(new RegExp('(?:'
+'\\[(?:[^\\x5C\\x5D]|\\\\[\\s\\S])*\\]'
+'|\\\\u[A-Fa-f0-9]{4}'
+'|\\\\x[A-Fa-f0-9]{2}'
+'|\\\\[0-9]+'
+'|\\\\[^ux0-9]'
+'|\\(\\?[:!=]'
+'|[\\(\\)\\^]'
+'|[^\\x5B\\x5C\\(\\)\\^]+'
+')','g'));var n=parts.length;var capturedGroups=[];for(var i=0,groupIndex=0;i<n;++i){var p=parts[i];if(p==='('){++groupIndex;}else if('\\'===p.charAt(0)){var decimalValue=+p.substring(1);if(decimalValue){if(decimalValue<=groupIndex){capturedGroups[decimalValue]=-1;}else{parts[i]=encodeEscape(decimalValue);}}}}
for(var i=1;i<capturedGroups.length;++i){if(-1===capturedGroups[i]){capturedGroups[i]=++capturedGroupIndex;}}
for(var i=0,groupIndex=0;i<n;++i){var p=parts[i];if(p==='('){++groupIndex;if(!capturedGroups[groupIndex]){parts[i]='(?:';}}else if('\\'===p.charAt(0)){var decimalValue=+p.substring(1);if(decimalValue&&decimalValue<=groupIndex){parts[i]='\\'+capturedGroups[decimalValue];}}}
for(var i=0;i<n;++i){if('^'===parts[i]&&'^'!==parts[i+1]){parts[i]='';}}
if(regex.ignoreCase&&needToFoldCase){for(var i=0;i<n;++i){var p=parts[i];var ch0=p.charAt(0);if(p.length>=2&&ch0==='['){parts[i]=caseFoldCharset(p);}else if(ch0!=='\\'){parts[i]=p.replace(/[a-zA-Z]/g,function(ch){var cc=ch.charCodeAt(0);return'['+String.fromCharCode(cc&~32,cc|32)+']';});}}}
return parts.join('');}
var rewritten=[];for(var i=0,n=regexs.length;i<n;++i){var regex=regexs[i];if(regex.global||regex.multiline){throw new Error(''+regex);}
rewritten.push('(?:'+allowAnywhereFoldCaseAndRenumberGroups(regex)+')');}
return new RegExp(rewritten.join('|'),ignoreCase?'gi':'g');}
function extractSourceSpans(node,isPreformatted){var nocode=/(?:^|\s)nocode(?:\s|$)/;var chunks=[];var length=0;var spans=[];var k=0;function walk(node){switch(node.nodeType){case 1:if(nocode.test(node.className)){return;}
for(var child=node.firstChild;child;child=child.nextSibling){walk(child);}
var nodeName=node.nodeName.toLowerCase();if('br'===nodeName||'li'===nodeName){chunks[k]='\n';spans[k<<1]=length++;spans[(k++<<1)|1]=node;}
break;case 3:case 4:var text=node.nodeValue;if(text.length){if(!isPreformatted){text=text.replace(/[ \t\r\n]+/g,' ');}else{text=text.replace(/\r\n?/g,'\n');}
chunks[k]=text;spans[k<<1]=length;length+=text.length;spans[(k++<<1)|1]=node;}
break;}}
walk(node);return{sourceCode:chunks.join('').replace(/\n$/,''),spans:spans};}
function appendDecorations(basePos,sourceCode,langHandler,out){if(!sourceCode){return;}
var job={sourceCode:sourceCode,basePos:basePos};langHandler(job);out.push.apply(out,job.decorations);}
var notWs=/\S/;function childContentWrapper(element){var wrapper=undefined;for(var c=element.firstChild;c;c=c.nextSibling){var type=c.nodeType;wrapper=(type===1)?(wrapper?element:c):(type===3)?(notWs.test(c.nodeValue)?element:wrapper):wrapper;}
return wrapper===element?undefined:wrapper;}
function createSimpleLexer(shortcutStylePatterns,fallthroughStylePatterns){var shortcuts={};var tokenizer;(function(){var allPatterns=shortcutStylePatterns.concat(fallthroughStylePatterns);var allRegexs=[];var regexKeys={};for(var i=0,n=allPatterns.length;i<n;++i){var patternParts=allPatterns[i];var shortcutChars=patternParts[3];if(shortcutChars){for(var c=shortcutChars.length;--c>=0;){shortcuts[shortcutChars.charAt(c)]=patternParts;}}
var regex=patternParts[1];var k=''+regex;if(!regexKeys.hasOwnProperty(k)){allRegexs.push(regex);regexKeys[k]=null;}}
allRegexs.push(/[\0-\uffff]/);tokenizer=combinePrefixPatterns(allRegexs);})();var nPatterns=fallthroughStylePatterns.length;var decorate=function(job){var sourceCode=job.sourceCode,basePos=job.basePos;var decorations=[basePos,PR_PLAIN];var pos=0;var tokens=sourceCode.match(tokenizer)||[];var styleCache={};for(var ti=0,nTokens=tokens.length;ti<nTokens;++ti){var token=tokens[ti];var style=styleCache[token];var match=void 0;var isEmbedded;if(typeof style==='string'){isEmbedded=false;}else{var patternParts=shortcuts[token.charAt(0)];if(patternParts){match=token.match(patternParts[1]);style=patternParts[0];}else{for(var i=0;i<nPatterns;++i){patternParts=fallthroughStylePatterns[i];match=token.match(patternParts[1]);if(match){style=patternParts[0];break;}}
if(!match){style=PR_PLAIN;}}
isEmbedded=style.length>=5&&'lang-'===style.substring(0,5);if(isEmbedded&&!(match&&typeof match[1]==='string')){isEmbedded=false;style=PR_SOURCE;}
if(!isEmbedded){styleCache[token]=style;}}
var tokenStart=pos;pos+=token.length;if(!isEmbedded){decorations.push(basePos+tokenStart,style);}else{var embeddedSource=match[1];var embeddedSourceStart=token.indexOf(embeddedSource);var embeddedSourceEnd=embeddedSourceStart+embeddedSource.length;if(match[2]){embeddedSourceEnd=token.length-match[2].length;embeddedSourceStart=embeddedSourceEnd-embeddedSource.length;}
var lang=style.substring(5);appendDecorations(basePos+tokenStart,token.substring(0,embeddedSourceStart),decorate,decorations);appendDecorations(basePos+tokenStart+embeddedSourceStart,embeddedSource,langHandlerForExtension(lang,embeddedSource),decorations);appendDecorations(basePos+tokenStart+embeddedSourceEnd,token.substring(embeddedSourceEnd),decorate,decorations);}}
job.decorations=decorations;};return decorate;}
function sourceDecorator(options){var shortcutStylePatterns=[],fallthroughStylePatterns=[];if(options['tripleQuotedStrings']){shortcutStylePatterns.push([PR_STRING,/^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/,null,'\'"']);}else if(options['multiLineStrings']){shortcutStylePatterns.push([PR_STRING,/^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/,null,'\'"`']);}else{shortcutStylePatterns.push([PR_STRING,/^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/,null,'"\'']);}
if(options['verbatimStrings']){fallthroughStylePatterns.push([PR_STRING,/^@\"(?:[^\"]|\"\")*(?:\"|$)/,null]);}
var hc=options['hashComments'];if(hc){if(options['cStyleComments']){if(hc>1){shortcutStylePatterns.push([PR_COMMENT,/^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/,null,'#']);}else{shortcutStylePatterns.push([PR_COMMENT,/^#(?:(?:define|e(?:l|nd)if|else|error|ifn?def|include|line|pragma|undef|warning)\b|[^\r\n]*)/,null,'#']);}
fallthroughStylePatterns.push([PR_STRING,/^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/,null]);}else{shortcutStylePatterns.push([PR_COMMENT,/^#[^\r\n]*/,null,'#']);}}
if(options['cStyleComments']){fallthroughStylePatterns.push([PR_COMMENT,/^\/\/[^\r\n]*/,null]);fallthroughStylePatterns.push([PR_COMMENT,/^\/\*[\s\S]*?(?:\*\/|$)/,null]);}
if(options['regexLiterals']){var REGEX_LITERAL=('/(?=[^/*])'
+'(?:[^/\\x5B\\x5C]'
+'|\\x5C[\\s\\S]'
+'|\\x5B(?:[^\\x5C\\x5D]|\\x5C[\\s\\S])*(?:\\x5D|$))+'
+'/');fallthroughStylePatterns.push(['lang-regex',new RegExp('^'+REGEXP_PRECEDER_PATTERN+'('+REGEX_LITERAL+')')]);}
var types=options['types'];if(types){fallthroughStylePatterns.push([PR_TYPE,types]);}
var keywords=(""+options['keywords']).replace(/^ | $/g,'');if(keywords.length){fallthroughStylePatterns.push([PR_KEYWORD,new RegExp('^(?:'+keywords.replace(/[\s,]+/g,'|')+')\\b'),null]);}
shortcutStylePatterns.push([PR_PLAIN,/^\s+/,null,' \r\n\t\xA0']);var punctuation=/^.[^\s\w\.$@\'\"\`\/\\]*/;fallthroughStylePatterns.push([PR_LITERAL,/^@[a-z_$][a-z_$@0-9]*/i,null],[PR_TYPE,/^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/,null],[PR_PLAIN,/^[a-z_$][a-z_$@0-9]*/i,null],[PR_LITERAL,new RegExp('^(?:'
+'0x[a-f0-9]+'
+'|(?:\\d(?:_\\d+)*\\d*(?:\\.\\d*)?|\\.\\d\\+)'
+'(?:e[+\\-]?\\d+)?'
+')'
+'[a-z]*','i'),null,'0123456789'],[PR_PLAIN,/^\\[\s\S]?/,null],[PR_PUNCTUATION,punctuation,null]);return createSimpleLexer(shortcutStylePatterns,fallthroughStylePatterns);}
var decorateSource=sourceDecorator({'keywords':ALL_KEYWORDS,'hashComments':true,'cStyleComments':true,'multiLineStrings':true,'regexLiterals':true});function numberLines(node,opt_startLineNum,isPreformatted){var nocode=/(?:^|\s)nocode(?:\s|$)/;var lineBreak=/\r\n?|\n/;var document=node.ownerDocument;var li=document.createElement('li');while(node.firstChild){li.appendChild(node.firstChild);}
var listItems=[li];function walk(node){switch(node.nodeType){case 1:if(nocode.test(node.className)){break;}
if('br'===node.nodeName){breakAfter(node);if(node.parentNode){node.parentNode.removeChild(node);}}else{for(var child=node.firstChild;child;child=child.nextSibling){walk(child);}}
break;case 3:case 4:if(isPreformatted){var text=node.nodeValue;var match=text.match(lineBreak);if(match){var firstLine=text.substring(0,match.index);node.nodeValue=firstLine;var tail=text.substring(match.index+match[0].length);if(tail){var parent=node.parentNode;parent.insertBefore(document.createTextNode(tail),node.nextSibling);}
breakAfter(node);if(!firstLine){node.parentNode.removeChild(node);}}}
break;}}
function breakAfter(lineEndNode){while(!lineEndNode.nextSibling){lineEndNode=lineEndNode.parentNode;if(!lineEndNode){return;}}
function breakLeftOf(limit,copy){var rightSide=copy?limit.cloneNode(false):limit;var parent=limit.parentNode;if(parent){var parentClone=breakLeftOf(parent,1);var next=limit.nextSibling;parentClone.appendChild(rightSide);for(var sibling=next;sibling;sibling=next){next=sibling.nextSibling;parentClone.appendChild(sibling);}}
return rightSide;}
var copiedListItem=breakLeftOf(lineEndNode.nextSibling,0);for(var parent;(parent=copiedListItem.parentNode)&&parent.nodeType===1;){copiedListItem=parent;}
listItems.push(copiedListItem);}
for(var i=0;i<listItems.length;++i){walk(listItems[i]);}
if(opt_startLineNum===(opt_startLineNum|0)){listItems[0].setAttribute('value',opt_startLineNum);}
var ol=document.createElement('ol');ol.className='linenums';var offset=Math.max(0,((opt_startLineNum-1))|0)||0;for(var i=0,n=listItems.length;i<n;++i){li=listItems[i];li.className='L'+((i+offset)%10);if(!li.firstChild){li.appendChild(document.createTextNode('\xA0'));}
ol.appendChild(li);}
node.appendChild(ol);}
function recombineTagsAndDecorations(job){var isIE8OrEarlier=/\bMSIE\s(\d+)/.exec(navigator.userAgent);isIE8OrEarlier=isIE8OrEarlier&&+isIE8OrEarlier[1]<=8;var newlineRe=/\n/g;var source=job.sourceCode;var sourceLength=source.length;var sourceIndex=0;var spans=job.spans;var nSpans=spans.length;var spanIndex=0;var decorations=job.decorations;var nDecorations=decorations.length;var decorationIndex=0;decorations[nDecorations]=sourceLength;var decPos,i;for(i=decPos=0;i<nDecorations;){if(decorations[i]!==decorations[i+2]){decorations[decPos++]=decorations[i++];decorations[decPos++]=decorations[i++];}else{i+=2;}}
nDecorations=decPos;for(i=decPos=0;i<nDecorations;){var startPos=decorations[i];var startDec=decorations[i+1];var end=i+2;while(end+2<=nDecorations&&decorations[end+1]===startDec){end+=2;}
decorations[decPos++]=startPos;decorations[decPos++]=startDec;i=end;}
nDecorations=decorations.length=decPos;var sourceNode=job.sourceNode;var oldDisplay;if(sourceNode){oldDisplay=sourceNode.style.display;sourceNode.style.display='none';}
try{var decoration=null;while(spanIndex<nSpans){var spanStart=spans[spanIndex];var spanEnd=spans[spanIndex+2]||sourceLength;var decEnd=decorations[decorationIndex+2]||sourceLength;var end=Math.min(spanEnd,decEnd);var textNode=spans[spanIndex+1];var styledText;if(textNode.nodeType!==1&&(styledText=source.substring(sourceIndex,end))){if(isIE8OrEarlier){styledText=styledText.replace(newlineRe,'\r');}
textNode.nodeValue=styledText;var document=textNode.ownerDocument;var span=document.createElement('span');span.className=decorations[decorationIndex+1];var parentNode=textNode.parentNode;parentNode.replaceChild(span,textNode);span.appendChild(textNode);if(sourceIndex<spanEnd){spans[spanIndex+1]=textNode=document.createTextNode(source.substring(end,spanEnd));parentNode.insertBefore(textNode,span.nextSibling);}}
sourceIndex=end;if(sourceIndex>=spanEnd){spanIndex+=2;}
if(sourceIndex>=decEnd){decorationIndex+=2;}}}finally{if(sourceNode){sourceNode.style.display=oldDisplay;}}}
var langHandlerRegistry={};function registerLangHandler(handler,fileExtensions){for(var i=fileExtensions.length;--i>=0;){var ext=fileExtensions[i];if(!langHandlerRegistry.hasOwnProperty(ext)){langHandlerRegistry[ext]=handler;}else if(win['console']){console['warn']('cannot override language handler %s',ext);}}}
function langHandlerForExtension(extension,source){if(!(extension&&langHandlerRegistry.hasOwnProperty(extension))){extension=/^\s*</.test(source)?'default-markup':'default-code';}
return langHandlerRegistry[extension];}
registerLangHandler(decorateSource,['default-code']);registerLangHandler(createSimpleLexer([],[[PR_PLAIN,/^[^<?]+/],[PR_DECLARATION,/^<!\w[^>]*(?:>|$)/],[PR_COMMENT,/^<\!--[\s\S]*?(?:-\->|$)/],['lang-',/^<\?([\s\S]+?)(?:\?>|$)/],['lang-',/^<%([\s\S]+?)(?:%>|$)/],[PR_PUNCTUATION,/^(?:<[%?]|[%?]>)/],['lang-',/^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],['lang-js',/^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],['lang-css',/^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i],['lang-in.tag',/^(<\/?[a-z][^<>]*>)/i]]),['default-markup','htm','html','mxml','xhtml','xml','xsl']);registerLangHandler(createSimpleLexer([[PR_PLAIN,/^[\s]+/,null,' \t\r\n'],[PR_ATTRIB_VALUE,/^(?:\"[^\"]*\"?|\'[^\']*\'?)/,null,'\"\'']],[[PR_TAG,/^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i],[PR_ATTRIB_NAME,/^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],['lang-uq.val',/^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/],[PR_PUNCTUATION,/^[=<>\/]+/],['lang-js',/^on\w+\s*=\s*\"([^\"]+)\"/i],['lang-js',/^on\w+\s*=\s*\'([^\']+)\'/i],['lang-js',/^on\w+\s*=\s*([^\"\'>\s]+)/i],['lang-css',/^style\s*=\s*\"([^\"]+)\"/i],['lang-css',/^style\s*=\s*\'([^\']+)\'/i],['lang-css',/^style\s*=\s*([^\"\'>\s]+)/i]]),['in.tag']);registerLangHandler(createSimpleLexer([],[[PR_ATTRIB_VALUE,/^[\s\S]+/]]),['uq.val']);registerLangHandler(sourceDecorator({'keywords':CPP_KEYWORDS,'hashComments':true,'cStyleComments':true,'types':C_TYPES}),['c','cc','cpp','cxx','cyc','m']);registerLangHandler(sourceDecorator({'keywords':'null,true,false'}),['json']);registerLangHandler(sourceDecorator({'keywords':CSHARP_KEYWORDS,'hashComments':true,'cStyleComments':true,'verbatimStrings':true,'types':C_TYPES}),['cs']);registerLangHandler(sourceDecorator({'keywords':JAVA_KEYWORDS,'cStyleComments':true}),['java']);registerLangHandler(sourceDecorator({'keywords':SH_KEYWORDS,'hashComments':true,'multiLineStrings':true}),['bsh','csh','sh']);registerLangHandler(sourceDecorator({'keywords':PYTHON_KEYWORDS,'hashComments':true,'multiLineStrings':true,'tripleQuotedStrings':true}),['cv','py']);registerLangHandler(sourceDecorator({'keywords':PERL_KEYWORDS,'hashComments':true,'multiLineStrings':true,'regexLiterals':true}),['perl','pl','pm']);registerLangHandler(sourceDecorator({'keywords':RUBY_KEYWORDS,'hashComments':true,'multiLineStrings':true,'regexLiterals':true}),['rb']);registerLangHandler(sourceDecorator({'keywords':JSCRIPT_KEYWORDS,'cStyleComments':true,'regexLiterals':true}),['js']);registerLangHandler(sourceDecorator({'keywords':COFFEE_KEYWORDS,'hashComments':3,'cStyleComments':true,'multilineStrings':true,'tripleQuotedStrings':true,'regexLiterals':true}),['coffee']);registerLangHandler(createSimpleLexer([],[[PR_STRING,/^[\s\S]+/]]),['regex']);function applyDecorator(job){var opt_langExtension=job.langExtension;try{var sourceAndSpans=extractSourceSpans(job.sourceNode,job.pre);var source=sourceAndSpans.sourceCode;job.sourceCode=source;job.spans=sourceAndSpans.spans;job.basePos=0;langHandlerForExtension(opt_langExtension,source)(job);recombineTagsAndDecorations(job);}catch(e){if(win['console']){console['log'](e&&e['stack']?e['stack']:e);}}}
function prettyPrintOne(sourceCodeHtml,opt_langExtension,opt_numberLines){var container=document.createElement('pre');container.innerHTML=sourceCodeHtml;if(opt_numberLines){numberLines(container,opt_numberLines,true);}
var job={langExtension:opt_langExtension,numberLines:opt_numberLines,sourceNode:container,pre:1};applyDecorator(job);return container.innerHTML;}
function prettyPrint(opt_whenDone){function byTagName(tn){return document.getElementsByTagName(tn);}
var codeSegments=[byTagName('pre'),byTagName('code'),byTagName('xmp')];var elements=[];for(var i=0;i<codeSegments.length;++i){for(var j=0,n=codeSegments[i].length;j<n;++j){elements.push(codeSegments[i][j]);}}
codeSegments=null;var clock=Date;if(!clock['now']){clock={'now':function(){return+(new Date);}};}
var k=0;var prettyPrintingJob;var langExtensionRe=/\blang(?:uage)?-([\w.]+)(?!\S)/;var prettyPrintRe=/\bprettyprint\b/;var prettyPrintedRe=/\bprettyprinted\b/;var preformattedTagNameRe=/pre|xmp/i;var codeRe=/^code$/i;var preCodeXmpRe=/^(?:pre|code|xmp)$/i;function doWork(){var endTime=(win['PR_SHOULD_USE_CONTINUATION']?clock['now']()+250:Infinity);for(;k<elements.length&&clock['now']()<endTime;k++){var cs=elements[k];var className=cs.className;if(prettyPrintRe.test(className)&&!prettyPrintedRe.test(className)){var nested=false;for(var p=cs.parentNode;p;p=p.parentNode){var tn=p.tagName;if(preCodeXmpRe.test(tn)&&p.className&&prettyPrintRe.test(p.className)){nested=true;break;}}
if(!nested){cs.className+=' prettyprinted';var langExtension=className.match(langExtensionRe);var wrapper;if(!langExtension&&(wrapper=childContentWrapper(cs))&&codeRe.test(wrapper.tagName)){langExtension=wrapper.className.match(langExtensionRe);}
if(langExtension){langExtension=langExtension[1];}
var preformatted;if(preformattedTagNameRe.test(cs.tagName)){preformatted=1;}else{var currentStyle=cs['currentStyle'];var whitespace=(currentStyle?currentStyle['whiteSpace']:(document.defaultView&&document.defaultView.getComputedStyle)?document.defaultView.getComputedStyle(cs,null).getPropertyValue('white-space'):0);preformatted=whitespace&&'pre'===whitespace.substring(0,3);}
var lineNums=cs.className.match(/\blinenums\b(?::(\d+))?/);lineNums=lineNums?lineNums[1]&&lineNums[1].length?+lineNums[1]:true:false;if(lineNums){numberLines(cs,lineNums,preformatted);}
prettyPrintingJob={langExtension:langExtension,sourceNode:cs,numberLines:lineNums,pre:preformatted};applyDecorator(prettyPrintingJob);}}}
if(k<elements.length){setTimeout(doWork,250);}else if(opt_whenDone){opt_whenDone();}}
doWork();}
var PR=win['PR']={'createSimpleLexer':createSimpleLexer,'registerLangHandler':registerLangHandler,'sourceDecorator':sourceDecorator,'PR_ATTRIB_NAME':PR_ATTRIB_NAME,'PR_ATTRIB_VALUE':PR_ATTRIB_VALUE,'PR_COMMENT':PR_COMMENT,'PR_DECLARATION':PR_DECLARATION,'PR_KEYWORD':PR_KEYWORD,'PR_LITERAL':PR_LITERAL,'PR_NOCODE':PR_NOCODE,'PR_PLAIN':PR_PLAIN,'PR_PUNCTUATION':PR_PUNCTUATION,'PR_SOURCE':PR_SOURCE,'PR_STRING':PR_STRING,'PR_TAG':PR_TAG,'PR_TYPE':PR_TYPE,'prettyPrintOne':win['prettyPrintOne']=prettyPrintOne,'prettyPrint':win['prettyPrint']=prettyPrint};if(typeof define==="function"&&define['amd']){define("google-code-prettify",[],function(){return PR;});}})();
// Save text
var markdownEl = document.getElementById('markdown');
var markdown = markdownEl.textContent || markdownEl.innerText;

// Prepare HTML body
document.body.innerHTML = '<div class="navbar navbar-fixed-top"> <div class="navbar-inner"> <div class="container"> <div id="headline" class="brand"> </div> </div> </div> </div>   <div id="content" class="container" />';

var titleEl = document.getElementsByTagName('title')[0];
var title = titleEl.innerHTML;

document.getElementById('headline').innerHTML = title;

// Generate Markdown
var converter = new Showdown.converter();
var html = converter.makeHtml(markdown);
document.getElementById('content').innerHTML = html;

// Prettify
var codeEls = document.getElementsByTagName('code');
for (var i=0, ii=codeEls.length; i<ii; i++) {
  var codeEl = codeEls[i];
  var lang = codeEl.className;
  codeEl.className = 'prettyprint lang-' + lang;
}
prettyPrint();

