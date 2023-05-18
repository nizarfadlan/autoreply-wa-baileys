import { delay } from '../lib/delay.js';
import replyMessage from '../lib/reply.js';
import { nlp } from '../lib/nlp.js';

export default async function messageHandler(sock, message) {
  const getReplyMessage = await replyMessage();
  const { key, pushName } = message;
  const messageBody = message.message.conversation;
  const from = key.remoteJid;
  console.log(message);

  const current_reply = nlp(messageBody, getReplyMessage);
  if (current_reply.length !== 0) {
    if (current_reply[0].response.includes('{name}')) current_reply[0].response = current_reply[0].response.replace('{name}', pushName);
    sock.reply(from, current_reply[0].response, message);
    await delay();
  }
}
