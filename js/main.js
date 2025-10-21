// ===== الملف الرئيسي لإدارة النموذج والتفاعلات =====

// المتغيرات العامة
let selectedProfileImage = null;
let selectedAdditionalImages = [];

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    initializeFormHandlers();
    setupImageHandlers();
    setupFormValidation();
});

// ===== إدارة معالجات النموذج =====
function initializeFormHandlers() {
    const form = document.getElementById('profileForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        form.addEventListener('reset', handleFormReset);
    }
    
    // عداد السيرة الذاتية
    const biographyField = document.getElementById('biography');
    if (biographyField) {
        biographyField.addEventListener('input', updateBioCounter);
    }
}

// ===== معالجات الصور =====
function setupImageHandlers() {
    // الصورة الشخصية
    const profileImageInput = document.getElementById('profileImage');
    if (profileImageInput) {
        profileImageInput.addEventListener('change', handleProfileImageChange);
    }
    
    // الصور الإضافية
    const additionalImagesInput = document.getElementById('additionalImages');
    if (additionalImagesInput) {
        additionalImagesInput.addEventListener('change', handleAdditionalImagesChange);
    }
}

// معالج تغيير الصورة الشخصية
async function handleProfileImageChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
        showAlert('يرجى اختيار ملف صورة صالح', 'error');
        return;
    }
    
    // التحقق من حجم الملف
    if (file.size > CONFIG.MAX_IMAGE_SIZE) {
        showAlert('حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت', 'error');
        return;
    }
    
    try {
        const compressedImage = await compressImage(file);
        selectedProfileImage = compressedImage;
        
        // عرض معاينة الصورة
        const preview = document.getElementById('profileImagePreview');
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="معاينة الصورة">`;
        };
        reader.readAsDataURL(compressedImage);
    } catch (error) {
        console.error('خطأ في معالجة الصورة:', error);
        showAlert('حدث خطأ في معالجة الصورة', 'error');
    }
}

// معالج تغيير الصور الإضافية
async function handleAdditionalImagesChange(event) {
    const files = Array.from(event.target.files);
    
    if (files.length > CONFIG.MAX_ADDITIONAL_IMAGES) {
        showAlert(`يمكنك اختيار حتى ${CONFIG.MAX_ADDITIONAL_IMAGES} صور فقط`, 'warning');
        return;
    }
    
    selectedAdditionalImages = [];
    const previewContainer = document.getElementById('additionalImagesPreview');
    previewContainer.innerHTML = '';
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) continue;
        if (file.size > CONFIG.MAX_IMAGE_SIZE) continue;
        
        try {
            const compressedImage = await compressImage(file);
            selectedAdditionalImages.push(compressedImage);
            
            // عرض معاينة
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                imageItem.innerHTML = `
                    <img src="${e.target.result}" alt="صورة إضافية ${i + 1}">
                    <button type="button" class="remove-image" data-index="${i}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                previewContainer.appendChild(imageItem);
                
                // إضافة مستمع لزر الحذف
                imageItem.querySelector('.remove-image').addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    removeAdditionalImage(index);
                });
            };
            reader.readAsDataURL(compressedImage);
        } catch (error) {
            console.error('خطأ في معالجة الصورة:', error);
        }
    }
}

// حذف صورة إضافية
function removeAdditionalImage(index) {
    selectedAdditionalImages.splice(index, 1);
    const previewContainer = document.getElementById('additionalImagesPreview');
    const items = previewContainer.querySelectorAll('.image-item');
    if (items[index]) {
        items[index].remove();
    }
}

// ضغط الصور
function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // تغيير حجم الصورة إذا كانت كبيرة جداً
                const maxDimension = 1920;
                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = (height / width) * maxDimension;
                        width = maxDimension;
                    } else {
                        width = (width / height) * maxDimension;
                        height = maxDimension;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob(function(blob) {
                    resolve(new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    }));
                }, 'image/jpeg', CONFIG.IMAGE_QUALITY);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ===== التحقق من صحة النموذج =====
