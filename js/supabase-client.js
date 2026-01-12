// ==========================================
// Supabase Client Configuration
// ==========================================

class SupabaseClient {
    constructor() {
        // Cấu hình cứng để mọi người truy cập website đều có thể kết nối
        // Hãy dán thông tin từ Supabase Dashboard của bạn vào đây
        this.CONFIG = {
            URL: 'https://kabojqukrwuhwyzbadic.supabase.co',
            KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthYm9qcXVrcnd1aHd5emJhZGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMjY1OTksImV4cCI6MjA4MzcwMjU5OX0.XvGFTeMqgwmE4glGLBNsaHpNVLn0MFb6uFpfe5GDxB8'
        };

        this.supabaseUrl = this.CONFIG.URL || null;
        this.supabaseKey = this.CONFIG.KEY || null;
        this.client = null;
        this.initialized = false;

        // Tự động khởi tạo nếu đã có config cứng
        if (this.supabaseUrl && this.supabaseKey) {
            this.initialize(this.supabaseUrl, this.supabaseKey);
        }
    }

    /**
     * Khởi tạo Supabase client
     * @param {string} url - Supabase URL
     * @param {string} key - Supabase anon key
     */
    async initialize(url, key) {
        try {
            this.supabaseUrl = url;
            this.supabaseKey = key;

            // Sử dụng Supabase JS client nếu đã load
            if (typeof supabase !== 'undefined') {
                this.client = supabase.createClient(url, key);
                this.initialized = true;
                console.log('Supabase client initialized successfully');
                return true;
            } else {
                console.error('Supabase library not loaded. Please include supabase-js in your HTML');
                return false;
            }
        } catch (error) {
            console.error('Error initializing Supabase:', error);
            return false;
        }
    }

    /**
     * Kiểm tra xem client đã được khởi tạo chưa
     */
    isInitialized() {
        return this.initialized && this.client !== null;
    }

    /**
     * Lấy Supabase client instance
     */
    getClient() {
        if (!this.isInitialized()) {
            throw new Error('Supabase client chưa được khởi tạo. Vui lòng gọi initialize() trước.');
        }
        return this.client;
    }

    /**
     * Kiểm tra kết nối với Supabase
     */
    async testConnection() {
        try {
            if (!this.isInitialized()) {
                return { success: false, message: 'Client chưa được khởi tạo' };
            }

            // Test bằng cách lấy danh sách tables
            const { data, error } = await this.client
                .from('tasks')
                .select('count')
                .limit(1);

            if (error) {
                return { success: false, message: error.message };
            }

            return { success: true, message: 'Kết nối thành công!' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

// Export singleton instance
const supabaseClient = new SupabaseClient();
