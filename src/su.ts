module su {
    export let commands={};//必须初始化，否则prototype undefined
    export let editorExtenders = [];//扩展数组
    export let extendEditor = function (extender) {//添加扩展
        editorExtenders.push(extender);
    }

    export let INVISIBLE_SPACE: '\uFEFF';//ES5 新增的空白符，叫「字节次序标记字符（Byte Order Mark）」，也就是前面提到的 BOM
    export let INVISIBLE_SPACE_REG_EXP = /\uFEFF/g;

    export let VOID_ELEMENTS = 'area, base, br, col, embed, hr, img, input, keygen, link, meta, param, source, track, wbr';
    export let PERMITTED_PHRASING_CONTENT_ONLY = 'h1, h2, h3, h4, h5, h6, p, pre';

    export let EMPTY_FUNCTION = function () { };

    export let ELEMENT_NODE = 1; //按键代码
    export let TEXT_NODE = 3;
    export let BACKSPACE_KEY = 8;
    export let ENTER_KEY = 13;
    export let ESCAPE_KEY = 27;
    export let SPACE_KEY = 32;
    export let TAB_KEY = 9;
    export let DELETE_KEY = 46;
}