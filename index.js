const OPENAI_API_KEY = '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';

const chatbotConversation = document.getElementById('chatbot-conversation');
let conversationStr = '';

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const userInput = document.getElementById('user-input');
  conversationStr += ` ${userInput.value} ->`;
  await fetchReply();
  const newSpeechBubble = document.createElement('div');
  newSpeechBubble.classList.add('speech', 'speech-human');
  chatbotConversation.appendChild(newSpeechBubble);
  newSpeechBubble.textContent = userInput.value;
  userInput.value = '';
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
});

async function fetchReply() {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: conversationStr,
      max_tokens: 100,
      temperature: 0,
      stop: ['\n', '->']
    })
  });

  const data = await response.json();

  if (data.choices && data.choices.length > 0) {
    conversationStr += ` ${data.choices[0].text} \n`;
    renderTypewriterText(data.choices[0].text);
    console.log(conversationStr);
  } else {
    console.log('No response from OpenAI API');
    // Handle the lack of response from the API as per your requirements
  }
}

function renderTypewriterText(text) {
  const newSpeechBubble = document.createElement('div');
  newSpeechBubble.classList.add('speech', 'speech-ai', 'blinking-cursor');
  chatbotConversation.appendChild(newSpeechBubble);
  let i = 0;
  const interval = setInterval(() => {
    newSpeechBubble.textContent += text.slice(i, i + 1);
    if (text.length === i) {
      clearInterval(interval);
      newSpeechBubble.classList.remove('blinking-cursor');
    }
    i++;
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
  }, 50);
}
