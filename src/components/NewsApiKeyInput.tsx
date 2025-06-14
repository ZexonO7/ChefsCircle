
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, ExternalLink } from 'lucide-react';

interface NewsApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
}

const NewsApiKeyInput = ({ onApiKeySet }: NewsApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          News API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            To display live culinary news, you need a NewsAPI key. 
            <a 
              href="https://newsapi.org/register" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-chef-royal-blue hover:underline ml-1"
            >
              Get your free API key here
              <ExternalLink className="w-3 h-3" />
            </a>
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter your NewsAPI key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full" disabled={!apiKey.trim()}>
            Set API Key
          </Button>
        </form>
        
        <p className="text-sm text-chef-charcoal/60">
          Your API key will be stored locally in your browser and used to fetch the latest culinary news.
        </p>
      </CardContent>
    </Card>
  );
};

export default NewsApiKeyInput;
