import {
  getDatabase,
  ref,
  push,
  set,
  query,
  orderByChild,
  onValue,
} from "firebase/database";
import { auth } from "../../firebase/config";

const database = getDatabase();

export const getConversationId = (userId1, userId2) =>
  userId1 && userId2 ? [userId1, userId2].sort().join("_") : null;

export const sendMessage = async (conversationId, messageText, recipientId) => {
  if (!conversationId) return;
  const messagesRef = ref(database, `messages/${conversationId}`);
  const newMessageRef = push(messagesRef);
  const message = {
    text: messageText,
    senderId: auth.currentUser?.uid,
    recipientId,
    timestamp: Date.now(),
  };
  await set(newMessageRef, message);
};

export const listenForMessages = (conversationId, onNewMessage) => {
  if (!conversationId) return;
  const messagesRef = ref(database, `messages/${conversationId}`);
  const messagesQuery = query(messagesRef, orderByChild("timestamp"));
  return onValue(messagesQuery, (snapshot) => {
    const messagesObject = snapshot.val();
    const messagesList = messagesObject
      ? Object.keys(messagesObject)
          .map((key) => ({ id: key, ...messagesObject[key] }))
          .sort((a, b) => a.timestamp - b.timestamp)
      : [];
    onNewMessage(messagesList);
  });
};
