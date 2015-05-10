/**
 * data-lef (Lef Form/Data Management API)
 * Form is used for <form> management and Data is for light sql management
 * @example
 *  <input data-lef="unique lower-case" data-lef-len="place">
 *  <tr>
 *    <th>ID</th>
 *    <th>User/用户名</th>
 *    <th>Gender/性别</th>
 *  </tr>
 *  <tr>
 *    <td data-lef="unique-row readonly" data-lef-name="id" data-regexp="\d" data-lef-lenrange="11">1</td>
 *    <td data-lef-name="name" data-lef-lenrange="6-15">Lef Well</td>
 *    <td data-lef-name="sex">M/男</td>
 * </tr>
 *  <tr>
 *    <td data-lef="unique-row readonly" data-lef-name="id" data-regexp="\d" data-lef-lenrange="11">2</td>
 *    <td data-lef-name="name">Shu Q.</td>
 *    <td data-lef-name="sex">W/女</td>
 * </tr>
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
 *  showlen-
 *  submit (submit-click) | submit-mouseover | submit-dbclick ...
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
 * @var data-lef-showlen = ""
 * @var data-lef-errtip string it'll show in all nodes whose has a class="data-lef-errtip"
 * @var data-lef-errshow class/id where to show the errtip, default is lef.errTipsClass:'.data-lef-errtip'
 *                        off is cancel
 * @var data-lef-lenrange int|range
 * @var data-lef-name the name of a input or the input inside a <td>
 *
 * @var data-lef-blur
 *
 * @var data-lef-len
 * @var data-lef-temporary
 */
