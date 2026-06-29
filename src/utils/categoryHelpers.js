import { categoryTree } from '@/data/categories'

export function flattenCategoryTree(tree = categoryTree, parentId = null) {
  const flat = []
  for (const node of tree) {
    const { children, ...rest } = node
    flat.push({ ...rest, parentId })
    if (children?.length) {
      flat.push(...flattenCategoryTree(children, node.id))
    }
  }
  return flat
}

export function findCategoryById(id, tree = categoryTree) {
  const numId = Number(id)
  for (const node of tree) {
    if (node.id === numId) return node
    if (node.children) {
      const found = findCategoryById(numId, node.children)
      if (found) return found
    }
  }
  return null
}

export function findCategoryPath(id, tree = categoryTree, path = []) {
  const numId = Number(id)
  for (const node of tree) {
    const next = [...path, node]
    if (node.id === numId) return next
    if (node.children) {
      const found = findCategoryPath(numId, node.children, next)
      if (found) return found
    }
  }
  return null
}

function collectDescendantIds(node) {
  const ids = [node.id]
  if (node.children) {
    for (const child of node.children) {
      ids.push(...collectDescendantIds(child))
    }
  }
  return ids
}

export function getDescendantIds(id, tree = categoryTree) {
  const node = findCategoryById(id, tree)
  if (!node) return [Number(id)]
  return collectDescendantIds(node)
}

export function getLeafCategories(tree = categoryTree) {
  const leaves = []
  for (const node of tree) {
    if (node.children?.length) {
      leaves.push(...getLeafCategories(node.children))
    } else {
      leaves.push(node)
    }
  }
  return leaves
}

export function getRootCategoryId(categoryId, tree = categoryTree) {
  const path = findCategoryPath(categoryId, tree)
  return path?.[0]?.id ?? null
}

export function getListingCategories(tree = categoryTree) {
  return getLeafCategories(tree)
}
