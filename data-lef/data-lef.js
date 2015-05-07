/**
 * data-lef (Lef Form/Data Management API)
 * @note it's based on jQuery
 * @see https://github.com/lefwell/_ObsoleteCodes/tree/master/zy201211%20Dead%20JS%20function%20package
 *
 * @var data-lef = (multi-select)
 *  unique | unique-line | unique-row
 *  (trim default) | trim-off | trim-htmltag
 *  readonly
 *  case-lower | case-upper |  case-camel | case-underline
 *  lentype-utf8 | lentype-place ..(or extend by yourself) for count()
 *  notnull | lenrange (make this.value not null) | lenrange-1-5
 * @var data-lef-trim = (multi-select)
 *  default | off | htmltag | prune
 * @var data-lef-regexp =
 * @note data-lef will remove the blank at head and tail. And combine 2 or
 *  more continued blanks to one. Replace html tags into urlencoded.
 *  Using data-lef-trim = "off" or data-lef="trim-off" to cancel it.
 * @var data-lef-unique = "both(default) | line | row"
 *  unique both row and line input value; if it's a <td>, make its inside input be unique
 * @var data-lef-case = "lower | upper | camel | underline"
 * @var data-lef-lentype = "utf8(default) | place | char"
 *
 * @var data-lef-errtip string it'll show in all nodes whose has a class="data-lef-errmsg"
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

  function exist(arr, val){
    if(typeof(arr) == 'string')
      return arr == val;
    if(arr.constructor == 'Array'){
      for(var i in arr) {
        if (val == arr[i])
          return arr;
      }
    }
    console.log("data-lef.js exist(arr, val) arr type error")
    return false;
  }
  $.fn.extend(
    {
      /**
       * Get|Check dataLef
       * @arg string flg = false optional
       * @return string|array|bool
       */
      'dataLef':function(s, flg){
        var a;
        if($(o).data('lef-'+s)){
          var a = $(o).data('lef-'+s).split(' ');
          if(flg)
            return exist(a, flg)
          return a[1] ? a : a[0];
        }

        var v = $(o).data('lef');
        if(a = v.match(RegExp('\\s'+s+'(\\-[\\w\\-]+)?','gi'))) {
          for (var x in a){
            // a[x] = a[x].replace(/(trim\-)|(\s)/ig, '');
            a[x] = a[x].replace(RegExp('('+s+'\\-)|\\s', 'ig'), '');
          }
          if(flg)
            return exist(a, flg)
          return a[1] ? a : a[0];
        }
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
    }
  };

  f.prototype = {
    /**
     * Configurations
     */
    errTextboxClass:'data-lef-errtextbox',
    errTipsClass:'data-lef-errtip',
    /**
     * @return string default tip shows in the errTipsClass
     */
    defaultErrTip: function(s){
      return s+ "错误";
    },
    htmlTags: [
      ['—', '&#8212;'],
      ['\'', '&#39;'],
      ['\"', '&quot;'],
      ['<', '&lt;'],
      ['>', '&gt;'],
      ['\\\\', '&#92;']
    ],
    data:{
      toArray:function(){
        return JSON.parse(data);
      },
      toData:function(){
        return JSON.stringify(arr);
      }
    },

    dataLefSelector:'dataLefSelector',




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
          ok = function(o){$(o).removeClass(this.errTipsClass)},
          len, lentype = $(o).datalef('lentype');
      var fn = !lentype ? 'utf8len' : (lentype + 'len');
      if(this.__proto__[fn])
        len = this[fn]($(o).val());
      else{
        console.log('dataLef.__proto__.'+ fn +'() is undefined...');
        return;
      }
      checkLenRange(o, len) ? ok(o) : err(o);
    },

    trimHandle: function(o){
      var s = $(o).val();
      var tm = $(o).dataLef('trim');
      /**
       * Default trim, using off to cancel below
       *  1. trim the blanks at head and tail
       *  2. combine 2 or more continued blanks into 1
       *  3. replace html tags to urlencoded
       *      htmltag to remove it instead of replacing
       */
      if(!tm){   // do default trim()
        s = s.replace(/^[\s　]+|[\s　]+$/g, '');
        s = s.replace(/\s+/g, ' ');
        for(var x in this.htmlTags){
          s = s.replace(RegExp(this.htmlTags[x][0], 'g'), this.htmlTags[x][1]);
        }
      }
      if($(o).dataLef('trim', 'prune')){
        s = s.replace(/[，,]+/g, ',');
        s = s.replace(/([\s\-\+\.,])+/g, '$1');
        s = s.replace(/^[,\s\-\+\.]+|[,\s\-\+\.]+$/g, '');
        s = s.replace(/[^\u4E00-\u9FA5\w,\-\+\s\.]/g, '');
      }
      $(o).val(s);
    },
    beforeSubmit:function(o){

    },
    afterSubmit:function(o){

    },
    showErr:function(o, s){
      s = s || $(o).dataLef('errtip') || this.defaultErrTip($(o).attr('placeholder') || $(o).name());
      var tips = $(o).parents('form').find('.' + this.errTipsClass);
      $(tips).hide(100).html(s).show(180);
      $(o).focus();
    },
    /**
     * @var flags
     *  ""  show <option></option>
     *  string selected key name
     * @example
     * {
     *  vita:{
     *    "dataLefSelector":{"dataLef":"notnull"},
     *    "name":{"selected":"Lef"},
     *    "age":99,
     *  }
     * }
     *    <select name = "vita" data-lef="notnull">
     *      <option></option>
     *      <option value="name" selected="selected">Lef</option>
     *      <option value="age">99</option>
     *    </select>
     */
    toSelector:function(select_name, arr){
      var html = '<select name="'+ select_name+'"';
      var info = arr[this.dataLefSelector];
      if(info){
        if(info.dataLef)
          html += 'data-lef="'+ info.dataLef +'"';
        arr[this.dataLefSelector] = null;
      }
      html += '>';

      for(var i in arr){
        if(arr[i]){
          html += '<option value="' + i + '"';
          if(arr[i].selected)
            html += ' selected="selected">' + arr[i].selected;
          else
            html += '>' + arr[i];
          html += '</option>';
        }

      }
      return '</select>';
    },
    init:function(){

    }

  };
  window.dataLef = new f();
  $(document).ready(function(){
    dataLef.init();
  });
});