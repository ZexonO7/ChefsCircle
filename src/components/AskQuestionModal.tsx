
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string, category: string) => Promise<boolean>;
}

const AskQuestionModal = ({ isOpen, onClose, onSubmit }: AskQuestionModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Techniques');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Techniques', 'Ingredients', 'Equipment', 'Troubleshooting', 'Nutrition', 'Food Safety'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit(title.trim(), content.trim(), category);
    
    if (success) {
      setTitle('');
      setContent('');
      setCategory('Techniques');
      onClose();
    }
    
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('');
      setContent('');
      setCategory('Techniques');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="chef-heading-md text-chef-charcoal">Ask a Question</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-chef-charcoal">Question Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your cooking question?"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-medium text-chef-charcoal">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="content" className="text-sm font-medium text-chef-charcoal">Question Details</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide details about your question, what you've tried, and what specific help you need..."
              className="mt-1 min-h-[120px]"
              required
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="chef-button-primary"
              disabled={isSubmitting || !title.trim() || !content.trim()}
            >
              {isSubmitting ? 'Posting...' : 'Post Question'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AskQuestionModal;
