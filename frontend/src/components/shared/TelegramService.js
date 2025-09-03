// TelegramService.js
const TELEGRAM_BOT_TOKEN = "7918152804:AAEfqKOSPdTW26F1OpWBhn3onVP3pk-6Jgs";
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

async function sendWorkflowToTelegram(name, email, nodes, edges, groups) {
  const currentDateTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  // Create a summary of the workflow
  const nodeTypes = nodes.reduce((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1;
    return acc;
  }, {});

  const workflowSummary = Object.entries(nodeTypes)
    .map(([type, count]) => `${type}: ${count}`)
    .join(', ') || 'None';

  const message = [
    `*Workflow AI Signup & Export*`,
    `*Name:* ${escapeMarkdown(name)}`,
    `*Email:* ${escapeMarkdown(email)}`,
    `*Date and Time:* ${escapeMarkdown(currentDateTime)}`,
    `*Workflow Summary:* ${escapeMarkdown(workflowSummary)}`,
    `*Node Count:* ${nodes.length}`,
    `*Edge Count:* ${edges.length}`,
    `*Group Count:* ${groups.length}`,
  ].join("\n");

  try {
    // Send the signup message first
    const data = await sendTelegramMessage(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, message);
    console.log("Telegram signup message sent:", data);
    
    // Send the full workflow as a document
    const workflowData = JSON.stringify({ nodes, edges, groups }, null, 2);
    const blob = new Blob([workflowData], { type: 'application/json' });
    
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('document', blob, `workflow-${Date.now()}.json`);
    formData.append('caption', `Workflow export for ${escapeMarkdown(name)} (${escapeMarkdown(email)})`);
    
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      body: formData
    });
    
    const documentData = await response.json();
    if (!documentData.ok) {
      console.error("Error sending workflow document:", documentData.description);
    } else {
      console.log("Telegram workflow document sent:", documentData);
    }
    
    return true;
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return false;
  }
}

export { sendWorkflowToTelegram };