function setupFormValidation() {
    // التحقق من البريد الإلكتروني
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                showAlert('البريد الإلكتروني غير صحيح', 'warning');
            }
        });
    }
    
    // التحقق من رقم الهاتف
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // السماح بالأرقام والرموز فقط
            this.value = this.value.replace(/[^\d+\-\s()]/g, '');
        });
    }
}

// التحقق من صحة البريد الإلكتروني
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// تحديث عداد السيرة الذاتية
function updateBioCounter() {
    const biography = document.getElementById('biography');
    const counter = document.getElementById('bioCounter');
    const length = biography.value.length;
    counter.textContent = `${length} / 500 حرف`;
    
    if (length > 500) {
        counter.style.color = 'var(--danger-color)';
        biography.value = biography.value.substring(0, 500);
    } else {
        counter.style.color = 'var(--text-light)';
    }
}

// ===== معالجة إرسال النموذج =====
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // التحقق من المصادقة
    if (!isAuthenticated()) {
        showAlert('يجب تسجيل الدخول أولاً', 'error');
        return;
    }
    
    // التحقق من الصورة الشخصية
    if (!selectedProfileImage) {
        showAlert('يجب اختيار صورة شخصية', 'error');
        return;
    }
    
    // جمع بيانات النموذج
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        biography: document.getElementById('biography').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        createdAt: new Date().toISOString(),
        id: generateUniqueId()
    };
    
    // التحقق من البيانات
    if (!formData.fullName || !formData.biography || !formData.email || !formData.phone) {
        showAlert('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    if (!isValidEmail(formData.email)) {
        showAlert('البريد الإلكتروني غير صحيح', 'error');
        return;
    }
    
    // عرض شاشة التقدم
    showProgressSection();
    updateProgress(0, 'جاري التحضير...');
    
    try {
        // إنشاء مجلد البروفايل
        updateProgress(10, 'إنشاء مجلد البروفايل...');
        const profileFolderId = await createProfileFolder(formData.fullName, formData.id);
        
        // رفع الصورة الشخصية
        updateProgress(30, 'رفع الصورة الشخصية...');
        const profileImageUrl = await uploadImageToDrive(selectedProfileImage, profileFolderId, 'profile');
        formData.profileImage = profileImageUrl;
        
        // رفع الصور الإضافية
        if (selectedAdditionalImages.length > 0) {
            updateProgress(50, `رفع الصور الإضافية (0/${selectedAdditionalImages.length})...`);
            formData.additionalImages = [];
            
            for (let i = 0; i < selectedAdditionalImages.length; i++) {
                const imageUrl = await uploadImageToDrive(selectedAdditionalImages[i], profileFolderId, `additional_${i}`);
                formData.additionalImages.push(imageUrl);
                
                const progress = 50 + ((i + 1) / selectedAdditionalImages.length) * 30;
                updateProgress(progress, `رفع الصور الإضافية (${i + 1}/${selectedAdditionalImages.length})...`);
            }
        }
        
        // حفظ البيانات في قاعدة البيانات
        updateProgress(85, 'حفظ البيانات...');
        await saveProfileToDatabase(formData);
        
        updateProgress(100, 'تم الحفظ بنجاح!');
        
        // عرض رسالة النجاح
        setTimeout(() => {
            hideProgressSection();
            showAlert('تم حفظ البروفايل بنجاح! ✨', 'success');
            handleFormReset();
            
            // الانتقال لصفحة البروفايلات
            setTimeout(() => {
                window.location.href = 'profiles.html';
            }, 2000);
        }, 1000);
        
    } catch (error) {
        console.error('خطأ في حفظ البروفايل:', error);
        hideProgressSection();
        showAlert('حدث خطأ في حفظ البروفايل: ' + error.message, 'error');
    }
}

// إنشاء مجلد للبروفايل
async function createProfileFolder(name, id) {
    // الحصول على المجلد الرئيسي
    const rootFolder = await getRootFolder();
    
    // إنشاء مجلد البروفايل
    const folderMetadata = {
        name: `${name}_${id}`,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [rootFolder.id]
    };
    
    const response = await gapi.client.drive.files.create({
        resource: folderMetadata,
        fields: 'id'
    });
    
    return response.result.id;
}

