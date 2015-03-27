/**
 * This class represents a node (l-level) for layout purposes. A node maintains
 * a list of its incident edges, which includes inter-graph edges. Every node
 * has an owner graph, except for the root node, which resides at the top of the
 * nesting hierarchy along with its child graph (the root graph).
 * gm, loc, size, vNode
 * gm, vNode, loc, size
 */

function LNode(gm, loc, size, vNode) {
  //Alternative constructor 1 : LNode(LGraphManager gm, Point loc, Dimension size, Object vNode)
//  if (size != null) {
//    var tmp = vNode;
//    vNode = size;
//    size = loc;
//    loc = tmp;
//  }

  if (size == null && vNode == null) {
    vNode = loc;
  }

  LGraphObject.call(this, vNode);

  //Alternative constructor 2 : LNode(Layout layout, Object vNode)
  if (gm.graphManager != null)
    gm = gm.graphManager;

  // -----------------------------------------------------------------------------
  // Section: Instance variables
  // -----------------------------------------------------------------------------
  /*
   * Owner graph manager of this node
   */
  this.graphManager = null;

  /**
   * Possibly null child graph of this node
   */
  this.child;

  /*
   * Owner graph of this node; cannot be null
   */
  this.owner;

  /*
   * List of edges incident with this node
   */
  this.edges;

  /*
   * Geometry of this node
   */
  this.rect;

  /*
   * List of clusters, this node belongs to.
   */
  this.clusters;

  /*
   * Estimated initial size (needed for compound node size estimation)
   */
  this.estimatedSize = Integer.MIN_VALUE;

  /*
   * Depth of this node in nesting hierarchy. Nodes in the root graph are of
   * depth 1, nodes in the child graph of a node in the graph are of depth 2,
   * etc.
   */
  this.inclusionTreeDepth = Integer.MAX_VALUE;

  // -----------------------------------------------------------------------------
  // Section: Constructors and initialization
  // -----------------------------------------------------------------------------
  //in java: super(vNode);
  this.vGraphObject = vNode;
  //in java: this.initialize();
  this.edges = [];
  this.clusters = [];
  //---------------------------
  this.graphManager = gm;

  if (size != null && loc != null)
    this.rect = new RectangleD(loc.x, loc.y, size.width, size.height);
  else
    this.rect = new RectangleD();

  /*this.addCluster = LNode.prototype.addCluster;
   this.belongsToCluster = LNode.prototype.belongsToCluster;
   this.calcEstimatedSize = LNode.prototype.calcEstimatedSize;
   this.getAllParents = LNode.prototype.getAllParents;
   this.getBottom = LNode.prototype.getBottom;
   this.getCenter = LNode.prototype.getCenter;
   this.getCenterX = LNode.prototype.getCenterX;
   this.getCenterY = LNode.prototype.getCenterY;
   this.getChild = LNode.prototype.getChild;
   this.getClusterID = LNode.prototype.getClusterID;
   this.getClusters = LNode.prototype.getClusters;
   this.getDiagonal = LNode.prototype.getDiagonal;
   this.getEdgeListToNode = LNode.prototype.getEdgeListToNode;
   this.getEdges = LNode.prototype.getEdges;
   this.getEdgesBetween = LNode.prototype.getEdgesBetween;
   this.getEstimatedSize = LNode.prototype.getEstimatedSize;
   this.getHalfTheDiagonal = LNode.prototype.getHalfTheDiagonal;
   this.getHeight = LNode.prototype.getHeight;
   this.getInclusionTreeDepth = LNode.prototype.getInclusionTreeDepth;
   this.getLeft = LNode.prototype.getLeft;
   this.getLocation = LNode.prototype.getLocation;
   this.getNeighborsList = LNode.prototype.getNeighborsList;
   this.getOwner = LNode.prototype.getOwner
   this.getParent = LNode.prototype.getParent;
   this.getRect = LNode.prototype.getRect;
   this.getRight = LNode.prototype.getRight;
   this.getSuccessors = LNode.prototype.getSuccessors;
   this.getTop = LNode.prototype.getTop;
   this.getWidth = LNode.prototype.getWidth;
   this.isNeighbor = LNode.prototype.isNeighbor;
   this.moveBy = LNode.prototype.moveBy;
   this.printTopology = LNode.prototype.printTopology;
   this.removeCluster = LNode.prototype.removeCluster;
   this.resetClusters = LNode.prototype.resetClusters;
   this.scatter = LNode.prototype.scatter;
   this.setCenter = LNode.prototype.setCenter;
   this.setChild = LNode.prototype.setChild;
   this.setHeight = LNode.prototype.setHeight;
   this.setLocation = LNode.prototype.setLocation;
   this.setOwner = LNode.prototype.setOwner;
   this.setRect = LNode.prototype.setRect;
   this.setWidth = LNode.prototype.setWidth;
   this.transform = LNode.prototype.transform;
   this.updateBounds = LNode.prototype.updateBounds;
   this.withChildren = LNode.prototype.withChildren;*/
}


