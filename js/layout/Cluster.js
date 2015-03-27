function Cluster(clusterManager, clusterID, clusterName) {
  /*
   * List of clustered objects that belong to the cluster
   */
  this.nodes = null;

  /*
   * Owner cluster manager.
   */
  this.clusterManager = null;

  /*
   * Unique ID of the cluster 
   */
  this.clusterID = null;

  /*
   * Name of the cluster
   */
  this.clusterName = null;

  /*
   * Polygon that covers all nodes of the cluster
   */
  this.polygon = null;

  if (clusterName != null) {
    this.nodes = new HashSet();
    this.polygon = [];

    // set the cluster manager
    this.clusterManager = clusterManager;
    this.clusterName = clusterName;

    // find a free clusterID
    if (this.clusterManager != null)
    {
      while (!this.clusterManager.isClusterIDUsed(ClusterManager.idCounter))
      {
        ClusterManager.idCounter++;
      }
    }
    this.clusterID = ClusterManager.idCounter;

    // each cluster has its own cluster ID, counter is incremented by 1
    ClusterManager.idCounter++;

    // set cluster name and id
    this.clusterName = clusterName;
    this.clusterID = clusterID;
  }
  else {
    clusterName = clusterID;
    this.nodes = new HashSet();
    this.polygon = [];

    // set the cluster manager
    this.clusterManager = clusterManager;
    this.clusterName = clusterName;

    // find a free clusterID
    if (this.clusterManager != null)
    {
      while (!this.clusterManager.isClusterIDUsed(ClusterManager.idCounter))
      {
        ClusterManager.idCounter++;
      }
    }
    this.clusterID = ClusterManager.idCounter;

    // each cluster has its own cluster ID, counter is incremented by 1
    ClusterManager.idCounter++;
  }
}

/**
 * This method returns a set of nodes that belong to this cluster. 
 */
Cluster.prototype.getNodes = function () {
  return this.nodes;
}

/**
 * This method returns the ID of this cluster.
 */
Cluster.prototype.getClusterID = function () {
  return this.clusterID;
}

/**
 * This method sets the cluster manager of this cluster
 */
Cluster.prototype.setClusterManager = function (clusterManager) {
  this.clusterManager = clusterManager;
}

/**
 * This method returns the name of this cluster.
 */
Cluster.prototype.getClusterName = function () {
  return this.clusterName;
}

/**
 * This method sets the name of this cluster.
 */
Cluster.prototype.setClusterName = function (clusterName)
{
  this.clusterName = clusterName;
}

/**
 * This method returns the polygon
 */
Cluster.prototype.getPolygon = function ()
{
  return this.polygon;
}

/**
 * This method sets the polygon
 */
Cluster.prototype.setPolygon = function (points)
{
  this.polygon = points;
}

/**
 * This method adds the given clustered node into this cluster.
 */
Cluster.prototype.addNode = function (node)
{
  node.addCluster(this);
}

/**
 * This method removes the given clustered node from this cluster.
 */
Cluster.prototype.removeNode = function (node)
{
  node.removeCluster(this);
}

/**
 * This method deletes the cluster information from the graph.
 */
Cluster.prototype.delete = function ()
{
  // get copy of nodes in order to prevent pointer problems
  var copy = [];
  this.nodes.addAllTo(copy);

  for (var i = 0; i < copy.length; i++)
  {
    node = copy[i];
    node.removeCluster(this);
  }

  // delete this cluster form cluster managers cluster list
  var index = this.clusterManager.getClusters().indexOf(this);
  this.clusterManager.getClusters().splice(index, 1);
}

/**
 * This method calculates the convex polygon bounding all nodes of 
 * this cluster.
 */
Cluster.prototype.calculatePolygon = function ()
{
  if (this.clusterID == 0)
  {
    return;
  }
  calculateConvexHull();
}

/**
 * This method collects all boundary points of all nodes.
 */
Cluster.prototype.findPoints = function ()
{
  this.polygon.clear();

  if (this.nodes.isEmpty())
  {
    return;
  }

  var node;
  var iterator = [];
  this.nodes.addAllTo(iterator);
  
  for (var i = 0; i < this.iterator.length; i++)
  {
    node = this.iterator[i];

    var left = node.getLeft();
    var right = node.getRight();
    var top = node.getTop();
    var bottom = node.getBottom();

    var parent = node.getParent();

    //calculate absolute position
    while (parent != null)
    {
      left += parent.getLeft();
      right += parent.getLeft();

      top += parent.getTop();
      bottom += parent.getTop();

      parent = parent.getParent();
    }

    this.polygon.add(new PointD(left, top));
    this.polygon.add(new PointD(right, top));
    this.polygon.add(new PointD(right, bottom));
    this.polygon.add(new PointD(left, bottom));
  }
}

