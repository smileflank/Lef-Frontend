# data-lef (Lef Form/Data Management API)

data-lef is light html form and sql data management JS API. It has not been finished yet. It will be really helpful for web developers.

data-lef 是一款轻量级的：HTML表单及数据库管理JS插件，目的是将大量重复的表单验证、数据库后台管理的功能解耦成独立的JS插件。data-lef 是根据我以前实际作业经验而总结的一套方案，暂时还未完成，但是相信完成后，其作用一定是非常广泛的。

data-lef 对HTML + CSS代码没有任何干扰，可以实现HTML + CSS 程序员与JS 零干扰开发。也就是说：data-lef 可以让只会HTML、CSS的程序员就可以实现对表单的前端验证和运算。

# Links 参考链接

http://lefwell.github.io/Lef-Frontend/data-lef/

# It's really easy to use! 使用方法

data-lef 还没有完成，暂时只是简单介绍一下她的思路，但是demo已经可用（第一步开发只在Chrome下，以后完成后我会开始更多的考虑兼容性、性能优化等）。

## It's easy! 使用超简单

暂时data-lef是基于 jQuery的，所以使用 data-lef 您只需要引入这两个JS文件就行了：

  &lt;script src="jquery.js"&gt;&lt;/script&gt;

  &lt;script src="data-lef.js"&gt;&lt;/script&gt;

之后，不需要再写一句JS，就可以在您的HTML代码里面使用data-lef了。

如果一个HTML程序员，需要一个输入框输入用户名 和 这个用户的年龄，毫无疑问必须要写下面的代码：

&lt;input type="text" name="user"&gt;

&lt;input type="text" name="age"&gt;

但是上面没有任何验证功能，用户可以在年龄上输入'Lef' 或者数字 9999 岁，那么okay,我们首先限制一下年龄只能输入最多3位整数：

&lt;input type="text" name="age" data-lef-type="number" data-lef-lenrange="3"&gt;

你去刷新一下界面，就可以发现如果输入的不是数字、或者长度不对，那么就会提示错误，并且即使你点击提交也无法提交，而且会告诉你错在哪里。

## data-lef 的两种表达方式

您可以使用两种等价的data-lef 表达方式，一种是 data-lef="属性-值" 一种是 data-lef-属性="值"，这是等价的，举个例子：
data-lef="showlen calc-(100+300)*40 regexp-\d+ lenrange-2-5"
等价于

data-lef-showlen="showlen" data-lef-calc="(100+300)*40" data-lef-regexp="\d+" data-lef-lengrange="2-5"
当然，如果属性值有空格的，那么就不能使用 data-lef=""表示了。

## data-lef 标签

  data-lef="" (multi-select)

  data-lef-regexp regexp has the highest priority

  data-lef-cal  calculate

    {#name} is the locator, you can use `name` to indicate it sometimes

    example

    data-lef-cal="(textboxa + textboxb) / 100" data-lef-type="number.2"

    data-lef-cal="({#textboxa} {#cal} {#textboxb}) / 100"

  data-lef-trim = (multi-select) default | off | htmltag | prune

    data-lef will remove the blank at head and tail. And combine 2 or

    more continued blanks to one. Replace html tags into urlencoded.

    Using data-lef-trim = "off" or data-lef="trim-off" to cancel it.

 data-lef-unique = "both(default) | line | row"

    unique both row and line input value; if it's a &lt;td&gt;, make its inside input be unique

 data-lef-case = "lower | upper | camel | underline"

 data-lef-lentype = "utf8(default) | place | char"

 data-lef-showlen = ""

 data-lef-errtip string it'll show in all nodes whose has a class="data-lef-errtip"

 data-lef-errshow class/id where to show the errtip,

    default is lef.errTipsClass:'.data-lef-errtip' off is cancel

 data-lef-lenrange int|range

 data-lef-type number|number.[int dec 0 on not restrict]

    On cal, if the value nodes has a type, use it; else use the result's type to express a int

    data-lef-regexp="\\d+" or data-lef-regexp="\\d{1,4}" or data-lef-type="number"

    to express a number with 2 decimal numbers

    data-lef-regexp="\\d+\\.\\d{2}" or data-lef-type="number.2"

 data-lef-name the name of a input or the input inside a &lt;td&gt;

 data-lef-blur

 data-lef-len

 data-lef-temporary



## Regular Expression 正则表达

data-lef 中，正则表达具有最高的优先级，如果匹配规则冲突，会优先判定正则规则是否正确。比如设置只能输入两位小数：
你可以使用下面三种方法之一：

&lt;input type="text" data-lef="type-number.2"&gt;

&lt;input type="text" data-lef-type="number.2"&gt;

&lt;input type="text" data-lef-regexp = "\d+\.\d{2}"&gt;

## Self-Configuration 自定义配置

你可以通过JS自己配置一些属性，引入文件后：

&lt;script&gt;

dataLef.autoStart = false;

dataLef.errTipsClass = '.errInputBox';

dataLef.errTextBoxClass = '.errShow';

...

dataLef.init();

&lt;/script&gt;