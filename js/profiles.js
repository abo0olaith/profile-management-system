// ===== إدارة صفحة عرض البروفايلات =====

let allProfiles = [];
let filteredProfiles = [];

// تحميل البروفايلات عند جاهزية الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // الانتظار حتى يتم التحقق من المصادقة
    setTimeout(() => {
        if (isAuthenticated()) {
            loadProfiles();
        } else {
            showAlert('يجب تسجيل الدخول لعرض البروفايلات', 'warning');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }, 1000);
    
    // إضافة مستمع البحث
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
});

// تحميل البروفايلات من Google Drive
async function loadProfiles() {
    const loadingSection = document.getElementById('loadingSection');
    const emptySection = document.getElementById('emptySection');
    const profilesGrid = document.getElementById('profilesGrid');
    
    // عرض حالة التحميل
    loadingSection.style.display = 'block';
    emptySection.style.display = 'none';
    profilesGrid.innerHTML = '';
    
    try {
        // الحصول على ملف قاعدة البيانات
        const rootFolder = await getRootFolder();
        const response = await gapi.client.drive.files.list({
            q: `name='${CONFIG.DATABASE_FILE_NAME}' and '${rootFolder.id}' in parents and trashed=false`,
            fields: 'files(id, name)',
            spaces: 'drive'
        });
        
        if (response.result.files.length === 0) {
            throw new Error('لم يتم العثور على قاعدة البيانات');
        }
        
        const dbFileId = response.result.files[0].id;
        
        // قراءة البيانات
        const dbResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${dbFileId}?alt=media`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
        
        if (!dbResponse.ok) {
            throw new Error('فشل قراءة قاعدة البيانات');
        }
        
        const data = await dbResponse.json();
        allProfiles = data.profiles || [];
        filteredProfiles = [...allProfiles];
        
        loadingSection.style.display = 'none';
        
        // عرض البروفايلات
        if (allProfiles.length === 0) {
            emptySection.style.display = 'block';
        } else {
            displayProfiles(filteredProfiles);
        }
        
    } catch (error) {
        console.error('خطأ في تحميل البروفايلات:', error);
        loadingSection.style.display = 'none';
        showAlert('حدث خطأ في تحميل البروفايلات: ' + error.message, 'error');
    }
}

// عرض البروفايلات
function displayProfiles(profiles) {
    const profilesGrid = document.getElementById('profilesGrid');
    profilesGrid.innerHTML = '';
    
    if (profiles.length === 0) {
        profilesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">لم يتم العثور على نتائج</p>
            </div>
        `;
        return;
    }
    
    profiles.forEach(profile => {
        const card = createProfileCard(profile);
        profilesGrid.appendChild(card);
    });
}

// إنشاء بطاقة بروفايل
function createProfileCard(profile) {
    const card = document.createElement('div');
    card.className = 'profile-card';
    
    // اختصار السيرة الذاتية
    const shortBio = profile.biography.length > 100 
        ? profile.biography.substring(0, 100) + '...' 
        : profile.biography;
    
    // عدد الصور الإضافية
    const additionalImagesCount = profile.additionalImages ? profile.additionalImages.length : 0;
    
    card.innerHTML = `
        <img src="${profile.profileImage}" alt="${profile.fullName}" class="profile-image" onerror="this.src='https://via.placeholder.com/300x250?text=صورة+غير+متوفرة'">
        <div class="profile-content">
            <h3 class="profile-name">${profile.fullName}</h3>
            <p class="profile-bio">${shortBio}</p>
            
            <div class="profile-info">
                <div class="profile-info-item">
                    <i class="fas fa-envelope"></i>
                    <span>${profile.email}</span>
                </div>
                <div class="profile-info-item">
                    <i class="fas fa-phone"></i>
                    <span>${profile.phone}</span>
                </div>
                ${additionalImagesCount > 0 ? `
                    <div class="profile-info-item">
                        <i class="fas fa-images"></i>
                        <span>${additionalImagesCount} صور إضافية</span>
                    </div>
                ` : ''}
                <div class="profile-info-item">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(profile.createdAt)}</span>
                </div>
            </div>
            
            <div class="profile-actions">
                <button class="btn btn-primary" onclick='viewProfile(${JSON.stringify(profile).replace(/'/g, "&apos;")})'>
                    <i class="fas fa-eye"></i> عرض التفاصيل
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// عرض تفاصيل البروفايل
function viewProfile(profile) {
    const modal = document.getElementById('profileModal');
    const modalBody = document.getElementById('modalBody');
    
    let additionalImagesHTML = '';
    if (profile.additionalImages && profile.additionalImages.length > 0) {
        additionalImagesHTML = `
            <div class="modal-additional-images">
                <h3><i class="fas fa-images"></i> صور إضافية (${profile.additionalImages.length})</h3>
                <div class="modal-images-grid">
                    ${profile.additionalImages.map(img => `
                        <img src="${img}" alt="صورة إضافية" onclick="window.open('${img}', '_blank')">
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    modalBody.innerHTML = `
        <img src="${profile.profileImage}" alt="${profile.fullName}" class="modal-profile-image">
        
        <div class="modal-profile-info">
            <h2>${profile.fullName}</h2>
            
            <div class="info-item">
                <i class="fas fa-pen"></i>
                <div>
                    <strong>السيرة الذاتية:</strong><br>
                    ${profile.biography}
                </div>
            </div>
            
            <div class="info-item">
                <i class="fas fa-envelope"></i>
                <div>
                    <strong>البريد الإلكتروني:</strong><br>
                    <a href="mailto:${profile.email}" style="color: var(--primary-color);">${profile.email}</a>
                </div>
            </div>
            
            <div class="info-item">
                <i class="fas fa-phone"></i>
                <div>
                    <strong>رقم الهاتف:</strong><br>
                    <a href="tel:${profile.phone}" style="color: var(--primary-color);">${profile.phone}</a>
                </div>
            </div>
            
            <div class="info-item">
                <i class="fas fa-calendar"></i>
                <div>
                    <strong>تاريخ الإنشاء:</strong><br>
                    ${formatDate(profile.createdAt)}
                </div>
            </div>
        </div>
        
        ${additionalImagesHTML}
    `;
    
    modal.style.display = 'flex';
}

// إغلاق النافذة المنبثقة
function closeModal() {
    const modal = document.getElementById('profileModal');
    modal.style.display = 'none';
}

// البحث في البروفايلات
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredProfiles = [...allProfiles];
    } else {
        filteredProfiles = allProfiles.filter(profile => {
            return profile.fullName.toLowerCase().includes(searchTerm) ||
                   profile.email.toLowerCase().includes(searchTerm) ||
                   profile.phone.includes(searchTerm) ||
                   profile.biography.toLowerCase().includes(searchTerm);
        });
    }
    
    displayProfiles(filteredProfiles);
}

// تنسيق التاريخ
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('ar-EG', options);
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

// إغلاق النافذة المنبثقة عند الضغط على Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});
