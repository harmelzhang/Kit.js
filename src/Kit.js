(function(window){
    var onReadys = []; // 存放加载函数
    var Kit = function(selector){
        if(Kit.isFn(selector)){
            onReadys.push(selector)
        }else{
            return new Kit.fn.init(selector);
        }
    };
    Kit.fn = Kit.prototype = {
        constructor : Kit,
        init : function(selector){
            var type;
            this.elements = [] // 存放DOM节点
            // 处理$()、$("")、$(null)、$(undefined)、$(window)的情况
            if(!selector || selector === window){
                Kit.error("$() $(\"\") $(null) $(undefined) $(window) is not supported");
            }
            // 传入DOM情况
            if(selector.nodeType){
                this.elements.push(selector);
            }
            // 传入字符串情况
            if(Kit.isStr(selector)){
                // 浏览器能力检测
                if(document.querySelectorAll){
                    var nodeList = document.querySelectorAll(selector);
                    for(var i in nodeList){
                        if(nodeList[i].tagName !== undefined){
                            this.elements.push(nodeList[i]);
                        }
                    }
                }else{
                    type = selector.charAt(0);
                    if(type !== "#" || type !== "."){
                        type = "<>";
                    }else{
                        selector = selector.substr(1);
                    }
                    // 选择器
                    if(type === "#"){
                        this.elements.push(document.getElementById(selector));
                    }else if(type === "."){
                        if(document.getElementsByClassName){
                            var nodeList = document.getElementsByClassName(selector);
                            for(var i in nodeList){
                                this.elements.push(nodeList[i]);
                            }
                        }else{
                            var nodeList = document.getElementsByTagName("*");
                            for(var i in nodeList){
                                var node = nodeList[i];
                                if(node.className){
                                    var classNames = node.className.split(/\s+/)
                                    for(var j in classNames){
                                        if(classNames[j] === selector){
                                            this.elements.push(node);
                                        }
                                    }
                                }
                            }
                        }
                    }else if(type === "<>"){
                        var nodeList = document.getElementsByTagName(selector);
                        for(var i in nodeList){
                            this.elements.push(nodeList[i]);
                        }
                    }
                }
            }
        },
        // 返回匹配元素的个数
        length : function(){
            return this.elements.length;
        },
        // 返回原始DOM对象
        get : function(index){
            if(index === undefined){
                return this.elements;
            }
            if(!Kit.isNumber(index)){
                Kit.error("NaN : " + index);
            }
            if(index < 0 || index > this.length() - 1){
                Kit.error("illegal argument : " + index);
            }
            return this.elements[index];
        },
        // 迭代匹配的元素
        each : function(fn){
            if(fn === undefined || !Kit.isFn(fn)){
                Kit.error("illegal argument : need callback function");
            }
            for(var i in this.elements){
                // 回调函数中的this即为DOM元素本身
                fn.call(this.elements[i]);
            }
            return this;
        },
        // 设置或获取value
        val : function(value){
            if(arguments.length == 0){
                if(this.length() == 1){
                    return this.get(0).value;
                }else{
                    // array.push()效率低
                    var array = new Array(this.length());
                    for(var i = 0, len = this.elements.length; i < len; i++){
                        array[i] = this.elements[i].value;
                    }
                    return array;
                }
            }
            if(value && Kit.isStr(value)){
                this.each(function(){
                    this.value = value;
                })
            }
        },
        // 设置或获取value
        html : function(html){
            if(arguments.length == 0){
                if(this.length() == 1){
                    return this.get(0).innerHTML;
                }else{
                    // array.push()效率低
                    var array = new Array(this.length());
                    for(var i = 0, len = this.elements.length; i < len; i++){
                        array[i] = this.elements[i].innerHTML;
                    }
                    return array;
                }
            }
            if(html && Kit.isStr(html)){
                this.each(function(){
                    this.innerHTML = html;
                });
            }
        },
        // 设置样式
        css : function(params){
            params = Kit.isObj(params)?params:{};
            this.each(function(){
                for(var key in params){
                    this.style[key] = params[key];
                }
            });
            return this;
        },
        // 绑定事件
        on : function(eventType, fn){
            this.each(function(){
                Kit.addEventListener(this, eventType, fn);
            });
            return this;
        },
        // 绑定单击事件
        click : function(fn){
            this.on("click", fn);
            return this;
        },
        // 绑定鼠标移入事件
        mouseover: function(fn){
            this.on("mouseover", fn);
            return this;
        },
        // 绑定鼠标移出事件
        mouseout: function(fn){
            this.on("mouseout", fn);
            return this;
        },
        // 绑定鼠标移入/移出事件
        hover : function(inFn, outFn){
            return this.mouseover(inFn).mouseout(outFn);
        }
    };
    Kit.fn.init.prototype = Kit.prototype;
    // 抛出异常
    Kit.error = function(msg){
        throw new Error(msg);
    };
    // 打印日志
    Kit.log = function(value){
        window.console = window.console || {
            log : function(value){
                alert(value)
            }
        };
        window.console.log(value);
    };
    // 加载函数
    Kit.onReady = function(fn){
        if(!Kit.isFn(fn)){
            Kit.error("illegal argument : not a function");
        }
        onReadys.push(fn);
    };
    // 类型检测
    Kit.typeOf = function(value){
        if(value === null){
            return "null";
        }
        var type = typeof value;
        if(type === "undefined" || type === "string" || type === "number" || type === "boolean"){
            return type;
        }
        var typeString = Object.prototype.toString.call(value);
        switch(typeString){
            case "[object Array]" : return "array";
            case "[object Date]" : return "date";
            case "[object Boolean]" : return "boolean";
            case "[object Number]" : return "number";
            case "[object Regexp]" : return "regexp";
        }
        if(type === "function"){
            return "function";
        }
        if(type === "object"){
            return "object";
        }
    };
    Kit.isFn = function(fn){
        return Kit.typeOf(fn) === "function";
    };
    Kit.isStr = function(string){
        return Kit.typeOf(string) === "string";
    };
    Kit.isArray = function(array){
        return Kit.typeOf(array) === "array";
    };
    Kit.isNumber = function(num){
        return Kit.typeOf(num) === "number";
    };
    Kit.isObj = function(obj){
        return Kit.typeOf(obj) === "object";
    };
    Kit.isKit = function(obj){
        return obj.constructor === Kit;
    };
    // 绑定事件
    Kit.addEventListener = function(dom, eventType, fn){
        if(dom === undefined || !Kit.isStr(eventType) || fn === undefined || !Kit.isFn(fn)){
            Kit.error("illegal argument");
        }
        if(dom.addEventListener){
            dom.addEventListener(eventType, fn, false);
        }else if(dom.attachEvent){
            dom.attachEvent("on" + eventType, fn);
        }else{
            dom["on" + eventType] = fn;
        }
    };
    // 解析JSON
    Kit.parseJSON = function(string){
        if(!Kit.isStr(string)){
            Kit.error("illegal argument");
        }else{
            if(JSON){
                return JSON.parse(string);
            }else{
                return window.eval("(" + string + ")");
            }
        }
    };
    // 解析XML
    Kit.parseXML = function(string){
        if(!Kit.isStr(string)){
            Kit.error("illegal argument");
        }
        var xmlDoc = null;
        try{
            xmlDoc = (new DOMParser()).parseFromString(string, "text/xml");
        }catch(e){
            xmlDoc = new ActivexObject ("MSXML2.DOMDocument");
            xmlDoc.load(string);
        }
        // 有些浏览器会生成<parsererror>形式的错误信息
        if(!xmlDoc || xmlDoc.getElementsByTagName("parsererror").length){
            Kit.error("error data ：" + string);
        }
        return xmlDoc;
    };
    // 获取<body>元素
    Kit.getBody = (function(){
        var body; // 缓存
        return function(){
            return body || (body = Kit("body"));
        }
    })();
    // 对象属性扩展，有则替换无则增加
    Kit.apply = function(target, from){
        if(target && from && Kit.isObj(target) && Kit.isObj(from)){
            for(var pName in from){
                target[pName] = from[pName];
            }
            return target;
        }else{
            Kit.error("illegal argument");
        }
    };
    // 对象属性扩展，有则忽略无则增加
    Kit.applyIf = function(target, from){
        if(target && from && Kit.isObj(target) && Kit.isObj(from)){
            for(var pName in from){
                if(target[pName] === undefined){
                    target[pName] = from[pName];
                }
            }
            return target;
        }else{
            Kit.error("illegal argument");
        }
    };
    // 设置加载函数
    window.onload = function(){
        for(var i in onReadys){
            onReadys[i].call(window)
        }
    };
    // 设置别名
    window.$ = window.Kit = Kit;
})(window);