LNode.prototype = Object.create(LGraphObject.prototype);
for (var prop in LGraphObject) {
  LNode[prop] = LGraphObject[prop];
}
// -----------------------------------------------------------------------------
// Section: Accessors
// -----------------------------------------------------------------------------
/**
 * This method returns the list of incident edges of this node.
 */
LNode.prototype.getEdges = function ()
{
  return this.edges;
};

/**
 * This method returns the child graph of this node, if any. Only compound
 * nodes will have child graphs.
 */
LNode.prototype.getChild = function ()
{
  return this.child;
};

/**
 * This method sets the child graph of this node. Only compound nodes will
 * have child graphs.
 */
LNode.prototype.setChild = function (child)
{
  if (child != null)
    if (!(child == null || child.getGraphManager() == this.graphManager))
      throw "Child has different graph mgr!";

  this.child = child;
};

/**
 * This method returns the owner graph of this node.
 */
LNode.prototype.getOwner = function ()
{
  if (this.owner != null) {
    if (!(this.owner == null || this.owner.getNodes().indexOf(this) > -1)) {
      throw "assert failed";
    }
  }

  return this.owner;
};

/**
 * This method sets the owner of this node as input graph.
 */
LNode.prototype.setOwner = function (owner)
{
  this.owner = owner;
};

/**
 * This method returns the width of this node.
 */
LNode.prototype.getWidth = function ()
{
  return this.rect.width;
};

/**
 * This method sets the width of this node.
 */
LNode.prototype.setWidth = function (width)
{
  this.rect.width = width;
};

/**
 * This method returns the height of this node.
 */
LNode.prototype.getHeight = function ()
{
  return this.rect.height;
};

/**
 * This method sets the height of this node.
 */
LNode.prototype.setHeight = function (height)
{
  this.rect.height = height;
};

/**
 * This method returns the x coordinate of the center of this node.
 */
LNode.prototype.getCenterX = function ()
{
  return this.rect.x + this.rect.width / 2;
};

/**
 * This method returns the y coordinate of the center of this node.
 */
LNode.prototype.getCenterY = function ()
{
  return this.rect.y + this.rect.height / 2;
};

/**
 * This method returns the center of this node.
 */
LNode.prototype.getCenter = function ()
{
  return new PointD(this.rect.x + this.rect.width / 2,
          this.rect.y + this.rect.height / 2);
};

/**
 * This method returns the location (upper-left corner) of this node.
 */
LNode.prototype.getLocation = function ()
{
  return new PointD(this.rect.x, this.rect.y);
};

/**
 * This method returns the geometry of this node.
 */
LNode.prototype.getRect = function ()
{
  return this.rect;
};

/**
 * This method returns the diagonal length of this node.
 */
LNode.prototype.getDiagonal = function ()
{
  return Math.sqrt(this.rect.width * this.rect.width +
          this.rect.height * this.rect.height);
};

/**
 * This method returns half the diagonal length of this node.
 */
LNode.prototype.getHalfTheDiagonal = function ()
{
  return Math.sqrt(this.rect.height * this.rect.height +
          this.rect.width * this.rect.width) / 2;
};

/**
 * This method sets the geometry of this node.
 */
LNode.prototype.setRect = function (upperLeft, dimension)
{
  this.rect.x = upperLeft.x;
  this.rect.y = upperLeft.y;
  this.rect.width = dimension.width;
  this.rect.height = dimension.height;
};

/**
 * This method sets the center of this node.
 */
LNode.prototype.setCenter = function (cx, cy)
{
  this.rect.x = cx - this.rect.width / 2;
  this.rect.y = cy - this.rect.height / 2;
};

/**
 * This method sets the location of this node.
 */
