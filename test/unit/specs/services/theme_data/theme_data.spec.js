import { getLayersArray, topoSort } from 'src/services/theme_data/theme_data.service.js'

describe('Theme Data utility functions', () => {
  describe('getLayersArray', () => {
    const fixture = {
      layer1: null,
      layer2: 'layer1',
      layer3a: 'layer2',
      layer3b: 'layer2'
    }

    it('should expand layers properly (3b)', () => {
      const out = getLayersArray('layer3b', fixture)
      expect(out).to.eql(['layer1', 'layer2', 'layer3b'])
    })

    it('should expand layers properly (3a)', () => {
      const out = getLayersArray('layer3a', fixture)
      expect(out).to.eql(['layer1', 'layer2', 'layer3a'])
    })

    it('should expand layers properly (2)', () => {
      const out = getLayersArray('layer2', fixture)
      expect(out).to.eql(['layer1', 'layer2'])
    })

    it('should expand layers properly (1)', () => {
      const out = getLayersArray('layer1', fixture)
      expect(out).to.eql(['layer1'])
    })
  })

  describe('topoSort', () => {
    const fixture1 = {
      layerA: [],
      layer1A: ['layerA'],
      layer2A: ['layer1A'],
      layerB: [],
      layer1B: ['layerB'],
      layer2B: ['layer1B'],
      layer3AB: ['layer2B', 'layer2A']
    }

    // Same thing but messed up order
    const fixture2 = {
      layer1A: ['layerA'],
      layer1B: ['layerB'],
      layer2A: ['layer1A'],
      layerB: [],
      layer3AB: ['layer2B', 'layer2A'],
      layer2B: ['layer1B'],
      layerA: []
    }

    it('should make a topologically sorted array', () => {
      const out = topoSort(fixture1, (node, inheritance) => inheritance[node])
      // This basically checks all ordering that matters
      expect(out.indexOf('layerA')).to.be.below(out.indexOf('layer1A'))
      expect(out.indexOf('layer1A')).to.be.below(out.indexOf('layer2A'))
      expect(out.indexOf('layerB')).to.be.below(out.indexOf('layer1B'))
      expect(out.indexOf('layer1B')).to.be.below(out.indexOf('layer2B'))
      expect(out.indexOf('layer2A')).to.be.below(out.indexOf('layer3AB'))
      expect(out.indexOf('layer2B')).to.be.below(out.indexOf('layer3AB'))
    })

    it('order in object shouldn\'t matter', () => {
      const out = topoSort(fixture2, (node, inheritance) => inheritance[node])
      // This basically checks all ordering that matters
      expect(out.indexOf('layerA')).to.be.below(out.indexOf('layer1A'))
      expect(out.indexOf('layer1A')).to.be.below(out.indexOf('layer2A'))
      expect(out.indexOf('layerB')).to.be.below(out.indexOf('layer1B'))
      expect(out.indexOf('layer1B')).to.be.below(out.indexOf('layer2B'))
      expect(out.indexOf('layer2A')).to.be.below(out.indexOf('layer3AB'))
      expect(out.indexOf('layer2B')).to.be.below(out.indexOf('layer3AB'))
    })

    it('dependentless nodes should be first', () => {
      const out = topoSort(fixture2, (node, inheritance) => inheritance[node])
      // This basically checks all ordering that matters
      expect(out.indexOf('layerA')).to.eql(0)
      expect(out.indexOf('layerB')).to.eql(1)
    })

    it('ignores cyclic dependencies', () => {
      const out = topoSort({ a: 'b', b: 'a', c: 'a' }, (node, inheritance) => [inheritance[node]])
      expect(out.indexOf('a')).to.be.below(out.indexOf('c'))
    })
  })
})
