// Admin Authentication System
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
            username: 'hungpham',
            password: 'hungpham123!@#',
            name: 'Hung Pham',
            role: 'administrator'
        };

        // Always update to latest credentials
        localStorage.setItem(this.ADMIN_USER_KEY, JSON.stringify(defaultAdmin));
    }

    // Login function
    async login(username, password) {
        // Try Supabase Login first if available
        if (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized()) {
            try {
                console.log('Attempting Supabase login...');
                const { data, error } = await supabaseClient.getClient().auth.signInWithPassword({
                    email: username,
                    password: password
                });

                if (!error && data.user) {
                    console.log('Supabase login successful');

                    // Fetch role from public users table
                    const { data: profile } = await supabaseClient.getClient()
                        .from('users')
                        .select('role, full_name')
                        .eq('id', data.user.id)
                        .single();

                    const role = profile?.role || 'administrator';

                    // Create session compatible with local structure
                    const session = {
                        username: data.user.email,
                        name: profile?.full_name || data.user.user_metadata?.full_name || username.split('@')[0],
                        role: role,
                        loginTime: new Date().toISOString(),
                        token: data.session.access_token,
                        type: 'supabase',
                        uid: data.user.id
                    };

                    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
                    return { success: true, session };
                } else {
                    console.log('Supabase auth failed, trying public users table...');
                    // Try to find the user in the public.users table if they don't have an auth entry
                    const { data: userProfile, error: profileError } = await supabaseClient.getClient()
                        .from('users')
                        .select('*')
                        .or(`email.eq.${username},username.eq.${username}`)
                        .eq('password', password)
                        .eq('is_active', true)
                        .single();

                    if (!profileError && userProfile) {
                        console.log('Public user login successful');
                        const session = {
                            username: userProfile.username || userProfile.email,
                            name: userProfile.full_name,
                            role: userProfile.role,
                            loginTime: new Date().toISOString(),
                            token: this.generateToken(),
                            type: 'db',
                            uid: userProfile.id
                        };
                        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
                        return { success: true, session };
                    }

                    console.log('Public user login failed:', profileError?.message);
                }
            } catch (err) {
                console.error('Supabase login error:', err);
            }
        }

        const adminUser = JSON.parse(localStorage.getItem(this.ADMIN_USER_KEY));

        if (!adminUser) {
            return { success: false, message: 'Không tìm thấy tài khoản admin' };
        }

        if (username !== adminUser.username) {
            return { success: false, message: 'Tên đăng nhập không đúng' };
        }

        if (password !== adminUser.password) {
            return { success: false, message: 'Mật khẩu không đúng' };
        }

        // Create session
        const session = {
            username: adminUser.username,
            name: adminUser.name,
            role: adminUser.role,
            loginTime: new Date().toISOString(),
            token: this.generateToken(),
            type: 'local'
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
        window.location.href = 'admin.html';
    }

    // Change password
    changePassword(currentPassword, newPassword) {
        const adminUser = JSON.parse(localStorage.getItem(this.ADMIN_USER_KEY));

        if (currentPassword !== adminUser.password) {
            return { success: false, message: 'Mật khẩu hiện tại không đúng' };
        }

        adminUser.password = newPassword;
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
