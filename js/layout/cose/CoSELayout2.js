;
(function ($$) {
  'use strict';
  var DEBUG;

  var allChildren = [];
  var idToLNode = {};
  var layout = new CoSELayout();
  function CoSELayout2(options) {
    fillCoseLayoutOptionsPack();
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

    var gm = layout.newGraphManager();
    var root = gm.addRoot();
    var orphans = [];
    var nodes = cy.nodes();
    var edges = cy.edges();

    for (var i = 0; i < nodes.length; i++) {
      var theNode = nodes[i];
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
    }

    layout.runLayout();

    cy.nodes().positions(function (i, ele) {
      var theId = cy.nodes()[i].data('id');
      var lNode = idToLNode[theId];
      console.log(theId + "\t" + lNode.getRect().getX() + "\t" + lNode.getRect().getY());
      return {
        x: lNode.getRect().getCenterX(),
        y: lNode.getRect().getCenterY()
      };
    });

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
      var children_of_children = allChildren[theChild.data("id")];
      var theNode;
      
      if (theChild._private.data.sbgnbbox.w !== null
              && theChild._private.data.sbgnbbox.h !== null) {
        theNode = parent.add(new CoSENode(layout.graphManager,
                new PointD(theChild._private.data.sbgnbbox.x, theChild._private.data.sbgnbbox.y),
                new DimensionD(parseFloat(theChild._private.data.sbgnbbox.w),
                        parseFloat(theChild._private.data.sbgnbbox.h))));
      }
      else {
        theNode = parent.add(new CoSENode(this.graphManager));
      }
      idToLNode[theChild.data("id")] = theNode;
      if (children_of_children != null && children_of_children.length > 0) {
        var theNewGraph;
        theNewGraph = layout.getGraphManager().add(layout.newGraph(), theNode);
        this.processChildrenList(theNewGraph, children_of_children);
      }
    }
  };
  // register the layout
  $$('layout', 'cose', CoSELayout2);

})(cytoscape);