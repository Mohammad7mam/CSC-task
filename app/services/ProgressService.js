// services/ProgressService.js
class ProgressService {
  // إنشاء ID فريد للتقدم
  static generateProgressId() {
    return (
      'progress_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
  }

  // جلب معلومات الكورس من Firebase
  static async fetchCourseDetails(courseId) {
    try {
      const firebaseUrl = `https://tst-csc-default-rtdb.firebaseio.com/courses/${courseId}.json`;

      const response = await fetch(firebaseUrl);

      if (!response.ok) {
        console.error(
          `❌ فشل في جلب الكورس ${courseId}، الرمز: ${response.status}`,
        );
        return null;
      }

      const courseData = await response.json();

      if (!courseData) {
        console.error(`❌ الكورس ${courseId} غير موجود في قاعدة البيانات`);
        return null;
      }

      console.log('✅ تم جلب معلومات الكورس بنجاح:', courseData.title);
      return courseData;
    } catch (error) {
      console.error('❌ خطأ في جلب تفاصيل الكورس:', error);
      return null;
    }
  }

  // إنشاء سجل تقدم جديد
  static async createProgressRecord(userId, courseId) {
    try {
      // جلب معلومات الكورس الحقيقية
      const courseData = await this.fetchCourseDetails(courseId);

      const progressId = this.generateProgressId();
      const currentDate = new Date().toISOString();

      // حساب تاريخ الانتهاء المقدر بناءً على مدة الكورس الحقيقية
      const estimatedCompletionDate = new Date();
      if (courseData && courseData.totalWeeks) {
        // استخدام مدة الكورس الحقيقية (أسبوع لكل أسبوع دراسي)
        estimatedCompletionDate.setDate(
          estimatedCompletionDate.getDate() + courseData.totalWeeks * 7,
        );
      } else {
        // القيمة الافتراضية: 3 أشهر
        estimatedCompletionDate.setMonth(
          estimatedCompletionDate.getMonth() + 3,
        );
      }

      // ✅ إعداد بيانات categories
      const categories = courseData?.categories || {
        primary: 'Uncategorized',
        secondary: [],
        tags: [],
      };

      // ✅ إعداد بيانات courseDetails مع categories
      const courseDetails = courseData
        ? {
            // المعلومات الأساسية
            totalLessons: courseData.totalLessons || 85,
            totalWeeks: courseData.totalWeeks || 12,
            totalHours: courseData.totalHours || 65.5,
            instructorName: courseData.instructor?.name || 'Unknown Instructor',
            courseDescription: courseData.shortDescription || '',
            rating: courseData.rating?.average || 0,

            // ✅ الفئات - هذا ما تريده
            categories: categories,

            // معلومات إضافية مفيدة
            certificateIncluded: courseData.certificateIncluded || false,
            language: courseData.language || 'English',
            price: courseData.price || null,
            provider: courseData.provider || null,
            requirements: courseData.requirements || [],
            targetAudience: courseData.targetAudience || [],
            whatYouWillLearn: courseData.whatYouWillLearn || {},
            resources: courseData.resources || {},
          }
        : null;

      // هيكل بيانات التقدم مع المعلومات الحقيقية للكورس
      const progressData = {
        progressId: progressId,
        userId: userId,
        courseId: courseId,
        courseTitle: courseData?.title || 'Unknown Course',
        enrollmentDate: currentDate,
        lastAccessed: currentDate,
        estimatedCompletionDate: estimatedCompletionDate.toISOString(),
        overallProgress: 0,
        status: 'in-progress',
        currentWeek: 1,
        currentLesson: 1,
        completedWeeks: [],
        completedLessons: [],
        bookmarks: [],
        totalTimeSpent: 0, // بالدقائق
        averageScore: 0,
        certificateEarned: false,
        assignments: {},
        quizzes: {},
        notes: [],
        // ✅ حفظ courseDetails مع categories
        courseDetails: courseDetails,
      };

      // حفظ في Firebase
      const firebaseUrl = `https://tst-csc-default-rtdb.firebaseio.com/user_progress/${progressId}.json`;

      const response = await fetch(firebaseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ فشل في إنشاء سجل التقدم:', errorText);
        throw new Error(`Failed to create progress record: ${response.status}`);
      }

      console.log('✅ تم إنشاء سجل التقدم بنجاح:', progressId);
      console.log('📊 معلومات الكورس المستخدمة:', {
        title: progressData.courseTitle,
        primaryCategory: categories.primary,
        secondaryCategories: categories.secondary,
        tags: categories.tags,
      });

      return {
        success: true,
        progressId: progressId,
        data: progressData,
      };
    } catch (error) {
      console.error('❌ خطأ في إنشاء سجل التقدم:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // تحديث حالة التسجيل وإنشاء التقدم إذا لزم الأمر
  static async updateEnrollmentStatus(enrollmentId, newStatus, enrollmentData) {
    try {
      console.log(
        '🔄 بدء تحديث حالة التسجيل:',
        enrollmentId,
        'الحالة:',
        newStatus,
      );

      // 1. تحديث الحالة في Firebase
      const updateUrl = `https://tst-csc-default-rtdb.firebaseio.com/course_enrollments/${enrollmentId}/status.json`;

      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStatus),
      });

      if (!response.ok) {
        throw new Error('فشل في تحديث حالة التسجيل');
      }

      console.log('✅ تم تحديث حالة التسجيل إلى:', newStatus);

      // 2. إذا كانت الحالة approved، أنشئ سجل التقدم
      if (newStatus === 'approved') {
        console.log('📝 إنشاء سجل تقدم جديد للمستخدم:', enrollmentData.userId);

        // تمرير userId و courseId فقط، سيتم جلب البيانات تلقائياً
        const progressResult = await this.createProgressRecord(
          enrollmentData.userId,
          enrollmentData.courseId,
        );

        if (progressResult.success) {
          console.log('✅ تم إنشاء سجل التقدم:', progressResult.progressId);

          // 3. تحديث التسجيل برابط التقدم
          const progressLinkUrl = `https://tst-csc-default-rtdb.firebaseio.com/course_enrollments/${enrollmentId}/progressId.json`;
          const linkResponse = await fetch(progressLinkUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(progressResult.progressId),
          });

          if (!linkResponse.ok) {
            console.warn('⚠️ تم إنشاء التقدم ولكن فشل ربطه بالتسجيل');
          } else {
            console.log('✅ تم ربط التقدم بالتسجيل بنجاح');
          }

          // 4. إرسال إشعار للمستخدم
          await this.sendApprovalNotification(
            enrollmentData,
            progressResult.progressId,
          );
        } else {
          console.error('❌ فشل في إنشاء سجل التقدم:', progressResult.error);
          throw new Error(`فشل في إنشاء سجل التقدم: ${progressResult.error}`);
        }
      }

      return {
        success: true,
        message: `تم ${newStatus === 'approved' ? 'قبول' : 'رفض'} الطلب`,
        newStatus: newStatus,
      };
    } catch (error) {
      console.error('❌ خطأ في عملية التحديث:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // إرسال إشعار للمستخدم
  static async sendApprovalNotification(enrollmentData, progressId) {
    try {
      // جلب معلومات الكورس لعرض العنوان الصحيح
      const courseData = await this.fetchCourseDetails(enrollmentData.courseId);
      const courseTitle =
        courseData?.title || enrollmentData.courseTitle || 'الكورس';

      console.log('📨 إشعار للمستخدم:', {
        to: enrollmentData.userEmail || 'بريد غير متوفر',
        message: `تم قبول تسجيلك في "${courseTitle}"`,
        progressId: progressId,
        courseId: enrollmentData.courseId,
      });

      // يمكنك إضافة إرسال إشعار حقيقي هنا (FCM، إيميل، إلخ)
      // await this.sendRealNotification(...);
    } catch (error) {
      console.error('خطأ في إرسال الإشعار:', error);
    }
  }

  // جلب تقدم المستخدم في كورس محدد
  static async getUserCourseProgress(userId, courseId) {
    try {
      console.log('🔍 البحث عن تقدم المستخدم:', userId, 'في الكورس:', courseId);

      // استعلام Firebase للحصول على جميع سجلات تقدم المستخدم
      const firebaseUrl = `https://tst-csc-default-rtdb.firebaseio.com/user_progress.json?orderBy="userId"&equalTo="${userId}"`;

      const response = await fetch(firebaseUrl);

      if (!response.ok) {
        console.error('❌ فشل في جلب بيانات التقدم:', response.status);
        return null;
      }

      const data = await response.json();

      if (!data) {
        console.log('⚠️ لا توجد سجلات تقدم للمستخدم:', userId);
        return null;
      }

      // البحث عن تقدم الكورس المحدد
      const progressRecords = Object.values(data);
      const courseProgress = progressRecords.find(
        progress => progress && progress.courseId === courseId,
      );

      if (courseProgress) {
        console.log('✅ تم العثور على تقدم الكورس:', courseProgress.progressId);
        // ✅ عرض معلومات categories إذا وجدت
        if (courseProgress.courseDetails?.categories) {
          console.log('📋 فئات الكورس:', {
            primary: courseProgress.courseDetails.categories.primary,
            secondary: courseProgress.courseDetails.categories.secondary,
          });
        }
      } else {
        console.log('⚠️ لم يتم العثور على تقدم للكورس المحدد');
      }

      return courseProgress;
    } catch (error) {
      console.error('خطأ في جلب تقدم المستخدم:', error);
      return null;
    }
  }

  // جلب جميع تقدمات المستخدم مع التصنيف
  static async getAllUserProgress(userId) {
    try {
      console.log('🔍 جلب جميع تقدمات المستخدم:', userId);

      const firebaseUrl = `https://tst-csc-default-rtdb.firebaseio.com/user_progress.json?orderBy="userId"&equalTo="${userId}"`;

      const response = await fetch(firebaseUrl);

      if (!response.ok) {
        console.error('❌ فشل في جلب جميع التقدمات:', response.status);
        return {};
      }

      const data = await response.json();

      if (!data) {
        console.log('⚠️ لا توجد سجلات تقدم للمستخدم');
        return {};
      }

      console.log(`✅ تم العثور على ${Object.keys(data).length} سجل تقدم`);

      // ✅ عرض إحصائيات حسب الفئة
      const categoryStats = {};
      Object.values(data).forEach(progress => {
        const primaryCategory =
          progress.courseDetails?.categories?.primary || 'غير مصنف';
        categoryStats[primaryCategory] =
          (categoryStats[primaryCategory] || 0) + 1;
      });

      console.log('📊 إحصائيات التقدم حسب الفئة:', categoryStats);

      return data || {};
    } catch (error) {
      console.error('خطأ في جلب جميع التقدمات:', error);
      return {};
    }
  }

  // ✅ دالة جديدة: جلب تقدم المستخدم حسب الفئة
  static async getUserProgressByCategory(userId, category) {
    try {
      console.log(`🔍 جلب تقدم المستخدم ${userId} حسب الفئة: ${category}`);

      const allProgress = await this.getAllUserProgress(userId);

      if (!allProgress || Object.keys(allProgress).length === 0) {
        return {};
      }

      // تصفية التقدم حسب الفئة
      const filteredProgress = {};
      Object.entries(allProgress).forEach(([key, progress]) => {
        const primaryCategory = progress.courseDetails?.categories?.primary;
        const secondaryCategories =
          progress.courseDetails?.categories?.secondary || [];
        const tags = progress.courseDetails?.categories?.tags || [];

        // البحث في الفئة الأساسية، الثانوية، أو التاجات
        if (
          primaryCategory === category ||
          secondaryCategories.includes(category) ||
          tags.includes(category)
        ) {
          filteredProgress[key] = progress;
        }
      });

      console.log(
        `✅ تم العثور على ${
          Object.keys(filteredProgress).length
        } كورس في فئة "${category}"`,
      );

      return filteredProgress;
    } catch (error) {
      console.error('خطأ في جلب التقدم حسب الفئة:', error);
      return {};
    }
  }

  // تحديث تقدم الدرس
  static async updateLessonProgress(
    progressId,
    lessonNumber,
    completed = true,
  ) {
    try {
      console.log('🔄 تحديث تقدم الدرس:', progressId, 'الدرس:', lessonNumber);

      // 1. جلب البيانات الحالية
      const currentUrl = `https://tst-csc-default-rtdb.firebaseio.com/user_progress/${progressId}.json`;
      const currentResponse = await fetch(currentUrl);

      if (!currentResponse.ok) {
        throw new Error(`Progress record not found: ${currentResponse.status}`);
      }

      const currentData = await currentResponse.json();

      if (!currentData) {
        throw new Error('سجل التقدم غير موجود');
      }

      // 2. تحديث الدروس المكتملة
      const updatedCompletedLessons = [
        ...new Set([...(currentData.completedLessons || []), lessonNumber]),
      ];

      // 3. حساب التقدم العام بناءً على عدد الدروس الفعلي للكورس
      const totalLessons = currentData.courseDetails?.totalLessons || 85;
      const overallProgress = Math.round(
        (updatedCompletedLessons.length / totalLessons) * 100,
      );

      // 4. حساب الأسبوع الحالي بناءً على التقدم
      const currentWeek = Math.max(
        1,
        Math.ceil(
          lessonNumber /
            (totalLessons / (currentData.courseDetails?.totalWeeks || 12)),
        ),
      );

      // 5. تحديث البيانات
      const updateData = {
        completedLessons: updatedCompletedLessons,
        currentLesson: Math.min(lessonNumber + 1, totalLessons),
        currentWeek: currentWeek,
        overallProgress: overallProgress,
        lastAccessed: new Date().toISOString(),
        totalTimeSpent: (currentData.totalTimeSpent || 0) + 30, // إضافة 30 دقيقة
      };

      // إذا أكمل جميع الدروس، تحديث حالة الكورس
      if (updatedCompletedLessons.length >= totalLessons) {
        updateData.status = 'completed';
        updateData.certificateEarned =
          currentData.courseDetails?.certificateIncluded || false;
      }

      // 6. حفظ التحديثات
      const updateUrl = `https://tst-csc-default-rtdb.firebaseio.com/user_progress/${progressId}.json`;
      const updateResponse = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!updateResponse.ok) {
        throw new Error('فشل في تحديث التقدم');
      }

      console.log('✅ تم تحديث تقدم الدرس بنجاح');
      console.log(
        `📊 الفئة: ${
          currentData.courseDetails?.categories?.primary || 'غير مصنف'
        }`,
      );

      return {
        success: true,
        progress: overallProgress,
        completedLessons: updatedCompletedLessons,
        currentWeek: currentWeek,
        totalLessons: totalLessons,
        // ✅ إضافة معلومات الفئة للنتيجة
        category: currentData.courseDetails?.categories?.primary || 'غير مصنف',
      };
    } catch (error) {
      console.error('خطأ في تحديث تقدم الدرس:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // دالة مساعدة: تحديث تقدم المستخدم بناءً على الأسبوع
  static async updateWeekProgress(progressId, weekNumber) {
    try {
      const currentUrl = `https://tst-csc-default-rtdb.firebaseio.com/user_progress/${progressId}.json`;
      const currentResponse = await fetch(currentUrl);
      const currentData = await currentResponse.json();

      if (!currentData) {
        throw new Error('سجل التقدم غير موجود');
      }

      const updatedCompletedWeeks = [
        ...new Set([...(currentData.completedWeeks || []), weekNumber]),
      ];

      const updateData = {
        completedWeeks: updatedCompletedWeeks,
        currentWeek: weekNumber + 1,
        lastAccessed: new Date().toISOString(),
      };

      const updateUrl = `https://tst-csc-default-rtdb.firebaseio.com/user_progress/${progressId}.json`;
      await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      return {
        success: true,
        completedWeeks: updatedCompletedWeeks,
      };
    } catch (error) {
      console.error('خطأ في تحديث تقدم الأسبوع:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // ✅ دالة جديدة: جلب إحصائيات التقدم حسب الفئة
  static async getCategoryStatistics(userId) {
    try {
      const allProgress = await this.getAllUserProgress(userId);

      if (!allProgress || Object.keys(allProgress).length === 0) {
        return {categories: {}};
      }

      const categoryStats = {
        categories: {},
        totalCourses: Object.keys(allProgress).length,
        totalProgress: 0,
      };

      Object.values(allProgress).forEach(progress => {
        const primaryCategory =
          progress.courseDetails?.categories?.primary || 'غير مصنف';
        const secondaryCategories =
          progress.courseDetails?.categories?.secondary || [];
        const progressValue = progress.overallProgress || 0;

        // تحديث إحصائيات الفئة الأساسية
        if (!categoryStats.categories[primaryCategory]) {
          categoryStats.categories[primaryCategory] = {
            count: 0,
            totalProgress: 0,
            averageProgress: 0,
            courses: [],
          };
        }

        categoryStats.categories[primaryCategory].count++;
        categoryStats.categories[primaryCategory].totalProgress +=
          progressValue;
        categoryStats.categories[primaryCategory].courses.push({
          title: progress.courseTitle,
          progress: progressValue,
          status: progress.status,
        });

        // تحديث التقدم الكلي
        categoryStats.totalProgress += progressValue;
      });

      // حساب متوسط التقدم لكل فئة
      Object.keys(categoryStats.categories).forEach(category => {
        const cat = categoryStats.categories[category];
        cat.averageProgress = Math.round(cat.totalProgress / cat.count);
      });

      return categoryStats;
    } catch (error) {
      console.error('خطأ في جلب إحصائيات الفئة:', error);
      return {categories: {}};
    }
  }
}

export default ProgressService;
