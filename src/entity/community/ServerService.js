import {
  getDatabase,
  ref,
  set,
  push,
  get,
  update,
  onValue,
} from "firebase/database";
import { auth } from "../../firebase/config";

const database = getDatabase();

const ServerService = {
  createServer: async (serverName) => {
    const serverRef = ref(database, "servers");
    const newServerRef = push(serverRef);
    const userId = auth.currentUser.uid;

    await set(newServerRef, {
      name: serverName,
      owner: userId,
      members: {
        [userId]: true,
      },
    });

    return newServerRef.key;
  },

  joinServerById: async (serverId) => {
    const userId = auth.currentUser.uid;
    const serverMembersRef = ref(database, `servers/${serverId}/members`);
    const updates = {};
    updates[userId] = true;
    await update(serverMembersRef, updates);

    return true;
  },

  // Join an existing server by Name
  joinServerByName: async (serverName) => {
    const userId = auth.currentUser.uid;
    const serverId = await ServerService.findServerIdByName(serverName);
    const updates = {};
    updates[`/servers/${serverId}/members/${userId}`] = true;
    await update(ref(database), updates);

    return serverId;
  },

  sendMessage: async (serverId, message) => {
    const messageRef = ref(database, `servers/${serverId}/messages`);
    const newMessageRef = push(messageRef);
    await set(newMessageRef, {
      userId: auth.currentUser.uid,
      text: message.text,
      timestamp: Date.now(),
    });
  },

  fetchMessages: (serverId, callback) => {
    const messagesRef = ref(database, `servers/${serverId}/messages`);
    return onValue(messagesRef, (snapshot) => {
      const messages = [];
      snapshot.forEach((childSnapshot) => {
        messages.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      callback(messages);
    });
  },

  fetchServerDetails: async (serverId) => {
    const serverRef = ref(database, `servers/${serverId}`);
    const snapshot = await get(serverRef);

    if (snapshot.exists()) {
      return { id: serverId, ...snapshot.val() };
    } else {
      throw new Error("Server not found");
    }
  },

  fetchUserServers: (callback) => {
    const userId = auth.currentUser.uid;
    const serversRef = ref(database, "servers");
    const unsubscribe = onValue(serversRef, (snapshot) => {
      const servers = [];
      snapshot.forEach((childSnapshot) => {
        const server = childSnapshot.val();
        const serverId = childSnapshot.key;
        if (server.members && server.members[userId]) {
          servers.push({ id: serverId, ...server });
        }
      });
      callback(servers);
    });

    return () => unsubscribe();
  },

  fetchUserDetails: async (userId) => {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.warn("User not found");
      return null;
    }
  },

  findServerIdByName: async (serverName) => {
    const serversSnapshot = await get(ref(database, "servers"));
    let foundServerId = null;

    serversSnapshot.forEach((childSnapshot) => {
      const server = childSnapshot.val();
      if (server.name.toLowerCase() === serverName.toLowerCase()) {
        foundServerId = childSnapshot.key;
      }
    });

    if (foundServerId) {
      return foundServerId;
    } else {
      throw new Error("Server not found with name: " + serverName);
    }
  },
};

export default ServerService;
