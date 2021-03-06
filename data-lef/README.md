> 敬请您先会使用data-lef，然后再给我一个更好的建议 —— 请不要把data-lef跟其他API比较，除非您真的会用data-lef。也许data-lef源码不佳，但是请不要否认 data-lef 的设计思路。

> Please give me some advices after KNOWING HOW TO USE data-lef. data-lef is different with other APIs. The code may not be good, but the design must be not bad.


# data-lef (Lef Form/Data Management API)

data-lef is a light html form and sql data management JS API. **It's use for decouple**. 
It has not been finished yet. It will be really helpful for web developers.

data-lef 是一款**以解耦为目的**、轻量级的：HTML表单及数据库管理JS插件，目的是将大量重复的表单验证、数据库后台管理的功能解耦成独立的JS插件。data-lef 是根据我以前实际作业经验而总结的一套方案，暂时还未完成，但是相信完成后，其作用一定是非常广泛的。

**data-lef 的目的不是简化代码、节省工作量，而是为了解耦！！！**

data-lef 唯一的好处，就是纯HTML，不需要写任何一句Javascript就能方便的管理form及
简单的数据库管理（通过Ajax接口)；data-lef 对HTML + CSS代码没有任何干扰，可以实现
HTML + CSS 程序员与JS 零干扰开发。

### data-lef 只为解耦、零干扰的解释
你可以在一个项目任意开发阶段使用、或者弃用data-lef ，而且使用、和弃用对代码没有
任何影响（只有功能的存在和消失）。
因为data-lef 没有生造出任何一种干扰HTML、或者JS的新“语法”。如果你的项目之前使用
过自己的JS验证代码，在使用data-lef之后，两者可以并列存在！

# Links 参考链接

http://lefwell.github.io/Lef-Frontend/data-lef/

# It's really easy to use! 使用方法

data-lef 还没有完成，暂时只是简单介绍一下她的思路，但是demo已经可用（第一步开发只在Chrome下，以后完成后我会开始更多的考虑兼容性、性能优化等）。

## It's easy! 使用超简单

暂时data-lef是基于 jQuery的，所以使用 data-lef 您只需要引入这两个JS文件就行了：

  &lt;script src="jquery.js"&gt;&lt;/script&gt;

  &lt;script src="data-lef.js"&gt;&lt;/script&gt;

之后，不需要再写一句JS，就可以在您的HTML代码里面使用data-lef了。

如果一个HTML程序员，需要一个输入框输入年龄，毫无疑问必须要写下面的代码：

&lt;input type="text" name="age"&gt;

但是上面没有任何验证功能，用户可以在年龄上输入'Lef' 或者数字 9999 岁，那么okay,我们首先限制一下年龄只能输入最多3位整数：

&lt;input type="text" name="age" data-lef-type="number" data-lef-lenrange="3"&gt;

你去刷新一下界面，就可以发现如果输入的不是数字、或者长度不对，那么就会提示错误，并且即使你点击提交也无法提交，而且会告诉你错在哪里。

### 下面我们举一些简单的例子

限制只能输入：姓名，一个中文算两个英文字母，输入6-14位字母长度；并且在class="name_length" 的节点显示已经输入的字符长度；如果用户输入错误，并且强制提交，那么就会在
id="name_err"的节点提示：“你连名字都不会写吗？”

&lt;input type="text" name="name" data-lef-lentype="place" data-lef-lenrange="6-14" data-lef-showlen=".name_length"
data-lef-errtip="你连名字都不会写吗？" data-lef-errshow="#name_err" &gt;

为了HTML代码的美观性，data-lef 提供了另外一种完全等价的表述

&lt;input type="text" name="name" data-lef="lentype-place lenrange-6-14 
showlen-.name_length errshow-#name_err" data-lef-errtip="你连名字都不会写吗？" &gt;


## data-lef 的两种表达方式

为了HTML代码的美观性，data-lef提供了两种等价表达方式，一种是 data-lef="属性-值" 一种是 data-lef-属性="值"，这是等价的，举个例子：

data-lef="showlen calc-({#price}+300)*40 regexp-\d+ lenrange-2-5"

等价于

data-lef-showlen="showlen" data-lef-calc="({#price}+300)*40" data-lef-regexp="\d+" data-lef-lengrange="2-5"

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

## Calculate 自动计算功能

你可以使用 {#name} 或者直接使用 name 来表示一个 name="name" 其他文本框，之后当前
文本框就可以自动计算出相应的结果：

data-lef-cal="50 * ({#price} + 300) - 10" 

data-lef-cal="50 * (price + 300) - 10" 


## Regular Expression 正则表达

data-lef 中，正则表达具有最高的优先级，如果匹配规则冲突，会优先判定正则规则是否正确。比如设置只能输入两位小数：

你可以使用下面三种方法之一：

&lt;input type="text" data-lef="type-number.2"&gt;

&lt;input type="text" data-lef-type="number.2"&gt;

&lt;input type="text" data-lef-regexp = "\d+\.\d{2}"&gt;

## Self-Configuration 自定义配置

你可以通过JS自己配置一些属性，引入文件后：

&lt;script&gt;

window.dataLef.errTipsClass = '.errInputBox';

window.dataLef.errTextBoxClass = '.errShow';

window.dataLef.data = function(){     // 如果想换种数据格式，比如protobuf等

  toArray:function(data){
  
     return protobufToArray(data);
     
  },
  
  toData: function(arr){
  
    return arrayToProtobuf(arr)
    
  }
  
}
...

// 如果想要手动启动dataLef，只需要：

window.dataLef.autoStart = false;

// 之后在你想要启动的地方使用 dataLef.init() 就可以了

window.dataLef.init();

&lt;/script&gt;