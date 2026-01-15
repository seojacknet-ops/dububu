// gemini-helper.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateContent(prompt) {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

async function generateProductDescription(productName, price, category) {
    const prompt = `
        Write a compelling e-commerce product description for DuBuBu.com:
        
        Product: ${productName}
        Price: ${price}
        Category: ${category}
        
        Requirements:
        - 150-200 words
        - Warm, cute, romantic tone
        - Include 4 bullet point features
        - End with call-to-action
        - Target audience: couples, gift buyers
    `;
    
    return await generateContent(prompt);
}

// CLI usage
const args = process.argv.slice(2);
if (args[0] === 'describe') {
    generateProductDescription(args[1], args[2], args[3])
        .then(console.log)
        .catch(console.error);
} else if (args[0]) {
    generateContent(args.join(' '))
        .then(console.log)
        .catch(console.error);
}

module.exports = { generateContent, generateProductDescription };
