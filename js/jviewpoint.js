/**
 * Conditionally account for requirejs if available
 */
;
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        //define this file as a named AMD module
        define('jviewpoint', ['domReady!'], factory)
    } else {
        //use the global space and set this module there

        //emulate requirejs in a simplified way for getting modules
        global.require = function (name, deps, cb) {
            if (typeof name === 'string') {
                return global[name];
            }
        }
        global['jviewpoint'] = factory(global.document)
    }
}(this, function (domReady) {
    //module will just enclose the entire module in a local scoped variable which will be returned
    //for inclusion in the containing module
    function JViewpoint() {}

    JViewpoint.prototype.init = function (element, callback) {
        this.callback = callback;
        this.container = element;
        this.collection = element.children;
        this.currentIndex = 1;
        this.currentTarget = this.collection[1];

        /**
         * Now get the links, and handle the click :target handling
         */
        var $this = this;
        var elements = Array.prototype.forEach.call(this.collection, function (viewElement, index, arr) {
            viewElement.jviewpoint = $this;
            viewElement.onclick = function (event) {
                var task = event.target.getAttribute('jvp-button');
                switch (task) {
                case 'next':
                case 'finish':
                    this.jviewpoint.moveNext();
                    this.jviewpoint.callback(this.jviewpoint.currentIndex+1, this.jviewpoint.collection.length, this.jviewpoint.currentTarget);
                    break;
                case 'prev':
                    this.jviewpoint.movePrev();
                    this.jviewpoint.callback(this.jviewpoint.currentIndex+1, this.jviewpoint.collection.length, this.jviewpoint.currentTarget);
                    break;
                default:
                    var step = event.target.getAttribute('jvp-step');
                    if (step) {
                        this.jviewpoint.moveTo(step);
                        this.jviewpoint.callback(this.jviewpoint.currentIndex+1, this.jviewpoint.collection.length, this.jviewpoint.currentTarget);
                    }
                }
            }
        });
    };

    /**
     * Jump to specified view panel
     * @param index - int index of panel to jump to
     */
    JViewpoint.prototype.moveTo = function (index) {
        this.currentTarget.removeAttribute("jvp-active");
        this.currentIndex = +index;
        this.currentTarget = this.collection[index];
        this.currentTarget.setAttribute("jvp-active", "true");
        var id = this.currentTarget.getAttribute("id");
        //location.hash = "#" + id;
       //Finds y value of given object
function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    return [curtop];
    }
}
window.scroll(0, findPos(this.currentTarget));
    };

    /**
     * Advance to the next view panel
     */
    JViewpoint.prototype.moveNext = function () {
        if (this.currentTarget.nextElementSibling !== null) {
            this.moveTo(this.currentIndex+1);
        }
    };

    /**
     * Move to previous view panel
     */
    JViewpoint.prototype.movePrev = function () {
        if (this.currentTarget.previousElementSibling !== null) {
            this.moveTo(this.currentIndex-1);
        }
    };

    return JViewpoint;
}))
