function CoarseningGraph(parent, layout, vGraph) {
  LGraph.call(this, parent, layout, vGraph);
  this.layout;
  if (layout == null && vGraph == null) {
    layout = parent;
    parent = null;
    this.layout = layout;
  }
  //this.prototype = new LGraph();
  /*this.coarsen = CoarseningGraph.prototype.coarsen;
   this.contract = CoarseningGraph.prototype.contract;
   this.getLayout = CoarseningGraph.prototype.getLayout;
   this.setLayout = CoarseningGraph.prototype.setLayout;
   this.unmatchAll = CoarseningGraph.prototype.unmatchAll;*/
}

//extends LGraph
CoarseningGraph.prototype = Object.create(LGraph.prototype);
for (var prop in LGraph) {
  CoarseningGraph[prop] = LGraph[prop];
}

CoarseningGraph.prototype.coarsen = function ()
{
  this.unmatchAll();

  var v, u;

  if (this.getNodes().length > 0)
  {
    // match each node with the one of the unmatched neighbors has minimum weight
    // if there is no unmatched neighbor, then match current node with itself
    while (!(this.getNodes()[0]).isMatched())
    {
      // get an unmatched node (v) and (if exists) matching of it (u).
      v = this.getNodes()[0];
      u = v.getMatching();

      // node t is constructed by contracting u and v
      contract(v, u);
    }

    // construct pred1, pred2, next fields of referenced node from CoSEGraph
    var nodes = this.getNodes();
    var s = nodes.length;
    for (var i = 0; i < s; i++)
    {
      var y = nodes[i];

      // new CoSE node will be in Mi+1
      var z = this.layout.newNode(null);

      z.setPred1(y.getNode1().getReference());
      y.getNode1().getReference().setNext(z);

      // if current node is not matched with itself
      if (y.getNode2() != null)
      {
        z.setPred2(y.getNode2().getReference());
        y.getNode2().getReference().setNext(z);
      }

      y.setReference(z);
    }
  }
}

/**
 * This method unflags all nodes as unmatched
 * it should be called before each coarsening process
 */
CoarseningGraph.prototype.unmatchAll = function ()
{
  var nodes = this.getNodes();
  var s = nodes.length;
  for (var i = 0; i < s; i++)
  {
    var v = nodes[i];
    v.setMatched(false);
  }
}

/**
 * This method contracts v and u
 */
CoarseningGraph.prototype.contract = function (v, u)
{
  // t will be constructed by contracting v and u		
  var t = new CoarseningNode();
  this.add(t);

  t.setNode1(v);
  var neighborsList = v.getNeighborsList();
  var s = neighborsList.length;
  for (var i = 0; i < s; i++)
  {
    var x = neighborsList[i];
    if (x != t)
    {
      this.add(new CoarseningEdge(), t, x);
    }
  }
  t.setWeight(v.getWeight());

  //remove contracted node from the graph
  this.remove(v);

  // if v has an unmatched neighbor, then u is not null and t.node2 = u
  // otherwise, leave t.node2 as null
  if (u != null)
  {
    t.setNode2(u);
    neighborsList = u.getNeighborsList();
    s = neighborsList.length;
    for (var i = 0; i < s; i++)
    {
      var x = neighborsList[i];
      if (x != t)
      {
        add(new CoarseningEdge(), t, x);
      }
    }
    t.setWeight(t.getWeight() + u.getWeight());

    //remove contracted node from the graph
    this.remove(u);
  }

  // t should be flagged as matched
  t.setMatched(true);
}

CoarseningGraph.prototype.getLayout = function ()
{
  return layout;
}

CoarseningGraph.prototype.setLayout = function (layout)
{
  this.layout = layout;
}