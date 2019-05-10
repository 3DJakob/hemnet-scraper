const fetch = require('node-fetch')
const JSDOM = require('jsdom').JSDOM

let selector = '.property__container .item .clear-children'
let url = 'https://www.hemnet.se/bostad/villa-4rum-alvsoden-ornskoldsviks-kommun-alvsoden-113-16096759'

fetch(url)
  .then(resp => resp.text())
  .then(text => {
    let dom = new JSDOM(text)
    const infoPane = dom.window.document.querySelector('.attribute-definition-list.mb2')
  
    const defs = getDefinitions(infoPane)
    const terms = getTerms(infoPane)

    printStr = getTitle(dom) + '\n'
    defs.forEach(def => {
      printStr += def + '\n'
    })

    exportFile(printStr)
   })


  const getAttribute = (infoPane, tag) => {
    let list = [...infoPane.querySelectorAll(tag)]
      .map(a => a.textContent.replace(/\n/g, '').trim())
    return list
  }

  const getTerms = (infoPane) => {
    return getAttribute(infoPane, 'dt')
  }

  const getDefinitions = (infoPane) => {
    return getAttribute(infoPane, 'dd')
  }

  const exportFile = (string) => {
    const fs = require('fs')
    fs.writeFile(__dirname + '/output.txt', string, function(err) {
        if(err) {
            return console.log(err)
        }
        console.log('The file was saved!')
    }); 
  }

  const getTitle = (dom) => {
    return dom.window.document.querySelector('h1').innerHTML
  }
