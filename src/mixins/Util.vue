<script>
  import VueScrollTo from 'vue-scrollto'
  import {concat, filter, head, initial, join, keys, last, split, trim} from 'lodash'

  export default {
    name: 'Utils',
    computed: {
      titleHexColor() {
        const theme = this.$vuetify.theme
        return theme.dark ? theme.themes.dark.title : theme.themes.light.title
      }
    },
    methods: {
      getCatalogListings(department) {
        return filter(keys(department.catalogListings), trim)
      },
      oxfordJoin: arr => {
        switch(arr.length) {
        case 1: return head(arr)
        case 2: return `${head(arr)} and ${last(arr)}`
        default: return join(concat(initial(arr), ` and ${last(arr)}`), ', ')
        }
      },
      pluralize: (noun, count, substitutions = {}, pluralSuffix = 's') => {
        return (`${substitutions[count] || substitutions['other'] || count} ` + (count !== 1 ? `${noun}${pluralSuffix}` : noun))
      },
      scrollTo: anchor => VueScrollTo.scrollTo(anchor, 400),
      scrollToTop: delay => VueScrollTo.scrollTo('#app', (delay || 400)),
      stripAnchorRef: path => split(path, '#', 1)[0]
    }
  }
</script>
