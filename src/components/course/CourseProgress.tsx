import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

interface CourseProgressProps {
  completedLessons: number[];
  totalLessons: number;
}

const CourseProgress = ({ completedLessons, totalLessons }: CourseProgressProps) => {
  const progress = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;
  const complete = progress >= 100;

  return (
    <Card className="premium-card border-0">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base font-medium text-foreground">
          <span className="inline-flex items-center gap-2">
            <Award className="h-4 w-4 text-accent" />
            Your Progress
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/50">
            {Math.round(progress)}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-foreground/[0.06]">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-accent/70"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
            {complete && (
              <div className="shimmer-gold absolute inset-0 rounded-full opacity-60" />
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-foreground/60">
            <span>{completedLessons.length} of {totalLessons} lessons</span>
            <span className={complete ? 'text-accent font-medium' : ''}>
              {complete ? 'Complete' : 'In progress'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseProgress;
