// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
Zepto.extend({
  access: function (elems, fn, key, value, chainable, emptyGet, raw) {
    var i = 0,
        length = elems.length,
        bulk = key == null;

    // Sets many values
    if (Zepto.type(key) === "object") {
        chainable = true;
        for (i in key) {
            Zepto.access(elems, fn, i, key[i], true, emptyGet, raw);
        }

        // Sets one value
    } else if (value !== undefined) {
        chainable = true;

        if (!Zepto.isFunction(value)) {
            raw = true;
        }

        if (bulk) {
            // Bulk operations run against the entire set
            if (raw) {
                fn.call(elems, value);
                fn = null;                // ...except when executing function values
            } else {
                bulk = fn;
                fn = function (elem, key, value) {
                    return bulk.call(Zepto(elem), value);
                };
            }
        }

        if (fn) {
            for (; i < length; i++) {
                fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
            }
        }
    }

    return chainable ?
        elems :

    // Gets
    bulk ?
        fn.call(elems) :
        length ? fn(elems[0], key) : emptyGet;
  },



  // Get and set the style property on a DOM Node
  style: function (elem, name, value, extra) {
      // Don't set styles on text and comment nodes
      if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
          return;
      }

      // Make sure that we're working with the right name
      var ret, type, hooks,
          origName = Zepto.camelCase(name),
          style = elem.style;

      name = Zepto.cssProps[origName] || (Zepto.cssProps[origName] = vendorPropName(style, origName));

      // gets hook for the prefixed version
      // followed by the unprefixed version
      hooks = Zepto.cssHooks[name] || Zepto.cssHooks[origName];

      // Check if we're setting a value
      if (value !== undefined) {
          type = typeof value;

          // convert relative number strings (+= or -=) to relative numbers. #7345
          if (type === "string" && (ret = rrelNum.exec(value))) {
              value = (ret[1] + 1) * ret[2] + parseFloat(Zepto.css(elem, name));
              // Fixes bug #9237
              type = "number";
          }

          // Make sure that NaN and null values aren't set. See: #7116
          if (value == null || type === "number" && isNaN(value)) {
              return;
          }

          // If a number was passed in, add 'px' to the (except for certain CSS properties)
          if (type === "number" && !Zepto.cssNumber[origName]) {
              value += "px";
          }

          // Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
          // but it would mean to define eight (for every problematic property) identical functions
          if (!Zepto.support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
              style[name] = "inherit";
          }

          // If a hook was provided, use that value, otherwise just set the specified value
          if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
              style[name] = value;
          }

      } else {
          // If a hook was provided get the non-computed value from there
          if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
              return ret;
          }

          // Otherwise just get the value from the style object
          return style[name];
      }
  }

});

Zepto.fn.extend({
  css: function (name, value) {
      return Zepto.access(this, function (elem, name, value) {
          var styles, len,
              map = {},
              i = 0;

          if (Zepto.isArray(name)) {
              styles = getStyles(elem);
              len = name.length;

              for (; i < len; i++) {
                  map[name[i]] = Zepto.css(elem, name[i], false, styles);
              }

              return map;
          }

          return value !== undefined ?
              Zepto.style(elem, name, value) :
              Zepto.css(elem, name);
      }, name, value, arguments.length > 1);
  }
});




// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
Zepto.each({
    Height: "height",
    Width: "width"
}, function (name, type) {
    Zepto.each({
        padding: "inner" + name,
        content: type,
        "": "outer" + name
    }, function (defaultExtra, funcName) {
        // margin is only for outerHeight, outerWidth
        Zepto.fn[funcName] = function (margin, value) {
            var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
                extra = defaultExtra || (margin === true || value === true ? "margin" : "border");

            return Zepto.access(this, function (elem, type, value) {
                var doc;

                if (Zepto.isWindow(elem)) {
                    // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
                    // isn't a whole lot we can do. See pull request at this URL for discussion:
                    // https://github.com/Zepto/Zepto/pull/764
                    return elem.document.documentElement["client" + name];
                }

                // Get document width or height
                if (elem.nodeType === 9) {
                    doc = elem.documentElement;

                    // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
                    // whichever is greatest
                    return Math.max(
                        elem.body["scroll" + name], doc["scroll" + name],
                        elem.body["offset" + name], doc["offset" + name],
                        doc["client" + name]
                    );
                }

                return value === undefined ?
                // Get width or height on the element, requesting but not forcing parseFloat
                Zepto.css(elem, type, extra) :

                // Set width or height on the element
                Zepto.style(elem, type, value, extra);
            }, type, chainable ? margin : undefined, chainable, null);
        };
    });
});

