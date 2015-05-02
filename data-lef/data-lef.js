/**
 * Lef Form JS
 * @note it's based on jQuery
 * @see https://github.com/lefwell/_ObsoleteCodes/tree/master/zy201211%20Dead%20JS%20function%20package
 * @note data-lef
 * @var data-lef
 *  unique | unique-line | unique-row
 *  trim | trim-no | trim-
 *  htmltag-remove | htmltag-keep | htmltag-replace
 *  readonly
 *  case-lower | case-upper |  case-camel | case-underline
 *  lentype-utf8 | lentype-place ..(or extend by yourself) for count()
 * @var data-lef-unique = "both(default) | line | row"
 *  unique both row and line input value; if it's a <td>, make its inside input be unique
 * @var data-lef-trim = "default(default) | no | "
 *  data-lef will remove the blank at head and tail. And combine 2 or more continued blanks
 *    to one. Using data-lef-trim = "no" or data-lef="no-trim" to cancel it.
 * @var data-lef-htmltag = "remove(default) | replace | keep"
 * @var data-lef-case = "lower | upper | camel | underline"
 * @var data-lef-lentype = "utf8(default) | place | char"
 *
 * @var data-lef-errmsg string it'll show in all nodes whose has a class="data-lef-errmsg"
 * @var data-lef-lenrange int|range
 * @var data-lef-name the name of a input or the input inside a <td>
 * @var data-lef-val the default value of the input or the input inside a <td>
 *
 * @var data-lef-blur
 * @example
 *  <input data-lef="unique lower-case" data-lef-len="place">
 *  <td data-lef="" data-lef-name="id" data-lef-val="Data-Lef" data-lef-unique="row"></td>
 */
(function(){
  $.fn.extend(
    {
      'getDatalef':function(s){
        if($(o).data('lef-'+s))
          return $(o).data('lef-'+s);

        var a, v = $(o).data('lef');
        if(RegExp('(^'+s+'\\s)|(\\s'+s+'\\s)|(\\s' + s +'$)|(^'+s+'$)').test(v))
          return s;
        if(a = (v.match(RegExp(s+'\\-(\\w+)\\s')) || v.match(RegExp(s+'\\-(\\w+)$'))))
          return a[1];
        return false;
      }
    }
  );

  function f(){}
  f.__proto__ = {
    /**
     * @return int the placeholder length. a Chinese char's placelen is 2.
     */
    charlen: function(s){
      return s.length;
    },
    placelen: function (s) {
      var l = 0;
      for (var i = 0; i < s.length; ++i) {
        l += s.charCodeAt(i) < 0x007f ? 1 : 2;
      }
      return l;
    },

    utf8len: function (s) {
      var c, i, l = 0;
      for (i = 0; i < s.length; i++) {
        c = s.charCodeAt(i);
        if (c < 0x007f)l++;
        else if ((0x0080 <= c) && (c <= 0x07ff))l += 2;
        else if ((0x0800 <= c) && (c <= 0xffff))l += 3;
        else l += 4;
      }
      return l;
    },
  };

  f.prototype = {
    /**
     * Configurations
     */
    errTextboxClass:'data-lef-errtextbox',
    errMsgClass:'data-lef-errmsg',



    isUsername:function(s){
      return /^[a-zA-Z\u4e00-\u9fa5][\u4e00-\u9fa5\w\-]+[a-zA-Z\u4e00-\u9fa5]$/.test(s);
    },
    isEmail: function (s) {
      return /^[\w\-\.]+\@[\w\-]+(\.[a-z]+)+$/.test(s);
    },
    isPhone: function (s) {
      return /^\d+$/.test(s);
    },
    checkLenRange:function(o, l){
      if($(o).data['lef-lenrange']){      // int|range
        var e = $(o).data('lef-lenrange').toString().split('-'),
            i = function(n){return parseInt(n)};
        return e[1] ? (l >= i(e[0]) && l<=i(e[1])) : (l<i(e[1]));
      }
    },
    showLen: function(o){
      var err = function(o){$(o).addClass(this.errTextboxClass)},
          ok = function(o){$(o).removeClass(this.errMsgClass)},
          len, lentype = $(o).datalef('lentype');
      var fn = !lentype ? 'utf8len' : (lentype + 'len');
      if(this.__proto__[fn]);
        len = this[fn]($(o).val());
      else{
        console.log('dataLef.__proto__.'+ fn +'() is undefined...');
        return;
      }
      checkLenRange(o, len) ? ok(o) : err(o);
    }

  };
  window.dataLef = new f();
  $(document).ready(function(){
    dataLef.init();
  });
});