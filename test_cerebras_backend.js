import Cerebras from '@cerebras/cerebras_cloud_sdk';

const cerebras = new Cerebras({
  apiKey: process.env['CEREBRAS_API_KEY']
  // This is the default and can be omitted
});

async function main() {
  const stream = await cerebras.chat.completions.create({
    messages: [
        {
            "role": "system",
            "content": ""
        }
    ],
    model: 'qwen-3-235b-a22b-instruct-2507',
    stream: true,
    max_completion_tokens: 20000,
    temperature: 0.7,
    top_p: 0.8
  });

  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
  }
}

main();