/**
 * This method computes the convex hull of given points in O(N*logN) time.
 * Very similar algorithm to Graham Scan is implemented.
 */
Cluster.prototype.calculateConvexHull = function ()
{
  // find points
  findPoints();

  if (this.polygon.isEmpty())
  {
    return;
  }

  // sort points in increasing order of x coordinates, in case of tie
  // point with higher y coordinate comes first
  Collections.sort(this.polygon, new PointComparator());

  var upperHull = [];
  var lowerHull = [];

  var n = this.polygon.length;
  if (n < 3)
  {
    // no polygon
    return;
  }
  // push first 2 points
  upperHull.push(this.polygon[0]);
  upperHull.push(this.polygon[1]);

  // calculate upper hull
  for (var i = 2; i < this.polygon.length; i++)
  {
    var pt3 = this.polygon[i];

    while (true)
    {
      var pt2 = upperHull.pop();
      // 2 points should be pushed back
      if (upperHull.length == 0)
      {
        upperHull.push(pt2);
        upperHull.push(pt3);
        break;
      }

      var pt1 = upperHull[upperHull.length - 1];

      if (rightTurn(pt1, pt2, pt3))
      {
        upperHull.push(pt2);
        upperHull.push(pt3);
        break;
      }
    }
  }

  lowerHull.push(this.polygon[n - 1]);
  lowerHull.push(this.polygon[n - 2]);

  // calculate lower hull
  for (var i = n - 3; i >= 0; i--)
  {
    var pt3 = this.polygon[i];

    while (true)
    {
      var pt2 = lowerHull.pop();
      // 2 points should be pushed back
      if (lowerHull.length == 0)
      {
        lowerHull.push(pt2);
        lowerHull.push(pt3);
        break;
      }

      var pt1 = lowerHull[lowerHull.length - 1];

      if (rightTurn(pt1, pt2, pt3))
      {
        lowerHull.push(pt2);
        lowerHull.push(pt3);
        break;
      }
    }
  }

  // construct convex hull
  this.polygon.clear();
  n = lowerHull.length;
  for (var i = 0; i < n; i++)
  {
    this.polygon.push(lowerHull.pop());
  }

  n = upperHull.length;
  for (var i = 0; i < n; i++)
  {
    this.polygon.push(upperHull.pop());
  }
}

/**
 * This method check whether it is a right turn.
 */
Cluster.rightTurn = function (pt1, pt2, pt3)
{
  // first vector
  var x1 = pt2.x - pt1.x;
  var y1 = -(pt2.y - pt1.y);

  // second vector
  var x2 = pt3.x - pt2.x;
  var y2 = -(pt3.y - pt2.y);

  // decide using cross product, right hand rule is applied
  if ((x1 * y2 - y1 * x2) <= 0) {
    return true;
  }
  else
  {
    return false;
  }
}

/**
 * Method to make 2 clusters comparable
 */
Cluster.prototype.compareTo = function (obj)
{
  if (obj instanceof  Cluster)
  {
    var cluster = obj;

    // compare ID's of two clusters
    //return ((Integer)this.clusterID).compareTo(cluster.getClusterID());
    if (this.clusterID > cluster.getClusterID) {
      return 1;
    }
    else if (this.clusterID < cluster.getClusterID) {
      return -1;
    }
    //return 0;
  }
  return 0;
}

Cluster.prototype.PointComparator = function () {
}

Cluster.prototype.PointComparator.prototype.compare = function (o1, o2) {
  var pt1 = o1;
  var pt2 = o2;

  if (pt1.x < pt2.x)
    return -1;
  else if (pt1.x > pt2.x)
    return 1;
  else if (Math.abs(pt1.x - pt2.x) < 1e-9 && pt1.y > pt2.y)
    return -1;
  else if (Math.abs(pt1.x - pt2.x) < 1e-9 && pt1.y < pt2.y)
    return 1;

  return 0;
}