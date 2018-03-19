/* global Vue, $ */

const BASE_URL = 'https://api.airtable.com/v0/app9lJrTtrcn4wEUf/'
const EMPTY_RECORD = { fields: {} }
const CATEGORY_ALL = { id: null, fields: { Name: '全部扩展' } }

function fetchRecords (table) {
  return $.ajax({
    url: BASE_URL + table,
    dataType: 'json',
    headers: { 'Authorization': 'Bearer keyYLxMmgG51LPZ77' }
  }).then(data => data.records)
}

Vue.component('category', {
  template: '#tpl-category',
  props: ['category', 'active'],
  computed: {
    categoryLink () {
      if (this.category.id) {
        return '#category/' + this.category.id
      } else {
        return '#'
      }
    }
  },
  methods: {
    setActive () {
      this.$emit('active', this.category.id)
    }
  }
})

Vue.component('extension', {
  template: '#tpl-extension',
  props: ['extension'],
  computed: {
    extensionId () {
      return '#' + this.extension.id
    },
    category () {
      return this.$parent.findCategory(this.extension.fields.Category[0]) || EMPTY_RECORD
    },
    author () {
      return this.$parent.findAuthor(this.extension.fields.Author[0]) || EMPTY_RECORD
    },
    thumb () {
      return this.extension.fields.Screenshots[0].thumbnails.large.url
    }
  }
})

var app = new Vue({
  el: '#app',
  data () {
    return {
      categories: [],
      authors: [],
      extensions: [],
      activeCategoryId: null
    }
  },
  created () {
    this.fetchCategories()
    this.fetchAuthors()
    this.fetchExtensions()
  },
  computed: {
    filteredExtensions () {
      if (this.activeCategoryId) {
        return this.extensions.filter(r => r.fields.Category.indexOf(this.activeCategoryId) >= 0)
      } else {
        return this.extensions
      }
    }
  },
  methods: {
    initActiveCategory () {
      var hash = window.location.hash
      if (/#category\/\w+$/.test(hash)) {
        this.setActiveCategory(hash.replace('#category/', ''))
      } else {
        this.setActiveCategory(null)
      }
    },
    setActiveCategory (id) {
      this.activeCategoryId = id
    },
    findAuthor (id) {
      return this.authors.find(record => record.id === id)
    },
    findCategory (id) {
      return this.categories.find(record => record.id === id)
    },
    fetchCategories () {
      fetchRecords('categories')
        .then(categories => { this.categories = [CATEGORY_ALL].concat(categories) })
        .then(() => this.initActiveCategory())
    },
    fetchExtensions () {
      fetchRecords('extensions')
        .then(extensions => { this.extensions = extensions })
    },
    fetchAuthors () {
      fetchRecords('authors')
        .then(authors => { this.authors = authors })
    }
  }
})
