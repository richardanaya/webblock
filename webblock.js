function WebBlock(data) {
  var isFunction = function (functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  };
  var attributes = data.attributes;
  var GenericComponent = function () {};
  GenericComponent.prototype = Object.create(HTMLElement.prototype);
  GenericComponent.prototype.createdCallback = function () {
    this.__is_attached__ = false;
    var _self = this;

    this.content = [];
    for (var j = 0; j < this.childNodes.length; j++) {
      this.content.push(this.childNodes[j]);
    }
    this.innerHTML = '';
    this.shadowRoot = this.createShadowRoot();

    this.__component__ = React.createClass({
      mixins: [React.addons.PureRenderMixin],
      render: function () {
        return data.render.call(_self, this);
      }
    });

    this.__props__ = {};
    this.__prop_observers__ = {};

    function createProperty(propName) {
      this.__prop_observers__[propName] = [];
      Object.defineProperty(this, propName, {
        set: function (x) {
          var oldValue = this.__props__[propName];
          this.__props__[propName] = x;
          this.__prop_observers__[propName].forEach(function(handler){
            handler(x,oldValue,propName)
          })
          this.__render__();
        },
        get: function () {
          return this.__props__[propName];
        }
      });
    }

    for (var i in attributes) {
      if ({}.hasOwnProperty.call(attributes, i)) {
        var def = attributes[i];
        var attrValue = this.getAttribute(i);
        if (typeof def === 'object' && attrValue === null && def.defaultValue !== undefined) {
          if(this[i]!=undefined){
            this.__props__[i] = this[i];
          }
          else {
            this.__props__[i] = def.defaultValue;
          }
        } else {
          if(this[i]!=undefined){
            this.__props__[i] = this[i];
          }
          else {
            this.__updateAttribute__(i, attrValue);
          }
        }
        createProperty.call(this, i);
      }
    }

    if (data.createdCallback) {
      data.createdCallback.apply(this, arguments);
    }
  };
  GenericComponent.prototype.observe = function (name,fn) {
    this.__prop_observers__[name].push(fn);
  }
  GenericComponent.prototype.unobserve = function (name,fn) {
    var index = this.__prop_observers__[name].indexOf(fn);
    this.__prop_observers__[name].splice(index, 1);
  }
  GenericComponent.prototype.bindContent = function (ref) {
    if (ref !== null) {
      ref.innerHTML = '';
      this.content.forEach(function (x) {
        ref.appendChild(x);
      });
    }
  };
  GenericComponent.prototype.bindProperty = function (ref, target, val) {
    if (ref !== null) {
      ref[target] = val;
    }
  };
  GenericComponent.prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
    if (attributes[attrName] === undefined) {
      return;
    }
    this.__updateAttribute__(attrName, newVal);
    this.__render__();
    if (this.__attributeChangedCallback__) {
      this.__attributeChangedCallback__.apply(this, arguments);
    }
  };
  GenericComponent.prototype.attachedCallback = function () {
    if (this.__is_attached__ === false) {
      this.__is_attached__ = true;
      this.__render__();
    }
    if (this.__attachedCallback__) {
      this.__attachedCallback__.apply(this, arguments);
    }
  };
  GenericComponent.prototype.detachedCallback = function () {
    if (this.__is_attached__ === true) {
      this.__is_attached__ = false;
      ReactDOM.unmountComponentAtNode(this.shadowRoot);
    }
    if (this.__detachedCallback__) {
      this.__detachedCallback__.apply(this, arguments);
    }
  };
  GenericComponent.prototype.__updateAttribute__ = function (attrName, value) {
    var def = attributes[attrName];

    if (typeof def === 'object') {
      if (def.type) {
        def = def.type;
      }
      if (def.converter) {
        def = def.converter;
      }
    }

    if (def === Object || def === Array) {
      this.__props__[attrName] = JSON.parse(value);
    } else if (def === Number) {
      this.__props__[attrName] = value === null ? value : parseFloat(value);
    } else if (def === Boolean) {
      this.__props__[attrName] = value === null ? value : value === 'true';
    } else if (def === String) {
      this.__props__[attrName] = value;
    } else if (isFunction(def)) {
      this.__props__[attrName] = def.call(this, value);
    } else {
      console.warn('Uhhh..we got passed a type we are not sure how to handle. Using as string.');
      this.__props__[attrName] = value;
    }
  };
  GenericComponent.prototype.__render__ = function () {
    if (this.__is_attached__ === false) {return;}
    var el = React.createElement(this.__component__, this.__props__);
    ReactDOM.render(el, this.shadowRoot);
  };

  for (var i in data) {
    if (i === 'attributeChangedCallback') {
      GenericComponent.prototype.__attributeChangedCallback__ = data[i];
      continue;
    }
    if (i === 'attachedCallback') {
      GenericComponent.prototype.__attachedCallback__ = data[i];
      continue;
    }
    if (i === 'detachedCallback') {
      GenericComponent.prototype.__detachedCallback__ = data[i];
      continue;
    }
    if (i !== 'attributes' && i !== 'tag' && i !== 'render' && i !== 'createdCallback') {
      GenericComponent.prototype[i] = data[i];
    }
  }
  document.registerElement(data.tag, GenericComponent);
  return GenericComponent;
}
