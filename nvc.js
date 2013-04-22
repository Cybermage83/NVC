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
            func.call(proto.Model[name].controller, proto.Model[name].view, proto.Model[name].model);
            //func(proto.Model[name].view, proto.Model[name].view);
        }());
    },

    Model = function (name, func) {
        if (!('model' in nvc.layer(name))) {
            nvc.layer(name).model = {};
        }

        [].push.call(proto.Model[name].model, (function () {
                return func();
            }())
        );


    };

    nvc.extend('model', Model);
    nvc.extend('view', View);
    nvc.extend('execute', Controller);

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
                    console.log('data',data.data);


                    return _.template('<h5><%= title %></h5>' +
                           '<img src="<%= link %>" width="<%= width%>" ' +
                           'height="<%= height %>" />', data.data);
                }
            };
        });

        NVC.execute('click', function (view, model) {
            console.log('this',this,view);


            view.el.on('click', function () {
                view.target.append(view.template(model[0]));
                console.log('this', this,'view',view,'layer',model[0]);
            });

        });

      window.nNVC = new NVC();

    });

}(jQuery, window));
