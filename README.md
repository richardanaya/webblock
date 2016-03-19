# WebBlock.js

Create expressive and powerful web components with React

## Simple Web Component Definition
```jsx
WebBlock({
  tag: "my-greeting",
  render: function(){
    return <div>Hello World!</div>
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
    return <div>Hello {this.name}</div>
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
    return <div>Hello {this.name.first}</div>
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
    return <div>Hello {this.name[0]}</div>
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
    if(!this.name) return <div>Hello World!</div>
    return <div>Hello {this.name.first}</div>
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
<script>
  document.getElementById("greet").name = {first:"John",last:"Smith"};
</script>
```

##Access to Web Component Lifecycle
```jsx
WebBlock({
  tag: "my-greeting",
  render: function(){
    return <div>Hello World!</div>
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

##All the Expressiveness of JSX
```jsx
WebBlock({
  tag: "my-greeting",
  render: function(){
    var children = this.names.map(function(x){
      return <div>{x}</div>
    })
    return <div>Hello Everyone!:{children}</div>
  },
  attributes: {
    names: Array
  }
});

```
```html
<my-greeting names='["John","Justin","Jacob"]'/>
```

##Useful Helpers
Easily add the original content to your new rendered content
```jsx
WebBlock({
  tag: "my-greeting",
  render: function(){
    return <div>Hello <span ref={(x)=>this.bindContent(x)}></span>!</div>
  }
});
```
```html
<my-greeting>John</my-greeting>
```
> Note: You can always access the origin dom children at **this.children**

Pass along properties from one web component to another

```jsx
WebBlock({
  tag: "my-greeting",
  render: function(){
    return <div>Hello {this.name}</div>
  },
  attributes: {
    name: String
  }
});
WebBlock({
  tag: "my-greeting-list",
  render: function(){
    var children = this.names.map(function(x){
      return <my-greeting ref={(ref)=>this.bindProperty(ref,"name",x)}/>
    })
    return <div>{children}</div>
  },
  attributes: {
    names: Array
  }
});
```
```html
<my-greeting-list names='["John","James","Justin"]'></my-greeting-list>
```

##Todo
```jsx
WebBlock({
  tag: 'todo-item',
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


