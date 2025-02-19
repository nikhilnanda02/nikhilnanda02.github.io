document.addEventListener("DOMContentLoaded", function () {
    let aiInstance = null;

    // Function to create AI instance when provider changes
    function initializeAIProvider() {
        var provider = document.getElementById("provider").value;
        console.log("provider",provider);
        var apiKey="";

if(provider=="openai"){
apiKey="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";
}

        aiInstance = new AIProvider({ provider, apiKey: apiKey });
        console.log(`AI Provider set to: ${provider}`);
    }

    // Initialize AI provider on dropdown change
    document.getElementById("provider").addEventListener("change", initializeAIProvider);

    document.getElementById("ask-btn").addEventListener("click", async function () {
        if (!aiInstance) {
            alert("Please select an AI provider first.");
            return;
        }

        const question = document.getElementById("question").value.trim();
        if (!question) {
            alert("Please enter a question.");
            return;
        }

        document.getElementById("response-container").style.display = "none";
        document.getElementById("response").textContent = "Loading...";

        try {
            const result = await aiInstance.query(question, { max_tokens: 1024 });
            document.getElementById("response").textContent = result.choices ? result.choices[0].message.content : "Error fetching response";
            document.getElementById("response-container").style.display = "block";
        } catch (error) {
            document.getElementById("response").textContent = "Failed to fetch response.";
            console.error(error);
        }
    });

    // Initialize AI provider on page load
    initializeAIProvider();
});
