import Node from './node.js';

const sampleArray1 = [1, 2, 3, 4, 5, 6, 7];
// [1,2,3], 4, [5,6,7]
const sampleArray2 = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

// pre-process
// sort array
// remove duplicates

// Tree class
// console.log('Node:', Node);
class Tree {
  // root = null;

  /**
     * @description turn array into balanced binary tree full of Node objects appropriately placed.

     * @param {Array} array
     * @return {Node} return the level-0 root node object
     * @memberof Tree
     */
  buildTree(array) {

    function buildTreeRecurse(targetArray, startIndex, endIndex) {
      // split array in half, find middle
      const localStartIndex = typeof startIndex === 'undefined' ? 0 : startIndex;
      const localEndIndex = typeof endIndex === 'undefined' ? targetArray.length - 1 : endIndex;
      const localMidIndex = (localStartIndex + localEndIndex) / 2;
      const rootNode = new Node(targetArray[localMidIndex]);

      // base case: reach end of given array
      if (localEndIndex < localStartIndex) return null;

      // recursive case
      // left subarray
      rootNode.left = buildTreeRecurse(targetArray, localStartIndex, localMidIndex - 1);
      // right subarray
      rootNode.right = buildTreeRecurse(targetArray, localMidIndex + 1, localEndIndex);

      return rootNode;
    }
    return buildTreeRecurse(this.preprocess(array));
  }

  /**
   * @description
   * @param {Array} array
   * @memberof Tree
   * @return {Array}
   */
  preprocess(array) {
    const uniqueArray = [...new Set(array)];
    uniqueArray.sort((a, b) => a - b);
    return uniqueArray;
  }

  prettyPrint = (node, prefix = '', isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
  };
}

const tree1 = new Tree();

const result = tree1.buildTree(sampleArray1);
console.log('result:', result);
