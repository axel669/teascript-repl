importScripts("https://unpkg.com/prettier@2.5.1/standalone.js")
importScripts("https://unpkg.com/prettier@2.5.1/parser-babel.js")
importScripts("https://cdn.jsdelivr.net/gh/axel669/teascript@v0.22.12/dist/browser-tea.js")

addEventListener(
    "message",
    async (evt) => {
        const time = Date.now()
        const result = await teascript(evt.data.source, evt.data.options)
        const invalid = result instanceof Error
        postMessage({
            time,
            valid: invalid === false,
            text: invalid ? result.message : result.code,
        })
    }
)
