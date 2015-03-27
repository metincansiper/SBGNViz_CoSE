function ClusterManager() {
  /*
   * Clusters maintained by this cluster manager.
   */
  this.clusters = null;

  /*
   * Boolean variable used for storing whether polygons are used during layout
   */
  this.polygonUsed = null;

  this.clusters = [];

  // default is false
  this.polygonUsed = false;
}

/**
 * This method returns the list of clusters maintained by this 
 * cluster manager.
 */
ClusterManager.prototype.getClusters = function ()
{
  return this.clusters;
}

/**
 * This method sets the polygonUsed variable
 * @param {boolean} polygonUsed whether we are using polygon
 */
ClusterManager.prototype.setPolygonUsed = function (polygonUsed)
{
  this.polygonUsed = polygonUsed;
};

/**
 * This method returns clusterIDs of all existing clusters as sorted array.
 */
ClusterManager.prototype.getClusterIDs = function ()
{
  var result = [];

  for (var i = 0; i < this.clusters.length; i++)
  {
    var cluster = this.clusters[i];
    if (cluster.getClusterID() > 0)
    {
      result.push(cluster.getClusterID());
    }
  }

  return result.sort();
}

ClusterManager.prototype.createCluster = function (clusterID, clusterName) {
  if (clusterID != null && clusterName != null) {
    // allocate new empty LCluster instance
    var cluster = new Cluster(this, clusterID, clusterName);

    // add the cluster into cluster list of this cluster manager
    this.clusters.add(cluster);
  }
  else {
    clusterName = clusterID;
    // allocate new empty LCluster instance
    var lCluster = new Cluster(this, clusterName);

    // add the cluster into cluster list of this cluster manager
    this.clusters.push(lCluster);
  }
}

/**
 * This method adds the given cluster into cluster manager of the graph.
 */
ClusterManager.prototype.addCluster = function (cluster)
{
  cluster.setClusterManager(this);

  // add the cluster into cluster list of this cluster manager
  this.clusters.push(cluster);
}

/**
 * Removes the given cluster from the graph.
 */
ClusterManager.prototype.removeCluster = function (cluster)
{
  // deletes the cluster information from graph
  cluster.delete();
}

/**
 * This method checks if the given cluster ID is used before.
 * If same ID is used before, it returns true, otherwise it returns false.
 */
ClusterManager.prototype.isClusterIDUsed = function (clusterID)
{
  // iterate over all clusters and check if clusterID is used before
  for (var i = 0; i < this.clusters.length; i++)
  {
    var cluster = clusters[i];

    if (cluster.getClusterID() == clusterID)
    {
      return true;
    }
  }

  // not used before
  return false;
}

/**
 * This method returns the cluster with given cluster ID, if no such cluster
 * it returns null;
 */
ClusterManager.prototype.getClusterByID = function (clusterID)
{
  // iterate over all clusters and check if clusterID is same
  for (var i = 0; i < this.clusters.length; i++)
  {
    var cluster = clusters[i];

    if (cluster.getClusterID() == clusterID)
    {
      return cluster;
    }
  }

  // no such cluster
  return null;
}

/**
 * This method removes all clusters from graph. First it copies all cluster
 * IDs. After that calls delete() method of each cluster.
 */
ClusterManager.prototype.clearClusters = function ()
{
  // first, copy of cluster ids is stored in order to prevent 
  // pointer problems
  var clusterIDs = [];

  for (var i = 0; i < this.clusters.length; i++)
  {
    clusterIDs.push(clusters[i].getClusterID());
  }

  for (var i = 0; i < clusterIDs.length; i++)
  {
    this.getClusterByID(clusterIDs[i]).delete();
  }
};

/*
 * idCounter is used to set the ID's of clusters. Each time when some
 * cluster ID is set, it should incremented by 1.
 */
ClusterManager.idCounter = 1;