import Tree from './index';

const sampleArray2 = [
  1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324, 500, 350, 400, 450, 7000, 5000, 5500, 4500, 5100,
];
const tree1 = new Tree(sampleArray2);

describe('Class bst', () => {
  it('exists', () => {
    expect(Tree).toBeDefined();
  });

  describe('bst.delete', () => {
    it('exists', () => expect(tree1.delete).toBeDefined());
  });

//   const bstToArray = [];
//   // call traversal, save result to array
//   tree1.levelOrderTraversalIterative(() => bstToArray.push(),false);
//   console.log('bstToArray:', bstToArray)
});
