import { processHtml } from 'src/services/tiny_post_html_processor/tiny_post_html_processor.service.js'

describe('TinyPostHTMLProcessor', () => {
  describe('with processor that keeps original line should not make any changes to HTML when', () => {
    const processorKeep = (line) => line
    it('fed with regular HTML with newlines', () => {
      const inputOutput = '1<br/>2<p class="lol">3 4</p> 5 \n 6 <p > 7 <br> 8 </p> <br>\n<br/>'
      expect(processHtml(inputOutput, processorKeep)).to.eql(inputOutput)
    })

    it('fed with possibly broken HTML with invalid tags/composition', () => {
      const inputOutput = '<feeee dwdwddddddw> <i>ayy<b>lm</i>ao</b> </section>'
      expect(processHtml(inputOutput, processorKeep)).to.eql(inputOutput)
    })

    it('fed with very broken HTML with broken composition', () => {
      const inputOutput = '</p> lmao what </div> whats going on <div> wha <p>'
      expect(processHtml(inputOutput, processorKeep)).to.eql(inputOutput)
    })

    it('fed with sorta valid HTML but tags aren\'t closed', () => {
      const inputOutput = 'just leaving a <div> hanging'
      expect(processHtml(inputOutput, processorKeep)).to.eql(inputOutput)
    })

    it('fed with not really HTML at this point... tags that aren\'t finished', () => {
      const inputOutput = 'do you expect me to finish this <div class='
      expect(processHtml(inputOutput, processorKeep)).to.eql(inputOutput)
    })

    it('fed with dubiously valid HTML (p within p and also div inside p)', () => {
      const inputOutput = 'look ma <p> p \nwithin <p> p! </p> and a <br/><div>div!</div></p>'
      expect(processHtml(inputOutput, processorKeep)).to.eql(inputOutput)
    })

    it('fed with maybe valid HTML? self-closing divs and ps', () => {
      const inputOutput = 'a <div class="what"/> what now <p aria-label="wtf"/> ?'
      expect(processHtml(inputOutput, processorKeep)).to.eql(inputOutput)
    })

    it('fed with valid XHTML containing a CDATA', () => {
      const inputOutput = 'Yes, it is me, <![CDATA[DIO]]>'
      expect(processHtml(inputOutput, processorKeep)).to.eql(inputOutput)
    })
  })
  describe('with processor that replaces lines with word "_" should match expected line when', () => {
    const processorReplace = (line) => '_'
    it('fed with regular HTML with newlines', () => {
      const input = '1<br/>2<p class="lol">3 4</p> 5 \n 6 <p > 7 <br> 8 </p> <br>\n<br/>'
      const output = '_<br/>_<p class="lol">_</p>_\n_<p >_<br>_</p> <br>\n<br/>'
      expect(processHtml(input, processorReplace)).to.eql(output)
    })

    it('fed with possibly broken HTML with invalid tags/composition', () => {
      const input = '<feeee dwdwddddddw> <i>ayy<b>lm</i>ao</b> </section>'
      const output = '_'
      expect(processHtml(input, processorReplace)).to.eql(output)
    })

    it('fed with very broken HTML with broken composition', () => {
      const input = '</p> lmao what </div> whats going on <div> wha <p>'
      const output = '</p>_</div>_<div>_<p>'
      expect(processHtml(input, processorReplace)).to.eql(output)
    })

    it('fed with sorta valid HTML but tags aren\'t closed', () => {
      const input = 'just leaving a <div> hanging'
      const output = '_<div>_'
      expect(processHtml(input, processorReplace)).to.eql(output)
    })

    it('fed with not really HTML at this point... tags that aren\'t finished', () => {
      const input = 'do you expect me to finish this <div class='
      const output = '_'
      expect(processHtml(input, processorReplace)).to.eql(output)
    })

    it('fed with dubiously valid HTML (p within p and also div inside p)', () => {
      const input = 'look ma <p> p \nwithin <p> p! </p> and a <br/><div>div!</div></p>'
      const output = '_<p>_\n_<p>_</p>_<br/><div>_</div></p>'
      expect(processHtml(input, processorReplace)).to.eql(output)
    })

    it('fed with maybe valid HTML? self-closing divs and ps', () => {
      const input = 'a <div class="what"/> what now <p aria-label="wtf"/> ?'
      const output = '_<div class="what"/>_<p aria-label="wtf"/>_'
      expect(processHtml(input, processorReplace)).to.eql(output)
    })

    it('fed with valid XHTML containing a CDATA', () => {
      const input = 'Yes, it is me, <![CDATA[DIO]]>'
      const output = '_'
      expect(processHtml(input, processorReplace)).to.eql(output)
    })
  })
})
