/* global Vue, $ */

const DATA_URL = 'https://api.jsonbin.io/b/5aafd05d5d1dee610788f818/latest'
const EMPTY_RECORD = { fields: {} }
const CATEGORY_ALL = { id: null, fields: { Name: '全部扩展' } }

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
    this.fetchData()
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
    fetchData () {
      $.getJSON(DATA_URL, data => {
        this.categories = [CATEGORY_ALL].concat(data.categories)
        this.authors = data.authors
        this.extensions = data.extensions
        this.setActiveCategory()
      })
    }
  }
})
