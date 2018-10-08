'use strict'

class QueryBuilder {
  constructor(visitor) {
    this.visitor = visitor
    this.joins = {}
    this.relationMap = {}
  }

  where(node) {
    if (node == null) {
      return ""
    }
    return this[node.type](node.where)
  }

  whereElement(node) {
    if (node == null) {
      return ""
    }
    const path = node.field.path.join('.')

    // relation field on select, where
    // 1. get value by map __r => __c
    // 2. add {mapped_key, mapped_object} to join objects
    if (node.field.path.length > 1) {
      const relation = this.relationMap[node.field.path[0]]
      this.joins[node.field.path[0]] = relation
    }
    // 3. build query
    //    left join {mapped_object} on {mapped_key} == {mapped_object.id}
    //    select {mapped_object}.{field}
    //    where {mapped_object}.{field}

    // sub query on select
    // 1. get value by map __r => __c
    // 2. add {mapped_key, mapped_object} to preload objects
    // 3. preload query
    //    select {field, ...} from {mapped_object} where {mapped_key} = {origin}.id
    // 4. build struct
    //    id => list
    //    get list by id and build as field
    const expression = node.value.accept(this.visitor)
    const type = node.value.type()
    switch (type.name.join('.')) {
      case 'String':
        return `${path} ${node.op} '${expression.value}'`
      case 'Integer':
        return `${path} ${node.op} ${expression.value}`
      case 'Double':
        return `${path} ${node.op} ${expression.value}`
    }
  }

  whereLogical(node) {
    if (!node) {
      return ''
    }
    const left = this.where(node.left)
    const right = this.where(node.right)
    return `${left} ${node.logical} ${right}`
  }

  select(node) {
    node.selectFields.forEach((selectField) => {
      if (selectField.path && selectField.path.length > 1) {
        const relation = this.relationMap[selectField.path[0]]
        this.joins[selectField.path[0]] = relation
      }
    })
  }
}

module.exports = QueryBuilder