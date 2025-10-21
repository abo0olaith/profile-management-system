# 🤝 المساهمة في المشروع

> نرحب بمساهماتك! كل مساهمة مهما كانت صغيرة تساعد في تحسين المشروع.

---

## 📋 جدول المحتويات

- [كيف يمكنني المساهمة؟](#كيف-يمكنني-المساهمة)
- [الإبلاغ عن الأخطاء](#الإبلاغ-عن-الأخطاء)
- [اقتراح ميزات جديدة](#اقتراح-ميزات-جديدة)
- [المساهمة بالكود](#المساهمة-بالكود)
- [معايير الكود](#معايير-الكود)
- [عملية المراجعة](#عملية-المراجعة)

---

## 🎯 كيف يمكنني المساهمة؟

هناك عدة طرق للمساهمة:

### 1. 🐛 الإبلاغ عن الأخطاء
وجدت خطأ؟ ساعدنا في إصلاحه!

### 2. 💡 اقتراح ميزات جديدة
لديك فكرة رائعة؟ شاركها معنا!

### 3. 📝 تحسين التوثيق
وجدت شيئاً غير واضح؟ ساعد في تحسين التوثيق!

### 4. 💻 المساهمة بالكود
اكتب كود جديد أو حسّن الموجود!

### 5. 🌍 الترجمة
ساعد في ترجمة المشروع للغات أخرى!

### 6. 🎨 تحسين التصميم
لديك حس فني؟ حسّن واجهة المستخدم!

---

## 🐛 الإبلاغ عن الأخطاء

### قبل الإبلاغ

- ✅ تأكد من أنك تستخدم أحدث إصدار
- ✅ ابحث في [Issues](https://github.com/yourusername/profiles-system/issues) الموجودة
- ✅ تحقق من أن المشكلة قابلة للتكرار

### كيفية الإبلاغ

افتح [Issue جديد](https://github.com/yourusername/profiles-system/issues/new) وضمّن:

#### 📋 نموذج الإبلاغ عن خطأ

```markdown
## وصف المشكلة
وصف واضح ومختصر للمشكلة

## خطوات إعادة الإنتاج
1. اذهب إلى '...'
2. انقر على '...'
3. لاحظ الخطأ

## السلوك المتوقع
ماذا كان يجب أن يحدث؟

## السلوك الفعلي
ماذا حدث فعلياً؟

## لقطات الشاشة
إن وُجدت، أضف لقطات شاشة

## البيئة
- نظام التشغيل: [مثلاً Windows 10]
- المتصفح: [مثلاً Chrome 120]
- إصدار المشروع: [مثلاً 1.0.0]

## معلومات إضافية
أي معلومات أخرى مفيدة
```

---

## 💡 اقتراح ميزات جديدة

### قبل الاقتراح

- ✅ ابحث في Issues الموجودة عن اقتراحات مشابهة
- ✅ تأكد من أن الميزة تتناسب مع أهداف المشروع

### كيفية الاقتراح

افتح [Issue جديد](https://github.com/yourusername/profiles-system/issues/new) بعنوان يبدأ بـ `[Feature Request]`

#### 📋 نموذج اقتراح ميزة

```markdown
## وصف الميزة
وصف واضح للميزة المقترحة

## المشكلة التي تحلها
لماذا نحتاج هذه الميزة؟

## الحل المقترح
كيف تتخيل عمل هذه الميزة؟

## البدائل المدروسة
هل فكرت في حلول بديلة؟

## معلومات إضافية
أي تفاصيل أخرى، mockups، أمثلة
```

---

## 💻 المساهمة بالكود

### الإعداد الأولي

1. **Fork المشروع**
   ```bash
   # انقر على Fork في GitHub
   ```

2. **استنساخ Fork الخاص بك**
   ```bash
   git clone https://github.com/YOUR_USERNAME/profiles-system.git
   cd profiles-system
   ```

3. **إضافة upstream remote**
   ```bash
   git remote add upstream https://github.com/original/profiles-system.git
   ```

4. **إنشاء فرع جديد**
   ```bash
   git checkout -b feature/amazing-feature
   # أو
   git checkout -b fix/bug-description
   ```

### تطوير الميزة

1. **اكتب الكود**
   - اتبع [معايير الكود](#معايير-الكود)
   - اكتب تعليقات واضحة بالعربية
   - اختبر الكود جيداً

2. **Commit التغييرات**
   ```bash
   git add .
   git commit -m "Add: وصف واضح للتغيير"
   ```

   **صيغة Commit Messages:**
   - `Add: إضافة ميزة جديدة`
   - `Fix: إصلاح خطأ في...`
   - `Update: تحديث...`
   - `Remove: إزالة...`
   - `Refactor: إعادة هيكلة...`
   - `Docs: تحديث التوثيق`
   - `Style: تحسينات في التصميم`

3. **Push للفرع**
   ```bash
   git push origin feature/amazing-feature
   ```

4. **فتح Pull Request**
   - اذهب إلى صفحة Fork الخاص بك على GitHub
   - انقر على "Compare & pull request"
   - اكتب وصفاً واضحاً للتغييرات

---

## 📏 معايير الكود

### HTML

```html
<!-- استخدم semantic HTML -->
<section class="profiles-section">
  <header>
    <h2>عنوان القسم</h2>
  </header>
  <article>
    <!-- محتوى -->
  </article>
</section>

<!-- المسافات: 4 spaces -->
<!-- الأسماء: kebab-case للـ classes و IDs -->
```

### CSS

```css
/* ترتيب الخصائص: alphabetically */
/* استخدم متغيرات CSS */
/* تعليقات واضحة */

.profile-card {
    background: var(--bg-primary);
    border-radius: 12px;
    padding: 1.5rem;
    transition: var(--transition);
}

/* Mobile First - ابدأ بالموبايل */
@media (min-width: 768px) {
    .profile-card {
        padding: 2rem;
    }
}
```

### JavaScript

```javascript
// استخدم ES6+
// تعليقات واضحة بالعربية
// أسماء متغيرات وصفية (camelCase)

/**
 * تحميل البروفايلات من Google Drive
 * @returns {Promise<Array>} قائمة البروفايلات
 */
async function loadProfiles() {
    try {
        const response = await fetchProfiles();
        return response.data;
    } catch (error) {
        console.error('خطأ في تحميل البروفايلات:', error);
        throw error;
    }
}

// استخدم const و let بدلاً من var
const API_URL = 'https://example.com/api';
let isLoading = false;

// Arrow functions عند الإمكان
const handleClick = () => {
    console.log('تم النقر');
};
```

### قواعد عامة

- ✅ **المسافات:** 4 spaces (لا tabs)
- ✅ **الترميز:** UTF-8
- ✅ **نهاية السطر:** LF (Unix)
- ✅ **الأسماء:** واضحة ووصفية
- ✅ **التعليقات:** بالعربية وواضحة
- ✅ **DRY:** لا تكرر نفسك
- ✅ **KISS:** ابقها بسيطة

---

## 🔍 عملية المراجعة

### ما نبحث عنه

1. **الوظيفية:**
   - هل يعمل الكود كما هو متوقع؟
   - هل تم اختباره جيداً؟

2. **الكود:**
   - هل يتبع معايير المشروع؟
   - هل هو واضح وقابل للصيانة؟

3. **التوثيق:**
   - هل التغييرات موثقة؟
   - هل تم تحديث README إن لزم؟

4. **الأداء:**
   - هل يؤثر على الأداء؟
   - هل تم التحسين حيث أمكن؟

### Timeline

- نراجع PRs عادة خلال **2-3 أيام**
- قد نطلب تعديلات
- بعد الموافقة، سيتم الدمج

---

## 🎓 موارد مفيدة

### تعلم Git & GitHub
- [Git - Simple Guide](https://rogerdudler.github.io/git-guide/index.ar.html)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

### معايير الكود
- [JavaScript Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [CSS Guidelines](https://cssguidelin.es/)
- [HTML Best Practices](https://github.com/hail2u/html-best-practices)

### أدوات
- [VS Code](https://code.visualstudio.com/) - محرر موصى به
- [Prettier](https://prettier.io/) - لتنسيق الكود
- [ESLint](https://eslint.org/) - للتحقق من JavaScript

---

## 🏆 المساهمون

شكراً لجميع المساهمين في هذا المشروع! 🙏

<!-- سيتم إضافة قائمة المساهمين تلقائياً -->

---

## ❓ أسئلة؟

إذا كان لديك أي سؤال:

- 💬 افتح [Discussion](https://github.com/yourusername/profiles-system/discussions)
- 📧 راسلنا على: contribute@profilessystem.com
- 🐛 أو افتح Issue

---

## 📜 ميثاق السلوك

نحن ملتزمون بتوفير بيئة ترحيبية وشاملة. نتوقع من جميع المساهمين:

- 🤝 الاحترام المتبادل
- 💬 التواصل البناء
- 🎯 التركيز على ما هو أفضل للمجتمع
- 🙏 إظهار التعاطف تجاه أعضاء المجتمع الآخرين

---

<div align="center">

### 🌟 شكراً لمساهمتك! 

**كل سطر كود، كل تقرير خطأ، كل اقتراح يُحدث فرقاً!**

صُنع بـ ❤️ للمجتمع العربي

</div>
