
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
      <DialogContent className="max-w-4xl bg-white text-chef-charcoal border-0 shadow-2xl rounded-2xl p-0 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-chef-royal-blue to-chef-royal-green p-8 text-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold font-playfair text-white mb-2">
              Ask the Community
            </DialogTitle>
            <p className="text-chef-warm-ivory/90 font-inter text-lg">
              Get expert advice from fellow chefs and culinary enthusiasts
            </p>
          </DialogHeader>
        </div>
        
        {/* Form Section */}
        <div className="p-8 bg-chef-warm-ivory">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title" className="text-base font-semibold text-chef-charcoal mb-3 block">
                  Question Title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's your cooking question?"
                  className="h-12 text-base bg-white border-2 border-chef-cream focus:border-chef-royal-blue text-chef-charcoal placeholder:text-chef-charcoal/60 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category" className="text-base font-semibold text-chef-charcoal mb-3 block">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 text-base bg-white border-2 border-chef-cream focus:border-chef-royal-blue text-chef-charcoal rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-chef-cream shadow-lg">
                    {categories.map((cat) => (
                      <SelectItem 
                        key={cat} 
                        value={cat}
                        className="text-chef-charcoal hover:bg-chef-cream focus:bg-chef-cream"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Question Details */}
            <div>
              <Label htmlFor="content" className="text-base font-semibold text-chef-charcoal mb-3 block">
                Question Details *
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Provide details about your question, what you've tried, and what specific help you need..."
                className="min-h-[160px] text-base bg-white border-2 border-chef-cream focus:border-chef-royal-blue text-chef-charcoal placeholder:text-chef-charcoal/60 rounded-lg resize-none"
                required
              />
              <p className="text-sm text-chef-charcoal/70 mt-2">
                The more details you provide, the better answers you'll receive!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-chef-cream">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isSubmitting}
                className="h-12 px-8 text-base font-semibold bg-white text-chef-charcoal border-2 border-chef-charcoal hover:bg-chef-charcoal hover:text-white transition-all duration-200 rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="h-12 px-8 text-base font-semibold bg-chef-royal-blue text-white hover:bg-chef-royal-blue/90 disabled:bg-chef-charcoal/30 disabled:text-chef-charcoal/60 transition-all duration-200 rounded-lg shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Posting Question...
                  </div>
                ) : (
                  'Post Question'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AskQuestionModal;
