var NVC = (function () {
    "use strict";

    var nvc = function () {}, proto = nvc.prototype;

    nvc.extend = function (name, func) {
        nvc[name] = func;
    };

    nvc.layer = function (name) {

        if (!('Model' in proto)) {
            proto.Model = {};
        }

        if (!(name in proto.Model)) {

            // perhaps i may not want to use prototype here
            proto.Model[name] = {};
        }

        // may want to have an extender here
        return proto.Model[name];
    };

    var View = function (name, func) {
        nvc.layer(name).view = (function () {
            return func();
        }());
    },

    Controller = function (name, func) {
        nvc.layer(name).controller = (function () {
            console.log('controller',this);
            // can do return for this call
            func.call(proto, proto.Model[name].view, proto.Model[name].model);
            //func(proto.Model[name].view, proto.Model[name].view);
        }());

        //var subConroller = nvc.layer(name).controller.prototype = {
            //controllManger : function () { return 'control this';}
        //};
    },

    Model = function (name, func) {
        var subModel = function ( ) {};
        subModel.prototype = {
            origin : function(model) {this.origin = model; },
            reset : function () {},
            update : function (key,value) {
                this[key] = value;
            }
        };
        // lets see i can do without the new
        subModel = new subModel();
        if (!('model' in nvc.layer(name))) {
            nvc.layer(name).model = subModel; // !!! << this needs to be a function wrapped in new?

        }
        if (func()) {
            [].push.call(proto.Model[name].model, (function () {
                    subModel.origin(func());
                    return (func());
                }())
            );


        }



    },

    Router = function (name, func) {
        console.log('name',name,'func',func);
    };


    nvc.extend('model', Model);
    nvc.extend('view', View);
    nvc.extend('execute', Controller);
    nvc.extend('router', Router);

    return nvc;
}());

(function($, window){
    "use strict";

    $(document).ready(function(){

        NVC.model('click', function() {
            console.log('this',this);

            return {
                data : {
                    title : 'cool',
                    link  : 'http://i.imgur.com/r5i8mbc.jpg',
                    width : '200',
                    height : '200'
                }
            };
        });

        NVC.view('click', function () {
            return {
                el : $('#click'),
                target : $('#images'),
                template : function (data) {
                    return _.template('<h5><%= title %></h5>' +
                           '<img src="<%= link %>" width="<%= width%>" ' +
                           'height="<%= height %>" />', data.data);
                }
            };
        });

        NVC.execute('click', function (view, model) {
            console.log('this!!',this,view);


            view.el.on('click', function () {
                view.target.append(view.template(model[0]));
                console.log('this', this,'view',view,'layer',model);
            });

        });

        NVC.model('text', function () {
            //return {};
        });

        NVC.view('text', function () {
            return {
                el: $('#text'),
                target: $('#text > input:first-child'),
                submit: $('#text > input:last-child'),
                template: function(data) {
                    console.log('data',data);
                    return _.template('<p>Model Update Value : <%= value %></p>',data);
                }
            };
        });

        NVC.execute('text', function (view, model) {
           view.target.on('focus', function() {
              view.target.val('');
           });
        });

        NVC.execute('text', function (view, model) {
            view.submit.on('click', function () {
                // crude update
                //model.value = view.target.val();

                // new update
                model.update('value',view.target.val());
                console.log('modal',model);
                view.el.append(view.template(model));
                console.log('val',model);
            });
        });

        NVC.router('text', function (view, model) {

        });



      window.nNVC = new NVC();

    });

}(jQuery, window));
