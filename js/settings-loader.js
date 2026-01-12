// ==========================================
// Settings Loader - Load website settings from Supabase
// ==========================================

class SettingsLoader {
    constructor() {
        this.settings = {};
        this.loaded = false;
        this.LOCAL_KEY = 'minhphuoc_settings';

        // Default settings (fallback if DB not available)
        this.defaults = {
            'site_name': 'Minh Phước Feng Shui',
            'site_description': 'Dịch vụ phong thủy, tử vi chuyên nghiệp',
            'contact_email': 'contact@minhphuoc.com',
            'contact_phone': '0888.08.1050',
            'facebook_url': 'https://facebook.com/minhphuocfengshui',
            'zalo_phone': '0888.08.1050',
            'address_hcm': '57 Đường 7A phường An Lạc, TP.HCM',
            'address_lamdong': 'Chùa Quan Âm Cát, xã Phan Rí Cửa, Lâm Đồng',
            'enable_consultations': 'true',
            'enable_appointments': 'true',
            'working_hours_weekday': '8:00 - 21:00',
            'working_hours_saturday': '8:00 - 17:00',
            'working_hours_sunday': '9:00 - 15:00'
        };
    }

    /**
     * Load all settings from Supabase
     */
    async loadSettings() {
        // Try to load from Supabase
        if (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized()) {
            try {
                const client = supabaseClient.getClient();

                const { data, error } = await client
                    .from('settings')
                    .select('setting_key, setting_value');

                if (error) {
                    console.error('Lỗi load settings từ Supabase:', error);
                    return this.loadFromLocalStorage();
                }

                if (data && data.length > 0) {
                    // Convert array to object
                    data.forEach(item => {
                        this.settings[item.setting_key] = item.setting_value;
                    });

                    // Cache to localStorage
                    localStorage.setItem(this.LOCAL_KEY, JSON.stringify(this.settings));
                    this.loaded = true;
                    console.log('Settings loaded from Supabase:', Object.keys(this.settings).length, 'items');
                    return this.settings;
                }
            } catch (error) {
                console.error('Lỗi kết nối Supabase:', error);
            }
        }

        return this.loadFromLocalStorage();
    }

    /**
     * Load from localStorage (fallback)
     */
    loadFromLocalStorage() {
        try {
            const cached = localStorage.getItem(this.LOCAL_KEY);
            if (cached) {
                this.settings = JSON.parse(cached);
                this.loaded = true;
                console.log('Settings loaded from localStorage cache');
                return this.settings;
            }
        } catch (e) {
            console.log('Không có settings cache');
        }

        // Use defaults
        this.settings = { ...this.defaults };
        this.loaded = true;
        console.log('Using default settings');
        return this.settings;
    }

    /**
     * Get a single setting value
     * @param {string} key - Setting key
     * @param {string} defaultValue - Default value if not found
     */
    getSetting(key, defaultValue = null) {
        if (!this.loaded) {
            // Return from defaults if not loaded yet
            return this.defaults[key] || defaultValue;
        }
        return this.settings[key] || this.defaults[key] || defaultValue;
    }

    /**
     * Get all settings
     */
    getAllSettings() {
        return { ...this.defaults, ...this.settings };
    }

    /**
     * Update a setting (admin only)
     */
    async updateSetting(key, value, settingType = 'text') {
        if (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized()) {
            try {
                const client = supabaseClient.getClient();

                const { data, error } = await client
                    .from('settings')
                    .upsert([{
                        setting_key: key,
                        setting_value: value,
                        setting_type: settingType
                    }], { onConflict: 'setting_key' })
                    .select();

                if (error) throw error;

                // Update local cache
                this.settings[key] = value;
                localStorage.setItem(this.LOCAL_KEY, JSON.stringify(this.settings));

                return { success: true, data: data[0] };
            } catch (error) {
                console.error('Lỗi update setting:', error);
                return { success: false, message: error.message };
            }
        }

        // Fallback to localStorage only
        this.settings[key] = value;
        localStorage.setItem(this.LOCAL_KEY, JSON.stringify(this.settings));
        return { success: true, message: 'Đã lưu vào localStorage' };
    }

    /**
     * Apply settings to page elements
     * Call this after loadSettings() to update DOM elements with settings values
     */
    applyToPage() {
        // Update phone number links
        const phone = this.getSetting('contact_phone', '0888.08.1050');
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            const cleanPhone = phone.replace(/\./g, '');
            link.href = 'tel:' + cleanPhone;
            // Update text content if it contains the phone number
            if (link.textContent.includes('0888') || link.textContent.match(/\d{4}\.\d{2}\.\d{4}/)) {
                link.textContent = phone;
            }
        });

        // Update email links
        const email = this.getSetting('contact_email', 'contact@minhphuoc.com');
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            link.href = 'mailto:' + email;
            if (link.textContent.includes('@')) {
                link.textContent = email;
            }
        });

        console.log('Settings applied to page');
    }
}

// Export singleton instance
const settingsLoader = new SettingsLoader();

// Auto-load settings when DOM is ready
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', async () => {
        // Wait for Supabase to initialize
        setTimeout(async () => {
            await settingsLoader.loadSettings();
            settingsLoader.applyToPage();
        }, 1500);
    });
}
