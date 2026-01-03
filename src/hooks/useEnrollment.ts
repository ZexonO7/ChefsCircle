import { useState, useEffect } from 'react';
import { EnrollmentData } from '@/components/course/EnrollmentModal';

const ENROLLMENT_STORAGE_KEY = 'course_enrollments';

interface StoredEnrollment extends EnrollmentData {
  courseId: number;
  enrolledAt: string;
}

export const useEnrollment = (courseId: number) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<StoredEnrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkEnrollment();
  }, [courseId]);

  const checkEnrollment = () => {
    try {
      const stored = localStorage.getItem(ENROLLMENT_STORAGE_KEY);
      if (stored) {
        const enrollments: StoredEnrollment[] = JSON.parse(stored);
        const existing = enrollments.find(e => e.courseId === courseId);
        if (existing) {
          setIsEnrolled(true);
          setEnrollmentData(existing);
        }
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    } finally {
      setLoading(false);
    }
  };

  const enroll = async (data: EnrollmentData): Promise<void> => {
    try {
      const stored = localStorage.getItem(ENROLLMENT_STORAGE_KEY);
      const enrollments: StoredEnrollment[] = stored ? JSON.parse(stored) : [];
      
      const newEnrollment: StoredEnrollment = {
        ...data,
        courseId,
        enrolledAt: new Date().toISOString(),
      };
      
      enrollments.push(newEnrollment);
      localStorage.setItem(ENROLLMENT_STORAGE_KEY, JSON.stringify(enrollments));
      
      setIsEnrolled(true);
      setEnrollmentData(newEnrollment);
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
  };
};
