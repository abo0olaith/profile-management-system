// ===== إعدادات Google API =====
// ملاحظة: يجب على المستخدم استبدال هذه القيم بقيمه الخاصة

const CONFIG = {
    // معرف العميل من Google Cloud Console
    // احصل عليه من: https://console.cloud.google.com/
    CLIENT_ID: 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com',
    
    // مفتاح API من Google Cloud Console
    API_KEY: 'YOUR_API_KEY_HERE',
    
    // نطاقات الصلاحيات المطلوبة
    SCOPES: [
        'https://www.googleapis.com/auth/drive.file', // إنشاء وتعديل الملفات
        'https://www.googleapis.com/auth/drive.appdata' // الوصول لمجلد البيانات
    ].join(' '),
    
    // معرف مكتبة Google API
    DISCOVERY_DOCS: [
        'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
    ],
    
    // اسم المجلد الرئيسي للبروفايلات
    ROOT_FOLDER_NAME: 'ProfilesSystem',
    
    // اسم ملف قاعدة البيانات
    DATABASE_FILE_NAME: 'profiles_database.json',
    
    // الحد الأقصى لحجم الصور (5MB)
    MAX_IMAGE_SIZE: 5 * 1024 * 1024,
    
    // الحد الأقصى لعدد الصور الإضافية
    MAX_ADDITIONAL_IMAGES: 10,
    
    // جودة ضغط الصور
    IMAGE_QUALITY: 0.8
};

// التحقق من وجود الإعدادات
function validateConfig() {
    if (CONFIG.CLIENT_ID === 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com') {
        return {
            valid: false,
            message: 'يرجى تكوين CLIENT_ID في ملف config.js'
        };
    }
    
    if (CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
        return {
            valid: false,
            message: 'يرجى تكوين API_KEY في ملف config.js'
        };
    }
    
    return { valid: true };
}

// تصدير الإعدادات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
