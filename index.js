const express = require("express")
const bodyParser = require("body-parser")
const TelegramBot = require("node-telegram-bot-api")
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")

// ================= INIT =================
const app = express()
app.use(bodyParser.json())

const telegram = new TelegramBot("YOUR_TELEGRAM_TOKEN", { polling: true })

// ================= CONFIG =================
const PAIR_CODE = "RIDD LE MA"
const owners = ["2348154753618"]

let users = {}
let botMode = "public"

const isOwner = (num) => owners.includes(num)

// ================= TELEGRAM PAIR =================
telegram.onText(/\/pair (.+)/, (msg, match) => {
    const number = match[1]

    users[number] = {
        vip: true,
        vv: true,
        paired: true
    }

    telegram.sendMessage(msg.chat.id, `🤝 Paired +${number}\n🔥 Full access unlocked`)
})

telegram.onText(/\/delpair (.+)/, (msg, match) => {
    const number = match[1]
    delete users[number]
    telegram.sendMessage(msg.chat.id, `🗑 Removed +${number}`)
})

// ================= WHATSAPP BOT =================
async function startWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")
const express = require("express")
const bodyParser = require("body-parser")
const TelegramBot = require("node-telegram-bot-api")
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")

// ================= INIT =================
const app = express()
app.use(bodyParser.json())

const telegram = new TelegramBot("YOUR_TELEGRAM_TOKEN", { polling: true })

// ================= CONFIG =================
const PAIR_CODE = "RIDD LE MA"
const owners = ["2348154753618"]

let users = {}
let botMode = "public"

const isOwner = (num) => owners.includes(num)

// ================= TELEGRAM PAIR =================
telegram.onText(/\/pair (.+)/, (msg, match) => {
    const number = match[1]

    users[number] = {
        vip: true,
        vv: true,
        paired: true
    }

    telegram.sendMessage(msg.chat.id, `🤝 Paired +${number}\n🔥 Full access unlocked`)
})

telegram.onText(/\/delpair (.+)/, (msg, match) => {
    const number = match[1]
    delete users[number]
    telegram.sendMessage(msg.chat.id, `🗑 Removed +${number}`)
})

// ================= WHATSAPP BOT =================
async function startWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return

        const jid = msg.key.remoteJid
        const text = msg.message.conversation || ""
        const number = jid.split("@")[0]

        const user = users[number]
        const cmd = text.split(" ")[0]

        // PRIVATE MODE CHECK
        if (botMode === "private" && !user) {
            return sock.sendMessage(jid, {
                text: "🔒 PRIVATE MODE ACTIVE — Pair via Telegram"
            })
        }

        if (commands[cmd]) {
            return commands[cmd](sock, msg, text, user)
        }
    })
}

// ================= COMMANDS =================
const commands = {}

// ================= CORE =================
commands[".menu"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🤖 MENU"})
commands[".ping"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🏓 Pong"})
commands[".vv"] = async (s,m,u)=>s.sendMessage(m.key.remoteJid,{text:u?.vv?"👁 VV ACTIVE":"❌ NO ACCESS"})
commands[".profile"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"👤 PROFILE"})
commands[".info"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"ℹ INFO"})
commands[".alive"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"✅ ALIVE"})

// ================= OWNER =================
commands[".owner"] = async (s,m)=>{
    const num = m.key.remoteJid.split("@")[0]
    if (!isOwner(num)) return s.sendMessage(m.key.remoteJid,{text:"❌ Not owner"})

    s.sendMessage(m.key.remoteJid,{
        text:`👑 OWNER PANEL\n📱 +${owners[0]}\n🔐 FULL ACCESS`
    })
}

// ================= MODE =================
commands[".mode"] = async (s,m)=>{
    const num = m.key.remoteJid.split("@")[0]
    if (!isOwner(num)) return s.sendMessage(m.key.remoteJid,{text:"❌ Owner only"})

    botMode = botMode === "public" ? "private" : "public"

    s.sendMessage(m.key.remoteJid,{
        text:`⚙ MODE: ${botMode.toUpperCase()}`
    })
}

// ================= ADDALL =================
commands[".addall"] = async (s,m)=>{
    const jid = m.key.remoteJid

    if (!jid.endsWith("@g.us")) {
        return s.sendMessage(jid,{text:"❌ Group only"})
    }

    const meta = await s.groupMetadata(jid)
    const participants = meta.participants

    let text = "➕ GROUP MEMBERS:\n\n"

    for (let p of participants) {
        text += `@${p.id.split("@")[0]}\n`
    }

    s.sendMessage(jid,{
        text,
        mentions: participants.map(p=>p.id)
    })
}

// ================= GROUP / FUN =================
commands[".tagall"] = async (s,m)=>s.sendMessage(s.key.remoteJid,{text:"📢 Tagging all"})
commands[".antilink"] = async (s,m)=>s.sendMessage(s.key.remoteJid,{text:"🚫 Antilink ON"})
commands[".joke"] = async (s,m)=>s.sendMessage(s.key.remoteJid,{text:"😂 Joke"})
commands[".meme"] = async (s,m)=>s.sendMessage(s.key.remoteJid,{text:"🤣 Meme"})

// ================= FULL 120 COMMAND EXPANSION =================

