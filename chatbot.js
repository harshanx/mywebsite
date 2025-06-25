function sendMessage() {
    const message = document.getElementById("message").value.trim();
    if (message === "") return;
  
    const chatbox = document.getElementById("chatbox");
    chatbox.innerHTML += `<div class='text-primary mb-2'><b>You:</b> ${message}</div>`;
  
    fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",  // replace this
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
      // Check if choices exists
      if (data.choices && data.choices.length > 0) {
        const reply = data.choices[0].message.content;
        chatbox.innerHTML += `<div class='text-success mb-2'><b>AI:</b> ${reply}</div>`;
      } else {
        chatbox.innerHTML += "<div class='text-danger mb-2'><b>Error:</b> No response from AI.</div>";
      }
      chatbox.scrollTop = chatbox.scrollHeight;
    })
    .catch(err => {
      chatbox.innerHTML += `<div class='text-danger mb-2'><b>Error:</b> ${err.message}</div>`;
    });
  
    document.getElementById("message").value = "";
  }
  