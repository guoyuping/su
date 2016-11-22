/// <reference path="dom/delegate.ts" />
/// <reference path="selection/selection.ts" />
var h2 = document.getElementById("header");
var btn = document.getElementById("button");
// su.dom.delegate(document.body,"[data-wysihtml5-command],#textarea,h2",'click',function(e:Event){
//     e.preventDefault();
//     console.log('clicked:'+(e.target as Element).tagName.toLowerCase())
// });
var slc = new su.Selection();
//let range = slc.createRange(h2);
// let sl = slc.setSelection(range)
// slc.setBefore(h2);
// test getNodes
// btn.onclick = function(){
//     console.log(slc.getNodes([1,3],function(node){
//         return  node.nodeType ==3;}));
// }
// test getLine
btn.onclick = function () {
    //slc.selectLine();
    // console.log(slc.getNodes([1,3],function(node){
    //     return  node.nodeType ==3;}));
};
//let sb = new su.dom.Sandbox(function(){console.log("aaa")},{});
//let cmd = new su.Commands(new su.Editor("header",{}));
var su;
(function (su) {
    var Nb = (function () {
        function Nb() {
            console.log("nb");
        }
        return Nb;
    }());
    su.Nb = Nb;
})(su || (su = {}));
var nb = new su.Nb();
