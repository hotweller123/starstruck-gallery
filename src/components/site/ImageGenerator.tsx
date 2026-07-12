import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description for your image");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Example using a placeholder service
      // In production, you would use services like:
      // - OpenAI DALL-E API
      // - Stable Diffusion API
      // - Midjourney API
      // - Replicate API

      // For demo purposes, using a placeholder image service
      const encodedPrompt = encodeURIComponent(prompt);
      const imageUrl = `https://via.placeholder.com/512x512.png?text=${encodedPrompt}`;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setGeneratedImage(imageUrl);
    } catch (err) {
      setError("Failed to generate image. Please try again.");
      console.error("Image generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Image Generator
        </CardTitle>
        <CardDescription>
          Describe what you want to create and AI will generate it for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="A serene landscape with mountains and a lake at sunset..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleGenerateImage()}
            disabled={isGenerating}
          />
          <Button
            onClick={handleGenerateImage}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Image"
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {generatedImage && (
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
              <img
                src={generatedImage}
                alt="Generated artwork"
                className="w-full h-full object-cover"
              />
            </div>
            <Button onClick={handleDownload} variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </Button>
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-semibold">Tips for better results:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Be specific about colors, style, and mood</li>
            <li>Include artistic references (e.g., "in the style of Van Gogh")</li>
            <li>Describe the composition and perspective</li>
            <li>Add details about lighting and atmosphere</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
