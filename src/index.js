import Node from './node.js';

const sampleArray1 = [1, 2, 3, 4, 5, 6, 7];
const sampleArray2 = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  traverse(config) {
    const { value, callback, conditionCheck } = config;
    if (typeof this.localRoot === 'undefined') this.localRoot = this.root;

    // ignore duplicates
    if (value === this.localRoot.data) {
      throw new Error('duplicate value');
    }

    const shouldGoLeft = () => {
      // if larger, go to right child
      if (value > this.localRoot.data) {
        return false;
      }
      // if smaller, go to left child
      return true;
    };

    let nodeToGoTo;
    if (shouldGoLeft()) {
      nodeToGoTo = this.localRoot.left;
      if (conditionCheck(nodeToGoTo)) {
        console.log('next node is undefined / null');
        // base case
        nodeToGoTo = callback(nodeToGoTo);
        this.localRoot.left = nodeToGoTo;
      } else {
        this.localRoot = nodeToGoTo;
        this.traverse(config);
      }
    } else {
      nodeToGoTo = this.localRoot.right;
      if (conditionCheck(nodeToGoTo)) {
        console.log('next node is undefined / null');

        // base case
        nodeToGoTo = callback(nodeToGoTo);
        this.localRoot.right = nodeToGoTo;
      } else {
        this.localRoot = nodeToGoTo;
        this.traverse(config);

      }
    }
  }

  insert(value) {
    function insertCallBack(nodeToGoTo) {
      nodeToGoTo = new Node(value);
      return nodeToGoTo
    }
    function conditionCheck(nodeToGoTo) {
      return typeof nodeToGoTo === 'undefined' || nodeToGoTo === null;
    }
    this.traverse({ value, callback: insertCallBack, conditionCheck });
  }

  delete(value) {}

  find(value) {}

  levelOrder(callback) {}

  inOrder(callback) {}

  preOrder(callback) {}

  postOrder(callback) {}

  height(node) {}

  depth(node) {}

  isBalanced() {}

  rebalance() {}

  /**
     * @description turn array into balanced binary tree full of Node objects appropriately placed.

     * @param {Array} array
     * @return {Node} return the level-0 root node object
     * @memberof Tree
     */
  buildTree(array) {
    function buildTreeRecurse(targetArray, startIndex, endIndex) {
      const localStartIndex = typeof startIndex === 'undefined' ? 0 : startIndex;
      const localEndIndex = typeof endIndex === 'undefined' ? targetArray.length - 1 : endIndex;
      const localMidIndex = Math.floor((localStartIndex + localEndIndex) / 2);
      const rootNode = new Node(targetArray[localMidIndex]);
      // base case: reach end of given array
      if (localEndIndex < localStartIndex) return null;

      // recursive case
      rootNode.left = buildTreeRecurse(targetArray, localStartIndex, localMidIndex - 1);
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
      this.prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
  };
}

const tree1 = new Tree(sampleArray2);
tree1.prettyPrint(tree1.root);
tree1.insert(0)
tree1.prettyPrint(tree1.root);
