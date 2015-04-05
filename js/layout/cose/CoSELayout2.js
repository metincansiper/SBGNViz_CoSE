;
(function ($$) {
  'use strict';
  var DEBUG;

  var allChildren = [];
  var idToLNode = {};
  
  var defaults = {
    // Called on `layoutready`
    ready               : function() {},

    // Called on `layoutstop`
    stop                : function() {},

    // Number of iterations between consecutive screen positions update (0 -> only updated on the end)
    refresh             : 0,
    
    // Whether to fit the network view after when done
    fit                 : true, 

    // Padding on fit
    padding             : 5, 


    // Whether to enable incremental mode
    incremental           : false,
    
    // Whether to use the JS console to print debug messages
    debug               : false,

    // Node repulsion (non overlapping) multiplier
    nodeRepulsion       : 4500,
    
    // Node repulsion (overlapping) multiplier
    nodeOverlap         : 10,
    
    // Ideal edge (non nested) length
    idealEdgeLength     : 50,
    
    // Divisor to compute edge forces
    edgeElasticity      : 0.45,
    
    // Nesting factor (multiplier) to compute ideal edge length for nested edges
    nestingFactor       : 0.1,
    
    // Gravity force (constant)
    gravity             : 0.4, 
    
    // Maximum number of iterations to perform
    numIter             : 2500,
    
    // Initial temperature (maximum node displacement)
    initialTemp         : 200,
    
    // Cooling factor (how the temperature is reduced between consecutive iterations
    coolingFactor       : 0.95, 
    
    // Lower temperature threshold (below this point the layout will end)
    minTemp             : 1
  };
  
  var layout = new CoSELayout();
  function CoSELayout2(options) {
    
    this.options = $$.util.extend({}, defaults, options);
    FDLayoutConstants.getUserOptions(options);
    fillCoseLayoutOptionsPack();
  }

  CoSELayout2.prototype.run = function () {
    allChildren = [];
    idToLNode = {};
    layout = new CoSELayout();
    //var options = this.options;
    var eles = this.options.eles; // elements to consider in the layout
//    var layout = this;

    // cy is automatically populated for us in the constructor
    var cy = this.options.cy; // jshint ignore:line


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

    if (this.options.fit)
      this.options.cy.fit(this.options.padding);

      console.log(FDLayoutConstants.DEFAULT_EDGE_LENGTH);

    //trigger layoutready when each node has had its position set at least once
    cy.one('layoutready', this.options.ready);
    cy.trigger('layoutready');

    // trigger layoutstop when the layout stops (e.g. finishes)
    cy.one('layoutstop', this.options.stop);
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