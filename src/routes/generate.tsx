import { createFileRoute } from "@tanstack/react-router";
import { ImageGenerator } from "@/components/site/ImageGenerator";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/generate")({
  component: GeneratePage,
});

function GeneratePage() {
  return (
    <>
      <PageHeader
        title="AI Art Generator"
        description="Create unique artworks using artificial intelligence"
      />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Transform Your Ideas Into Art</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Describe your vision and watch as AI brings it to life. From abstract concepts to
              detailed scenes, our AI can generate stunning artwork based on your prompts.
            </p>
          </div>

          <ImageGenerator />

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">How It Works</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Enter a detailed description of what you want to create</li>
                <li>Click "Generate Image" to start the AI process</li>
                <li>Wait a few seconds while the AI creates your artwork</li>
                <li>Download your generated image or try again with a new prompt</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Example Prompts</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>"A vibrant sunset over a futuristic city with flying cars"</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>"Abstract painting with swirling colors in the style of Van Gogh"</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>"Mystical forest with glowing mushrooms and fairy lights"</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>"Portrait of a cyberpunk warrior with neon accents"</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
