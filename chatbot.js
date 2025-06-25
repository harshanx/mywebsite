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
