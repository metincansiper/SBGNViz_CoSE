function LNodeDegreeSort(objectArray) {
  QuickSort.call(this, objectArray);
}

LNodeDegreeSort.prototype = Object.create(QuickSort.prototype);

for (var prop in QuickSort) {
  LNodeDegreeSort[prop] = QuickSort[prop];
}

LNodeDegreeSort.prototype.compare = function (node1, node2) {
  return (node2.getEdges().length > node1.getEdges().length);
};

