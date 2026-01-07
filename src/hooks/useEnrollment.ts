import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { EnrollmentData } from '@/components/course/EnrollmentModal';

interface StoredEnrollment {
  id: string;
  user_id: string;
  course_id: number;
  certificate_name: string;
  email: string;
  phone: string | null;
  enrolled_at: string;
}

export const useEnrollment = (courseId: number) => {
  const { user } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<StoredEnrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkEnrollment();
    } else {
      setIsEnrolled(false);
      setEnrollmentData(null);
      setLoading(false);
    }
  }, [courseId, user]);

  const checkEnrollment = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('course_enrollments' as any)
        .select('*')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking enrollment:', error);
      } else if (data) {
        setIsEnrolled(true);
        setEnrollmentData(data as unknown as StoredEnrollment);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    } finally {
      setLoading(false);
    }
  };

  const enroll = async (data: EnrollmentData): Promise<void> => {
    if (!user) {
      throw new Error('User must be logged in to enroll');
    }

    try {
      const { data: insertedData, error } = await supabase
        .from('course_enrollments' as any)
        .insert({
          user_id: user.id,
          course_id: courseId,
          certificate_name: data.certificateName,
          email: data.email,
          phone: data.phone || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving enrollment:', error);
        throw error;
      }

      setIsEnrolled(true);
      setEnrollmentData(insertedData as unknown as StoredEnrollment);
    } catch (error) {
      console.error('Error saving enrollment:', error);
      throw error;
    }
  };

  return {
    isEnrolled,
    enrollmentData,
    loading,
    enroll,
    requiresAuth: !user,
  };
};
