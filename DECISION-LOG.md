- **Context** or problem you were solving
- **Options considered**
- **Pros and cons** of each option
- **Why you made the decision** you did
- **Outcome**

  - ~~Context (IGNORE. NOT NEEDED)~~

    - ~~In case of only parent node having just 1 child, Tree.delete() needs a way to track if childnode was on the right OR left side of the parent. This is so that once the child node is set to null, we can then set parent.left or parent.right to null. Otherwise, `prettyPrint` throws TypeError due to an undefined node~~
  - ~~Options~~

    - ~~(1) Pass shouldGoLeft variable (true/false) as argument to the function `callback`() inside `traverse()` .THEN, ` Tree.deleteCallback(nodeToGoTo, shouldGoLeft)`sets `this.localRoot.right/left` to null.~~

      - ~~Pros:~~
        - ~~Whether or not child was on the left or right side of the parent might be useful information for other methods.~~
      - ~~Cons:~~
        - ~~1 extra argument that might not always be needed.~~
        - ~~Some extra memory used, although `callback() `is only used when reaching base case, so it's not like every recursive call will use~~
    - ~~(2) Set  Check if `localRoot.left` or `localRoot.right` is undefined. If it is, set it to null instead~~

      - ~~Pros:~~
        - ~~Simple~~
      - ~~Cons:~~
    - ~~(3)~~
  - Context

    - Tree.delete() needs a way to check if the node has 1 child, 2 children, or no children.
  - Options

    - return object with hasLeftChild & hasRightChild properties
    - use enums
      - pros:
        - get to learn a new concept
        - easy to read
      - cons:
        - not flexible because of literal
  - Decision: try enums first, then object

  `<-------------------------------------------------------------------------------->`
- Context

  - `buildTree(array)`: passed-in array is just a array of values, and I need a way to construct subtrees, and link them all together.
- Options

  - A) Convert the starting array immediately (after sorting and removing duplicates) into an array of Node objects. Objects will be empty in the beginning except for data
    - Pros
      - A_P1) Convenient? Not sure by much more
    - Cons
      - A_C1) Memory expensive - copies the original array. This would then need to be passed into *every* recursion
        - how much memory is it?
          - given original array size n, O(n * NodeObjectSize)
        - COUNTERPOINT: the original array is being REPLACED (after having made a copy), and that new array is being passed instead. So the only thing that adds to the cost is the fact that every array item is now an object
      - A_C2) Related to above AC1 - it wouldn't scale
      - A_C3) Defeats the purpose of building a tree if I use an array to access the elements. We don't really NEED an array or index-access, since the resulting tree can be traversed starting from the root node anyway.
  - B) Create Node objects as you go, and don't use them in an array
    - Pros
      - B_P1) saves a bit of memory (really not sure if this is true)
        - O(h * NodeObjectSize), which means O(log n *NodeObjectSize) since h (height) of balanced tree is log n.
        - BUT, I don't think know if this is the case if we're building a BST from scratch, and the `h = log n `is  for an existing tree
    - Cons
      - B_C1) A bit harder to code
- Decision: go with B. Memory difference may not be significant, but I think it defeats the whole purpose of building a tree if I'm keeping track of it in an array.
