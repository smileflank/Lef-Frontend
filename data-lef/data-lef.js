/**
 * *****************************************************************************************************
 * 敬请您先会使用data-lef，然后再给我一个更好的建议 —— 请不要把data-lef跟其他API比较，除非您真的会用data-lef
 * Please give me some advices after KNOWING HOW TO USE data-lef. data-lef is different with other APIs.
 * *******************************************************************************************************
 *
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
 *  regexp-
 *  calc-
 *  unique | unique-line | unique-row
 *  (trim default) | trim-off | trim-htmltag
 *  readonly
 *  case-lower | case-upper |  case-camel | case-underline
 *  lentype-utf8 | lentype-place ..(or extend by yourself) for count()
 *  notnull | lenrange (make this.value not null) | lenrange-1-5
 *  showlen-
 *  submit (submit-click) | submit-mouseover | submit-dbclick ...
 *  type-number | type-number.2
 * @var data-lef-regexp regexp has the highest priority
 * @var data-lef-cal  calculate;
 *  {#name} is the locator, you can use `name` to indicate it sometimes
 *  example
 *    data-lef-cal="(textboxa + textboxb) / 100" data-lef-type="number.2"
 *    data-lef-cal="({#textboxa} {#cal} {#textboxb}) / 100"
 * @var data-lef-trim = (multi-select)
 *  default | off | htmltag | prune
 * @note data-lef will remove the blank at head and tail. And combine 2 or
 *  more continued blanks to one. Replace html tags into urlencoded.
 *  Using data-lef-trim = "off" or data-lef="trim-off" to cancel it.
 * @var data-lef-unique = "both(default) | line | row"
 *  unique both row and line input value; if it's a <td>, make its inside input be unique
 * @var data-lef-case = "lower | upper | camel | underline"
 * @var data-lef-lentype = "utf8(default) | place | char"
 * @var data-lef-showlen = ""
 * @var data-lef-errtip string it'll show in all nodes whose has a class="data-lef-errtip"
 * @var data-lef-errshow class/id where to show the errtip,
 *  default is lef.errTipsClass:'.data-lef-errtip' off is cancel
 * @var data-lef-lenrange int|range
 * @var data-lef-type number|number.[int dec 0 on not restrict]
 *  On cal, if the value nodes has a type, use it; else use the result's type
 *  to express a int
 *    data-lef-regexp="\\d+" or data-lef-regexp="\\d{1,4}" or data-lef-type="number"
 *  to express a number with 2 decimal numbers
 *    data-lef-regexp="\\d+\\.\\d{2}" or data-lef-type="number.2"
 * @var data-lef-name the name of a input or the input inside a <td>
 *
 * @var data-lef-blur
 *
 * @var data-lef-len
 * @var data-lef-temporary
 */
