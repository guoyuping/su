namespace su {
    /**
* Rich Text Query/Formatting Commands
*
* @example
*    var commands = new wysihtml.Commands(editor);
*/
    export class Commands {
        editor;
        composer;
        doc:Document;

        constructor(editor) {
            this.editor = editor;
            this.composer = editor.composer;
            this.doc = this.composer.doc;
        }

        /**
         * 检测浏览器的document是否支持 command
         *
         * @param {String} command The command string which to check (eg. "bold", "italic", "insertUnorderedList")
         * @example
         *    commands.supports("createLink");
         */
        support(command):boolean {
            return browser.supportsCommand(this.doc, command);
        }

        /**
         * Check whether the browser supports the given command
         * https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand
         *
         * @param {String} command The command string which to execute (eg. "bold", "italic", "insertUnorderedList")
         * @param {String} [value] The command value parameter, needed for some commands ("createLink", "insertImage", ...), optional for commands that don't require one ("bold", "underline", ...)
         * @example
         *    commands.exec("insertImage", "http://a1.twimg.com/profile_images/113868655/schrei_twitter_reasonably_small.jpg");
         */
        exec(command:string, value?:string) {
            var obj = su.commands[command],
                args = lang.array(arguments).get(),
                method = obj && obj.exec,
                result = null;
                
                
            // If composer ahs placeholder unset it before command
            // Do not apply on commands that are behavioral 
            if (this.composer.hasPlaceholderSet() && !lang.array(['styleWithCSS', 'enableObjectResizing', 'enableInlineTableEditing']).contains(command)) {
                this.composer.element.innerHTML = "";
                this.composer.selection.selectNode(this.composer.element);
            }

            this.editor.fire("beforecommand:composer");

            if (method) {
                args.unshift(this.composer);
                result = method.apply(obj, args);
            } else {
              
                try {
                    // try/catch for buggy firefox
                    result = this.doc.execCommand(command, false, value);
                } catch (e) { }
            }

            this.editor.fire("aftercommand:composer");
            return result;
        }

        remove(command, commandValue) {
            var obj = su.commands[command],
                args = lang.array(arguments).get(),
                method = obj && obj.remove;
            if (method) {
                args.unshift(this.composer);
                return method.apply(obj, args);
            }
        }

        // /**
        //  * Check whether the current command is active
        //  * If the caret is within a bold text, then calling this with command "bold" should return true
        //  *
        //  * @param {String} command The command string which to check (eg. "bold", "italic", "insertUnorderedList")
        //  * @param {String} [commandValue] The command value parameter (eg. for "insertImage" the image src)
        //  * @return {Boolean} Whether the command is active
        //  * @example
        //  *    var isCurrentSelectionBold = commands.state("bold");
        //  */
        // state(command, commandValue) {
        //     var obj = sulag.commands[command],
        //         args = lang.array(arguments).get(),
        //         method = obj && obj.state;
        //     if (method) {
        //         args.unshift(this.composer);
        //         return method.apply(obj, args);
        //     } else {
        //         try {
        //             // try/catch for buggy firefox
        //             return this.doc.queryCommandState(command);
        //         } catch (e) {
        //             return false;
        //         }
        //     }
        // }
        // /**
        //  * 如果命令具有stateValue解析函数，则获取命令状态解析值
        //  * Get command state parsed value if command has stateValue parsing function
        //  */
        // stateValue(command) {
        //     var obj = su.commands[command],
        //         args = lang.array(arguments).get(),
        //         method = obj && obj.stateValue;
        //     if (method) {
        //         args.unshift(this.composer);
        //         return method.apply(obj, args);
        //     } else {
        //         return false;
        //     }
        // }
    }
}