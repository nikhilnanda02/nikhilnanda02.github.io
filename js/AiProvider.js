class AIProvider {
    constructor(config) {
        if (!config || !config.provider) {
            throw new Error("Provider configuration is required.");
        }
        this.provider = config.provider;
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl || this.getDefaultBaseUrl();
    }

    getDefaultBaseUrl() {
        const providerUrls = {
            openai: "https://api.openai.com/v1",
            llama: "http://192.168.162.42:11434/api/chat"
        };
        return providerUrls[this.provider] || "";
    }

    async query(prompt, options = {}) {
        switch (this.provider) {
            case "openai":
                return this.queryOpenAI(prompt, options);
            case "llama":
                return this.queryLLaMA(prompt, options);
            default:
                throw new Error("Unsupported AI provider.");
        }
    }

    async queryOpenAI(prompt, options) {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: options.model || "gpt-4o",
                temperature: options.temperature || 0.2,
                n: 1,
                messages: [{ role: "user", content: prompt }],
                max_tokens: options.max_tokens || 1024
            })
        });
        return response.json();
    }

    async queryLLaMA(prompt, options) {
        const response = await fetch(`${this.baseUrl}`, {
            method: "POST",
            headers: {
                // "Authorization": `Bearer ${this.apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt,
                stream:false,
                model: options.model || "hf.co/bartowski/Llama-3.3-70B-Instruct-GGUF:Q4_K_L",
                max_tokens: options.max_tokens || 1024
            })
        });
        return response.json();
    }
}

// Example Usage:
const ai = new AIProvider({ provider: "openai", apiKey: "your_openai_api_key" });
ai.query("What is AI?", { max_tokens: 100 }).then(console.log);
