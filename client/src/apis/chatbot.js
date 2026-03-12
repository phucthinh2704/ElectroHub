import axios from "../config/axios";

export const apiAskChatbot = (data) =>
    axios({
        url: "/chatbot/ask",
        method: "post",
        data,
    });