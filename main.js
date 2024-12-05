import { promises as fs } from 'fs';
import HTMLParser from 'node-html-parser'
import { exit } from 'process';

async function sleep(timeInSeconds = 1) {
    return new Promise((resolve, reject) => setTimeout(() => resolve(), timeInSeconds * 1000))
}

async function loadText() {
    try {
        wordsStates = JSON.parse(await fs.readFile('./today.json'))
        console.log('reading from local...')
    } catch(e) {
        console.log('reading from remote...')
        const res = await fetch("https://cemantix.certitudes.org/pedantix")
        const text = await res.text()
        const html = HTMLParser.parse(text)
        const paragraphs = html.querySelectorAll('.game > h2, #article > p')
        wordsStates = new Array(paragraphs.length).fill().map(u => ([]));
        wordsStates.forEach((p, i) => {
            paragraphs[i].querySelectorAll('.w').forEach(w => p.push({found: false, currentValue: null, distance: null}))
        })
        wordsStates = wordsStates.filter(ws => ws.length)
    }
}

async function loadWords() {
    words = JSON.parse(await fs.readFile('./common.json'))
}

async function renderText() {
    console.log('Rendering...')
    await fs.writeFile('./preview.txt', wordsStates.map(p => {
        return p.map(w => {
            if(w.found) return w.currentValue
            if(!w.currentValue) return 'null'
            return `['${w.currentValue}, ${w.distance}']`
        }).join(' ')
    }).join('\n\n'))
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
let words = []

async function main() {
    await loadText()
    await loadWords()
    await renderText()
    
    for(const word of words) {
        console.log(`Guessing: ${word.label}`)
        const res = await makeAGuess(word.label)
        for(const [index, value] of Object.entries(res.score)) {
            const flatWords = wordsStates.flat()
            if(flatWords[index].found) continue
            if(typeof value === "string") {
                flatWords[index].currentValue = value
                flatWords[index].found = true
            } else if(flatWords[index].currentValue <= value) {
                flatWords[index].currentValue = word.label
                flatWords[index].distance = value
            }
        }
        await renderText()
        // await saveTodayState()
        // await sleep(.5)
    }
    await renderText()
    // await saveTodayState()
}

main()