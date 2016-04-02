# WebBlock.js

Create expressive and powerful web components with virtual dom

##Why should I look this library?

[Web components](https://css-tricks.com/modular-future-web-components/) are a very powerful way to modularize your UI in a way that is standards compliant and familiar to people who know HTML. The problem is, the leading library for making web components - Polymer JS:

* Has a steep learning curve
* Lacks concise ways to write expressions
* Tries to re-implement it's own way of "how do I update my dom nodes quickly" (virtual dom) when other more popular and suitable ways exist

This library allows you to get started with web components quickly and reuse popular virtual dom technologies like React.

## Simple Web Component Definition
By default you can use string or HTMLElement. Look down below for how to use your virtual dom technology of choice.
```jsx
WebBlock({
  tag: "my-greeting",
  render: function(){
    return "<div>Hello World!</div>";
  }
});
```
or
```jsx
WebBlock({
  tag: "my-greeting",
  render: function(){
    var el = document.createElement("div")
    el.innerHTML = "Hello World!"
    return el;
  }
});
```
```html
<my-greeting/>
```
## Attributes
Define attributes that give your web component data from outside world
```jsx
WebBlock({
  tag: "my-greeting",
  render: function(){
    return "<div>Hello "+this.name+"</div>";
  },
  attributes: {
    name: String
  }
});

```
```html
<my-greeting name="John"/>
```

## Built-In Attribute Converters
WebBlock supports complex types for your attributes
```jsx
WebBlock({
  tag: "my-greeting",
  render: function(){
    return "<div>Hello "+this.name.first+"</div>";
  },
  attributes: {
    name: Object
  }
});

```
```html
<my-greeting name='{"first":"John", "last":"Smith"}'></my-greeting>
```

## Custom Attribute Converters
Create your own converter to use whatever format you like
```jsx
WebBlock({
  tag: "my-greeting",
  render: function(){
    return "<div>Hello "+this.name[0]+"</div>";
  },
  attributes: {
    name: function(val){
      return val.split(":");
    }
  }
});

```
```html
<my-greeting name='John:Smith'/>
```

##Typed Attribute Property Access
Attribute string conversion, while useful, can be very slow. For every attribute you expose, a corresponding property is exposed you can pass along typed data through:
```jsx
WebBlock({
  tag: "my-greeting",
  render: function(){
    if(!this.name) return "<div>Hello World!</div>"
    return "<div>Hello "+this.name.first+"</div>";
  },
  attributes: {
    name: function(val){
      return val.split(":");
    }
  }
});

```
```html
<my-greeting id="greet"/>
```
```javascript
document.getElementById("greet").name = {first:"John",last:"Smith"};
```

##Observe changes
Observe changes to the attributes properties using observe() and unobserve()
```jsx
WebBlock({
  tag: "my-greeting",
  render: function(){
    return "<div>Hello "+this.name+"</div>";
  },
  attributes: {
    name: String
  }
});

```
```html
<my-greeting id="greet"/>
```
```javascript
var element = document.getElementById("greet");
var watcher = function(value, oldValue, name){
  console.log(name+" changed from" + oldValue+ " to " + newValue);
};
element.observe("name",watcher)
element.name = "John";
element.unobserve("name",watcher);
```

##Access to Web Component Lifecycle
```jsx
WebBlock({
  tag: "my-greeting",
  render: function(){
    return "<div>Hello World!</div>"
  },
  createdCallback: function(){
    console.log("Element instantiated")
  },
  detachedCallback: function(){
    console.log("Element attached to DOM")
  },
  attachedCallback: function(){
    console.log("Element detached to DOM")
  },
  attributeChangedCallback: function(name,oldVal,newVal){
    console.log(name+" changed from "+oldVal+" to "+newVal)
  }
});

```
```html
<my-greeting/>
```

## ShadowDOM and Styling
By default your component exists in ShadowDOM, and is immune to css outside your component. You can easily define your components internal css:
```jsx
WebBlock({
  tag: "my-greeting",
  style: ".greeting{ color: green}"
  render: function(){
    return '<div className="greeting">Hello World!</div>'
  }
});
```
Alternatively you can reference css urls that will be imported within your component:
```jsx
WebBlock({
  tag: "my-greeting",
  style: ["greeting.css"]
  render: function(){
    return '<div className="greeting">Hello World!</div>'
  }
});
```
```html
<my-greeting/>
<div class="greeting">I won't be green because i'm not in the web component</div>
```
##Access the original content of the Web Component
Some people use the inside of a web component for data or configuration, you have access to this to use however you want once a web component is resolved:
```jsx
WebBlock({
  tag: "my-greeting",
  style: ".name { color: blue}",
  render: function(){
    var el = document.createElement("div")
    el.className = "name"
    el.innerHTML = "Hello "+this.content[0].textContent
    return el;
  }
});
```
```html
<my-greeting>Sam</my-greeting>
```
##Mixin support
```jsx
var ActionMixin = {
  action: function(type){
    var event = document.createEvent('Event');
    event.initEvent('action's, true, true);
    event.details = type;
    this.dispatchEvent(event);
  }
}

WebBlock({
  tag: 'my-greeting',
  mixins: [ActionMixin],
  render: function () {
    var _this = this;
    var el = document.createElement("div");
    el.innerHTML = "<button>Send Action</button>"
    el.querySelector("button").addEventListener("click",function(){
      _this.action("boom!")
    })
    return el;
  }
});
document.addEventListener("action",function(e){
  console.log(e);
})
```
```html
<my-greeting/>
```
#Choose Your Own Virtual Dom
By default web component uses no virtual dom. But you can choose between React and virtual-dom enabled web components.
##All the power of JSX
We can return JSX as our render and WebBlock will neatly merge it into our virtual dom. Notice how there are no props, instead, you can simply just build your JSX using the web component's properties itself. So easy!

If you have child web components. Use JSX's ref ( https://facebook.github.io/react/docs/more-about-refs.html ) to get access to the node when it's mounted. This is very useful for storing references to inputs and accessing the direct properties/functions of our child web components.

```jsx
var React = require("react");
var ReactDOM = require("react-dom");
WebBlock({
  tag: "my-greeting",
  virtualDom: WebBlock.React(React,ReactDOM),
  render: function(){
    return <div>Hello {this.name.first}</div>
  },
  attributes: {
    name: Object
  }
});

WebBlock({
  tag: "my-greeting-list",
  virtualDom: WebBlock.React(React,ReactDOM),
  render: function(){
    debugger;
    if(this.names==undefined)return <div></div>
    var children = this.names.map(function(x){
      function setName(ref){
        //set the property directly on the dom node
        ref.name = x;
      }
      return <my-greeting ref={setName}></my-greeting>
    })
    return <div>{children}</div>
  },
  attributes: {
    names: Array
  }
});

```
```html
<my-greeting-list names='[{"first":"John","last":"Smith"},{"first":"Justin","last":"Smith"}]'/>
```
##All the power of virtual-dom
This is an extremely minimalistic virtual-dom project.
```jsx
var vdom = require("virtual-dom");
WebBlock({
  tag: "my-greeting",
  virtualDom: WebBlock.VirtualDom(vdom),
  style: ".name { color: blue}",
  render: function(){
    return vdom.h('div',{className:"name"},["Hello "+this.name+"!"]);
  },
  attributes: {
    name:String
  }
});
```
```html
<my-greeting names="Sam"/>
```

#All the power of Polymer
Polymer has a great collection of web components to use, by default they use what is called "shady dom" which is not compatible with ShadowDOM. To force polymer to use ShadowDOM (which will one day become the default!), use this block of code before Polymer is loaded on your page:

```html
<script>
    /* this script must run before Polymer is imported */
    window.Polymer = {
      dom: 'shadow',
      lazyRegister: true
    };
</script>
```

Look for new components at https://customelements.io/

##Getting started with polymer

```bash
npm install -g bower
bower install webblock
bower install paper-button
```

```html
<script>
    /* this script must run before Polymer is imported */
    window.Polymer = {
      dom: 'shadow',
      lazyRegister: true
    };
</script>
<script src="bower_components/webcomponentsjs/webcomponents.js"></script>
<link rel="import" href="bower_components/font-roboto/roboto.html">
<link rel="import" href="bower_components/paper-button/paper-button.html">
<link rel="import" href="bower_components/webblock/webblock.html">
<style>
body {
  font-family: roboto;
}
</style>
<script>
WebBlock({
  tag: "hello-world",
  render: function(){
    return "<paper-styles><paper-button raised>Hello World</paper-button>"
  }
});
</script>
<hello-world></hello-world>
```

#Quickstart

```html
<script src="https://rawgit.com/richardanaya/webblock/master/lib/webcomponents.min.js"></script>
<link rel="import" href="https://rawgit.com/richardanaya/webblock/master/webblock.html">
<script>
WebBlock({
  tag: "hello-world",
  render: function(){
    return "Hello!"
  }
});
</script>
<hello-world/>
```

#Todo
Let's look at how we'd make todo
```jsx
WebBlock({
  tag: 'todo-item',
  virtualDom: WebBlock.React(React,ReactDOM),
  render: function () {
    var divStyle = {};
    if (this.complete) {
      divStyle.textDecoration = 'line-through';
    }
    return <div style={divStyle}>
          <input type="checkbox"
            ref={(x) => this.checkBox = x}
            checked={this.complete}
            onChange={(x) => this.onCheckChanged()} />
          {this.task}
    </div>;
  },
  onCheckChanged() {
    this.complete = this.checkBox.checked;
  },
  attributes: {
    task: String,
    complete: {
      type: Boolean,
      defaultValue: false
    }
  }
});

WebBlock({
  tag: 'todo-list',
  virtualDom: WebBlock.React(React,ReactDOM),
  render: function () {
    var children = this.tasks.map(function (x) {
      return <todo-item task={x} />;
    });
    return <div>TODO LIST{children}</div>;
  },
  attributes: {
    tasks:{
      type:Array,
      defaultValue: []
    }
  }
});
```
```html
<todo-list tasks='["Throw Out Trash","Write Code","Cook Dinner"]'/>
```
[Checkout a working example on CodePen](http://codepen.io/ranaya/pen/WwpNxx?editors=1010)

#Import HTML
If you need to import other html simply:
```javascript
WebBlock.import(['http://www.test.com/componentA.html,http://www.test.com/componentB.html'],function(){
  console.log("loaded all components");
}, function(err){
  console.log("there was an error");
})
```

#Using with WebPack
WebBlock can be used totally with HTMLImports, but many people use a webpack work flow. It's very easy to integrate in, check out this full example:
http://www.webpackbin.com/N1iTaJ1Cl

#Flux/Redux
Let's look how we can use popular unidirection data architecture with web components made with web block. Take a look at this example that uses redux:
http://www.webpackbin.com/E1D11e1Ce
