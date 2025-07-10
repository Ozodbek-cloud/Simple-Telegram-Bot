import axios from "axios";

const BOT_TOKEN = '7429278410:AAG3BrITSTCKPBnBhIqDt19m_4hmRac7CSA';
const CHAT_ID = '595379559';
const TEXT = 'tinchmi?';

export async function sendMessage() {
    console.log("📨 Xabar yuborilmoqda...");
    try {
        const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: TEXT,
        });
        console.log("✅ Yuborildi:", response.data);
    } catch (err) {
        console.error("❌ Error:", err.response?.data || err.message);
    }
}

sendMessage();




