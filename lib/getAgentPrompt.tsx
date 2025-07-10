// lib/getAgentPrompt.ts
import { agentPromptTemplates } from "./agentPromptTemplates";

type PromptVars = Record<string, any>;

interface GetAgentPromptParams extends PromptVars {
  industryKey?: string;
  roleTitle: string;
}

export const getAgentPrompt = ({
  industryKey = "",
  roleTitle,
  ...vars
}: GetAgentPromptParams): string => {
  const normalizedIndustry = industryKey.trim();
  console.log("Normalized Industry:", normalizedIndustry, roleTitle);

  const industryPrompts =
    agentPromptTemplates[normalizedIndustry] || agentPromptTemplates.default;

  const promptGenerator = industryPrompts?.[roleTitle];

  if (!promptGenerator) {
    console.warn(
      `No prompt found for role "${roleTitle}" in industry "${industryKey}"`
    );
    return "";
  }

  return promptGenerator(vars);
};
