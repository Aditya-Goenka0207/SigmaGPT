import "dotenv/config";

// gives reply based on the message
const getOpenAIAPIResponse = async (messages) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: messages,
    }),
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options,
    );
    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status}`);
    }

    const data = await response.json();
    return (
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response."
    );
  } catch (err) {
    console.log(err);
    return "Something went wrong while generating the response.";
  }
};

export default getOpenAIAPIResponse;
