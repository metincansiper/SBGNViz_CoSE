/**
 * An ArrayList implementation in JavaScript.
 * @class ArrayList
 * @constructor
 */
function ArrayList() {
  this._array = [];
  this._length = 0;
}

ArrayList.prototype = {
  constructor: ArrayList,
  //Appends some data to the end of the list.
  add: function (data) {
    this._array.push(data);
    this._length++;
  },
  addAll: function (list) {
    this._array.addAll(list);
    this._length = this._length + list.length;
  },
  get: function (index) {
    //check for out-of-bounds values
    if (index > -1 && index < this._length) {
      return this._array[index];
    } else {
      return null;
    }
  },
  remove: function (index) {
    //check for out-of-bounds values
    if (index > -1 && index < this._length) {
      var tmp = this._array.get(index);
      this._array.splice(index, 1);
      this._length--;

      return tmp;
    } else {
      return null;
    }
  },
  clear: function () {
    this._array = [];
    this._length = 0;
  },
  size: function () {
    return this._length;
  },
  isEmpty: function () {
    return this._length === 0;
  },
  toArray: function () {
    return this._array.slice(0);//creates a clone
  },
  toString: function () {
    return this.toArray().toString();
  }
};


