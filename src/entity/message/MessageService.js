// messageService.js
import { getDatabase, ref, push, set } from "firebase/database";
import { auth } from "../../firebase/config";

const database = getDatabase();

const messageService = {
  sendMessage: async (recipientId, messageText) => {
    const senderId = auth.currentUser.uid;
    const conversationId = `${senderId}_${recipientId}`;

    const messagesRef = ref(database, `messages/${conversationId}`);
    const newMessageRef = push(messagesRef);

    const message = {
      text: messageText,
      senderId: senderId,
      recipientId: recipientId,
      timestamp: Date.now(),
    };

    await set(newMessageRef, message);

    return newMessageRef.key;
  },
};

export default messageService;
