import Node from './node.js';

const sampleArray1 = [1, 2, 3, 4, 5, 6, 7];
const sampleArray2 = [
  1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324, 500, 350, 400, 450, 7000, 5000, 5500, 4500, 5100,
];
const ChildrenType = {
  NO_CHILDREN: 'no children',
  ONLY_LEFT_CHILD: 'only left child',
  ONLY_RIGHT_CHILD: 'only right child',
  BOTH_CHILDREN: 'both children',
};

const TraverseCondition = {
  LEFT: 'left',
  RIGHT: 'right',
  NUMERIC: 'numeric',
};

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
    this.localRoot = this.root;
  }

  traverse(config) {
    const { value, callback, conditionCheck, ignoreDuplicates = false } = config;
    // if (typeof this.localRoot === 'undefined') this.localRoot = this.root;v
    // ignore duplicates
    // FIXME: this doesn't do what I think it should do
    if (!ignoreDuplicates && value === this.localRoot.data) {
      throw new Error('duplicate value');
    }

    const shouldGoLeft = (staticCondition = null, criterion = TraverseCondition.NUMERIC) => {
      if (staticCondition) {
        if (staticCondition === TraverseCondition.LEFT) {
          return true;
        }
        return false;
      }

      // if larger, go to right child
      if (criterion === TraverseCondition.NUMERIC) {
        if (value > this.localRoot.data) {
          return false;
        }
        // if smaller, go to left child
        return true;
      }
    };

    let nodeToGoTo;
    if (shouldGoLeft()) {
      nodeToGoTo = this.localRoot.left;
      if (conditionCheck(nodeToGoTo)) {
        // console.log('next node is undefined / null');
        // base case
        nodeToGoTo = callback(nodeToGoTo);
        this.localRoot.left = nodeToGoTo;
        // reset localRoot for next method call before exiting
        this.localRoot = this.root;
        return this.root;
      }
      // recursive case
      this.localRoot = nodeToGoTo;
      this.traverse(config);
    } else {
      nodeToGoTo = this.localRoot.right;
      if (conditionCheck(nodeToGoTo)) {
        // console.log('next node is undefined / null');

        // base case
        nodeToGoTo = callback(nodeToGoTo);
        this.localRoot.right = nodeToGoTo;
        // reset localRoot for next method call before exiting
        this.localRoot = this.root;
        return this.root;
      }
      // recursive case
      this.localRoot = nodeToGoTo;
      this.traverse(config);
    }
  }

  insert(value) {
    function insertCallback(nodeToGoTo) {
      nodeToGoTo = new Node(value);
      return nodeToGoTo;
    }
    function conditionCheck(nodeToGoTo) {
      return typeof nodeToGoTo === 'undefined' || nodeToGoTo === null;
    }
    this.traverse({ value, callback: insertCallback, conditionCheck });
  }

  delete(value) {
    const traverseLeft = (targetNode) => {
      let previousNode = targetNode;
      while (typeof targetNode.left !== 'undefined' && targetNode.left !== null) {
        previousNode = targetNode;

        targetNode = targetNode.left;
      }
      console.log('previousNode:', previousNode);
      return { targetNode, parent: previousNode };
    };

    const deleteCallback = (nodeToGoTo) => {

      // if node has no children, node set to null
      console.log('nodeToGoTo:', nodeToGoTo);
      switch (this.checkNodeChildren(nodeToGoTo)) {
        case ChildrenType.NO_CHILDREN:
          nodeToGoTo = null;
          break;
        case ChildrenType.ONLY_LEFT_CHILD:
          nodeToGoTo = nodeToGoTo.left;
          break;
        case ChildrenType.ONLY_RIGHT_CHILD:
          nodeToGoTo = nodeToGoTo.right;
          break;
        case ChildrenType.BOTH_CHILDREN:
          // find smallest in the right subtree
          const rightSubtreeStart = nodeToGoTo.right;
          var traverseResult = traverseLeft(rightSubtreeStart);
          let nextLargest = traverseResult.targetNode;
          // FIXME
          // check

          switch (this.checkNodeChildren(nextLargest)) {
            case ChildrenType.NO_CHILDREN:
              // TESTED
              nodeToGoTo.data = nextLargest.data;
              break;

            case ChildrenType.ONLY_LEFT_CHILD:
            case ChildrenType.BOTH_CHILDREN:
              throw new Error(
                'should not have happened, inorder successofr should have no   number that is smaller than it '
              );
            //! !!
            case ChildrenType.ONLY_RIGHT_CHILD:

              console.log('nodeToGoTo.right:', nodeToGoTo.right)
              console.log('nextLargest.right:', nextLargest.right)
              nodeToGoTo.right.left = nextLargest.right
              

              nodeToGoTo.data = nextLargest.data;
             //FIXME

            default:
              break;
          }
          // nodeToGoTo = nextLargest;

          nextLargest = null;
          traverseResult.parent.left = null; // parent of nextLargest: set its .left to nu
          break;
        default:
          throw new Error('check this error');
          break;
      }

      return nodeToGoTo;
    };

    function conditionCheck(nodeToGoTo) {
      return nodeToGoTo.data === value;
    }
    this.traverse({
      value,
      callback: deleteCallback,
      conditionCheck,
      ignoreDuplicates: true,
    });
  }

  find(value) {}

  levelOrder(callback) {}

  inOrder(callback) {}

  preOrder(callback) {}

  postOrder(callback) {}

  height(node) {}

  depth(node) {}

  isBalanced() {}

  rebalance() {}

  checkNodeChildren(node) {
    if (!node.left && !node.right) {
      return ChildrenType.NO_CHILDREN;
    }
    if (node.left && !node.right) {
      return ChildrenType.ONLY_LEFT_CHILD;
    }
    if (!node.left && node.right) {
      return ChildrenType.ONLY_RIGHT_CHILD;
    }
    return ChildrenType.BOTH_CHILDREN;
  }

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
tree1.insert(0);
tree1.delete(4500);
tree1.prettyPrint(tree1.root);
