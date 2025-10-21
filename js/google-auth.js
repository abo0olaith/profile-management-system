// ===== إدارة المصادقة مع Google =====

let tokenClient;
let accessToken = null;
let gapiInited = false;
let gisInited = false;

// تهيئة Google API Client
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    try {
        await gapi.client.init({
            apiKey: CONFIG.API_KEY,
            discoveryDocs: CONFIG.DISCOVERY_DOCS,
        });
        gapiInited = true;
        maybeEnableButtons();
    } catch (error) {
        console.error('خطأ في تهيئة GAPI:', error);
        showAlert('حدث خطأ في تهيئة Google API', 'error');
    }
}

// تهيئة Google Identity Services
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CONFIG.CLIENT_ID,
        scope: CONFIG.SCOPES,
        callback: '', // يتم تعيينه لاحقاً
    });
    gisInited = true;
    maybeEnableButtons();
}

// تفعيل أزرار التفويض عند جاهزية النظام
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        // التحقق من صحة الإعدادات
        const configValidation = validateConfig();
        if (!configValidation.valid) {
            showAlert(configValidation.message, 'error');
            document.getElementById('authorizeButton').disabled = true;
            return;
        }
        
        document.getElementById('authorizeButton').style.display = 'inline-flex';
        checkAuthStatus();
    }
}

// التحقق من حالة المصادقة
function checkAuthStatus() {
    const token = gapi.client.getToken();
    if (token !== null) {
        accessToken = token.access_token;
        updateAuthUI(true);
    } else {
        updateAuthUI(false);
    }
}

// معالجة طلب التفويض
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            showAlert('فشل التفويض: ' + resp.error, 'error');
            throw (resp);
        }
        accessToken = gapi.client.getToken().access_token;
        updateAuthUI(true);
        showAlert('تم تسجيل الدخول بنجاح!', 'success');
        
        // تهيئة مجلد البروفايلات
        await initializeProfilesFolder();
    };

    if (gapi.client.getToken() === null) {
        // طلب الحصول على رمز الوصول
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        // تخطي طلب الموافقة للحصول على رمز وصول إضافي
        tokenClient.requestAccessToken({prompt: ''});
    }
}

// معالجة تسجيل الخروج
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        accessToken = null;
        updateAuthUI(false);
        showAlert('تم تسجيل الخروج بنجاح', 'info');
    }
}

// تحديث واجهة المستخدم بناءً على حالة المصادقة
function updateAuthUI(isAuthenticated) {
    const authorizeButton = document.getElementById('authorizeButton');
    const signoutButton = document.getElementById('signoutButton');
    const authStatus = document.getElementById('authStatus');
    const formSection = document.getElementById('formSection');
    
    if (isAuthenticated) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'inline-flex';
        authStatus.innerHTML = '<i class="fas fa-check-circle"></i> متصل بحساب Google Drive';
        authStatus.style.color = 'var(--success-color)';
        formSection.style.display = 'block';
    } else {
        authorizeButton.style.display = 'inline-flex';
        signoutButton.style.display = 'none';
        authStatus.innerHTML = '';
        formSection.style.display = 'none';
    }
}

// التحقق من حالة الاتصال
function isAuthenticated() {
    return accessToken !== null && gapi.client.getToken() !== null;
}

// تهيئة مجلد البروفايلات الرئيسي
async function initializeProfilesFolder() {
    try {
        // البحث عن المجلد الرئيسي
        const response = await gapi.client.drive.files.list({
            q: `name='${CONFIG.ROOT_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            fields: 'files(id, name)',
            spaces: 'drive'
        });
        
        if (response.result.files.length === 0) {
            // إنشاء المجلد الرئيسي
            const folderMetadata = {
                name: CONFIG.ROOT_FOLDER_NAME,
                mimeType: 'application/vnd.google-apps.folder'
            };
            
            const folder = await gapi.client.drive.files.create({
                resource: folderMetadata,
                fields: 'id'
            });
            
            console.log('تم إنشاء المجلد الرئيسي:', folder.result.id);
            
            // إنشاء ملف قاعدة البيانات
            await createDatabaseFile(folder.result.id);
        }
    } catch (error) {
        console.error('خطأ في تهيئة المجلد:', error);
    }
}

// إنشاء ملف قاعدة البيانات
async function createDatabaseFile(folderId) {
    try {
        const initialData = {
            profiles: [],
            created_at: new Date().toISOString(),
            last_updated: new Date().toISOString()
        };
        
        const fileMetadata = {
            name: CONFIG.DATABASE_FILE_NAME,
            parents: [folderId],
            mimeType: 'application/json'
        };
        
        const fileContent = JSON.stringify(initialData, null, 2);
        const file = new Blob([fileContent], {type: 'application/json'});
        
        const formData = new FormData();
        formData.append('metadata', new Blob([JSON.stringify(fileMetadata)], {type: 'application/json'}));
        formData.append('file', file);
        
        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            body: formData
        });
        
        if (response.ok) {
            console.log('تم إنشاء ملف قاعدة البيانات بنجاح');
        }
    } catch (error) {
        console.error('خطأ في إنشاء ملف قاعدة البيانات:', error);
    }
}

// تحميل عند جاهزية الصفحة
window.addEventListener('load', () => {
    gapiLoaded();
    
    // إضافة مستمعي الأحداث للأزرار
    const authorizeButton = document.getElementById('authorizeButton');
    const signoutButton = document.getElementById('signoutButton');
    
    if (authorizeButton) {
        authorizeButton.addEventListener('click', handleAuthClick);
    }
    
    if (signoutButton) {
        signoutButton.addEventListener('click', handleSignoutClick);
    }
});

// تحميل GIS عند جاهزية النص البرمجي
if (typeof google !== 'undefined') {
    gisLoaded();
}