// الحصول على المجلد الرئيسي
async function getRootFolder() {
    const response = await gapi.client.drive.files.list({
        q: `name='${CONFIG.ROOT_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
        spaces: 'drive'
    });
    
    if (response.result.files.length > 0) {
        return response.result.files[0];
    }
    
    throw new Error('لم يتم العثور على المجلد الرئيسي');
}

// رفع صورة إلى Google Drive
async function uploadImageToDrive(file, folderId, fileName) {
    const metadata = {
        name: `${fileName}_${Date.now()}.jpg`,
        parents: [folderId],
        mimeType: 'image/jpeg'
    };
    
    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
    formData.append('file', file);
    
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        body: formData
    });
    
    if (!response.ok) {
        throw new Error('فشل رفع الصورة');
    }
    
    const result = await response.json();
    
    // جعل الملف قابل للعرض العام
    await makeFilePublic(result.id);
    
    return `https://drive.google.com/uc?export=view&id=${result.id}`;
}

// جعل الملف قابل للعرض العام
async function makeFilePublic(fileId) {
    try {
        await gapi.client.drive.permissions.create({
            fileId: fileId,
            resource: {
                role: 'reader',
                type: 'anyone'
            }
        });
    } catch (error) {
        console.error('خطأ في جعل الملف عام:', error);
    }
}

// حفظ البروفايل في قاعدة البيانات
async function saveProfileToDatabase(profileData) {
    // الحصول على ملف قاعدة البيانات
    const dbFile = await getDatabaseFile();
    
    // قراءة البيانات الحالية
    const currentData = await readDatabaseFile(dbFile.id);
    
    // إضافة البروفايل الجديد
    currentData.profiles.push(profileData);
    currentData.last_updated = new Date().toISOString();
    
    // تحديث الملف
    await updateDatabaseFile(dbFile.id, currentData);
}

// الحصول على ملف قاعدة البيانات
async function getDatabaseFile() {
    const rootFolder = await getRootFolder();
    
    const response = await gapi.client.drive.files.list({
        q: `name='${CONFIG.DATABASE_FILE_NAME}' and '${rootFolder.id}' in parents and trashed=false`,
        fields: 'files(id, name)',
        spaces: 'drive'
    });
    
    if (response.result.files.length > 0) {
        return response.result.files[0];
    }
    
    throw new Error('لم يتم العثور على ملف قاعدة البيانات');
}

// قراءة ملف قاعدة البيانات
async function readDatabaseFile(fileId) {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
    
    if (!response.ok) {
        throw new Error('فشل قراءة قاعدة البيانات');
    }
    
    return await response.json();
}

// تحديث ملف قاعدة البيانات
async function updateDatabaseFile(fileId, data) {
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], {type: 'application/json'});
    
    const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
        method: 'PATCH',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: blob
    });
    
    if (!response.ok) {
        throw new Error('فشل تحديث قاعدة البيانات');
    }
}

// ===== وظائف مساعدة =====

// توليد معرف فريد
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// عرض قسم التقدم
function showProgressSection() {
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('progressSection').style.display = 'block';
}

// إخفاء قسم التقدم
function hideProgressSection() {
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('formSection').style.display = 'block';
}

// تحديث شريط التقدم
function updateProgress(percent, text) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressFill.style.width = percent + '%';
    progressFill.textContent = Math.round(percent) + '%';
    progressText.textContent = text;
}

// عرض رسالة تنبيه
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    alert.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    alertContainer.appendChild(alert);
    
    // إزالة التنبيه بعد 5 ثواني
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// إعادة تعيين النموذج
function handleFormReset() {
    selectedProfileImage = null;
    selectedAdditionalImages = [];
    
    document.getElementById('profileImagePreview').innerHTML = `
        <i class="fas fa-user-circle"></i>
        <span>اختر صورة شخصية</span>
    `;
    
    document.getElementById('additionalImagesPreview').innerHTML = '';
    document.getElementById('bioCounter').textContent = '0 / 500 حرف';
}