(function ($, window, document, undefined) {
    "use strict";
    var plugin_name = "autocompletion",
        defaults = {
            caching: true,
            container: '<div class="autocompletion"></div>',
            item: '<p class="autocompletion-item"></p>',
            source: []
        };

    function Plugin(element, options) {
        this.options = $.extend({}, defaults, options);
        this.customize = this.options.customize || this.customize;
        this.fill = this.options.fill || this.fill;
        this.$container = $(this.options.container);
        this.$element = $(element);
        this._attr_value = "data-item-value";
        this._cache = {};
        this._class_current = "current";
        this._defaults = defaults;
        this._name = plugin_name;
        this.init();
    }
    Plugin.prototype = {
        init: function () {
            this.bind();
        },
        bind: function () {
            var that = this,
                item_selector = "[" + this._attr_value + "]";
            this.$element.on("blur", $.proxy(this.blur, this)).on("keyup", $.proxy(this.keyup, this));
            this.$container.on("mouseenter", function () {
                that.mousein = true;
            }).on("mouseleave", function () {
                that.mousein = false;
            }).on("mouseenter", item_selector, function (e) {
                that.$container.find("." + that._class_current).removeClass(that._class_current);
                $(e.currentTarget).addClass(that._class_current);
            }).on("click", item_selector, $.proxy(this.click, this));
        },
        blur: function () {
            // Hide only when cursor outside of the container.
            // This is to ensure that the browser did not hide container before the clue clicked.
            if (!this.mousein) {
                this.hide();
            }
        },
        keyup: function () {
            this.q = this.$element.val();
            this.q_lower = this.q.toLowerCase();
            if (!this.q) {
                return this.hide();
            }
            if (this.options.caching && this._cache[this.q_lower]) {
                // pass to render method directly
                this.render(this._cache[this.q_lower]);
            } else if ($.isFunction(this.options.source)) {
                // if it's a function, then run it and pass context
                this.options.source(this.q, $.proxy(this.suggest, this));
            } else {
                this.suggest(this.options.source);
            }
        },
        click: function (e) {
            e.stopPropagation();
            e.preventDefault();
            this.select();
        },
        suggest: function (items) {
            var that = this,
                filtered_items = $.grep(items, function (item) {
                    return item.toLowerCase().indexOf(that.q_lower) !== -1;
                });
            // cache if needed
            if (this.options.caching) {
                this._cache[this.q_lower] = filtered_items;
            }
            this.render(filtered_items);
        },
        render: function (items) {
            if (!items.length) {
                return this.hide();
            }
            var that = this,
                items_dom = $.map(items, function (item) {
                    return $(that.options.item).attr(that._attr_value, item).html(that.highlight(item))[0];
                }),
                position = this.$element.position();
            // render container body
            this.customize(this.$container.css({
                left: position.left + "px",
                top: position.top + this.$element.outerHeight() + "px"
            }).html(items_dom)[0]);
            this.$container.insertAfter(this.$element);
            this.show();
        },
        highlight: function (item) {
            var q = this.q.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
            return item.replace(new RegExp("(" + q + ")", "ig"), function ($1, match) {
                return "<strong>" + match + "</strong>";
            });
        },
        customize: function (clues) {
            return;
        },
        select: function () {
            var $el = this.$container.find("." + this._class_current),
                value = $.proxy(this.fill, $el[0], $el.attr(this._attr_value), $.proxy(this.hide, this))();
            if (value) {
                this.hide();
                this.$element.val().change();
            }
        },
        fill: function (value) {
            return value;
        },
        show: function () {
            if (!this.visible) {
                this.visible = true;
                this.$container.show();
            }
        },
        hide: function () {
            if (this.visible) {
                this.visible = false;
                this.$container.hide();
            }
        }
    };
    $.fn[plugin_name] = function (options) {
        return this.each(function () {
            /*
      if (!$.data(this, "plugin_" + plugin_name)) {
        $.data(this, "plugin_" + plugin_name, new Plugin(this, options));
      }
      */

            if (!this['instance'] + plugin_name) {
                this['instance'] = new Plugin(this, options);
            }
        });
    };
})(Zepto, window, document);




$('input.autocompletion').autocompletion({
    source: ['Mother', 'Father', 'Sister', 'Brother'] // Also it can be a function. See below.
});