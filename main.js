import { promises as fs } from 'fs';
import HTMLParser from 'node-html-parser'

async function loadText() {
    try {
        wordsStates = JSON.parse(await fs.readFile('./today.json'))
        console.log('reading from local...')
    } catch(e) {
        console.log('reading from remote...')
        const res = await fetch("https://cemantix.certitudes.org/pedantix")
        const text = await res.text()
        const html = HTMLParser.parse(text)
        const words = html.querySelectorAll('#article .w')
        const paragraphs = html.querySelectorAll('.game h2, #article > p')
        wordsStates = new Array(paragraphs.length - 1).fill().map(u => ([]));
        wordsStates.forEach((p, i) => {
            if(i === 1) return
            paragraphs[i].querySelectorAll('.w').forEach(w => p.push({found: false, currentValue: null}))
        })
        console.log(wordsStates)
    }
}

async function renderText() {
    console.log('Rendering...')
    await fs.writeFile('./preview.txt', wordsStates.map(p => {
        return p.map(w => {
            if(w.round) return w.currentValue
            if(!w.currentValue) return 'null'
            return w.currentValue
        })
    }).join('\n'))
}

async function saveTodayState() {
    await fs.writeFile('./today.json', JSON.stringify(wordsStates))
}

async function makeAGuess(guess) {
    const res = await fetch("https://cemantix.certitudes.org/pedantix/score", {
        "headers": {
            "Content-Type": "application/json",
            "Origin": "https://cemantix.certitudes.org",
        },
        "body": JSON.stringify({"word":guess,"answer":[guess,guess]}),
        "method": "POST",
    })
    const data =  await res.json()

    return data
}

let wordsStates = []

async function main() {
    await loadText()
    await renderText()
    
    for(const word of [{"type":"dét.","frequency":1050561,"label":"le"}]) {
        const res = await makeAGuess(word.label)
        for(const [index, value] of Object.entries(res.score)) {
            if(typeof value === "string") {
                wordsStates[index].currentValue = value
                wordsStates[index].found = true
            } else wordsStates[index].currentValue = value
        }
    }
    // console.log(wordsStates)
    await renderText()
    // await saveTodayState()
}

main()