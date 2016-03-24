function WebBlock(data) {
  var isFunction = function (functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  };
  var virtualDomClass = data.virtualDom||WebBlock.React;
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
    this.__virtualDom__ = new virtualDomClass(this);
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

    for (var i in this.__attributeDefinitions__) {
      if ({}.hasOwnProperty.call(this.__attributeDefinitions__, i)) {
        var def = this.__attributeDefinitions__[i];
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

    if (this.__createdCallback__) {
      this.__createdCallback__.apply(this, arguments);
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
    if (this.__attributeDefinitions__[attrName] === undefined) {
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
      this.__virtualDom__.detach();
    }
    if (this.__detachedCallback__) {
      this.__detachedCallback__.apply(this, arguments);
    }
  };
  GenericComponent.prototype.__updateAttribute__ = function (attrName, value) {
    var def = this.__attributeDefinitions__[attrName];

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
    this.__virtualDom__.render();
  };

  for (var i in data) {
    if (i === 'createdCallback') {
      GenericComponent.prototype.__createdCallback__ = data[i];
      continue;
    }
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
    if (i === 'style') {
      GenericComponent.prototype.__style__ = data[i];
      continue;
    }
    if (i === 'render') {
      GenericComponent.prototype.__componentRender__ = data[i];
      continue;
    }
    if (i === 'attributes') {
      GenericComponent.prototype.__attributeDefinitions__ = data[i];
      continue;
    }
    GenericComponent.prototype[i] = data[i];
  }
  document.registerElement(data.tag, GenericComponent);
  return GenericComponent;
}

WebBlock.React = function(webComponent){
  this.webComponent = webComponent;
  this.reactComponent = React.createClass({
    componentDidMount: function(){
      var node = ReactDOM.findDOMNode(this);
      var existingStyles = node.parentNode.querySelectorAll('style');
      for(var l = 0; l<existingStyles.length;l++){
        existingStyles[l].remove();
      }
      //create style
      if(typeof webComponent.__style__ == "string"){
        var el = document.createElement('style');
        el.innerHTML = webComponent.__style__;
        node.parentNode.appendChild(el);
      }
      else if(Array.isArray(webComponent.__style__)){
        for(var k in webComponent.__style__){
          var cssURL = webComponent.__style__[k];
          var el = document.createElement('style');
          el.innerHTML = '@import "' + cssURL + '"';
          node.parentNode.appendChild(el);
        }
      }
    },
    mixins: [React.addons.PureRenderMixin],
    render: function () {
      return webComponent.__componentRender__.call(webComponent, this);
    }
  });
}
WebBlock.React.prototype.render = function(){
  var el = React.createElement(this.reactComponent, this.webComponent.__props__);
  ReactDOM.render(el, this.webComponent.shadowRoot);
}
WebBlock.React.prototype.detach = function(){
  ReactDOM.unmountComponentAtNode(this.webComponent.shadowRoot);
}
