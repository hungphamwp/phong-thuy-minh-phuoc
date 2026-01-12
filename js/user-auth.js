// User Authentication System for Customer Login
// Separate from admin authentication

class UserAuth {
    constructor() {
        this.USERS_KEY = 'minhphuoc_users';
        this.SESSION_KEY = 'minhphuoc_user_session';
        this.useSupabase = false;
        this.initUsersStorage();
    }

    // Initialize users storage
    async initUsersStorage() {
        if (!localStorage.getItem(this.USERS_KEY)) {
            localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
        }
    }

    // Check if Supabase is available
    async checkSupabaseConnection() {
        try {
            if (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized()) {
                this.useSupabase = true;
                console.log('UserAuth: Sử dụng Supabase');
                // Migrate localStorage users to Supabase if exists
                await this.migrateToSupabase();
            } else {
                console.log('UserAuth: Sử dụng localStorage (Supabase chưa kết nối)');
            }
        } catch (error) {
            console.log('UserAuth: Sử dụng localStorage (lỗi kết nối Supabase)');
        }
    }

    // Migrate existing localStorage users to Supabase
    async migrateToSupabase(force = false) {
        try {
            const localData = localStorage.getItem(this.USERS_KEY);
            if (!localData) return { success: false, message: 'Không có dữ liệu người dùng local để đồng bộ' };

            const users = JSON.parse(localData);
            if (!users || users.length === 0) return { success: false, message: 'Danh sách người dùng rỗng' };

            if (!this.useSupabase && typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized()) {
                this.useSupabase = true;
            }

            if (!this.useSupabase) return { success: false, message: 'Supabase chưa kết nối' };

            const client = supabaseClient.getClient();

            // Nếu không ép buộc, kiểm tra xem DB đã có dữ liệu ngoài admin chưa
            if (!force) {
                const { count } = await client
                    .from('users')
                    .select('*', { count: 'exact', head: true });

                // Nếu đã có nhiều hơn 2 users (thường là mặc định Admin và 1 test), bỏ qua tự động
                if (count > 2) {
                    console.log('Supabase đã có dữ liệu người dùng, bỏ qua tự động migrate.');
                    return { success: true, message: 'Đã có dữ liệu trên Supabase' };
                }
            }

            console.log(`Đang đồng bộ ${users.length} người dùng lên Supabase...`);
            let count = 0;

            for (const user of users) {
                try {
                    // Kiểm tra email đã tồn tại chưa
                    const { data: existing } = await client
                        .from('users')
                        .select('id')
                        .eq('email', user.email)
                        .maybeSingle();

                    if (!existing) {
                        const { error } = await client.from('users').insert([{
                            email: user.email,
                            full_name: user.fullName || user.username || 'Anonymous',
                            phone: user.phone || '',
                            role: user.role || 'user',
                            created_at: user.registeredDate || new Date().toISOString()
                        }]);

                        if (!error) count++;
                    }
                } catch (e) {
                    console.error('Lỗi khi đồng bộ user:', user.email, e);
                }
            }

            return { success: true, message: `Đã đồng bộ ${count} người dùng mới lên Supabase` };
        } catch (error) {
            console.error('Lỗi migrateToSupabase:', error);
            return { success: false, message: error.message };
        }
    }

    // Register new user
    async register(email, password, fullName, phone) {
        // Supabase Registration
        if (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized()) {
            try {
                const { data, error } = await supabaseClient.getClient().auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            phone: phone
                        }
                    }
                });

                if (error) return { success: false, message: error.message };

                // Add to public users table (if using database-schema.sql structure)
                if (data.user) {
                    await supabaseClient.getClient().from('users').upsert([
                        {
                            id: data.user.id,
                            email: email,
                            full_name: fullName,
                            phone: phone,
                            role: 'user'
                        }
                    ]);
                }

                return { success: true, message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.' };
            } catch (err) {
                return { success: false, message: err.message };
            }
        }

        // Local Storage Fallback
        const users = this.getAllUsers();
        // Check if email already exists
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email đã được đăng ký' };
        }
        // ... (rest of local logic)
        const newUser = {
            id: Date.now().toString(),
            email: email,
            password: password,
            fullName: fullName,
            phone: phone,
            isPremium: false,
            registeredDate: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        return { success: true, message: 'Đăng ký thành công!' };
    }

    // Login user
    async login(email, password) {
        // Supabase Login
        if (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized()) {
            try {
                const { data, error } = await supabaseClient.getClient().auth.signInWithPassword({
                    email,
                    password
                });

                if (error) return { success: false, message: error.message };

                // Fetch profile info from users table
                const { data: profile } = await supabaseClient.getClient()
                    .from('users')
                    .select('full_name, role')
                    .eq('id', data.user.id)
                    .single();

                const session = {
                    id: data.user.id,
                    email: data.user.email,
                    fullName: profile?.full_name || data.user.user_metadata?.full_name || 'User',
                    full_name: profile?.full_name || data.user.user_metadata?.full_name || 'User', // Keep both for compatibility
                    role: profile?.role || 'user',
                    packageLevel: profile?.package_level || 'free',
                    isPremium: (profile?.role === 'admin' || profile?.package_level === 'premium' || profile?.package_level === 'admin'),
                    loginTime: new Date().toISOString(),
                    type: 'supabase'
                };

                localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
                return { success: true, message: 'Đăng nhập thành công!', user: session };
            } catch (err) {
                // Fallback to local
                console.log(err);
            }
        }

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
            loginTime: new Date().toISOString(),
            type: 'local'
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

    // Refresh user session data from Supabase
    async refreshSession() {
        const session = this.getSession();
        if (!session || session.type !== 'supabase') return { success: false, message: 'Không có phiên đăng nhập Supabase' };

        if (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized()) {
            try {
                const { data: profile, error } = await supabaseClient.getClient()
                    .from('users')
                    .select('full_name, role, package_level')
                    .eq('id', session.id)
                    .single();

                if (error) throw error;

                // Update session object
                session.fullName = profile.full_name || session.fullName;
                session.role = profile.role || session.role;
                session.packageLevel = profile.package_level || 'free';
                session.isPremium = (profile.role === 'admin' || profile.package_level === 'premium' || profile.package_level === 'admin');
                session.lastRefresh = new Date().toISOString();

                localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
                return { success: true, user: session };
            } catch (err) {
                console.error('UserAuth: Lỗi khi làm mới session:', err);
                return { success: false, message: err.message };
            }
        }
        return { success: false, message: 'Supabase chưa kết nối' };
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
