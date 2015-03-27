;
(function ($$) {
  'use strict';
  var DEBUG;

  var allChildren = [];
  var idToLNode = {};
  var layout = new CoSELayout();
  function CoSELayout2(options) {
    layoutOptionsPack = $$.util.extend({}, layoutOptionsPack, options);
  }

  CoSELayout2.prototype.run = function () {
    allChildren = [];
    idToLNode = {};
    layout = new CoSELayout();
    //var options = this.options;
    var eles = layoutOptionsPack.eles; // elements to consider in the layout
//    var layout = this;

    // cy is automatically populated for us in the constructor
    var cy = layoutOptionsPack.cy; // jshint ignore:line


    cy.trigger('layoutstart');

    //var gm = this.getGraphManager();

    var gm = layout.newGraphManager();
    var root = gm.addRoot();
    //var root = [];
    var orphans = [];
    var nodes = cy.nodes();
    var edges = cy.edges();

    for (var i = 0; i < nodes.length; i++) {
      var theNode = nodes[i];
      //var theId = theNode.data("id");
      var p_id = theNode.data("parent");
      if (p_id != null) {
        if (allChildren[p_id] == null) {
          allChildren[p_id] = [];
        }
        allChildren[p_id].push(theNode);
      }
      else {
        orphans.push(theNode);
      }
    }

    //add nodes to the graph manager in correct order
    this.processChildrenList(root, orphans);

    for (var i = 0; i < edges.length; i++) {
      var edge = edges[i];
      var sourceNode = idToLNode[edge.data("source")];
      var targetNode = idToLNode[edge.data("target")];
      var e1 = gm.add(layout.newEdge(), sourceNode, targetNode);

      var e_id = edge.data("source") + edge.data("target");
      var s = edge.data("source");
      var t = edge.data("target");
      var line = "LEdge " + e_id + " = gm.add(layout.newEdge(new String(\"asd\")), " + s + ", " + t + ");";
      console.log(line);
    }

    layout.runLayout();

//    this.graphManager.printTopology();

    cy.nodes().positions(function (i, ele) {
      var theId = cy.nodes()[i].data('id');
      var lNode = idToLNode[theId];
      console.log(theId + "\t" + lNode.getRect().getX() + "\t" + lNode.getRect().getY());
      return {
        x: lNode.getRect().getCenterX(),
        y: lNode.getRect().getCenterY()
      };
    });

    /*for(var i = 0; i < eles.nodes().length; i++){
     nodes[i].data.width = lNode.getRect().width;
     nodes[i].data.height = lNode.getRect().height;
     }*/

    if (layoutOptionsPack.fit)
      layoutOptionsPack.cy.fit(layoutOptionsPack.padding);

    //trigger layoutready when each node has had its position set at least once
    cy.one('layoutready', layoutOptionsPack.ready);
    cy.trigger('layoutready');

    // trigger layoutstop when the layout stops (e.g. finishes)
    cy.one('layoutstop', layoutOptionsPack.stop);
    cy.trigger('layoutstop');

    return this; // chaining
  };

  /**
   * @brief : called on continuous layouts to stop them before they finish
   */
  CoSELayout2.prototype.stop = function () {
    this.stopped = true;

    return this; // chaining
  };


  CoSELayout2.prototype.processChildrenList = function (parent, children) {
    var size = children.length;
    for (var i = 0; i < size; i++) {
      var theChild = children[i];
      cy.nodes().length;
//      console.log(theChild.data("id"));
      var children_of_children = allChildren[theChild.data("id")];

//      console.log(theChild.data("id"));

      var theNode;
//      console.log(theChild.data("width") + "\t" + theChild.data("height"));
      if (theChild._private.data.sbgnbbox.w !== null
              && theChild._private.data.sbgnbbox.h !== null) {
        theNode = parent.add(new CoSENode(layout.graphManager,
                new PointD(theChild._private.data.sbgnbbox.x, theChild._private.data.sbgnbbox.y),
                new DimensionD(parseFloat(theChild._private.data.sbgnbbox.w),
                        parseFloat(theChild._private.data.sbgnbbox.h))));

//        console.log("width " + theChild._private.data.sbgnbbox.w 
//                + " height" + theChild._private.data.sbgnbbox.h
//                + " x " + theChild._private.data.sbgnbbox.x 
//                + " y " + theChild._private.data.sbgnbbox.y
//                + " parentid " + theChild.data("parent")
//                + " id " + theChild.data("id"));
        var p = theChild.data("parent");
        if (p == null) {
          p = "g1";
        }
        else {
          p = p + "_graph";
        }
        var line = "LNode " + theChild.data("id") + " = "
                + p + ".add(new CoSENode(gm, new Point("
                + theChild._private.data.sbgnbbox.x + ", "
                + theChild._private.data.sbgnbbox.y + "), new Dimension("
                + theChild._private.data.sbgnbbox.w + ", "
                + theChild._private.data.sbgnbbox.h + "), null));"
        console.log(line);

      }
      else {
        theNode = parent.add(new CoSENode(this.graphManager));
      }
      idToLNode[theChild.data("id")] = theNode;
      if (children_of_children != null && children_of_children.length > 0) {
        var theNewGraph;
        theNewGraph = layout.getGraphManager().add(layout.newGraph(), theNode);
        this.processChildrenList(theNewGraph, children_of_children);

        var g_id = theChild.data("id") + "_graph";
        var line = "LGraph " + g_id + " = gm.add(layout.newGraph(\"G2\")," + theChild.data("id") + ");";
        console.log(line);
      }
    }
  };
  // register the layout
  $$('layout', 'cose', CoSELayout2);

})(cytoscape);


