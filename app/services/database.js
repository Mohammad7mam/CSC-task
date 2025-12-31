// services/database.js
import { database } from '../firebase/firebase';

const DB_BASE_PATH = '/courses';
const SECONDARY_CATEGORIES_PATH = '/categories/secondary_categories';

// ============== دوال Courses ==============

// جلب جميع الكورسات
export const getAllCourses = async () => {
  try {
    const snapshot = await database()
      .ref(DB_BASE_PATH)
      .once('value');
    
    if (snapshot.exists()) {
      const courses = snapshot.val();
      // تحويل الobject إلى array مع حفظ الID
      return Object.keys(courses).map(key => ({
        id: key,
        ...courses[key]
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

// جلب كورس معين بالـ ID
export const getCourseById = async (courseId) => {
  try {
    const snapshot = await database()
      .ref(`${DB_BASE_PATH}/${courseId}`)
      .once('value');
    
    if (snapshot.exists()) {
      return {
        id: courseId,
        ...snapshot.val()
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching course ${courseId}:`, error);
    throw error;
  }
};

// جلب الكورسات حسب الفئة
export const getCoursesByCategory = async (categoryType, categoryName) => {
  try {
    const allCourses = await getAllCourses();
    
    return allCourses.filter(course => {
      if (categoryType === 'secondary') {
        return course.categories?.secondary?.includes(categoryName);
      } else if (categoryType === 'primary') {
        return course.categories?.primary === categoryName;
      } else if (categoryType === 'tags') {
        return course.categories?.tags?.includes(categoryName);
      }
      return false;
    });
  } catch (error) {
    console.error('Error filtering courses by category:', error);
    throw error;
  }
};

// جلب كورسات حسب الفئة الثانوية بالاسم
export const getCoursesBySecondaryCategoryName = async (categoryName) => {
  try {
    const allCourses = await getAllCourses();
    
    return allCourses.filter(course => {
      return course.categories?.secondary?.includes(categoryName);
    });
  } catch (error) {
    console.error('Error filtering courses by secondary category name:', error);
    throw error;
  }
};

// إضافة كورس جديد
export const addCourse = async (courseData) => {
  try {
    // توليد ID جديد تلقائياً من Firebase
    const newCourseRef = database()
      .ref(DB_BASE_PATH)
      .push();
    
    const courseId = newCourseRef.key;
    
    await newCourseRef.set({
      ...courseData,
      courseId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return courseId;
  } catch (error) {
    console.error('Error adding course:', error);
    throw error;
  }
};

// تحديث كورس موجود
export const updateCourse = async (courseId, updatedData) => {
  try {
    await database()
      .ref(`${DB_BASE_PATH}/${courseId}`)
      .update({
        ...updatedData,
        updatedAt: new Date().toISOString()
      });
    
    return true;
  } catch (error) {
    console.error(`Error updating course ${courseId}:`, error);
    throw error;
  }
};

// حذف كورس
export const deleteCourse = async (courseId) => {
  try {
    await database()
      .ref(`${DB_BASE_PATH}/${courseId}`)
      .remove();
    
    return true;
  } catch (error) {
    console.error(`Error deleting course ${courseId}:`, error);
    throw error;
  }
};

// ============== دوال الفئات الثانوية ==============

// جلب جميع الفئات الثانوية
export const getSecondaryCategories = async () => {
  try {
    const snapshot = await database()
      .ref(SECONDARY_CATEGORIES_PATH)
      .once('value');
    
    if (snapshot.exists()) {
      const categories = snapshot.val();
      return Object.keys(categories).map(key => ({
        id: key,
        ...categories[key]
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching secondary categories:', error);
    throw error;
  }
};

// جلب فئة ثانوية معينة بالـ ID
export const getSecondaryCategoryById = async (categoryId) => {
  try {
    const snapshot = await database()
      .ref(`${SECONDARY_CATEGORIES_PATH}/${categoryId}`)
      .once('value');
    
    if (snapshot.exists()) {
      return {
        id: categoryId,
        ...snapshot.val()
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching category ${categoryId}:`, error);
    throw error;
  }
};

// ============== دوال إضافية مفيدة ==============

// جلب الكورسات المميزة
export const getFeaturedCourses = async () => {
  try {
    const allCourses = await getAllCourses();
    return allCourses.filter(course => course.isFeatured === true);
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    throw error;
  }
};

// جلب الكورسات المنشورة
export const getPublishedCourses = async () => {
  try {
    const allCourses = await getAllCourses();
    return allCourses.filter(course => course.isPublished === true);
  } catch (error) {
    console.error('Error fetching published courses:', error);
    throw error;
  }
};

// جلب الكورسات حسب المدرب
export const getCoursesByInstructor = async (instructorId) => {
  try {
    const allCourses = await getAllCourses();
    return allCourses.filter(course => course.instructor?.instructorId === instructorId);
  } catch (error) {
    console.error(`Error fetching courses by instructor ${instructorId}:`, error);
    throw error;
  }
};

// البحث في الكورسات
export const searchCourses = async (searchTerm) => {
  try {
    const allCourses = await getAllCourses();
    const term = searchTerm.toLowerCase();
    
    return allCourses.filter(course => {
      return (
        course.title?.toLowerCase().includes(term) ||
        course.shortDescription?.toLowerCase().includes(term) ||
        course.categories?.primary?.toLowerCase().includes(term) ||
        course.categories?.tags?.some(tag => tag.toLowerCase().includes(term)) ||
        course.instructor?.name?.toLowerCase().includes(term)
      );
    });
  } catch (error) {
    console.error('Error searching courses:', error);
    throw error;
  }
};

// تحديث عدد التسجيلات في كورس
export const updateEnrollmentCount = async (courseId, increment = 1) => {
  try {
    const course = await getCourseById(courseId);
    if (!course) throw new Error('Course not found');
    
    const newCount = (course.enrollmentCount || 0) + increment;
    
    await updateCourse(courseId, { enrollmentCount: newCount });
    
    return newCount;
  } catch (error) {
    console.error(`Error updating enrollment for course ${courseId}:`, error);
    throw error;
  }
};

// تصدير جميع الدوال
export default {
  // Courses
  getAllCourses,
  getCourseById,
  getCoursesByCategory,
  getCoursesBySecondaryCategoryName,
  addCourse,
  updateCourse,
  deleteCourse,
  
  // Categories
  getSecondaryCategories,
  getSecondaryCategoryById,
  
  // Additional
  getFeaturedCourses,
  getPublishedCourses,
  getCoursesByInstructor,
  searchCourses,
  updateEnrollmentCount
};