LNode.prototype.setLocation = function (x, y)
{
  this.rect.x = x;
  this.rect.y = y;
};

/**
 * This method moves the geometry of this node by specified amounts.
 */
LNode.prototype.moveBy = function (dx, dy)
{
  this.rect.x += dx;
  this.rect.y += dy;
};

/**
 * This method returns the cluster ID of this node.
 * Use with caution, because it returns the cluster id of the first cluster.
 * If a node has multiple clusters, remaining cluster information
 * may be accessed by getClusters() method.
 */
LNode.prototype.getClusterID = function ()
{
  if (this.clusters.length == 0)
  {
    return null;
  }

  throw "burası böyle miymiş debuggerdan kontrol et"
  return "" + this.clusters[0].clusterID;
};

/**
 * This method returns the list of clusters this node belongs to.
 */
LNode.prototype.getClusters = function ()
{
  return this.clusters;
};


// -----------------------------------------------------------------------------
// Section: Remaining methods
// -----------------------------------------------------------------------------
/**
 * This method returns all nodes emanating from this node.
 */
LNode.prototype.getEdgeListToNode = function (to)
{
  var edgeList = [];
  var edge;

  for (var obj in this.edges)
  {
    edge = obj;

    if (edge.target == to)
    {
      if (edge.source != this)
        throw "Incorrect edge source!";

      edgeList.push(edge);
    }
  }

  return edgeList;
};

/**
 *	This method returns all edges between this node and the given node.
 */
LNode.prototype.getEdgesBetween = function (other)
{
  var edgeList = [];
  var edge;

  for (var obj in this.edges)
  {
    edge = obj;

    if (!(edge.source == this || edge.target == this))
      throw "Incorrect edge source and/or target";

    if ((edge.target == other) || (edge.source == other))
    {
      edgeList.push(edge);
    }
  }

  return edgeList;
};

/**
 * This method returns whether or not input node is a neighbor of this node.
 */
LNode.prototype.isNeighbor = function (node)
{
  var edge;

  for (var obj in this.edges)
  {
    edge = obj;

    if (edge.source == node || edge.target == node)
    {
      return true;
    }
  }

  return false;
};

/**
 * This method returns a set of neighbors of this node.
 */
LNode.prototype.getNeighborsList = function ()
{
  var neighbors = new HashSet();
  var edge;

  for (var obj in this.edges)
  {
    edge = obj;

    if (edge.source.equals(this))//*********************************************
    {
      neighbors.add(edge.target);
    }
    else
    {
      if (!edge.target.equals(this))
        throw "Incorrect incidency!";
      neighbors.add(edge.source);
    }
  }

  return neighbors;
};

/**
 * This method returns a set of successors (outgoing nodes) of this node.
 */
LNode.prototype.getSuccessors = function ()
{
  var neighbors = new HashSet();
  var edge;

  for (var obj in this.edges)
  {
    edge = obj;

    if (!(edge.source.equals(this) || edge.target.equals(this)))
      throw	"Incorrect incidency!";

    if (edge.source.equals(this))//**************************************************
    {
      neighbors.add(edge.target);
    }
  }

  return neighbors;
};

/**
 * This method forms a list of nodes, composed of this node and its children
 * (direct and indirect).
 */
LNode.prototype.withChildren = function ()
{
  var withNeighborsList = [];
  var childNode;

  withNeighborsList.push(this);

  if (this.child != null)
  {
    var nodes = this.child.getNodes();
    for (var i = 0; i < nodes.length; i++)
    {
      childNode = nodes[i];

      withNeighborsList = withNeighborsList.concat(childNode.withChildren());
    }
  }

  return withNeighborsList;
};

/**
 * This method returns the estimated size of this node, taking into account
 * node margins and whether this node is a compound one containing others.
 */
LNode.prototype.getEstimatedSize = function () {
  if (this.estimatedSize == Integer.MIN_VALUE) {
    throw "assert failed";
  }
  return this.estimatedSize;
};

/*
 * This method calculates the estimated size of this node. If the node is
 * a compound node, the operation is performed recursively. It also sets the
 * initial sizes of compound nodes based on this estimate.
 */
LNode.prototype.calcEstimatedSize = function () {
  if (this.child == null)
  {
    return this.estimatedSize = Math.floor((this.rect.width + this.rect.height) / 2);
  }
  else
  {
    this.estimatedSize = this.child.calcEstimatedSize();
    this.rect.width = this.estimatedSize;
    this.rect.height = this.estimatedSize;

    return this.estimatedSize;
  }
};

