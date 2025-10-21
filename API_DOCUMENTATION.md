# 📚 توثيق API - نظام إدارة البروفايلات

> دليل شامل للمطورين للتكامل مع النظام وفهم البنية التقنية

---

## 📋 جدول المحتويات

- [Google Drive API](#google-drive-api)
- [هيكل البيانات](#هيكل-البيانات)
- [الوظائف الرئيسية](#الوظائف-الرئيسية)
- [أمثلة الاستخدام](#أمثلة-الاستخدام)

---

## 🔐 Google Drive API

### Authentication

#### `handleAuthClick()`
**الوصف:** معالجة تسجيل الدخول مع Google  
**الإرجاع:** `Promise<void>`

```javascript
// الاستخدام
document.getElementById('loginBtn').addEventListener('click', handleAuthClick);
```

#### `handleSignoutClick()`
**الوصف:** معالجة تسجيل الخروج  
**الإرجاع:** `Promise<void>`

```javascript
// الاستخدام
document.getElementById('logoutBtn').addEventListener('click', handleSignoutClick);
```

#### `isAuthenticated()`
**الوصف:** التحقق من حالة تسجيل الدخول  
**الإرجاع:** `boolean`

```javascript
if (isAuthenticated()) {
    console.log('المستخدم مسجل الدخول');
}
```

---

## 📊 هيكل البيانات

### Profile Object

```typescript
interface Profile {
    // المعرف الفريد
    id: string;
    
    // البيانات الشخصية
    fullName: string;
    biography: string;
    email: string;
    phone: string;
    
    // الصور
    profileImage: string;        // رابط Google Drive
    additionalImages?: string[]; // روابط الصور الإضافية
    
    // البيانات الزمنية
    createdAt: string;          // ISO 8601 format
}
```

#### مثال:

```json
{
    "id": "lm4n5o6p7q8r9s",
    "fullName": "محمد أحمد",
    "biography": "مطور برمجيات متخصص في تطوير الويب...",
    "email": "mohamed@example.com",
    "phone": "+20 123 456 7890",
    "profileImage": "https://drive.google.com/uc?export=view&id=ABC123",
    "additionalImages": [
        "https://drive.google.com/uc?export=view&id=XYZ789",
        "https://drive.google.com/uc?export=view&id=DEF456"
    ],
    "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Database File Structure

```typescript
interface Database {
    profiles: Profile[];
    created_at: string;
    last_updated: string;
}
```

#### مثال:

```json
{
    "profiles": [
        { /* Profile 1 */ },
        { /* Profile 2 */ }
    ],
    "created_at": "2024-01-15T10:00:00.000Z",
    "last_updated": "2024-01-15T14:30:00.000Z"
}
```

---

## 🛠️ الوظائف الرئيسية

### Profile Management

#### `createProfile(profileData)`
**الوصف:** إنشاء بروفايل جديد وحفظه على Google Drive  
**المعاملات:**
- `profileData` (Object): بيانات البروفايل

**الإرجاع:** `Promise<Profile>`

```javascript
const profileData = {
    fullName: 'محمد أحمد',
    biography: 'مطور برمجيات...',
    email: 'mohamed@example.com',
    phone: '+20 123 456 7890',
    profileImage: File, // File object
    additionalImages: [File, File] // Array of Files
};

const newProfile = await createProfile(profileData);
console.log('تم الإنشاء:', newProfile.id);
```

#### `loadProfiles()`
**الوصف:** تحميل جميع البروفايلات من Google Drive  
**الإرجاع:** `Promise<Profile[]>`

```javascript
try {
    const profiles = await loadProfiles();
    console.log(`تم تحميل ${profiles.length} بروفايل`);
} catch (error) {
    console.error('خطأ في التحميل:', error);
}
```

#### `getProfileById(profileId)`
**الوصف:** الحصول على بروفايل محدد بواسطة المعرف  
**المعاملات:**
- `profileId` (string): معرف البروفايل

**الإرجاع:** `Promise<Profile | null>`

```javascript
const profile = await getProfileById('abc123xyz');
if (profile) {
    console.log('تم العثور على:', profile.fullName);
}
```

---

### Image Processing

#### `compressImage(file)`
**الوصف:** ضغط الصورة قبل الرفع  
**المعاملات:**
- `file` (File): ملف الصورة الأصلي

**الإرجاع:** `Promise<File>`

```javascript
const originalFile = document.getElementById('imageInput').files[0];
const compressedFile = await compressImage(originalFile);
console.log(`تم التقليل من ${originalFile.size} إلى ${compressedFile.size} بايت`);
```

**الإعدادات:**
- حجم أقصى: 1920px للبعد الأكبر
- جودة: 0.8 (قابل للتعديل في CONFIG)
- صيغة الإخراج: JPEG

#### `uploadImageToDrive(file, folderId, fileName)`
**الوصف:** رفع صورة إلى Google Drive  
**المعاملات:**
- `file` (File): ملف الصورة
- `folderId` (string): معرف المجلد
- `fileName` (string): اسم الملف

**الإرجاع:** `Promise<string>` - رابط الصورة

```javascript
const imageUrl = await uploadImageToDrive(
    compressedImage,
    'folder_id_123',
    'profile_image'
);
console.log('رابط الصورة:', imageUrl);
```

---

### Drive Operations

#### `getRootFolder()`
**الوصف:** الحصول على المجلد الرئيسي للنظام  
**الإرجاع:** `Promise<{id: string, name: string}>`

```javascript
const rootFolder = await getRootFolder();
console.log('المجلد الرئيسي:', rootFolder.name);
```

#### `createProfileFolder(name, id)`
**الوصف:** إنشاء مجلد لبروفايل معين  
**المعاملات:**
- `name` (string): اسم البروفايل
- `id` (string): معرف البروفايل

**الإرجاع:** `Promise<string>` - معرف المجلد

```javascript
const folderId = await createProfileFolder('محمد أحمد', 'profile_123');
```

#### `makeFilePublic(fileId)`
**الوصف:** جعل ملف قابل للعرض للجميع  
**المعاملات:**
- `fileId` (string): معرف الملف

**الإرجاع:** `Promise<void>`

```javascript
await makeFilePublic('file_id_abc123');
console.log('الملف الآن عام');
```

---

### Database Operations

#### `getDatabaseFile()`
**الوصف:** الحصول على ملف قاعدة البيانات  
**الإرجاع:** `Promise<{id: string, name: string}>`

```javascript
const dbFile = await getDatabaseFile();
console.log('قاعدة البيانات:', dbFile.id);
```

#### `readDatabaseFile(fileId)`
**الوصف:** قراءة محتوى قاعدة البيانات  
**المعاملات:**
- `fileId` (string): معرف ملف قاعدة البيانات

**الإرجاع:** `Promise<Database>`

```javascript
const db = await readDatabaseFile('db_file_id');
console.log(`عدد البروفايلات: ${db.profiles.length}`);
```

#### `updateDatabaseFile(fileId, data)`
**الوصف:** تحديث قاعدة البيانات  
**المعاملات:**
- `fileId` (string): معرف الملف
- `data` (Database): البيانات الجديدة

**الإرجاع:** `Promise<void>`

```javascript
const updatedData = {
    ...currentData,
    profiles: [...currentData.profiles, newProfile],
    last_updated: new Date().toISOString()
};

await updateDatabaseFile('db_file_id', updatedData);
```

#### `saveProfileToDatabase(profileData)`
**الوصف:** حفظ بروفايل في قاعدة البيانات  
**المعاملات:**
- `profileData` (Profile): بيانات البروفايل

**الإرجاع:** `Promise<void>`

```javascript
await saveProfileToDatabase(newProfile);
console.log('تم الحفظ بنجاح');
```

---

### Utility Functions

#### `generateUniqueId()`
**الوصف:** توليد معرف فريد للبروفايل  
**الإرجاع:** `string`

```javascript
const uniqueId = generateUniqueId();
// مثال: "lm4n5o6p7q8r9s"
```

#### `showAlert(message, type)`
**الوصف:** عرض رسالة تنبيه للمستخدم  
**المعاملات:**
- `message` (string): نص الرسالة
- `type` (string): نوع التنبيه ('success' | 'error' | 'warning' | 'info')

**الإرجاع:** `void`

```javascript
showAlert('تم الحفظ بنجاح!', 'success');
showAlert('حدث خطأ', 'error');
```

#### `updateProgress(percent, text)`
**الوصف:** تحديث شريط التقدم  
**المعاملات:**
- `percent` (number): النسبة المئوية (0-100)
- `text` (string): النص التوضيحي

**الإرجاع:** `void`

```javascript
updateProgress(50, 'جاري رفع الصور...');
updateProgress(100, 'تم بنجاح!');
```

#### `formatDate(dateString)`
**الوصف:** تنسيق التاريخ للعرض بالعربية  
**المعاملات:**
- `dateString` (string): تاريخ بصيغة ISO

**الإرجاع:** `string`

```javascript
const formatted = formatDate('2024-01-15T10:30:00.000Z');
// "١٥ يناير ٢٠٢٤ - ١٠:٣٠"
```

---

## 💡 أمثلة الاستخدام

### مثال كامل: إنشاء بروفايل

```javascript
async function createCompleteProfile() {
    try {
        // 1. التحقق من المصادقة
        if (!isAuthenticated()) {
            throw new Error('يجب تسجيل الدخول أولاً');
        }
        
        // 2. جمع البيانات من النموذج
        const formData = {
            fullName: document.getElementById('fullName').value,
            biography: document.getElementById('biography').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            id: generateUniqueId(),
            createdAt: new Date().toISOString()
        };
        
        // 3. معالجة الصور
        const profileImageFile = document.getElementById('profileImage').files[0];
        const compressedProfileImage = await compressImage(profileImageFile);
        
        // 4. إنشاء مجلد البروفايل
        const folderId = await createProfileFolder(formData.fullName, formData.id);
        
        // 5. رفع الصورة الشخصية
        updateProgress(30, 'رفع الصورة الشخصية...');
        formData.profileImage = await uploadImageToDrive(
            compressedProfileImage,
            folderId,
            'profile'
        );
        
        // 6. رفع الصور الإضافية
        const additionalImagesFiles = Array.from(
            document.getElementById('additionalImages').files
        );
        
        if (additionalImagesFiles.length > 0) {
            formData.additionalImages = [];
            
            for (let i = 0; i < additionalImagesFiles.length; i++) {
                const compressed = await compressImage(additionalImagesFiles[i]);
                const url = await uploadImageToDrive(
                    compressed,
                    folderId,
                    `additional_${i}`
                );
                formData.additionalImages.push(url);
                
                const progress = 30 + ((i + 1) / additionalImagesFiles.length) * 50;
                updateProgress(progress, `رفع الصور (${i + 1}/${additionalImagesFiles.length})`);
            }
        }
        
        // 7. حفظ في قاعدة البيانات
        updateProgress(85, 'حفظ البيانات...');
        await saveProfileToDatabase(formData);
        
        // 8. إنهاء
        updateProgress(100, 'تم بنجاح!');
        showAlert('تم إنشاء البروفايل بنجاح!', 'success');
        
        return formData;
        
    } catch (error) {
        console.error('خطأ:', error);
        showAlert('حدث خطأ: ' + error.message, 'error');
        throw error;
    }
}
```

### مثال: البحث في البروفايلات

```javascript
function searchProfiles(searchTerm) {
    const allProfiles = /* تحميل من قاعدة البيانات */;
    
    return allProfiles.filter(profile => {
        const searchLower = searchTerm.toLowerCase();
        
        return (
            profile.fullName.toLowerCase().includes(searchLower) ||
            profile.email.toLowerCase().includes(searchLower) ||
            profile.phone.includes(searchTerm) ||
            profile.biography.toLowerCase().includes(searchLower)
        );
    });
}

// الاستخدام
const results = searchProfiles('محمد');
console.log(`وُجد ${results.length} نتيجة`);
```

---

## 🔒 معايير الأمان

### CORS
```javascript
// جميع الطلبات تُرسل من النطاق المصرح به فقط
// يجب إضافة النطاق في Google Cloud Console
```

### Authentication
```javascript
// المصادقة مطلوبة لجميع العمليات
if (!isAuthenticated()) {
    throw new Error('Authentication required');
}
```

### File Validation
```javascript
// التحقق من نوع الملف
if (!file.type.startsWith('image/')) {
    throw new Error('ملف غير صالح');
}

// التحقق من حجم الملف
if (file.size > CONFIG.MAX_IMAGE_SIZE) {
    throw new Error('الملف كبير جداً');
}
```

---

## 📝 ملاحظات للمطورين

### أفضل الممارسات

1. **Always Check Authentication:**
   ```javascript
   if (!isAuthenticated()) {
       // توجيه لصفحة تسجيل الدخول
   }
   ```

2. **Handle Errors Properly:**
   ```javascript
   try {
       await someOperation();
   } catch (error) {
       console.error('خطأ:', error);
       showAlert(error.message, 'error');
   }
   ```

3. **Use Progress Indicators:**
   ```javascript
   updateProgress(0, 'البدء...');
   // ... عمليات
   updateProgress(100, 'انتهى!');
   ```

4. **Compress Images:**
   ```javascript
   const compressed = await compressImage(originalFile);
   // استخدم compressed بدلاً من originalFile
   ```

---

## 🆘 استكشاف الأخطاء

### خطأ: "Token expired"
```javascript
// الحل: إعادة المصادقة
handleAuthClick();
```

### خطأ: "Quota exceeded"
```javascript
// الحل: انتظر أو اطلب زيادة الحصة من Google Cloud Console
```

---

## 📞 الدعم

للمزيد من المساعدة:
- 📖 راجع [README.md](README.md)
- 🐛 افتح [Issue](https://github.com/yourusername/profiles-system/issues)
- 💬 انضم للنقاش في [Discussions](https://github.com/yourusername/profiles-system/discussions)

---

**آخر تحديث:** 2024-01-15  
**الإصدار:** 1.0.0