(function(){
  var lef;

  Array.prototype.has = function(val){  // replace to $.inArray() if you like
    // for (var in) will list the prototypes of Array
    for(var i = 0; i<this.length; ++i) {
      if (val == this[i])
        return this;
    }
    return false;
  }
  String.prototype.has = function(val){
    return this == val;
  }
  String.prototype.word = function(){
    return this.replace(/[^\w\-]/g,'');
  }
  $.fn.extend(
    {
      //'textval':function(v){
      //  var u = typeof(v) == 'undefined';
      //    if($(this).is('input') || $(this).is('textarea'))
      //      return u ? $(this).val() : $(this).val(v);
      //    else
      //      return u ? $(this).html() : $(this).html(v);
      //},
      /**
       * Get|Check dataLef
       * @arg string flg = false optional
       * @return string|array|bool
       */
      'dataLef':function(s, flg){
        var a;
        if(a = $(this).data('lef-'+s)){
          if(['errtip', 'len', 'temporary'].has(s))
            return $(this).data('lef-'+s);
          a = a.split(' ');
          if(flg)
            return a.has(flg)
          return a[1] ? a : a[0];
        }

        var v = ' ' + $(this).data('lef');

        if(v != ' ' && (a = v.match(RegExp('\\s'+s+'(\\-[^\\s]+)?','gi')))) {
          // for (var in) will list the prototypes of Array
          for (var x=0; x<a.length; ++x){
            a[x] = a[x].replace(RegExp('('+s+'\\-)|\\s', 'ig'), '');
          }
          if(flg)
            return a.has(flg);
          return a[1] ? a : a[0];
        }
        return false;
      },
      'datalef':function(s, flg){
        return $(this).dataLef();
      }
    }
  );

  function f(){}
  f.__proto__ = {

  };

  f.prototype = {
    /**
     * Configurations
     */
    errTextBoxClass:'.data-lef-errtextbox',
    errTipsClass:'.data-lef-errtip',
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


    errShowHandle:true,

    isUsername:function(s){
      return /^[a-zA-Z\u4e00-\u9fa5][\u4e00-\u9fa5\w\-]+[a-zA-Z\u4e00-\u9fa5]$/.test(s);
    },
    isEmail: function (s) {
      return /^[\w\-\.]+\@[\w\-]+(\.[a-z]+)+$/.test(s);
    },
    isPhone: function (s) {
      return /^\d+$/.test(s);
    },
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

    hasErr:function(o){
      return $(o).hasClass(lef.errTextBoxClass.word()) ? true : (!lef.regexpCheck(o));
    },
    setErr:function(o){
      $(o).addClass(lef.errTextBoxClass.word())
    },
    liftErr:function(o){
      $(o).removeClass(lef.errTextBoxClass.word())
    },
    errHandle:function(o){
      lef.lenrangeHandle(o);
      lef.hasErr(o) ? lef.setErr(o) : lef.liftErr(o);
    },

    showErr:function(o, s){
      var errshow =  $(o).dataLef('errshow');
      s = s || $(o).dataLef('errtip') || lef.defaultErrTip($(o).attr('placeholder') || $(o).name());
      if(!lef.errShowHandle || errshow == 'off')
        return;
      if(!errshow){
        if($(o).parents('form').find(lef.errTipsClass).length < 1)
          $(o).parents('form').prepend('<p class="'+ lef.errTipsClass +'" data-lef="temporary">'+ s +'</p>');
        errshow = $(o).parents('form').find(lef.errTipsClass);
      }

      if($(errshow).html() && !$(o).dataLef('temporary')){

      }


      $(errshow).hide(100).html(s).show(180);
      $(o).focus();
    },





    regexpCheck:function(o){
      var reg = $(o).dataLef('regexp');
        return reg ? RegExp(reg).test($(o).value) : true;
    },
    /**
     * It changes always, so it should combined handle actions with check
     */
    lenrangeHandle:function(o){
      var len, rtn, lentype = $(o).dataLef('lentype');
      var fn = !lentype ? 'utf8len' : (lentype + 'len');
      if(lef.__proto__[fn])
        len = lef[fn]($(o).val());
      else{
        console.log('dataLef.__proto__.'+ fn +'() is undefined...');
        return false;
      }
      $(o).data('lef-len', len);

      var show_len = $(o).dataLef('showlen');
      // lef.lenrangeCheck(o);
      if(show_len && len >0){
        if(show_len == 'showlen')
          show_len = $(o).parent().find('em');
        $(show_len).html($(o).dataLef('len'));
      }


      var range = $(o).dataLef('lenrange');
      if(range){      // int|range
        var e = range.toString().split('-'),
          i = function(n){return parseInt(n)};
        return e[1] ? (len >= i(e[0]) && len<=i(e[1])) : (len<i(e[1]));
      }



      return true;
    },



    trim: function(o){
      var s = $(o).val();
      //if(!s)
       // return;
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
        for(var x=0; x<lef.htmlTags.length; ++x){
          s = s.replace(RegExp(lef.htmlTags[x][0], 'g'), lef.htmlTags[x][1]);
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
    /**
     * Modify a line of data
     * @arg jQuery-Object tr
     */
    beforeModify:function(tr){
      $(tr).find('td').each(function(i, td){
        var input = '<input type="text"';
        input += 'value="';
        input += $(td).dataLef('name') ? $(td).dataLef('name') : $(td).html()
        input += '"';

        if($(td).dataLef('readonly'))
          input += 'readonly="readonly"';
        if($(td).dataLef('name'))
          input += 'name="'+ $(td).dataLef('name') +'"';

        input += '>';
        $(td).html(input);
      });
    },

    afterModify:function(tr){
      $(tr).find('td').each(function(i, td){
        $(td).html($(td).children().val());
      });
    },


    beforeSubmit:function(o, e){
      var r = true;  // 用于返回，让提交按钮后面代码停止执行

      lef.errShowHandle = $(o).dataLef('errshow') == 'off' ? false : true;      // reset back to true is necessary


      $(o).parents('form').find(lef.errTipsClass).hide(180);
      $(o).parents('form').find('input[type!=submit], select, textarea').each(function (i, textbox) {
        if($(textbox).dataLef('submit'))
          return true;    // continue to next loop
        lef.trim($(textbox));
        lef.errHandle($(textbox));
        if(lef.hasErr($(textbox))){
          e && e.preventDefault();// prevent submit
          lef.showErr($(textbox));
          r=false;
          return r; // break each input/select/textarea
        }
      });
      return r;
    },
    afterSubmit:function(o){

    },
    init:function(data_lef){
      lef = data_lef;
      console.log('Not Finish Yet...');
      var nodes = 'input:text, input:password, textarea';
      $(nodes).bind('input propertychange', function () {
        lef.errHandle(this);
      });


      $(nodes).blur(function () {
        lef.trim(this);
        lef.errHandle(this);
      });

      $('form').submit(function (e) {
        lef.beforeSubmit(this, e);
      });

      $('body *').each(function(){
        var method;
        if(method = $(this).dataLef('submit')){
          if(method == 'submit')
            method = 'click';
          $(this).bind(method,function(e){
            //console.log(method)
            lef.beforeSubmit(this, e)
          });
        }
      });
    }

  };

  //if(typeof(window.dataLef) != 'function')
    window.dataLef = new f();
  $(document).ready(function(){

    dataLef.init(window.dataLef);
  });
})();