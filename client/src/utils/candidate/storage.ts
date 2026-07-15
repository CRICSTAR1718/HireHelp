export const storage = {

    setToken(token: string) {

        localStorage.setItem("token", token);

    },

    getToken() {

        return localStorage.getItem("token");

    },

    removeToken() {

        localStorage.removeItem("token");

    },

};