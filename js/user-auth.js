// User Authentication System for Customer Login
// Separate from admin authentication

class UserAuth {
    constructor() {
        this.USERS_KEY = 'minhphuoc_users';
        this.SESSION_KEY = 'minhphuoc_user_session';
        this.initUsersStorage();
    }

    // Initialize users storage
    initUsersStorage() {
        if (!localStorage.getItem(this.USERS_KEY)) {
            localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
        }
    }

    // Register new user
    register(email, password, fullName, phone) {
        const users = this.getAllUsers();

        // Check if email already exists
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email đã được đăng ký' };
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            email: email,
            password: password, // In production, should hash this
            fullName: fullName,
            phone: phone,
            isPremium: false, // Free account by default
            registeredDate: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

        return { success: true, message: 'Đăng ký thành công!' };
    }

    // Login user
    login(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return { success: false, message: 'Email hoặc mật khẩu không đúng' };
        }

        // Create session
        const session = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            isPremium: user.isPremium,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        return { success: true, message: 'Đăng nhập thành công!', user: session };
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.getSession() !== null;
    }

    // Check if user has premium access
    isPremium() {
        const session = this.getSession();
        return session && session.isPremium === true;
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

    // Logout user
    logout() {
        localStorage.removeItem(this.SESSION_KEY);
    }

    // Get all users (private method)
    getAllUsers() {
        const usersData = localStorage.getItem(this.USERS_KEY);
        try {
            return JSON.parse(usersData) || [];
        } catch (e) {
            return [];
        }
    }

    // Upgrade user to premium (for future use)
    upgradeToPremium(userId) {
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex !== -1) {
            users[userIndex].isPremium = true;
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

            // Update session if user is currently logged in
            const session = this.getSession();
            if (session && session.id === userId) {
                session.isPremium = true;
                localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            }

            return { success: true, message: 'Nâng cấp tài khoản thành công!' };
        }

        return { success: false, message: 'Không tìm thấy người dùng' };
    }
}

// Create global instance
const userAuth = new UserAuth();
