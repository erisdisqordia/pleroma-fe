import { shallowMount, createLocalVue } from '@vue/test-utils'
import EmojiInput from 'src/components/emoji_input/emoji_input.vue'

const generateInput = (value, padEmoji = true) => {
  const localVue = createLocalVue()
  localVue.directive('click-outside', () => {})
  const wrapper = shallowMount(EmojiInput, {
    propsData: {
      suggest: () => [],
      enableEmojiPicker: true,
      value
    },
    mocks: {
      $store: {
        getters: {
          mergedConfig: {
            padEmoji
          }
        }
      }
    },
    slots: {
      default: '<input />'
    },
    localVue
  })
  return [wrapper, localVue]
}

describe('EmojiInput', () => {
  describe('insertion mechanism', () => {
    it('inserts string at the end with trailing space', () => {
      const initialString = 'Testing'
      const [wrapper] = generateInput(initialString)
      const input = wrapper.find('input')
      input.setValue(initialString)
      wrapper.setData({ caret: initialString.length })
      wrapper.vm.insert({ insertion: '(test)', keepOpen: false })
      const inputEvents = wrapper.emitted().input
      expect(inputEvents[inputEvents.length - 1][0]).to.eql('Testing (test) ')
    })

    it('inserts string at the end with trailing space (source has a trailing space)', () => {
      const initialString = 'Testing '
      const [wrapper] = generateInput(initialString)
      const input = wrapper.find('input')
      input.setValue(initialString)
      wrapper.setData({ caret: initialString.length })
      wrapper.vm.insert({ insertion: '(test)', keepOpen: false })
      const inputEvents = wrapper.emitted().input
      expect(inputEvents[inputEvents.length - 1][0]).to.eql('Testing (test) ')
    })

    it('inserts string at the begginning without leading space', () => {
      const initialString = 'Testing'
      const [wrapper] = generateInput(initialString)
      const input = wrapper.find('input')
      input.setValue(initialString)
      wrapper.setData({ caret: 0 })
      wrapper.vm.insert({ insertion: '(test)', keepOpen: false })
      const inputEvents = wrapper.emitted().input
      expect(inputEvents[inputEvents.length - 1][0]).to.eql('(test) Testing')
    })

    it('inserts string between words without creating extra spaces', () => {
      const initialString = 'Spurdo Sparde'
      const [wrapper] = generateInput(initialString)
      const input = wrapper.find('input')
      input.setValue(initialString)
      wrapper.setData({ caret: 6 })
      wrapper.vm.insert({ insertion: ':ebin:', keepOpen: false })
      const inputEvents = wrapper.emitted().input
      expect(inputEvents[inputEvents.length - 1][0]).to.eql('Spurdo :ebin: Sparde')
    })

    it('inserts string between words without creating extra spaces (other caret)', () => {
      const initialString = 'Spurdo Sparde'
      const [wrapper] = generateInput(initialString)
      const input = wrapper.find('input')
      input.setValue(initialString)
      wrapper.setData({ caret: 7 })
      wrapper.vm.insert({ insertion: ':ebin:', keepOpen: false })
      const inputEvents = wrapper.emitted().input
      expect(inputEvents[inputEvents.length - 1][0]).to.eql('Spurdo :ebin: Sparde')
    })

    it('inserts string without any padding if padEmoji setting is set to false', () => {
      const initialString = 'Eat some spam!'
      const [wrapper] = generateInput(initialString, false)
      const input = wrapper.find('input')
      input.setValue(initialString)
      wrapper.setData({ caret: initialString.length, keepOpen: false })
      wrapper.vm.insert({ insertion: ':spam:' })
      const inputEvents = wrapper.emitted().input
      expect(inputEvents[inputEvents.length - 1][0]).to.eql('Eat some spam!:spam:')
    })

    it('correctly sets caret after insertion at beginning', (done) => {
      const initialString = '1234'
      const [wrapper, vue] = generateInput(initialString)
      const input = wrapper.find('input')
      input.setValue(initialString)
      wrapper.setData({ caret: 0 })
      wrapper.vm.insert({ insertion: '1234', keepOpen: false })
      vue.nextTick(() => {
        expect(wrapper.vm.caret).to.eql(5)
        done()
      })
    })

    it('correctly sets caret after insertion at end', (done) => {
      const initialString = '1234'
      const [wrapper, vue] = generateInput(initialString)
      const input = wrapper.find('input')
      input.setValue(initialString)
      wrapper.setData({ caret: initialString.length })
      wrapper.vm.insert({ insertion: '1234', keepOpen: false })
      vue.nextTick(() => {
        expect(wrapper.vm.caret).to.eql(10)
        done()
      })
    })

    it('correctly sets caret after insertion if padEmoji setting is set to false', (done) => {
      const initialString = '1234'
      const [wrapper, vue] = generateInput(initialString, false)
      const input = wrapper.find('input')
      input.setValue(initialString)
      wrapper.setData({ caret: initialString.length })
      wrapper.vm.insert({ insertion: '1234', keepOpen: false })
      vue.nextTick(() => {
        expect(wrapper.vm.caret).to.eql(8)
        done()
      })
    })
  })
})
