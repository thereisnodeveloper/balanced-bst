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
  SENTINEL_VALUE: 'sentinel',
};

export default class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
    this.localRoot = this.root;
  }

  /**
   * Navigates the binary search tree to perform operations based on the provided configuration.
   *
   * @param {Object} config - Configuration object .
   * @param {*} config.value - The value to be used in the callback function  (e.g., for insertion or deletion).
   * @param {Function} config.callback - Function to be called when the target node is found.
   * @param {Function} config.stopConditionMet - Function that determines when to stop the navigation.
   * @param {boolean} [config.ignoreDuplicates=false] - Whether to ignore duplicate values during navigation.
   *
   * @throws {Error} Throws an error if a duplicate value is encountered and ignoreDuplicates is false.
   *
   * @returns {Node} Returns the root node of the tree after the navigation operation.
   *
   * @description
   * This method travels the binary search tree recursively, moving left or right based on the value
   * being searched for. It uses the provided callback and stop condition to perform operations
   * (such as insertion or deletion) at the appropriate node. The method maintains a 'localRoot'
   * to keep track of the current position in the tree during travel.
   */
  navigateTreeAndExecute(config) {
    //practicing how to use rest
    let {
      // parent = null,
      ...rest
    } = config;
    const {
      value,
      callback,
      stopConditionMet,
      ignoreDuplicates: ignoreDuplicateValuesInTree = false,
    } = rest;
    if (!ignoreDuplicateValuesInTree && value === this.localRoot.data) {
      throw new Error('duplicate value');
    }

    // visit & check root node against condition
    if (stopConditionMet(this.localRoot)) {
      // base case
      this.localRoot = callback(this.localRoot);
      // this.localRoot.left = nodeToGoTo;
      // reset localRoot for next method call before exiting
      this.localRoot = this.root;
      return this.root;
    }

    const shouldGoLeft = (staticCondition = null, criterion = TraverseCondition.SENTINEL_VALUE) => {
      if (staticCondition) {
        if (staticCondition === TraverseCondition.LEFT) {
          return true;
        }
        return false;
      }

      // if larger, go to right child
      if (criterion === TraverseCondition.SENTINEL_VALUE) {
        if (value > this.localRoot.data) {
          return false;
        }
        // if smaller, go to left child
        return true;
      }
    };

    let nodeToGoTo;

    // determine whether to go to the left or right child node
    if (shouldGoLeft()) {
      // config.parent = this.localRoot
      // parent = this.localRoot
      this.parentNode = this.localRoot
      nodeToGoTo = this.localRoot.left;
      if (stopConditionMet(nodeToGoTo)) {
        // base case
        nodeToGoTo = callback(nodeToGoTo);
        this.localRoot.left = nodeToGoTo;
        // reset localRoot for next method call before exiting
        this.localRoot = this.root;
        return this.root;
      }
      // recursive case
      this.localRoot = nodeToGoTo;
      this.navigateTreeAndExecute(config);
      // if we go right...
    } else {
      // go to the right instead
      // config.parent = this.localRoot
      // parent = this.localRoot
      this.parentNode = this.localRoot

      nodeToGoTo = this.localRoot.right;
      if (stopConditionMet(nodeToGoTo)) {
        // base case
        nodeToGoTo = callback(nodeToGoTo);
        this.localRoot.right = nodeToGoTo;
        // reset localRoot for next method call before exiting
        this.localRoot = this.root;
        return this.root;
      }
      // recursive case
      this.localRoot = nodeToGoTo;
      this.navigateTreeAndExecute(config);
    }
  }

  insert(value) {
    function insertCallback(nodeToGoTo) {
      nodeToGoTo = new Node(value);
      return nodeToGoTo;
    }
    function stopConditionCheck(nodeToGoTo) {
      return typeof nodeToGoTo === 'undefined' || nodeToGoTo === null;
    }
    this.navigateTreeAndExecute({
      value,
      callback: insertCallback,
      stopConditionMet: stopConditionCheck,
    });
  }

  delete(value) {
    const traverseLeft = (targetNode) => {
      let previousNode = targetNode;
      while (typeof targetNode.left !== 'undefined' && targetNode.left !== null) {
        previousNode = targetNode;

        targetNode = targetNode.left;
      }
      // console.log('previousNode:', previousNode);
      return { targetNode, parent: previousNode };
    };

    const deleteCallback = (deleteTarget) => {
      console.log('deleteTarget:', deleteTarget);
      let inorderSuccessor; // smallest node in deleteTarget's right subtree
      switch (Tree.checkNodeChildren(deleteTarget)) {
        case ChildrenType.ONLY_LEFT_CHILD:
          console.log('Case deleteTarget has triggered: ONLY_LEFT_CHILD');
          deleteTarget = deleteTarget.left;
          break;
        case ChildrenType.ONLY_RIGHT_CHILD:
          console.log('Case triggered: deleteTarget has ONLY_RIGHT_CHILD');
          deleteTarget = deleteTarget.right;
          break;
        case ChildrenType.BOTH_CHILDREN:
          console.log('Case triggered: deleteTarget has BOTH_CHILDREN');
          inorderSuccessor = findInorderSuccessor();
          console.log('inorderSuccessor:', inorderSuccessor);
          checkSuccessorChildrenAndPerformDelete(inorderSuccessor);
          break;
        default:
          console.log('Case triggered: deleteTarget has NO_CHILDREN (default)');
        // ChildrenType.NO_CHILDREN:
      }

      function findInorderSuccessor() {
        // find node with smallest value in the right subtree of deleteTarget
        const rightSubtreeStart = deleteTarget.right;
        const traverseResult = traverseLeft(rightSubtreeStart);
        return traverseResult.targetNode;
      }
      function checkSuccessorChildrenAndPerformDelete(inorderSuccessor,parentNode) {
        switch (Tree.checkNodeChildren(inorderSuccessor)) {
          case ChildrenType.ONLY_LEFT_CHILD:
            console.log('Case triggered for inorderSuccessor: ONLY_LEFT_CHILD');
          case ChildrenType.BOTH_CHILDREN:
            console.log('Case triggered for inorderSuccessor: BOTH_CHILDREN');
            throw new Error(
              'should not have happened, inorder successor should have no   number that is smaller than it (meaning no left child)'
            );
            break;
          case ChildrenType.ONLY_RIGHT_CHILD:
            console.log('Case triggered for inorderSuccessor: ONLY_RIGHT_CHILD');
            console.log('inorderSuccessor has ONLY right child');
            console.log('inorderSuccessor.right:', inorderSuccessor.right);

            // SAVE deleteTarget's left child before it gets deleted
            const deleteTargetLeftChild = deleteTarget.left;
            //!!! I can do this recursively, not sure about the difference.
            deleteTarget = inorderSuccessor;
            deleteTarget.left = deleteTargetLeftChild;

            break;
          default:
            console.log('Case triggered for inorderSuccessor: NO_CHILDREN (default)');
            console.log('inorderSuccessor has NO children');
            //  ChildrenType.NO_CHILDREN:
            //FIXME: this doesn't delete the inordersuccessor
            deleteTarget.data = inorderSuccessor.data;
        // console.log('parent:', parent)
console.log('this.parentNode:', this.parentNode)

        }
      }
      return deleteTarget;
    };

    function stopConditionCheck(nodeToGoTo) {
      return nodeToGoTo.data === value;
    }
    this.navigateTreeAndExecute({
      value,
      callback: deleteCallback,
      stopConditionMet: stopConditionCheck,
      ignoreDuplicates: true,
    });
  }

  visualizeLocalStructure(node, nextLargest) {
    console.log('Local structure:');
    console.log(`${node.data}`);
    console.log(`├── ${node.left ? node.left.data : 'null'}`);
    console.log(`└── ${node.right ? node.right.data : 'null'}`);
    console.log(`    └── ${node.right && node.right.left ? node.right.left.data : 'null'}`);
    console.log(`Next largest: ${nextLargest.data}`);
    console.log(`└── ${nextLargest.right ? nextLargest.right.data : 'null'}`);
  }

  find(value) {
    return this.levelOrderTraversalRecursiveWrapper((currentNode) => {
      if (currentNode.data === value) {
        return currentNode;
      }
    }, true);
  }

  /**
   * Performs an iterative level-order traversal of a tree.
   * @example
   * levelOrderTraversalIterative(node => console.log(node))
   * undefined
   * @param {Function} callback - Function applied to each node during traversal.
   * @returns {void} No return value.
   * @description
   *   - Uses a queue to track nodes for traversal.
   *   - Traverses until there are no more nodes in the queue.
   *   - Applies the callback to each node in sequence.
   */
  levelOrderTraversalIterative(callback, exitOnCallback = false) {
    if (!callback) throw new Error('needs callback');
    let keepTraversing = true;
    const queueArray = [];
    this.localRoot = this.root;
    if (queueArray.length === 0) queueArray.push(this.localRoot);
    while (keepTraversing) {
      const shiftedItem = queueArray.shift();
      const callBackResult = callback(shiftedItem);
      if (exitOnCallback && callBackResult) {
        return callBackResult;
      }
      this.pushValidChildren.call(queueArray, shiftedItem);

      keepTraversing = queueArray.length > 0;
    }
  }

  /**
   * Initiates a recursive level-order traversal on a tree structure.
   * @example
   * levelOrderTraversalRecursiveWrapper(callbackFunction, initialQueueArray)
   * undefined
   * @param {Function} callback - Function to execute on each node.
   * @param {Array} queueArray - Queue of nodes for traversal.
   * @returns {Array} Updated queue array after traversal.
   * @description
   *   - Begins traversal with the root node and an optional queue.
   *   - Throws error if a callback function is not provided.
   *   - Starts recursive helper function for processing nodes.
   */
  levelOrderTraversalRecursiveWrapper(callback, exitOnCallback = false) {
    this.localRoot = this.root;
    // if (!queueArray) {
    const queueArray = [];
    queueArray.push(this.root);
    // }
    if (!callback) throw new Error('needs callback');

    /**
     * Performs a level-order traversal on a tree structure.
     * @example
     * levelOrderTraversalRecursive(callbackFunction, initialQueueArray)
     * undefined
     * @param {Function} callback - Function to execute on each node.
     * @param {Array} queueArray - Queue of nodes for traversal.
     * @returns {Array} Updated queue array after traversal.
     * @description
     *   - Operates recursively to traverse nodes level by level.
     *   - Utilizes a queue to manage the order of node processing.
     *   - Calls a method to handle valid children and appends them to the queue.
     */
    const levelOrderTraversalRecursive = (callback, queueArray, exitOnCallback = false) => {
      // BASE CASE
      if (
        Tree.checkNodeChildren(this.localRoot) === ChildrenType.NO_CHILDREN &&
        queueArray.length === 0
      )
        return queueArray;

      // RECURSIVE CASE
      this.localRoot = queueArray.shift();
      const callbackResult = callback(this.localRoot);
      if (exitOnCallback && callbackResult) return callbackResult;
      this.pushValidChildren.call(queueArray, this.localRoot);
      return levelOrderTraversalRecursive(callback, queueArray, true);
    };

    return levelOrderTraversalRecursive(callback, queueArray, true);
  }

  pushValidChildren(parentNode) {
    [parentNode.left, parentNode.right].forEach((child) => {
      if (child !== null && child !== undefined) {
        this.push(child);
      }
    });
  }

  inOrder(callback) {}

  preOrder(callback) {}

  postOrder(callback) {}

  height(node) {}

  depth(node) {}

  isBalanced() {}

  rebalance() {}

  static checkNodeChildren(node) {
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
tree1.insert(0);
tree1.prettyPrint(tree1.root);
// case where inorder successor is direct child of deleteTarget
// tree1.delete(9);

tree1.delete(9);

tree1.prettyPrint(tree1.root);
// tree1.levelOrderTraversalIterative();

// case
// deleteTarget has ...
// left child
// right child
// both child

// deleteTarget vs. inorderSuccessor
// case: inorderSuccessor is direct child

// inorderSuccessor is NOT a direct child

// delete root

// Test cases for Tree.delete() method
console.log('\n--- Testing Tree.delete() method ---');

// Test case 1: Deleting a node with both children
const testTree1 = new Tree([10, 5, 15, 3, 7, 12, 18]);
console.log('Original tree:');
testTree1.prettyPrint(testTree1.root);

console.log('\nDeleting node with value 10 (root):');
testTree1.delete(10);
testTree1.prettyPrint(testTree1.root);

// Test case 2: Deleting a leaf node
const testTree2 = new Tree([10, 5, 15, 3, 7, 12, 18]);
console.log('\nOriginal tree:');
testTree2.prettyPrint(testTree2.root);

console.log('\nDeleting node with value 3 (leaf):');
testTree2.delete(3);
testTree2.prettyPrint(testTree2.root);

// Test case 3: Deleting a node with only right child
const testTree3 = new Tree([10, 5, 15, 7, 12, 18]);
console.log('\nOriginal tree:');
testTree3.prettyPrint(testTree3.root);

console.log('\nDeleting node with value 5 (only right child):');
testTree3.delete(5);
testTree3.prettyPrint(testTree3.root);

// Test case 4: Deleting a node with only left child
const testTree4 = new Tree([10, 5, 15, 3, 12, 18]);
console.log('\nOriginal tree:');
testTree4.prettyPrint(testTree4.root);

console.log('\nDeleting node with value 5 (only left child):');
testTree4.delete(5);
testTree4.prettyPrint(testTree4.root);

// Helper function to check if the tree is still a valid BST
function isBST(node, min = null, max = null) {
  if (node === null) return true;

  if ((min !== null && node.data <= min) || (max !== null && node.data >= max)) {
    return false;
  }

  return isBST(node.left, min, node.data) && isBST(node.right, node.data, max);
}

// Check if all test trees are still valid BSTs after deletion
console.log('\nChecking if trees are still valid BSTs after deletion:');
console.log('Test Tree 1 is a valid BST:', isBST(testTree1.root));
console.log('Test Tree 2 is a valid BST:', isBST(testTree2.root));
console.log('Test Tree 3 is a valid BST:', isBST(testTree3.root));
console.log('Test Tree 4 is a valid BST:', isBST(testTree4.root));
