export default defineEventHandler(async (event) => {
  // Read the request body
  const { messages } = await readBody(event);

  const body = {
    modelUri: `gpt://${process.env.VITE_YANDEX_FOLDER}/yandexgpt`,
    completionOptions: {
      stream: false,
      temperature: 1,
      maxTokens: "50",
      reasoningOptions: {
        mode: "DISABLED",
      },
    },
    messages,
  };
  console.log(body);
  const res = await fetch(
    `${process.env.VITE_YANDEX_GPT_URL}/foundationModels/v1/completion`,
    {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VITE_IAM_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();
  console.log(data);
  const responseMessage = data.result.alternatives[0].message;

  // const responseMessage = { role: "assistant", text: "привет" };
  console.log(responseMessage);
  return responseMessage;
});
