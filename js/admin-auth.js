ư// Admin Authentication System
// Simple client-side authentication for demo purposes

class AdminAuth {
    constructor() {
        this.ADMIN_USER_KEY = 'minhphuoc_admin_user';
        this.SESSION_KEY = 'minhphuoc_admin_session';
        this.initDefaultAdmin();
    }

    // Initialize default admin user
    initDefaultAdmin() {
        const defaultAdmin = {
            email: 'admin@minhphuoc.com',
            password: this.simpleHash('Admin@2026'),
            name: 'Admin',
            role: 'administrator'
        };

        // Only set if not exists
        if (!localStorage.getItem(this.ADMIN_USER_KEY)) {
            localStorage.setItem(this.ADMIN_USER_KEY, JSON.stringify(defaultAdmin));
        }
    }

    // Simple hash function (for demo only - use bcrypt in production)
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    // Login function
    login(email, password) {
        const adminUser = JSON.parse(localStorage.getItem(this.ADMIN_USER_KEY));

        if (!adminUser) {
            return { success: false, message: 'Không tìm thấy tài khoản admin' };
        }

        if (email !== adminUser.email) {
            return { success: false, message: 'Email không đúng' };
        }

        if (this.simpleHash(password) !== adminUser.password) {
            return { success: false, message: 'Mật khẩu không đúng' };
        }

        // Create session
        const session = {
            email: adminUser.email,
            name: adminUser.name,
            role: adminUser.role,
            loginTime: new Date().toISOString(),
            token: this.generateToken()
        };

        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        return { success: true, session };
    }

    // Generate simple token
    generateToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    // Check if user is logged in
    isLoggedIn() {
        const session = this.getSession();
        return session !== null;
    }

    // Get current session
    getSession() {
        const sessionData = localStorage.getItem(this.SESSION_KEY);
        if (!sessionData) return null;

        try {
            return JSON.parse(sessionData);
        } catch (e) {
            return null;
        }
    }

    // Logout
    logout() {
        localStorage.removeItem(this.SESSION_KEY);
    }

    // Change password
    changePassword(currentPassword, newPassword) {
        const adminUser = JSON.parse(localStorage.getItem(this.ADMIN_USER_KEY));

        if (this.simpleHash(currentPassword) !== adminUser.password) {
            return { success: false, message: 'Mật khẩu hiện tại không đúng' };
        }

        adminUser.password = this.simpleHash(newPassword);
        localStorage.setItem(this.ADMIN_USER_KEY, JSON.stringify(adminUser));

        return { success: true, message: 'Đổi mật khẩu thành công' };
    }

    // Protect admin pages - redirect to login if not authenticated
    requireAuth(redirectUrl = 'admin.html') {
        if (!this.isLoggedIn()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    // Redirect if already logged in
    redirectIfLoggedIn(redirectUrl = 'admin-posts.html') {
        if (this.isLoggedIn()) {
            window.location.href = redirectUrl;
            return true;
        }
        return false;
    }
}

// Create global instance
const auth = new AdminAuth();
