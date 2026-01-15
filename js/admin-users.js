// Admin User Management System
// Manages admin users for author selection and user management

class UserManager {
    constructor() {
        this.useSupabase = false;
        this.USERS_KEY = 'minhphuoc_admin_users';
        this.initUsersStorage();
    }

    // Initialize localStorage storage
    initUsersStorage() {
        if (!localStorage.getItem(this.USERS_KEY)) {
            // Default admin users
            const defaultUsers = [
                {
                    id: '1',
                    username: 'minhphuoc',
                    full_name: 'Thầy Minh Phước',
                    first_name: 'Phước',
                    last_name: 'Minh',
                    email: 'Contact.minhphuocfs@gmail.com',
                    role: 'admin',
                    avatar_url: '',
                    phone: '0888081050',
                    website: '',
                    is_active: true,
                    post_count: 0,
                    last_login: null,
                    created_at: new Date().toISOString()
                },
                {
                    id: '2',
                    username: 'admin',
                    full_name: 'Admin',
                    first_name: '',
                    last_name: '',
                    email: 'admin2@minhphuoc.com',
                    role: 'admin',
                    avatar_url: '',
                    phone: '',
                    website: '',
                    is_active: true,
                    post_count: 0,
                    last_login: null,
                    created_at: new Date().toISOString()
                }
            ];
            localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
        }
    }

    // Check if Supabase is available
    async checkSupabaseConnection() {
        try {
            if (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized()) {
                this.useSupabase = true;
                console.log('UserManager: Sử dụng Supabase');
                return true;
            }
        } catch (error) {
            console.log('UserManager: Sử dụng localStorage');
        }
        return false;
    }

    // Get all users
    async getAllUsers() {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { data, error } = await client
                    .from('users')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                return data || [];
            } catch (error) {
                console.error('Error fetching users:', error);
                return this.getLocalUsers();
            }
        }
        return this.getLocalUsers();
    }

    // Get admin users only (for author selection)
    async getAdminUsers() {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { data, error } = await client
                    .from('users')
                    .select('*')
                    .eq('role', 'admin')
                    .eq('is_active', true)
                    .order('full_name', { ascending: true });

                if (error) throw error;
                return data || [];
            } catch (error) {
                console.error('Error fetching admin users:', error);
                return this.getLocalUsers().filter(u => u.role === 'admin');
            }
        }
        return this.getLocalUsers().filter(u => u.role === 'admin');
    }

    // Get user by ID
    async getUserById(id) {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { data, error } = await client
                    .from('users')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Error fetching user:', error);
                return this.getLocalUsers().find(u => u.id === id);
            }
        }
        return this.getLocalUsers().find(u => u.id === id);
    }

    // Create new user
    async createUser(userData) {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { data, error } = await client
                    .from('users')
                    .insert([{
                        username: userData.username,
                        full_name: userData.full_name,
                        first_name: userData.first_name || '',
                        last_name: userData.last_name || '',
                        email: userData.email,
                        phone: userData.phone || '',
                        website: userData.website || '',
                        role: userData.role || 'user',
                        avatar_url: userData.avatar_url || '',
                        password: userData.password || '',
                        is_active: userData.is_active !== false
                    }])
                    .select()
                    .single();

                if (error) throw error;
                return { success: true, user: data };
            } catch (error) {
                console.error('Error creating user:', error);
                return { success: false, message: error.message };
            }
        }

        // localStorage fallback
        const users = this.getLocalUsers();
        const newUser = {
            id: Date.now().toString(),
            username: userData.username || userData.email?.split('@')[0] || '',
            full_name: userData.full_name,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email,
            phone: userData.phone || '',
            website: userData.website || '',
            role: userData.role || 'user',
            avatar_url: userData.avatar_url || '',
            is_active: userData.is_active !== false,
            post_count: 0,
            last_login: null,
            created_at: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        return { success: true, user: newUser };
    }

    // Update user
    async updateUser(id, userData) {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { data, error } = await client
                    .from('users')
                    .update({
                        username: userData.username,
                        full_name: userData.full_name,
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        email: userData.email,
                        phone: userData.phone,
                        website: userData.website,
                        role: userData.role,
                        avatar_url: userData.avatar_url,
                        password: userData.password,
                        is_active: userData.is_active
                    })
                    .eq('id', id)
                    .select()
                    .single();

                if (error) throw error;
                return { success: true, user: data };
            } catch (error) {
                console.error('Error updating user:', error);
                return { success: false, message: error.message };
            }
        }


        // localStorage fallback
        const users = this.getLocalUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...userData };
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            return { success: true, user: users[index] };
        }
        return { success: false, message: 'User not found' };
    }

    // Delete user
    async deleteUser(id) {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { error } = await client
                    .from('users')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                return { success: true };
            } catch (error) {
                console.error('Error deleting user:', error);
                return { success: false, message: error.message };
            }
        }

        // localStorage fallback
        const users = this.getLocalUsers();
        const filtered = users.filter(u => u.id !== id);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(filtered));
        return { success: true };
    }

    // Get local users from localStorage
    getLocalUsers() {
        try {
            return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
        } catch (e) {
            return [];
        }
    }

    // Get statistics
    async getStatistics() {
        const users = await this.getAllUsers();
        return {
            total: users.length,
            admins: users.filter(u => u.role === 'admin').length,
            users: users.filter(u => u.role === 'user').length,
            active: users.filter(u => u.is_active).length,
            inactive: users.filter(u => !u.is_active).length
        };
    }
}

// Create global instance
const userManager = new UserManager();
