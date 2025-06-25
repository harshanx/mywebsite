function sendMessage() {
    const message = document.getElementById("user-input").value.trim();
    if (message === "") return;

    const chatbox = document.getElementById("chatbox");

    // User message bubble (right side)
    chatbox.innerHTML += `
      <div class="d-flex justify-content-end mb-2">
        <div class="bg-success text-white p-2 rounded" style="max-width: 75%; word-wrap: break-word;">
          <b></b> ${message}
        </div>
      </div>`;

    fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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", // Ensure this is your correct key
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "llama3-70b-8192",
        "messages": [{ "role": "user", "content": message }],
        "temperature": 0.7
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.choices && data.choices.length > 0) {
        let reply = data.choices[0].message.content;

        // Format line breaks nicely
        reply = reply.replace(/\n/g, "<br>");

        // Convert Markdown bold (**text**) to HTML bold (<b>text</b>)
        reply = reply.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

        // AI reply bubble (left side)
        chatbox.innerHTML += `
          <div class="d-flex justify-content-start mb-2">
            <div class="bg-light text-dark p-2 rounded" style="max-width: 75%; word-wrap: break-word;">
              <b></b> ${reply}
            </div>
          </div>`;
      } else {
        chatbox.innerHTML += `
          <div class="d-flex justify-content-start mb-2 text-danger">
            <b>Error:</b> No response from AI.
          </div>`;
      }

      chatbox.scrollTop = chatbox.scrollHeight;
    })
    .catch(err => {
      chatbox.innerHTML += `
        <div class="d-flex justify-content-start mb-2 text-danger">
          <b>Error:</b> ${err.message}
        </div>`;
    });

    document.getElementById("user-input").value = "";
}

// Function to display initial AI messages
function initializeChatbot() {
    const chatbox = document.getElementById("chatbox");

    // First AI message
    const firstMessage = "Hey there!";
    chatbox.innerHTML += `
      <div class="d-flex justify-content-start mb-2">
        <div class="bg-light text-dark p-2 rounded" style="max-width: 75%; word-wrap: break-word;">
          <b></b> ${firstMessage}
        </div>
      </div>`;
    chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom after first message

    // Second AI message (you might add a small delay here for a more conversational feel)
    setTimeout(() => {
        const secondMessage = "Please describe your problem briefly, and I'll do my best to help.";
        chatbox.innerHTML += `
          <div class="d-flex justify-content-start mb-2">
            <div class="bg-light text-dark p-2 rounded" style="max-width: 75%; word-wrap: break-word;">
              <b></b> ${secondMessage}
            </div>
          </div>`;
        chatbox.scrollTop = chatbox.scrollHeight; // Scroll again after second message
    }, 500); // 500 milliseconds (0.5 second) delay
}

// Call initializeChatbot when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeChatbot);
document.getElementById("user-input").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); 
    sendMessage();
  }
});

