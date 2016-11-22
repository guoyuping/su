/// <reference path="dom/delegate.ts" />
/// <reference path="selection/selection.ts" />

let h2 = document.getElementById("header");
let btn = document.getElementById("button");
// su.dom.delegate(document.body,"[data-wysihtml5-command],#textarea,h2",'click',function(e:Event){
//     e.preventDefault();
//     console.log('clicked:'+(e.target as Element).tagName.toLowerCase())
// });

//let slc = new su.Selection();
//let range = slc.createRange(h2);
// let sl = slc.setSelection(range)
// slc.setBefore(h2);
// test getNodes
// btn.onclick = function(){
//     console.log(slc.getNodes([1,3],function(node){
//         return  node.nodeType ==3;}));
// }
// test getLine


//let sb = new su.dom.Sandbox(function(){console.log("aaa")},{});
//let cmd = new su.Commands(new su.Editor("header",{}));
let editor = new su.Editor("editor",{});
let composer = editor.composer;

btn.onclick = function(){
    //editor.fire('change_view','textarea');
    //composer.commands.exec("bold");
    // console.log(slc.getNodes([1,3],function(node){
    //     return  node.nodeType ==3;}));
    console.log(Math.random().name);
}