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
        this.currentIndex = 0;
        this.currentTarget = this.collection[0];

        /**
         * Create target id's for each section
         */
        this.currentTarget.style.display = "block"
        for (var idx = 1;idx < this.collection.length; idx++) {
            this.collection[idx].style.display = "none";
        }

        /**
         * Create an <a><span> tag combo with given set of attributes
         * @param attributes - Object name/value pairs of attributes
         * @param classes - String of classnames
         * @param tagText - String text node for anchor tag
         */
        function createStepItem(attributes, classes, tagText, index) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            var span = document.createElement('span');
            for (var attribute in attributes) {
                a.setAttribute(attribute, attributes[attribute]);
            }
            a.className = classes;
            !tagText || a.appendChild(document.createTextNode(tagText));
            span.appendChild(document.createTextNode(index));
            a.appendChild(span);
            li.appendChild(a);
            return li;
        }
         
        /**
         * Create an <li><a> tag combo with given set of attributes
         * @param attributes - Object name/value pairs of attributes
         * @param classes - String of classnames
         * @param tagText - String text node for anchor tag
         */
        function createListItem(attributes, classes, tagText) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            for (var attribute in attributes) {
                a.setAttribute(attribute, attributes[attribute]);
            }
            a.className = classes;
            !tagText || a.appendChild(document.createTextNode(tagText));
            li.appendChild(a);
            return li;
        }

        /**
         * Now get the links, and handle the click :target handling
         */
        var $this = this;
        var elements = Array.prototype.forEach.call(this.collection, function (viewElement, index, arr) {
            var nav = document.createElement('ul');
            nav.className = 'jvp-nav';
            for (var i=0;i<$this.collection.length;i++) {
                var stepName = $this.collection[i].getAttribute('jvp-nav-name');
                var stepState = (i < index) ? 'completed-step' : (index === i) ? 'active-step' : '';
                var nextStep = createStepItem({'jvp-step': (i), 'href': '#', 'jvp-active': (i === index)}, "jvp-nav-item " + stepState, stepName, i+1);
                nav.appendChild(nextStep);
            }

            var viewLinks = document.createElement('ul');
            viewLinks.className = 'jvp-links';
            var prev = {};
            if (index > 0) {
                prev = createListItem({'jvp-button': 'prev'}, "jvp-link jvp-prev");
                viewLinks.appendChild(prev);
            }

            var next = {};
            if (index < arr.length - 1) {
                next = createListItem({'jvp-button': 'next'}, "jvp-link jvp-next");
                viewLinks.appendChild(next);
            }

            viewElement.appendChild(viewLinks);
            viewElement.insertBefore(nav, viewElement.firstChild);
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
        this.currentTarget.style.display = "none";
        this.currentTarget.removeAttribute("jvp-active");
        this.currentIndex = +index;
        this.currentTarget = this.collection[index];
        this.currentTarget.setAttribute("jvp-active", "true");
        this.currentTarget.style.display = "block";
    };

    /**
     * Advance to the next view panel
     */
    JViewpoint.prototype.moveNext = function () {
        this.currentTarget.style.display = "none";
        if (this.currentTarget.nextElementSibling !== null) {
            this.moveTo(this.currentIndex+1);
        }
    };

    /**
     * Move to previous view panel
     */
    JViewpoint.prototype.movePrev = function () {
        this.currentTarget.style.display = "none";
        if (this.currentTarget.previousElementSibling !== null) {
            this.moveTo(this.currentIndex-1);
        }
    };

    return JViewpoint;
}))
