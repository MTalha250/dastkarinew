import OpenAI from "openai";
import Product from "../models/product.js";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to search products based on various criteria
const searchProducts = async ({
  query = "",
  category = "",
  artisan = "",
  region = "",
  minPrice,
  maxPrice,
  inStock,
}) => {
  let searchQuery = {};

  if (query) {
    searchQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { tags: { $in: [new RegExp(query, "i")] } },
    ];
  }

  if (category) {
    searchQuery.category = { $regex: category, $options: "i" };
  }

  if (artisan) {
    searchQuery.brand = { $regex: artisan, $options: "i" }; // Using brand field for artisan name
  }

  if (region) {
    searchQuery.tags = { $in: [new RegExp(region, "i")] }; // Using tags for region
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    searchQuery.finalPrice = {};
    if (minPrice !== undefined) searchQuery.finalPrice.$gte = minPrice;
    if (maxPrice !== undefined) searchQuery.finalPrice.$lte = maxPrice;
  }

  if (inStock !== undefined) {
    searchQuery.inStock = inStock;
  }

  const products = await Product.find(searchQuery).limit(5);
  return products;
};

export const chat = async (req, res) => {
  const { message } = req.body;

  try {
    const functions = [
      {
        name: "search_products",
        description: "Search for traditional Pakistani handicrafts and artisanal products in our collection.",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "General search term for product name, description, or traditional craft techniques",
            },
            category: {
              type: "string",
              description: "Product category like 'Pottery', 'Textiles', 'Woodwork', 'Metalwork', 'Jewelry', etc.",
            },
            artisan: {
              type: "string",
              description: "Name of the artisan or craftsperson who created the piece",
            },
            region: {
              type: "string",
              description: "Region of Pakistan where the craft originates (e.g., 'Sindh', 'Punjab', 'Balochistan', etc.)",
            },
            minPrice: {
              type: "number",
              description: "Minimum price of the handcrafted item",
            },
            maxPrice: {
              type: "number",
              description: "Maximum price of the handcrafted item",
            },
            inStock: {
              type: "boolean",
              description: "Whether the artisanal piece is available",
            },
          },
        },
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable guide for Pakistani handicrafts and cultural artifacts at Dastkari. You understand the rich heritage of Pakistani craftsmanship and can provide detailed information about traditional techniques, regional styles, and the cultural significance of various artisanal pieces. Respond with cultural sensitivity and enthusiasm for Pakistani heritage. Use occasional Urdu/Hindi phrases naturally to add authenticity. When discussing prices, always be respectful and focus on the artisanal value and craftsmanship.",
        },
        { role: "user", content: message },
      ],
      functions,
      function_call: "auto",
    });

    const responseMessage = response.choices[0].message;

    if (responseMessage.function_call) {
      const functionName = responseMessage.function_call.name;
      const functionArgs = JSON.parse(responseMessage.function_call.arguments);

      let functionResponse;
      if (functionName === "search_products") {
        functionResponse = await searchProducts(functionArgs);
      }

      const secondResponse = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a knowledgeable guide for Pakistani handicrafts and cultural artifacts at Dastkari. You understand the rich heritage of Pakistani craftsmanship and can provide detailed information about traditional techniques, regional styles, and the cultural significance of various artisanal pieces. Respond with cultural sensitivity and enthusiasm for Pakistani heritage. Use occasional Urdu/Hindi phrases naturally to add authenticity. When discussing prices, always be respectful and focus on the artisanal value and craftsmanship.",
          },
          { role: "user", content: message },
          responseMessage,
          {
            role: "function",
            name: functionName,
            content: JSON.stringify(functionResponse),
          },
        ],
      });

      return res.json({
        response: secondResponse.choices[0].message.content,
        products: functionResponse,
      });
    }

    return res.json({
      response: responseMessage.content,
      products: [],
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ message: error.message });
  }
}; 