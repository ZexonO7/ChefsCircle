import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Download, Users, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllCourses } from '@/data/courseData';

const courses = getAllCourses();

interface Enrollment {
  id: string;
  user_id: string;
  course_id: number;
  certificate_name: string;
  email: string;
  phone: string | null;
  enrolled_at: string;
}

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('course_enrollments' as any)
        .select('*')
        .order('enrolled_at', { ascending: false });

      if (error) {
        console.error('Error fetching enrollments:', error);
      } else {
        setEnrollments((data || []) as unknown as Enrollment[]);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch =
      enrollment.certificate_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse =
      courseFilter === 'all' || enrollment.course_id.toString() === courseFilter;
    return matchesSearch && matchesCourse;
  });

  const getCourseName = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    return course?.title || `Course ${courseId}`;
  };

  const exportCSV = () => {
    const headers = ['Certificate Name', 'Email', 'Phone', 'Course', 'Enrolled At'];
    const rows = filteredEnrollments.map((e) => [
      e.certificate_name,
      e.email,
      e.phone || '',
      getCourseName(e.course_id),
      new Date(e.enrolled_at).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enrollments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chef-royal-blue"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 border border-chef-royal-blue/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-chef-gold/20 rounded-full">
              <Users className="w-6 h-6 text-chef-gold" />
            </div>
            <div>
              <p className="text-sm text-chef-charcoal/60">Total Enrollments</p>
              <p className="text-2xl font-bold text-chef-charcoal">{enrollments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-chef-royal-blue/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-chef-royal-blue/20 rounded-full">
              <GraduationCap className="w-6 h-6 text-chef-royal-blue" />
            </div>
            <div>
              <p className="text-sm text-chef-charcoal/60">Active Courses</p>
              <p className="text-2xl font-bold text-chef-charcoal">
                {new Set(enrollments.map((e) => e.course_id)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chef-charcoal/40" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-chef-charcoal/20"
          />
        </div>
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-white border-chef-charcoal/20">
            <SelectValue placeholder="Filter by course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={exportCSV}
          variant="outline"
          className="border-chef-royal-blue text-chef-royal-blue hover:bg-chef-royal-blue/5"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-chef-royal-blue/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-chef-warm-ivory/50">
              <TableHead>Certificate Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Enrolled At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnrollments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-chef-charcoal/60">
                  No enrollments found
                </TableCell>
              </TableRow>
            ) : (
              filteredEnrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell className="font-medium">{enrollment.certificate_name}</TableCell>
                  <TableCell>{enrollment.email}</TableCell>
                  <TableCell>{enrollment.phone || '-'}</TableCell>
                  <TableCell>{getCourseName(enrollment.course_id)}</TableCell>
                  <TableCell>
                    {new Date(enrollment.enrolled_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default AdminEnrollments;