/**
 * This method positions this node randomly in both x and y dimensions. We
 * assume the center to be at (WORLD_CENTER_X, WORLD_CENTER_Y).
 */
LNode.prototype.scatter = function () {
  var randomCenterX;
  var randomCenterY;

  var minX = -LayoutConstants.INITIAL_WORLD_BOUNDARY;
  var maxX = LayoutConstants.INITIAL_WORLD_BOUNDARY;
  randomCenterX = LayoutConstants.WORLD_CENTER_X +
          (LNode.random.nextDouble() * (maxX - minX)) + minX;

  var minY = -LayoutConstants.INITIAL_WORLD_BOUNDARY;
  var maxY = LayoutConstants.INITIAL_WORLD_BOUNDARY;
  randomCenterY = LayoutConstants.WORLD_CENTER_Y +
          (LNode.random.nextDouble() * (maxY - minY)) + minY;

  this.rect.x = randomCenterX;
  this.rect.y = randomCenterY
};

/**
 * This method updates the bounds of this compound node.
 */
LNode.prototype.updateBounds = function () {
  if (this.getChild() == null) {
    throw "assert failed";
  }
  if (this.getChild().getNodes().length != 0)
  {
    // wrap the children nodes by re-arranging the boundaries
    var childGraph = this.getChild();
    childGraph.updateBounds(true);

    this.rect.x = childGraph.getLeft();
    this.rect.y = childGraph.getTop();

    this.setWidth(childGraph.getRight() - childGraph.getLeft() +
            2 * LayoutConstants.COMPOUND_NODE_MARGIN);
    this.setHeight(childGraph.getBottom() - childGraph.getTop() +
            2 * LayoutConstants.COMPOUND_NODE_MARGIN +
            LayoutConstants.LABEL_HEIGHT);
  }
};

/**
 * This method returns the depth of this node in the inclusion tree (nesting
 * hierarchy).
 */
LNode.prototype.getInclusionTreeDepth = function ()
{
  if (this.inclusionTreeDepth == Integer.MAX_VALUE) {
    throw "assert failed";
  }
  return this.inclusionTreeDepth;
};

/**
 * This method returns all parents (direct or indirect) of this node in the
 * nesting hierarchy.
 */
LNode.prototype.getAllParents = function () {
  var parents = [];
  var rootNode = this.owner.getGraphManager().getRoot().getParent();
  var parent = this.owner.getParent();

  while (true)
  {
    if (parent != rootNode)
    {
      parents.push(parent);
    }
    else
    {
      break;
    }

    parent = parent.getOwner().getParent();
  }

  parents.push(rootNode);

  return parents;
};

/**
 * This method transforms the layout coordinates of this node using input
 * transform.
 */
LNode.prototype.transform = function (trans)
{
  var left = this.rect.x;

  if (left > LayoutConstants.WORLD_BOUNDARY)
  {
    left = LayoutConstants.WORLD_BOUNDARY;
  }
  else if (left < -LayoutConstants.WORLD_BOUNDARY)
  {
    left = -LayoutConstants.WORLD_BOUNDARY;
  }

  var top = this.rect.y;

  if (top > LayoutConstants.WORLD_BOUNDARY)
  {
    top = LayoutConstants.WORLD_BOUNDARY;
  }
  else if (top < -LayoutConstants.WORLD_BOUNDARY)
  {
    top = -LayoutConstants.WORLD_BOUNDARY;
  }

  var leftTop = new PointD(left, top);
  var vLeftTop = trans.inverseTransformPoint(leftTop);

  this.setLocation(vLeftTop.x, vLeftTop.y);
};

// -----------------------------------------------------------------------------
// Section: implementation of clustered interface
// -----------------------------------------------------------------------------
/**
 * This method add this node model into a cluster with given cluster ID. If
 * such cluster doesn't exist in ClusterManager, it creates a new cluster.
 */
