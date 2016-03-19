QUnit.test( "Test simple attribute", function( assert ) {
  WebBlock({
    tag: "test-0",
    render: function(){
      return React.createElement("div",null, null)
    },
    attributes: {
      name: String
    }
  });
  var el = document.createElement("test-0")
  assert.ok(el.name===null);
});

QUnit.test( "Test complex definition", function( assert ) {
  WebBlock({
    tag: "test-1",
    render: function(){
      return React.createElement("div",null, null)
    },
    attributes: {
      name: {
        type: String
      }
    }
  });
  var el = document.createElement("test-1")
  assert.ok(el.name===null);
});

QUnit.test( "Test defaultValue", function( assert ) {
  WebBlock({
    tag: "test-2",
    render: function(){
      return React.createElement("div",null, null)
    },
    attributes: {
      name: {
        type: String,
        defaultValue: "foo"
      }
    }
  });
  var el = document.createElement("test-2")
  assert.ok(el.name==="foo");
});

QUnit.test( "Test Number type", function( assert ) {
  WebBlock({
    tag: "test-3",
    render: function(){
      return React.createElement("div",null, null)
    },
    attributes: {
      n: Number
    }
  });
  var el = document.createElement("test-3")
  assert.ok(el.n===null);
  el.setAttribute("n","42")
  assert.ok(el.n===42);
  el.setAttribute("n","0")
  assert.ok(el.n===0);
});

QUnit.test( "Test Boolean type", function( assert ) {
  WebBlock({
    tag: "test-4",
    render: function(){
      return React.createElement("div",null, null)
    },
    attributes: {
      n: Boolean
    }
  });
  var el = document.createElement("test-4")
  assert.ok(el.n===null);
  el.setAttribute("n","true")
  assert.ok(el.n===true);
  el.setAttribute("n","false")
  assert.ok(el.n===false);
});

QUnit.test( "Test converter type", function( assert ) {
  WebBlock({
    tag: "test-5",
    render: function(){
      return React.createElement("div",null, null)
    },
    attributes: {
      n: {
        converter: function(val){
          return val.split(":");
        },
        defaultValue: []
      }
    }
  });
  var el = document.createElement("test-5")
  assert.ok(Array.isArray(el.n));
  assert.ok(el.n.length===0);
  el.setAttribute("n","1:2")
  assert.ok(Array.isArray(el.n));
  assert.ok(el.n[0]==="1");
  assert.ok(el.n[1]==="2");
});

QUnit.test( "Test minimal converter type", function( assert ) {
  WebBlock({
    tag: "test-6",
    render: function(){
      return React.createElement("div",null, null)
    },
    attributes: {
        n : function(val){
          if(val==null){
            return [];
          }
          return val.split(":");
        }
      }
  });
  var el = document.createElement("test-6")
  assert.ok(Array.isArray(el.n));
  assert.ok(el.n.length===0);
  el.setAttribute("n","1:2")
  assert.ok(Array.isArray(el.n));
  assert.ok(el.n[0]==="1");
  assert.ok(el.n[1]==="2");
});

QUnit.test( "Can add function", function( assert ) {
  WebBlock({
    tag: "test-7",
    render: function(){
      return React.createElement("div",null, null)
    },
    doSomething: function(){}
  });
  var el = document.createElement("test-7")
  assert.ok(el.doSomething != null);
});
