// Empty constructor version is inherently available since we are using javascript
function CoarseningNode(gm, vNode) {
  LNode.call(this, gm, vNode);
// -----------------------------------------------------------------------------
// Section: Instance variables
// -----------------------------------------------------------------------------

  /**
   * A coarsening node in G (coarsening graph) 
   * references a CoSENode in M (CoSE graph manager)
   */
  this.reference;

  /**
   * node1 and node2 hold the contracted nodes
   */
  this.node1;
  this.node2;
  /**
   * matched flag of the coarsening node
   */
  this.matched;

  /**
   * weight
   */
  this.weight = 1; // 1 comes from the constructor in java

  /*this.getMatching = CoarseningNode.prototype.getMatching;
   this.getNode1 = CoarseningNode.prototype.getNode1;
   this.getNode2 = CoarseningNode.prototype.getNode2;
   this.getReference = CoarseningNode.prototype.getReference;
   this.getWeight = CoarseningNode.prototype.getWeight;
   this.isMatched = CoarseningNode.prototype.isMatched;
   this.setMatched = CoarseningNode.prototype.setMatched;
   this.setNode1 = CoarseningNode.prototype.setNode1;
   this.setNode2 = CoarseningNode.prototype.setNode2;
   this.setReference = CoarseningNode.prototype.setReference;
   this.setWeight = CoarseningNode.prototype.setWeight;*/
}


CoarseningNode.prototype = Object.create(LNode.prototype);

for (var prop in LNode) {
  CoarseningNode[prop] = LNode[prop];
}

// -----------------------------------------------------------------------------
// Section: Getters and setter
// -----------------------------------------------------------------------------

CoarseningNode.prototype.setMatched = function (matched)
{
  this.matched = matched;
};

CoarseningNode.prototype.isMatched = function ()
{
  return matched;
};

CoarseningNode.prototype.setWeight = function (weight)
{
  this.weight = weight;
};

CoarseningNode.prototype.getWeight = function ()
{
  return weight;
};

CoarseningNode.prototype.setNode1 = function (node1)
{
  this.node1 = node1;
};

CoarseningNode.prototype.getNode1 = function ()
{
  return node1;
};

CoarseningNode.prototype.setNode2 = function (node2)
{
  this.node2 = node2;
};

CoarseningNode.prototype.getNode2 = function ()
{
  return node2;
};

CoarseningNode.prototype.setReference = function (reference)
{
  this.reference = reference;
};

CoarseningNode.prototype.getReference = function ()
{
  return reference;
};

// -----------------------------------------------------------------------------
// Section: Other methods
// -----------------------------------------------------------------------------
/**
 * This method returns the matching of this node
 * if this node does not have any unmacthed neighbor then returns null
 */
CoarseningNode.prototype.getMatching = function ()
{
  var minWeighted = null;
  var minWeight = Integer.MAX_VALUE;
  for (var obj in this.getNeighborsList())
  {
    var v = obj;
    if ((!v.isMatched()) && (v != this) && (v.getWeight() < minWeight))
    {
      minWeighted = v;
      minWeight = v.getWeight();
    }
  }

  return minWeighted;
};
