import makeWASocket, { DisconnectReason, jidNormalizedUser, makeInMemoryStore, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { pino } from 'pino';
import * as fs from 'fs';
import messageHandler from './message/index.js';

let setting = JSON.parse(fs.readFileSync('./config.json'));

// const store = makeInMemoryStore({ logger: pino().child({ level: 'fatal', stream: 'store' }) });

async function connectToWhatsApp () {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');

  let sock = makeWASocket.default({
    printQRInTerminal: true,
    logger: pino({ level: 'fatal' }),
    auth: state,
    browser: [setting.botName ?? 'Bot Private', 'Chrome', '3.0'],
  })

  // store.bind(sock.ev);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if(connection === 'close') {
      new Boom(lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
        ? connectToWhatsApp()
        : console.log('[INFO]: connection closed...')
    } else if(connection === 'open') {
      console.log('[INFO]: connection opened...')
    }
  });
  sock.ev.on('creds.update', await saveCreds);

  sock.ev.on('messages.upsert', async (m) => {
    const message = m.messages[0];
    const jid = jidNormalizedUser(message.key.remoteJid);
		if (message.key.fromMe || m.type !== 'notify') return;

    const isGroup = jid.endsWith('@g.us');

    if (!isGroup) {
      await messageHandler(sock, message);
      await sock.readMessages([message.key]);
    }
	})

  sock.reply = async (from, content, msg) => await sock.sendMessage(from, { text: content }, { quoted: msg })

  return sock;
}

connectToWhatsApp().catch(err => console.log(err))
