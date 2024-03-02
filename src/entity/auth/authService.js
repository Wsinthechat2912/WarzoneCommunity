const authService = {
  login: async (username) => {
    // API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(username === "admin");
      }, 1000);
    });
  },
};

export default authService;
