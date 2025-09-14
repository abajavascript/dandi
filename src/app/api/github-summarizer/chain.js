import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Define the output schema
const summarySchema = z.object({
  summary: z.string().describe("A concise summary of the repository"),
  cool_facts: z
    .array(z.string())
    .describe("A list of cool or interesting facts about the repository"),
});

// Create the prompt template
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    [
      "You are an expert at summarizing GitHub repositories.",
      "Given the README file content, provide:",
      "- A concise summary of what the repository is about.",
      "- A list of cool or interesting facts about the repository.",
      "If you cannot find enough information, say so in the summary.",
    ].join("\n"),
  ],
  ["human", "README content:\n{readmeContent}"],
]);

// The main function to summarize a GitHub repo's README content
export async function summarizeReadmeWithLangchain(readmeContent) {
  // You may want to configure the model and temperature as needed
  const llm = new ChatOpenAI({
    model: "gpt-4-0125-preview",
    temperature: 0.3,
  });

  // Chain the prompt and the LLM with structured output
  const chain = prompt.pipe(llm.withStructuredOutput(summarySchema));

  // Invoke the chain
  const result = await chain.invoke({ readmeContent });

  // result will be { summary: string, cool_facts: string[] }
  return result;
}
