import {expect} from 'chai'

import {ago, duration} from '../../src/lib/time.js'

describe('time', function () {
  describe('ago', function () {
    it('shows seconds for < 60s', function () {
      const since = new Date(Date.now() - (30 * 1000))
      expect(ago(since)).to.match(/~ \d+s ago/)
    })

    it('shows minutes for < 1h', function () {
      const since = new Date(Date.now() - (5 * 60 * 1000))
      expect(ago(since)).to.match(/~ \d+m ago/)
    })

    it('shows hours for < 25h', function () {
      const since = new Date(Date.now() - (3 * 60 * 60 * 1000))
      expect(ago(since)).to.match(/~ \d+h ago/)
    })

    it('shows date only for >= 25h', function () {
      const since = new Date(Date.now() - (30 * 60 * 60 * 1000))
      expect(ago(since)).not.to.contain('ago')
    })
  })

  describe('duration', function () {
    it('shows hours and minutes', function () {
      const from = new Date('2024-01-01T00:00:00Z')
      const to = new Date('2024-01-01T01:30:00Z')
      expect(duration(from, to)).to.equal('1h 30m')
    })

    it('shows minutes and seconds', function () {
      const from = new Date('2024-01-01T00:00:00Z')
      const to = new Date('2024-01-01T00:05:15Z')
      expect(duration(from, to)).to.equal('5m 15s')
    })

    it('shows seconds only', function () {
      const from = new Date('2024-01-01T00:00:00Z')
      const to = new Date('2024-01-01T00:00:45Z')
      expect(duration(from, to)).to.equal('45s')
    })

    it('returns empty string for zero duration', function () {
      const d = new Date('2024-01-01T00:00:00Z')
      expect(duration(d, d)).to.equal('')
    })
  })
})
