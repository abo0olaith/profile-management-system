// ===== مثال لملف الإعدادات =====
// انسخ هذا الملف إلى js/config.js وحدّث القيم

const CONFIG = {
    // ========================================
    // معرف العميل من Google Cloud Console
    // ========================================
    // كيفية الحصول عليه:
    // 1. انتقل إلى https://console.cloud.google.com/
    // 2. اختر مشروعك أو أنشئ مشروعاً جديداً
    // 3. فعّل Google Drive API
    // 4. انتقل إلى APIs & Services > Credentials
    // 5. أنشئ OAuth 2.0 Client ID
    // 6. انسخ Client ID هنا
    CLIENT_ID: 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com',
    
    // ========================================
    // مفتاح API من Google Cloud Console
    // ========================================
    // كيفية الحصول عليه:
    // 1. في نفس صفحة Credentials
    // 2. انقر "+ CREATE CREDENTIALS"
    // 3. اختر "API key"
    // 4. انسخ المفتاح هنا
    API_KEY: 'YOUR_API_KEY_HERE',
    
    // ========================================
    // نطاقات الصلاحيات المطلوبة
    // ========================================
    // لا تحتاج لتغيير هذه القيم
    SCOPES: [
        'https://www.googleapis.com/auth/drive.file', // إنشاء وتعديل الملفات فقط
        'https://www.googleapis.com/auth/drive.appdata' // الوصول لمجلد البيانات
    ].join(' '),
    
    // ========================================
    // معرف مكتبة Google API
    // ========================================
    DISCOVERY_DOCS: [
        'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
    ],
    
    // ========================================
    // إعدادات التطبيق
    // ========================================
    
    // اسم المجلد الرئيسي للبروفايلات على Google Drive
    ROOT_FOLDER_NAME: 'ProfilesSystem',
    
    // اسم ملف قاعدة البيانات (JSON)
    DATABASE_FILE_NAME: 'profiles_database.json',
    
    // الحد الأقصى لحجم الصورة (بايت)
    // القيمة الحالية: 5 ميجابايت
    MAX_IMAGE_SIZE: 5 * 1024 * 1024,
    
    // الحد الأقصى لعدد الصور الإضافية
    MAX_ADDITIONAL_IMAGES: 10,
    
    // جودة ضغط الصور (0.1 - 1.0)
    // 0.8 = جودة عالية مع ضغط جيد
    IMAGE_QUALITY: 0.8
};

// التحقق من وجود الإعدادات
function validateConfig() {
    if (CONFIG.CLIENT_ID === 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com') {
        return {
            valid: false,
            message: 'يرجى تكوين CLIENT_ID في ملف config.js - راجع setup.html للمزيد'
        };
    }
    
    if (CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
        return {
            valid: false,
            message: 'يرجى تكوين API_KEY في ملف config.js - راجع setup.html للمزيد'
        };
    }
    
    return { valid: true };
}

// تصدير الإعدادات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
