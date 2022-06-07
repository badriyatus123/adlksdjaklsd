const {
    default: makeWASocket,
    BufferJSON,
    initInMemoryKeyStore,
    DisconnectReason,
    AnyMessageContent,
    makeInMemoryStore,
    useSingleFileAuthState,
    delay
} = require("@adiwajshing/baileys")
const logg = require('pino')
const clui = require('clui')
const { Spinner } = clui
let session = `./session1.json`
const { state, saveState } = useSingleFileAuthState(session)

const connectToWhatsApp = async () => {
    const conn = makeWASocket({
        printQRInTerminal: true,
        logger: logg({ level: 'fatal' }),
        auth: state,
        browser: ["Manzip", "Safari", "3.0"]
    })
    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            // console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if(shouldReconnect) {
                connectToWhatsApp()
            }
        } else if(connection === 'open') {
            console.log('opened connection');
            require('./express.js')(conn);   
        }
    })

}
connectToWhatsApp()