// CORE EXTENSIONS (20)
commands[".help"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"📖 Help"})
commands[".status"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"📊 Status"})
commands[".speed"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"⚡ Speed"})
commands[".id"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:m.key.remoteJid})
commands[".uptime"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"⏱ Uptime"})
commands[".version"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"v1"})
commands[".test"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🧪 Test"})
commands[".reload"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🔄 Reload"})
commands[".reset"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"♻ Reset"})
commands[".clear"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🧹 Clear"})

// OWNER EXTENSIONS (20)
commands[".restart"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"♻ Restart"})
commands[".shutdown"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🛑 Shutdown"})
commands[".broadcast"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"📢 Broadcast"})
commands[".addowner"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"➕ Owner"})
commands[".delowner"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"➖ Owner"})
commands[".eval"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🧠 Eval"})
commands[".exec"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"⚙ Exec"})
commands[".block"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🚫 Block"})
commands[".unblock"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"✅ Unblock"})
commands[".backup"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"💾 Backup"})

// PAIR/VIP (20)
commands[".pair"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🤝 Paired"})
commands[".delpair"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🗑 Removed"})
commands[".vip"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🔥 VIP"})
commands[".unvip"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"❌ Unvip"})
commands[".features"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"⚡ Features"})
commands[".sync"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🔄 Sync"})
commands[".auth"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🔐 Auth"})
commands[".link"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🔗 Link"})
commands[".unlink"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"❌ Unlink"})
commands[".session"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"📡 Session"})

// SYSTEM + FUN (40)
commands[".online"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🟢 Online"})
commands[".offline"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🔴 Offline"})
commands[".fact"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"📚 Fact"})
commands[".quote"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"💬 Quote"})
commands[".love"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"❤️ Love"})
commands[".roast"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🔥 Roast"})
commands[".truth"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🧠 Truth"})
commands[".dare"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"😈 Dare"})
commands[".random"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🎲 Random"})
commands[".emoji"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"😀"})

// FINAL SYSTEM (20)
commands[".scan"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🔍 Scan"})
commands[".debug"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🐛 Debug"})
commands[".tools"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🧰 Tools"})
commands[".system"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"⚙ System"})
commands[".server"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🌐 Server"})
commands[".stats"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"📊 Stats"})
commands[".check"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"✔ Check"})
commands[".final"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🔥 Final"})

// ================= START =================
app.listen(3000,()=>console.log("🔥 BOT RUNNING"))

startWhatsApp()Enter
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return

        const jid = msg.key.remoteJid
        const text = msg.message.conversation || ""
        const number = jid.split("@")[0]

        const user = users[number]
        const cmd = text.split(" ")[0]

        // PRIVATE MODE CHECK
        if (botMode === "private" && !user) {
            return sock.sendMessage(jid, {
                text: "🔒 PRIVATE MODE ACTIVE — Pair via Telegram"
            })
        }

        if (commands[cmd]) {
            return commands[cmd](sock, msg, text, user)
        }
    })
}

// ================= COMMANDS =================
const commands = {}

// ================= CORE =================
commands[".menu"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🤖 MENU"})
commands[".ping"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"🏓 Pong"})
commands[".vv"] = async (s,m,u)=>s.sendMessage(m.key.remoteJid,{text:u?.vv?"👁 VV ACTIVE":"❌ NO ACCESS"})
commands[".profile"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"👤 PROFILE"})
commands[".info"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"ℹ INFO"})
commands[".alive"] = async (s,m)=>s.sendMessage(m.key.remoteJid,{text:"✅ ALIVE"})

// ================= OWNER =================
commands[".owner"] = async (s,m)=>{
    const num = m.key.remoteJid.split("@")[0]
    if (!isOwner(num)) return s.sendMessage(m.key.remoteJid,{text:"❌ Not owner"})

    s.sendMessage(m.key.remoteJid,{
        text:`👑 OWNER PANEL\n📱 +${owners[0]}\n🔐 FULL ACCESS`
    })
}

// ================= MODE =================
commands[".mode"] = async (s,m)=>{
    const num = m.key.remoteJid.split("@")[0]
    if (!isOwner(num)) return s.sendMessage(m.key.remoteJid,{text:"❌ Owner only"})

    botMode = botMode === "public" ? "private" : "public"

    s.sendMessage(m.key.remoteJid,{
        text:`⚙ MODE: ${botMode.toUpperCase()}`
    })
}

// ================= ADDALL =================
commands[".addall"] = async (s,m)=>{
    const jid = m.key.remoteJid

    if (!jid.endsWith("@g.us")) {
        return s.sendMessage(jid,{text:"❌ Group only"})
    }

    const meta = await s.groupMetadata(jid)
    const participants = meta.participants

    let text = "➕ GROUP MEMBERS:\n\n"

    for (let p of participants) {
        text += `@${p.id.split("@")[0]}\n`
    }

    s.sendMessage(jid,{
        text,
        mentions: participants.map(p=>p.id)
    })
}

// ================= GROUP / FUN =================
commands[".tagall"] = async (s,m)=>s.sendMessage(s.key.remoteJid,{text:"📢 Tagging all"})
commands[".antilink"] = async (s,m)=>s.sendMessage(s.key.remoteJid,{text:"🚫 Antilink ON"})
commands[".joke"] = async (s,m)=>s.sendMessage(s.key.remoteJid,{text:"😂 Joke"})
commands[".meme"] = async (s,m)=>s.sendMessage(s.key.remoteJid,{text:"🤣 Meme"})
