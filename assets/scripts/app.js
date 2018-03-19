/* global Vue, $ */

// "https://api.airtable.com/v0/app9lJrTtrcn4wEUf/Table%201?maxRecords=3&view=Grid%20view" \
// -H "Authorization: Bearer keyYLxMmgG51LPZ77"
const BASE_URL = 'https://api.airtable.com/v0/app9lJrTtrcn4wEUf/'
const EMPTY_RECORD = { fields: {} }

function fetchRecords (table) {
  return $.ajax({
    url: BASE_URL + table,
    dataType: 'json',
    headers: { 'Authorization': 'Bearer keyYLxMmgG51LPZ77' }
  }).then(data => data.records)
}

Vue.component('category', {
  template: '#tpl-category',
  props: ['category'],
  computed: {
    categoryLink () {
      return '#' + this.category.id
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
      extensions: []
    }
  },
  created () {
    this.fetchCategories()
    this.fetchAuthors()
    this.fetchExtensions()
  },
  methods: {
    findAuthor (id) {
      return this.authors.find(record => record.id == id)
    },
    findCategory (id) {
      return this.categories.find(record => record.id == id)
    },
    fetchCategories () {
     fetchRecords('categories').then(categories => this.categories = categories)
    },
    fetchExtensions () {
      fetchRecords('extensions').then(extensions => this.extensions = extensions)
    },
    fetchAuthors () {
      fetchRecords('authors').then(authors => this.authors = authors)
    }
  }
})
