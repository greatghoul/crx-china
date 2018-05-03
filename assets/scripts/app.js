/* global Vue, $, _ */

const DATA_URL = 'https://gist.githubusercontent.com/greatghoul/08f1269e370f967b2cd9c423272eae6d/raw/data.json'
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
      var category = _.get(this.extension, 'fields.Category[0]')
      return this.$parent.findCategory(category) || EMPTY_RECORD
    },
    author () {
      var author = _.get(this.extension, 'fields.Author[0]')
      return this.$parent.findAuthor(author) || EMPTY_RECORD
    },
    thumb () {
      return _.get(this.extension, 'fields.Screenshots[0].thumbnails.large.url')
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
        var categories = _.filter(data.categories, (item) => item.fields.Name)
        this.categories = [CATEGORY_ALL].concat(categories)
        this.authors = _.filter(data.authors, (item) => item.fields.Name)
        this.extensions = _.filter(data.extensions, (item) => item.fields.Name)
        this.setActiveCategory()
      })
    }
  }
})
