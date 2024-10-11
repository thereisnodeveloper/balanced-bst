import Node from './node.js';

const sampleArray1 = [7, 6, 5, 4, 3, 2, 1];
const sampleArray2 = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

// pre-process
// sort array
// remove duplicates

// Tree class
console.log('Node:', Node);
class Tree {
  root = null;

  /**
     * @description turn array into balanced binary tree full of Node objects appropriately placed.

     * @param {Array}
     * @return {*} return the level-0 root node object
     * @memberof Tree
     */
  buildTree(array) {
    return rootNode;
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
// const result = tree1.preprocess(sampleArray1);
