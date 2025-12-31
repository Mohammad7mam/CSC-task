// services/AdminService.js
class AdminService {
  // جلب جميع التسجيلات
  static async getAllEnrollments() {
    try {
      const response = await fetch(
        'https://tst-csc-default-rtdb.firebaseio.com/course_enrollments.json'
      );
      
      if (!response.ok) {
        throw new Error('فشل في جلب التسجيلات');
      }
      
      const data = await response.json();
      return data || {};
    } catch (error) {
      console.error('AdminService Error:', error);
      throw error;
    }
  }

  // تحديث حالة التسجيل
  static async updateEnrollmentStatus(enrollmentId, status) {
    try {
      const response = await fetch(
        `https://tst-csc-default-rtdb.firebaseio.com/course_enrollments/${enrollmentId}/status.json`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(status),
        }
      );
      
      if (!response.ok) {
        throw new Error('فشل في تحديث الحالة');
      }
      
      return true;
    } catch (error) {
      console.error('Update Status Error:', error);
      throw error;
    }
  }

  // جلب إحصائيات
  static async getEnrollmentStats() {
    try {
      const enrollments = await this.getAllEnrollments();
      const enrollmentsArray = Object.values(enrollments || {});
      
      return {
        total: enrollmentsArray.length,
        pending: enrollmentsArray.filter(e => e.status === 'pending').length,
        approved: enrollmentsArray.filter(e => e.status === 'approved').length,
        rejected: enrollmentsArray.filter(e => e.status === 'rejected').length,
      };
    } catch (error) {
      console.error('Stats Error:', error);
      throw error;
    }
  }

  // حذف تسجيل
  static async deleteEnrollment(enrollmentId) {
    try {
      const response = await fetch(
        `https://tst-csc-default-rtdb.firebaseio.com/course_enrollments/${enrollmentId}.json`,
        {
          method: 'DELETE',
        }
      );
      
      if (!response.ok) {
        throw new Error('فشل في حذف التسجيل');
      }
      
      return true;
    } catch (error) {
      console.error('Delete Error:', error);
      throw error;
    }
  }
}

export default AdminService;