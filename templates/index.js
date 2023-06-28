document.getElementById('form').addEventListener('submit', handleSubmit);

function handleSubmit(event) {
    event.preventDefault();
    const userInput = document.getElementById('user-input').value;

    // Send the user input to the server using AJAX or fetch
    fetch('/submit', {
        method: 'POST',
        body: JSON.stringify({ 'user-input': userInput }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(data => displayResponse(data))
    .catch(error => console.error('Error:', error));
}

function displayResponse(response) {
    const conversationContainer = document.getElementById('chatbot-conversation');
    const speech = document.createElement('div');
    speech.classList.add('speech');
    speech.textContent = response;
    conversationContainer.appendChild(speech);
}