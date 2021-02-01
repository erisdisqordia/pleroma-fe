import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faEnvelope,
  faLock,
  faLockOpen,
  faGlobe
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faEnvelope,
  faGlobe,
  faLock,
  faLockOpen
)

const ScopeSelector = {
  props: [
    'showAll',
    'userDefault',
    'originalScope',
    'initialScope',
    'onScopeChange'
  ],
  data () {
    return {
      currentScope: this.initialScope
    }
  },
  computed: {
    showNothing () {
      return !this.showPublic && !this.showUnlisted && !this.showPrivate && !this.showDirect
    },
    showPublic () {
      return this.originalScope !== 'direct' && this.shouldShow('public')
    },
    showUnlisted () {
      return this.originalScope !== 'direct' && this.shouldShow('unlisted')
    },
    showPrivate () {
      return this.originalScope !== 'direct' && this.shouldShow('private')
    },
    showDirect () {
      return this.shouldShow('direct')
    },
    css () {
      return {
        public: { selected: this.currentScope === 'public' },
        unlisted: { selected: this.currentScope === 'unlisted' },
        private: { selected: this.currentScope === 'private' },
        direct: { selected: this.currentScope === 'direct' }
      }
    }
  },
  methods: {
    shouldShow (scope) {
      return this.showAll ||
        this.currentScope === scope ||
        this.originalScope === scope ||
        this.userDefault === scope ||
        scope === 'direct'
    },
    changeVis (scope) {
      this.currentScope = scope
      this.onScopeChange && this.onScopeChange(scope)
    }
  }
}

export default ScopeSelector