(function () {
    var lef;

    var regDecMax = function (n) {      // \d \d+ \d{1,2} \d{3}
        if (n = n.match(/(\d+)\}$/))         // match(//g)[0] and match(//)[0]
            return parseInt(n[1]);
        return 0;
    }


    /**
     * I'm sorry to pollute prototypes of global Array, String, Object, but I still think it's helpful
     */
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fn, fn_this) {
            var i = 0,
                o = Object(this),
                len = o.length >>> 0;
            for (; i < len; ++i) {
                if (i in o)
                    fn.call(fn_this, o[i], i, o);
            }
        }
    }


    $.fn.extend(
        {
            //'textval':function(v){
            //  var u = typeof v == 'undefined';
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
            'dataLef': function (s, flg) {
                var a;
                if (a = $(this).data('lef-' + s)) {
                    if ($.inArray(s, ['errtip', 'len', 'lenrange', 'temporary', 'regexp', 'type', 'calc']) > -1)
                        return a.toString().replace(/^[\s　]+|[\s　]+$/g, '');
                    //if ('regexp' == s) {
                    //  var reg_arr = a.replace(/\\+/g, '\\').split('\\');
                    //  var new_a = reg_arr[0];
                    //  a.match(/\\+/g).forEach(function(seg, i){
                    //
                    //    if(seg.length % 2){
                    //      new_a += seg.length > 1 ? '\\{' + (seg.length-1) +'}\\' : '\\';
                    //    } else {
                    //      new_a += '\\{' + seg.length + '}'
                    //    }
                    //    new_a += reg_arr[i+1];
                    //  });
                    //  //console.log(new_a)
                    //  new_a = ' ' + new_a; // for regexp below
                    //  return new_a.replace(/[^\\]@/g, '$1\\');
                    //}

                    a = a.split(' ');
                    if (flg)
                        return ($.inArray(flg, a) > -1);
                    return a[1] ? a : a[0];
                }

                var v = $(this).data('lef');

                if (v && (a = (' ' + v).match(RegExp('\\s' + s + '(\\-[^\\s]+)?', 'gi')))) {  // match(//g)[0] and match(//)[0]
                    // for (var in) will list the prototypes of Array
                    for (var i = 0; i < a.length; ++i)
                        a[i] = a[i].replace(RegExp('(' + s + '\\-)|\\s', 'ig'), '');
                    if (flg)
                        return ($.inArray(flg, a) > -1);
                    return a[1] ? a : a[0];
                }
                return false;
            },
            'datalef': function (s, flg) {
                return $(this).dataLef();
            }
        }
    );

    function f() {
        lef = this;
    }

    //f.__proto__ = {
    //
    //};

    f.prototype = {
        autoStart: true,
        /**
         * Configurations
         */
        errTextBoxClass: '.data-lef-errtextbox',
        errTipsClass: '.data-lef-errtip',
        /**
         * @return string default tip shows in the errTipsClass
         */
        defaultErrTip: function (s) {
            return s + 'ERROR';
        },
        htmlTags: [
            ['—', '&#8212;'],
            ['\'', '&#39;'],
            ['\"', '&quot;'],
            ['<', '&lt;'],
            ['>', '&gt;'],
            ['\\\\', '&#92;']
        ],
        data: {
            toArray: function (data) {
                return JSON.parse(data);
            },
            toData: function (arr) {
                return JSON.stringify(arr);
            }
        },

        dataLefSelector: 'dataLefSelector',

        isUsername: function (s) {
            return /^[a-zA-Z\u4e00-\u9fa5][\u4e00-\u9fa5\w\-]+[a-zA-Z\u4e00-\u9fa5]$/.test(s);
        },
        isEmail: function (s) {
            return /^[\w\-\.]+\@[\w\-]+(\.[a-z]+)+$/.test(s);
        },
        isPhone: function (s) {
            return /^\d+$/.test(s);
        },

        regexpCheck: function (o) {
            var reg = $(o).dataLef('regexp');
            if (!reg) {
                reg = $(o).dataLef('type');
                if (reg && (reg = reg.match(/^number(\.?)(\d+)?$/)))
                    reg = !reg[1] ? '\\d+' : (!reg[2] ? '\\d+(\\.\\d*)?' : '\\d+\\.\\d{' + reg[2] + '}');
            }

            //if(reg)console.log(reg + ' : ' + reg.replace(/\\/g,'\\\\') + ' : '+ $(o).val() +(reg ? RegExp('^'+reg+'$').test($(o).val()) : true))
            return reg ? RegExp('^' + reg + '$').test($(o).val()) : true;
        },

        /**
         * regexp --> data-lef-type  -- data-lef="type-"
         * @return int -1 on string; 0 on int; >0 on the max decimal number, esp. Number.POSITIVE_INFINITY on a descimal,but unknown
         */
        getDecimalPlaces: function (o) {
            var reg,
                max;
            if (reg = $(o).dataLef('regexp')) {
                // match(//g)[0] and match(//)[0]
                if (reg = reg.match(/^(\\d[\+\{\d,\}]*)(\\?\.\\d[\+\{\d,\}]*)?$/)) {
                    if (!reg[2])
                        return 0;
                    if ((max = regDecMax(reg[2])) > 0)
                        return max;
                    var len_max = lef.getLenrange(o)[1];
                    if ((max = regDecMax(reg[1])) > 0 && len_max !== Number.POSITIVE_INFINITY)
                        return len_max - max;
                    return Number.POSITIVE_INFINITY;
                }
            }
            //if(reg = $(o).dataLef('type')){
            //  if(reg = reg.match(/^number(\.?)(\d+)?$/)){
            //    if(!reg[1])
            //      return 0;
            //    if(!reg[2])
            //      return Number.POSITIVE_INFINITY;
            //    return parseInt(reg[2]);
            //  }
            //}
            return -1;

        },
        isTypeNumber: function (o, o_reserve) {
            return /^[\d\.]+$/.test($(o).val()) && (lef.getDecimalPlaces(o) > -1 || o_reserve && lef.getDecimalPlaces(o_reserve));
        },
        calc: function (o) {
            var cc = $(o).dataLef('calc'),
                nodes = cc.match(/\{\s*\#\s*([\w\-]+)\s*\}/g);       // match(//g)[0] and match(//)[0]
            nodes = (nodes || []).concat(cc.match(/([\w\-]+)/g));      // match(//g)[0] and match(//)[0]
            var once = [],
                cc2,
                err,
                v;
            nodes.forEach(function (name) {
                if (($.inArray(name, once) < 0) && $('input[name=' + name + ']').length == 1) {
                    $('input[name=' + name + ']').on('input propertychange', function (e) {
                        err = false;
                        cc2 = cc;
                        nodes.forEach(function (n) {
                            if ($('input[name=' + n + ']').length == 1) {
                                v = $('input[name=' + n + ']').val();
                                if (lef.hasErr($('input[name=' + n + ']')) || (v.length < 1))
                                    err = true;
                                if (!lef.isTypeNumber($('input[name=' + n + ']'), $(o)))
                                    v = '"' + v + '"';
                                cc2 = cc2.replace(RegExp(n, 'g'), v);
                                //console.log(cc2)
                            }
                        });
                        v = $(this).val();
                        if (!err && !lef.hasErr($(this)) && (v.length > 0))
                            $(o).val(eval(cc2.replace(RegExp(name, 'g'), v)));

                    });
                    once.push(name);
                }
            });

        },
        /**
         * @return int the placeholder length. a Chinese char's placelen is 2.
         */
        charlen: function (s) {
            return s.length;
        },
        placelen: function (s) {
            var i = l = 0;
            for (; i < s.length; ++i)
                l += s.charCodeAt(i) < 0x007f ? 1 : 2;
            return l;
        },

        utf8len: function (s) {
            var c, i = l = 0;
            for (; i < s.length; i++) {
                c = s.charCodeAt(i);
                if (c < 0x007f)
                    l++;
                else if ((0x0080 <= c) && (c <= 0x07ff))
                    l += 2;
                else if ((0x0800 <= c) && (c <= 0xffff))
                    l += 3;
                else
                    l += 4;
            }
            return l;
        },

        hasErr: function (o) {
            var no_err;
            // first doing
            no_err = lef.lenrangeHandle(o) && lef.regexpCheck(o);
            //no_err = no_err && lef.regexpCheck(o);
            return !no_err;
        },
        setErr: function (o) {
            $(o).addClass(lef.errTextBoxClass.replace(/[^\w\-]/g, ''))
        },
        liftErr: function (o) {
            $(o).removeClass(lef.errTextBoxClass.replace(/[^\w\-]/g, ''))
        },
        errHandle: function (o) {
            // console.log(lef.lenrangeHandle(o));
            lef.hasErr(o) ? lef.setErr(o) : lef.liftErr(o);
        },

        showErr: function (o, s) {
            var errshow = $(o).dataLef('errshow');
            s = s || $(o).dataLef('errtip') || lef.defaultErrTip($(o).attr('placeholder') || $(o).attr('name'));
            if (errshow == 'off')
                return;
            if (!errshow) {
                if ($(o).parents('form').find(lef.errTipsClass).length < 1)
                    $(o).parents('form').prepend('<p class="' + lef.errTipsClass.replace(/[^\w\-]/g, '') + '">' + s + '</p>');
                errshow = $(o).parents('form').find(lef.errTipsClass);
            }

            if ($(errshow).html().length < 1) {
                $(errshow).html(s);
            }

            $(errshow).hide(100).html(s).show(180);
            $(o).focus();
        },


        /**
         * @return array [min, max];
         */
        getLenrange: function (o) {
            var range = $(o).dataLef('lenrange');
            if (range) {      // int|range
                var e = range.replace(/\s/g, '').match(/^(\d+)?([^\d])?(\d+)?$/);   // match(//g)[0] and match(//)[0]
                var r = [];
                if (!e[2])
                    return [0, parseInt(e[1])];
                r[0] = e[1] ? parseInt(e[1]) : 0;
                r[1] = e[3] ? parseInt(e[3]) : Number.POSITIVE_INFINITY;
                return r;
            }
            return [0, Number.POSITIVE_INFINITY];
        },

        /**
         * It changes always, so it should combined handle actions with check
         */
        lenrangeHandle: function (o) {
            var len,
                rtn,
                lentype = $(o).dataLef('lentype'),
                fn = !lentype ? 'utf8len' : (lentype + 'len');
            if (lef.__proto__[fn])
                len = lef[fn]($(o).val());
            else {
                console.log('dataLef.__proto__.' + fn + '() is undefined...');
                return false;
            }
            $(o).data('lef-len', len);

            var show_len = $(o).dataLef('showlen');

            // lef.lenrangeCheck(o);
            if (show_len && len > 0) {
                if (show_len == 'showlen')
                    show_len = $(o).parent().find('em');
                $(show_len).html($(o).dataLef('len'));
            }
            var range = lef.getLenrange(o);
            return !(len < range[0] || len > range[1]);
        },


        trim: function (o) {
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
            if (!tm) {   // do default trim()
                s = s.replace(/^[\s　]+|[\s　]+$/g, '');
                s = s.replace(/\s+/g, ' ');
                lef.htmlTags.forEach(function (x) {
                    s = s.replace(RegExp(x[0], 'g'), x[1]);
                });
            }
            if ($(o).dataLef('trim', 'prune')) {
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
        toSelector: function (select_name, arr) {
            var html = '<select name="' + select_name + '"',
                info = arr[this.dataLefSelector];
            if (info) {
                if (info.dataLef)
                    html += 'data-lef="' + info.dataLef + '"';
                arr[this.dataLefSelector] = null;
            }
            html += '>';

            for (var i = 0; i < arr.length; ++i) {
                if (arr[i]) {
                    html += '<option value="' + i + '"';
                    if (arr[i].selected)
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
        beforeModify: function (tr) {
            $(tr).find('td').each(function (i, td) {
                var input = '<input type="text"';
                input += 'value="';
                input += $(td).dataLef('name') ? $(td).dataLef('name') : $(td).html()
                input += '"';

                if ($(td).dataLef('readonly'))
                    input += 'readonly="readonly"';
                if ($(td).dataLef('name'))
                    input += 'name="' + $(td).dataLef('name') + '"';

                input += '>';
                $(td).html(input);
            });
        },

        afterModify: function (tr) {
            $(tr).find('td').each(function (i, td) {
                $(td).html($(td).children().val());
            });
        },


        beforeSubmit: function (o, e) {
            var r = true;  // 用于返回，让提交按钮后面代码停止执行
            if (!$(o).is('form'))
                o = $(o).parents('form');
            $(o).find(lef.errTipsClass).hide(180);
            $(o).find('input[type!=submit], select, textarea').each(function (i, textbox) {
                if ($(textbox).dataLef('submit'))
                    return true;    // continue to next loop
                lef.trim($(textbox));
                lef.errHandle($(textbox));
                if (lef.hasErr($(textbox))) {
                    e && e.preventDefault();// prevent submit
                    lef.showErr($(textbox));
                    r = false;
                    return r; // break each input/select/textarea
                }
            });
            return r;
        },
        afterSubmit: function (o) {

        },
        init: function () {
            console.log('Not Finish Yet...');
            var nodes = 'input:text, input:password, textarea';

            $(nodes).on('input propertychange', function () {
                lef.errHandle(this);
            });


            $(nodes).on('blur', function () {
                lef.trim(this);
                lef.errHandle(this);
            });

            $('form').submit(function (e) {
                lef.beforeSubmit($(this).first(), e);
            });

            $('body *').each(function () {
                var method;
                if (method = $(this).dataLef('submit')) {
                    if (method == 'submit')
                        method = 'click';
                    $(this).on(method, function (e) {
                        //console.log(method)
                        lef.beforeSubmit(this, e)
                    });
                }
                if (method = $(this).dataLef('calc')) {
                    lef.calc(this);
                }
            });
        }

    };

    //if(typeof window.dataLef != 'function')
    window.dataLef = new f();
    $(function () {
        window.dataLef.autoStart && window.dataLef.init();
    });
})();