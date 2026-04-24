function processData(data) {

  const invalid_entries = [];
  const duplicate_edges = [];

  const seenEdges = new Set();
  const childParentMap = {};

  const adjacency = {};

  // VALIDATION
  for (let item of data) {

    const edge = String(item).trim();

    if (!/^[A-Z]->[A-Z]$/.test(edge)) {
      invalid_entries.push(edge);
      continue;
    }

    const [parent, child] = edge.split("->");

    if (parent === child) {
      invalid_entries.push(edge);
      continue;
    }

    if (seenEdges.has(edge)) {

      if (!duplicate_edges.includes(edge)) {
        duplicate_edges.push(edge);
      }

      continue;
    }

    seenEdges.add(edge);

    // MULTI PARENT CHECK
    if (childParentMap[child]) {
      continue;
    }

    childParentMap[child] = parent;

    if (!adjacency[parent]) {
      adjacency[parent] = [];
    }

    adjacency[parent].push(child);

    if (!adjacency[child]) {
      adjacency[child] = [];
    }
  }

  // FIND ROOTS
  const allNodes = Object.keys(adjacency);

  const childNodes = new Set(Object.keys(childParentMap));

  let roots = allNodes.filter(node => !childNodes.has(node));

  // if no roots → possible cycle
  if (roots.length === 0 && allNodes.length > 0) {
    roots = [allNodes.sort()[0]];
  }

  const hierarchies = [];

  let total_trees = 0;
  let total_cycles = 0;

  let largestDepth = 0;
  let largest_tree_root = "";

  // DFS cycle detection
  function hasCycle(node, visiting, visited) {

    if (visiting.has(node)) {
      return true;
    }

    if (visited.has(node)) {
      return false;
    }

    visiting.add(node);

    for (let child of adjacency[node]) {
      if (hasCycle(child, visiting, visited)) {
        return true;
      }
    }

    visiting.delete(node);

    visited.add(node);

    return false;
  }

  // build tree object
  function buildTree(node) {

    const result = {};

    for (let child of adjacency[node]) {
      result[child] = buildTree(child);
    }

    return result;
  }

  // calculate depth
  function getDepth(node) {

    if (adjacency[node].length === 0) {
      return 1;
    }

    let maxDepth = 0;

    for (let child of adjacency[node]) {
      maxDepth = Math.max(maxDepth, getDepth(child));
    }

    return maxDepth + 1;
  }

  for (let root of roots) {

    const cycle = hasCycle(
      root,
      new Set(),
      new Set()
    );

    if (cycle) {

      total_cycles++;

      hierarchies.push({
        root,
        tree: {},
        has_cycle: true
      });

    } else {

      total_trees++;

      const tree = {};
      tree[root] = buildTree(root);

      const depth = getDepth(root);

      if (
        depth > largestDepth ||
        (
          depth === largestDepth &&
          root < largest_tree_root
        )
      ) {
        largestDepth = depth;
        largest_tree_root = root;
      }

      hierarchies.push({
        root,
        tree,
        depth
      });
    }
  }

  return {

    user_id: "Pratibhasingh_12082005",

    email_id: "ps6543@srmist.edu.in",

    college_roll_number: "RA2311003020316",

    hierarchies,

    invalid_entries,

    duplicate_edges,

    summary: {
      total_trees,
      total_cycles,
      largest_tree_root
    }
  };
}

module.exports = { processData };