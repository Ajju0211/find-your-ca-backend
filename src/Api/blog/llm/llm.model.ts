export const generateBlogFromLLM = async (caData: any) => {
  const blogPrompt = `You are a professional blog writer for a financial advice website.

Your task is to write a well-structured, engaging, and informative **JSON object** based on the data below.

Instructions:
- Generate a unique, catchy blog title (different each time)
- Return the current date as "dateCreated" in the format: "Month Day, Year" (e.g., "July 2, 2025")
- Each expert should have a rich description that spans approximately 5 lines. Include name, location, years of experience, specialties, rating, and a unique highlight or insight.
- Format your response exactly like this:

{
  "title": "Auto-generated unique blog title",
  "dateCreated": "Month Day, Year",
  "experts": [
    {
      "name": "Name",
      "description": "Minimum 5 lines of content about the expert including all key details.",
      "rating": 4.8,
      "buttons": {
        "profile": "View Profile",
        "contact": "Contact Now"
      }
    }
  ]
}

Tone:
- Professional and friendly
- Descriptive and trustworthy
- Description should be paragraph-style, not bullet points

Data: ${caData}
`;

  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer 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',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          {
            role: 'user',
            content: blogPrompt,
          },
        ],
      }),
    },
  );

  const res = await response.json();
  const blogData = res?.choices?.[0]?.message?.content;

  if (!blogData) {
    console.error('❌ blogData is missing. Full response:', res);
    throw new Error('blogData is undefined. LLM response might be malformed.');
  }

  const cleanedJsonBlogObject = blogData
    .replace(/^```json/, '') // remove starting block
    .replace(/```$/, '') // remove ending block
    .trim();

  try {
    return JSON.parse(cleanedJsonBlogObject);
  } catch (err) {
    console.error('❌ Failed to parse blog data:', cleanedJsonBlogObject);
    throw new Error('Invalid JSON from LLM');
  }
};
