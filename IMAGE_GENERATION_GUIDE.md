# AI Image Generation Guide

## Overview

Yes, you can generate images using AI! There are several approaches and services available for integrating image generation into your web application.

## Popular AI Image Generation Services

### 1. **OpenAI DALL-E 3**

- **Best for**: High-quality, creative images with excellent prompt understanding
- **Pricing**: Pay-per-image via OpenAI API
- **Integration**: REST API

```javascript
// Example using OpenAI API
const response = await fetch("https://api.openai.com/v1/images/generations", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "dall-e-3",
    prompt: "A serene landscape with mountains",
    n: 1,
    size: "1024x1024",
  }),
});
```

### 2. **Stable Diffusion (via Replicate)**

- **Best for**: Open-source, customizable, cost-effective
- **Pricing**: Pay-per-generation
- **Integration**: REST API or self-hosted

```javascript
// Example using Replicate API
const response = await fetch("https://api.replicate.com/v1/predictions", {
  method: "POST",
  headers: {
    Authorization: `Token ${REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    version: "stability-ai/stable-diffusion",
    input: {
      prompt: "A beautiful artwork",
    },
  }),
});
```

### 3. **Midjourney**

- **Best for**: Artistic, stylized images
- **Pricing**: Subscription-based
- **Integration**: Discord bot (no direct API)

### 4. **Hugging Face Inference API**

- **Best for**: Free tier available, multiple models
- **Pricing**: Free tier + paid options
- **Integration**: REST API

```javascript
// Example using Hugging Face
const response = await fetch(
  "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
  {
    headers: {
      Authorization: `Bearer ${HF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      inputs: "astronaut riding a horse",
    }),
  },
);
```

## Implementation Steps

### 1. Choose a Service

Consider these factors:

- **Budget**: API costs per image
- **Quality**: Image resolution and style
- **Speed**: Generation time
- **Control**: Customization options

### 2. Set Up API Access

```bash
# Install necessary packages
npm install axios dotenv

# Create .env file
OPENAI_API_KEY=your_api_key_here
# or
REPLICATE_API_TOKEN=your_token_here
```

### 3. Create a Backend Endpoint

```javascript
// Example Express.js endpoint
app.post("/api/generate-image", async (req, res) => {
  const { prompt } = req.body;

  try {
    // Call your chosen AI service
    const imageUrl = await generateImage(prompt);
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate image" });
  }
});
```

### 4. Implement Frontend Component

I've created a sample component at `src/components/site/ImageGenerator.tsx` that demonstrates:

- User input for prompts
- Loading states
- Error handling
- Image display
- Download functionality

## Best Practices

### 1. **Prompt Engineering**

- Be specific and descriptive
- Include style references (e.g., "oil painting", "digital art")
- Specify composition and perspective
- Add mood and lighting details

### 2. **User Experience**

- Show loading indicators (generation can take 10-30 seconds)
- Provide prompt suggestions or templates
- Allow users to save/favorite generated images
- Implement retry mechanisms

### 3. **Cost Management**

- Implement rate limiting
- Cache generated images
- Use lower resolutions for previews
- Monitor API usage

### 4. **Content Moderation**

- Filter inappropriate prompts
- Use service-provided safety features
- Implement user reporting

## Example Integration

Here's how to add image generation to your gallery:

```javascript
// src/services/imageGeneration.ts
export class ImageGenerationService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateArtwork(prompt: string): Promise<string> {
    // Implementation based on chosen service
    const response = await fetch('your-api-endpoint', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    return data.imageUrl;
  }
}
```

## Security Considerations

1. **Never expose API keys in frontend code**
2. **Use environment variables**
3. **Implement server-side API calls**
4. **Add authentication to your endpoints**
5. **Rate limit requests per user**

## Next Steps

1. Choose an AI service that fits your needs
2. Sign up and get API credentials
3. Update the `ImageGenerator` component with real API calls
4. Add the component to your routes
5. Style it to match your gallery theme

## Resources

- [OpenAI DALL-E Documentation](https://platform.openai.com/docs/guides/images)
- [Replicate Documentation](https://replicate.com/docs)
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference/index)
- [Stable Diffusion Web UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui)

## Sample Route Integration

To add the image generator to your app:

```javascript
// src/routes/generate.tsx
import { createFileRoute } from "@tanstack/react-router";
import { ImageGenerator } from "@/components/site/ImageGenerator";

export const Route = createFileRoute("/generate")({
  component: GeneratePage,
});

function GeneratePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create AI Art</h1>
      <ImageGenerator />
    </div>
  );
}
```

Remember to update your navigation to include a link to the new page!