LNode.prototype.addCluster = function (clusterID)
{
  if (typeof (id) === 'number') {
    //get cluster manager of the graph manager of this LNode
    var cm = this.graphManager.getClusterManager();
    var cluster = cm.getClusterByID(clusterID);

    if (cluster == null)
    {
      cluster = new Cluster(cm, clusterID, "Cluster " + clusterID);
      cm.addCluster(cluster);
    }

    this.addCluster(cluster);
  } else {
    if (cluster == null)
    {
      return;
    }

    // check if it is not added before
    if (this.clusters.indexof(cluster) == -1)
    {
      // add given cluster into list of clusters
      this.clusters.push(cluster);

      // add this node to set of nodes of the cluster
      cluster.getNodes().push(this);

      // if this node is a compound node
      if (this.child != null)
      {
        // get all nodes of the child graph
        // child nodes may be compound as well
        var childrenNodes = this.child.getNodes();

//        var itr = childrenNodes.iterator();
//        throw "iterator kısmına bi bak";

        var s = childrenNodes.length;
        // iterate over each child node
        for (var i = 0; i < s; i++)
        {
          var childNode = childrenNodes[i];

          // recursively add children nodes to the cluster
          childNode.addCluster(cluster);
        }
      }
    }
  }
};

/**
 * This method removes the cluster from clustered object's clusters
 */
LNode.prototype.removeCluster = function (cluster)
{
  if (cluster == null)
  {
    return;
  }

  // check if given cluster exists
  if (this.clusters.indexof(cluster) != -1)
  {
    // remove given cluster from list of clusters
    var index = this.clusters.indexof(cluster);
    this.clusters.splice(index, 1);

    // remove this node from set of nodes of the cluster
    index = cluster.getNodes().indexof(this);
    cluster.getNodes().splice(index, 1);

    // if this node is a compound node
    if (this.child != null)
    {
      // get all nodes of the child graph
      // child nodes may be compound as well
      var childrenNodes = this.child.getNodes();

      var itr = childrenNodes.iterator();
      throw "iterator kısmına bi bak";

      // iterate over each child node
      while (itr.hasNext())
      {
        var childNode = itr.next();

        // recursively remove children nodes from the cluster
        childNode.removeCluster(cluster);
      }
    }
  }
};

/**
 * This method resets all clusters of the clustered object
 */
LNode.prototype.resetClusters = function ()
{
  for (var i in this.clusters)
  {
    var cluster = this.clusters[i];
    var nodes = cluster.getNodes();
    var index = nodes.indexof(this);
    nodes.splice(index, 1);
  }
  this.clusters = [];
};

/**
 * This method returns the left of this node.
 */
LNode.prototype.getLeft = function ()
{
  return this.rect.x;
};

/**
 * This method returns the right of this node.
 */
LNode.prototype.getRight = function ()
{
  return this.rect.x + this.rect.width;
};

/**
 * This method returns the top of this node.
 */
LNode.prototype.getTop = function ()
{
  return this.rect.y;
};

/**
 * This method returns the bottom of this node.
 */
LNode.prototype.getBottom = function ()
{
  return this.rect.y + this.rect.height;
};

/**
 * This method returns the parent of clustered object.
 * If it is a root object, then null should be returned.
 */
LNode.prototype.getParent = function ()
{
  if (this.owner == null)
  {
    return null;
  }

  return this.owner.getParent();
};

/**
 * This method checks if this node belongs to the given cluster
 * Returns boolean true if this node belongs to the given cluster,
 * and boolean false otherwise
 */
LNode.prototype.belongsToCluster = function (cluster)
{
  if (this.clusters.indexof(cluster) != -1)
  {
    return true;
  }
  else
  {
    return false;
  }
};

// -----------------------------------------------------------------------------
// Section: Class variables
// -----------------------------------------------------------------------------
/*
 * Used for random initial positioning
 */
LNode.random = new RandomSeed(Layout.RANDOM_SEED);

// -----------------------------------------------------------------------------
// Section: Testing methods
// -----------------------------------------------------------------------------
/**
 * This method prints the topology of this node.
 */
LNode.prototype.printTopology = function ()
{
//  console.log(this.label == null ? "?" : this.label + "{");
//  var edge;
//  var otherEnd;
//  var edges = this.edges;
//  var s = edges.length;
//  for (var i = 0; i < s; i++)
//  {
//    edge = edges[i];
//    otherEnd = edge.getOtherEnd(this);
//    console.log(otherEnd.label == null ? "?" : otherEnd.label + ",");
//  }
//  console.log("} ");
  console.log(this.rect.x + "\t" + this.rect.getY() + "\t" + this.rect.getWidth() + "\t" + this.rect.getHeight());
}
