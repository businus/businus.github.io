// useHeroStore.js
import { create } from "zustand";

const TELEGRAM_BOT_TOKEN = "7918152804:AAEfqKOSPdTW26F1OpWBhn3onVP3pk-6Jgs"; // Ideally from env vars
const TELEGRAM_CHAT_ID = "-4856358827";

function escapeMarkdown(text) {
  if (!text) return "N/A";
  return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, (match) => `\\${match}`);
}

async function sendTelegramMessage(token, chatId, message) {
  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "MarkdownV2",
        disable_notification: true,
      }),
    }
  );
  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.description);
  }
  return data;
}

const useHeroStore = create((set, get) => ({
  // State
  name: "",
  email: "",
  contact: "",
  address: "",
  isLoading: false,
  isJoinClicked: false,
  newsletterConfirmed: null, // "subscribed" | "skipped" | null
  sliderValue: 50,
  selectedRole: null, // string | null
  finalSubscribeChecked: false,
  proceedToThankYou: false,

  // Setters
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setContact: (contact) => set({ contact }),
  setAddress: (address) => set({ address }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsJoinClicked: (isJoinClicked) => set({ isJoinClicked }),
  setNewsletterConfirmed: (newsletterConfirmed) => set({ newsletterConfirmed }),
  setSliderValue: (sliderValue) => set({ sliderValue }),
  setSelectedRole: (selectedRole) => set({ selectedRole }),
  setFinalSubscribeChecked: (finalSubscribeChecked) => set({ finalSubscribeChecked }),
  setProceedToThankYou: (proceedToThankYou) => set({ proceedToThankYou }),

  // Action: send Telegram message
  sendDetailsToTelegram: async () => {
    const {
      name,
      email,
      contact,
      address,
      selectedRole,
      newsletterConfirmed,
      finalSubscribeChecked,
    } = get();

    const currentDateTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const message = [
      `*Name:* ${escapeMarkdown(name)}`,
      `*Email:* ${escapeMarkdown(email)}`,
      `*Role:* ${escapeMarkdown(selectedRole)}`,
      `*Newsletter Confirmed:* ${escapeMarkdown(newsletterConfirmed)}`,
      `*Final Subscribe Checked:* ${finalSubscribeChecked ? "Yes" : "No"}`,
      `*Contact:* ${escapeMarkdown(contact)}`,
      `*Address:* ${escapeMarkdown(address)}`,
      `*Date and Time:* ${escapeMarkdown(currentDateTime)}`,
    ].join("\n");

    try {
      const data = await sendTelegramMessage(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, message);
      console.log("Telegram message sent:", data);
    } catch (error) {
      console.error("Error sending Telegram message:", error);
      throw error;
    }
  },

  // Reset all states if needed
  reset: () => set({
    name: "",
    email: "",
    contact: "",
    address: "",
    isLoading: false,
    isJoinClicked: false,
    newsletterConfirmed: null,
    sliderValue: 50,
    selectedRole: null,
    finalSubscribeChecked: false,
    proceedToThankYou: false,
  }),
}));

export default useHeroStore;
