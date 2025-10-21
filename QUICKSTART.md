# 🚀 دليل البدء السريع

> ابدأ مع نظام إدارة البروفايلات في 10 دقائق!

---

## ⚡ خطوات سريعة

### 1️⃣ تحميل المشروع
```bash
# إذا كان لديك git
git clone <repository-url>
cd ProfilesSystem

# أو حمّل الملف ZIP وفك الضغط
```

### 2️⃣ الحصول على بيانات Google API

#### أ) إنشاء مشروع على Google Cloud
1. افتح [Google Cloud Console](https://console.cloud.google.com/)
2. انقر "New Project" → أدخل اسم "ProfilesSystem"
3. انتظر حتى يتم إنشاء المشروع

#### ب) تفعيل Google Drive API
1. من القائمة → APIs & Services → Library
2. ابحث عن "Google Drive API"
3. انقر "Enable"

#### ج) إنشاء OAuth Consent Screen
1. من القائمة → APIs & Services → OAuth consent screen
2. اختر "External" → Create
3. املأ:
   - App name: `ProfilesSystem`
   - User support email: بريدك
   - Developer contact: بريدك
4. Save and Continue (3 مرات)
5. في Test users → Add Users → أضف بريدك

#### د) إنشاء OAuth Client ID
1. APIs & Services → Credentials
2. "+ CREATE CREDENTIALS" → OAuth client ID
3. Application type: Web application
4. Name: `ProfilesSystem Web Client`
5. Authorized JavaScript origins:
   ```
   http://localhost:8000
   ```
6. Create → **احفظ Client ID**

#### هـ) إنشاء API Key
1. في نفس صفحة Credentials
2. "+ CREATE CREDENTIALS" → API key
3. **احفظ API Key**
4. (اختياري) Restrict Key → Google Drive API

### 3️⃣ تكوين الإعدادات

افتح `js/config.js` وضع بياناتك:

```javascript
const CONFIG = {
    CLIENT_ID: 'ضع-CLIENT-ID-هنا.apps.googleusercontent.com',
    API_KEY: 'ضع-API-KEY-هنا',
    // ... باقي الإعدادات كما هي
};
```

### 4️⃣ تشغيل الخادم المحلي

اختر طريقة واحدة:

```bash
# Python 3 (الأسهل)
python -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

### 5️⃣ فتح التطبيق

```
http://localhost:8000
```

### 6️⃣ تسجيل الدخول والاستخدام

1. انقر "تسجيل الدخول بحساب Google"
2. اختر حسابك
3. وافق على الصلاحيات
4. ابدأ بإنشاء أول بروفايل! 🎉

---

## 🆘 مشاكل شائعة؟

### ❌ "redirect_uri_mismatch"
→ أضف `http://localhost:8000` في Authorized JavaScript origins

### ❌ "Access blocked"
→ أضف بريدك في Test users (OAuth consent screen)

### ❌ التطبيق لا يعمل
→ تأكد من استخدام http:// وليس file://

### ❌ "Invalid API key"
→ تحقق من نسخ API Key بشكل صحيح

---

## 📚 المزيد من المعلومات

- **دليل الإعداد الكامل:** افتح `setup.html` في المتصفح
- **التوثيق الكامل:** اقرأ `README.md`
- **مشاكل أخرى:** راجع قسم "استكشاف الأخطاء" في README.md

---

## 🎯 الخطوات التالية

بعد الإعداد الناجح:

1. ✅ جرب إنشاء بروفايل تجريبي
2. ✅ تحقق من حفظ البيانات على Google Drive
3. ✅ اختبر صفحة عرض البروفايلات
4. ✅ جرب البحث والفلترة
5. ✅ خصص الألوان والتصميم حسب رغبتك

---

**🌟 إذا واجهت أي مشكلة، راجع `setup.html` للدليل الشامل!**

**صُنع بـ ❤️ للمجتمع العربي**
