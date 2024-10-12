import Node from './node.js';

const sampleArray1 = [1, 2, 3, 4, 5, 6, 7];
const sampleArray2 = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  insert(value) {
    // start from rootNode
    if (typeof this.localRoot === 'undefined') this.localRoot = this.root;

    // compare value with value of rootNode
    // ignore duplicates
    if (value === this.localRoot.data) {
      throw new Error('duplicate value');
      // TEST
    }

    const shouldGoLeft = () => {
      // if larger, go to right child
      if (value > this.localRoot.data) {
        return false;
        this.localRoot = this.localRoot.right;
        this.insert(value);
      }
      // if smaller, go to left child

      return true;
      this.localRoot = this.localRoot.left;
      this.insert(value);
    };

    // base case
    // FIXME: since I need to link the newly created node as a left/child of the
    // parent node, I need to run checks BEFORE traversing to the next node

    // if rootNode=== null/undefined (means empty), insert
    let nodeToGoTo;
    if (shouldGoLeft()) {
      nodeToGoTo = this.localRoot.left;
      if (typeof nodeToGoTo === 'undefined' || nodeToGoTo === null) {
        this.localRoot.left = nodeToGoTo;
        nodeToGoTo === new Node(value);
      } else {
        this.localRoot = nodeToGoTo;
        this.insert(value);
      }
    } else {
      nodeToGoTo = this.localRoot.right;
      if (typeof nodeToGoTo === 'undefined' || nodeToGoTo === null) {
        this.localRoot.left = nodeToGoTo;
        nodeToGoTo === new Node(value);
      } else {
        this.localRoot = nodeToGoTo;
        this.insert(value);
      }
    }
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
tree1.insert(0);
tree1.prettyPrint(tree1.root);
