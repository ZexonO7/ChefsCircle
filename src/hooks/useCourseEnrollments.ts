import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCourseEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        // Get unique user counts per course
        const { data, error } = await supabase
          .from('user_course_progress')
          .select('course_id, user_id');

        if (error) throw error;

        // Count unique users per course
        const counts: Record<number, Set<string>> = {};
        data?.forEach(row => {
          if (!counts[row.course_id]) {
            counts[row.course_id] = new Set();
          }
          counts[row.course_id].add(row.user_id);
        });

        // Convert sets to counts
        const enrollmentCounts: Record<number, number> = {};
        Object.entries(counts).forEach(([courseId, users]) => {
          enrollmentCounts[Number(courseId)] = users.size;
        });

        setEnrollments(enrollmentCounts);
      } catch (error) {
        console.error('Error fetching enrollment counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('course-enrollments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_course_progress'
        },
        () => {
          fetchEnrollments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getEnrollmentCount = (courseId: number): number => {
    return enrollments[courseId] || 0;
  };

  return { enrollments, loading, getEnrollmentCount };
};
