var NVC = (function () {
    "use strict";

    var HS = function () {}, proto = HS.prototype;

    HS.extend = function (name, func) {
        HS[name] = func;
    };

    HS.modal = function (name) {

        if (!('domModal' in proto)) {
            proto.domModal = {};
        }

        if (!(name in proto.domModal)) {

            // perhaps i may not want to use prototype here
            proto.domModal[name] = {};
        }

        // may want to have an extender here
        return proto.domModal[name];
    };

    var domView = function (name, func) {
        HS.modal(name).view = (function () {
            return func();
        }());
    },

    domController = function (name, func) {
        HS.modal(name).controller = (function () {

            // can do return for this call
            func(proto.domModal[name].view);
        }());
    },

    domModal = function (name, func) {
        HS.modal(name).model = (function () {
            return func();
        }());
    };

    HS.extend('model', domModal);
    HS.extend('view', domView);
    HS.extend('execute', domController);

    return HS;
}());

(function($, window){
    "use strict";
    
    $(document).ready(function(){

        NVC.model('close', function(response) {

            // any json request here
            // have return states such as pending or error for controller to know
            return {
                name : 'Andrey',
                address : 'Earth',
                work : 'FOX'
            };
        });

        NVC.view('close', function () {
            return {
                el : '.close',
                config : {target:'.photo', next : '#next'},
                events : {
                    'click .news' : 'news'
                },
                template : function (el, config, data) {
                    console.log('contoller executed', el, config, data);
                }
            };
        });

        NVC.execute('close', function (view) {
            $(view.el).bind('click',function() {
                $(view.config.target).hide();
            });
        });

        NVC.execute('close', function (view) {
            $(view.config.next).bind('mouseover',function (e) {
                $(this).css('cursor','pointer');
            });
        });

        console.log('hugeSlider',NVC.prototype);
        window.z = new NVC();
        console.log('z',window.z);
    });

}(jQuery, window));
