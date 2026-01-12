// Media Management System
// Handle image uploads and media library

class MediaManager {
    constructor() {
        this.MEDIA_KEY = 'minhphuoc_media_library';
        this.MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        this.ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    }

    // Get all media items
    async getAllMedia() {
        if (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized()) {
            try {
                const { data, error } = await supabaseClient.getClient()
                    .from('media_library')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                return this.convertSupabaseToLocal(data || []);
            } catch (error) {
                console.error('Lỗi lấy media từ Supabase:', error);
                return [];
            }
        }

        const data = localStorage.getItem(this.MEDIA_KEY);
        if (!data) return [];
        try {
            return JSON.parse(data).media || [];
        } catch (e) {
            return [];
        }
    }

    // Convert Supabase format to local format
    convertSupabaseToLocal(items) {
        return items.map(item => ({
            id: item.id,
            filename: item.file_name,
            url: item.file_url,
            type: item.file_type === 'image' ? 'image/jpeg' : item.file_type, // Approximation
            size: item.file_size,
            uploadDate: item.created_at,
            title: item.caption || item.file_name,
            alt: item.alt_text || '',
            usedIn: [] // Supabase implementation might need a separate relation for usage
        }));
    }

    // Generate unique ID
    generateId() {
        return 'media_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Validate file
    validateFile(file) {
        if (!file) {
            return { valid: false, error: 'Không có file được chọn' };
        }

        if (!this.ALLOWED_TYPES.includes(file.type)) {
            return { valid: false, error: 'Định dạng file không hợp lệ. Chỉ chấp nhận: JPG, PNG, GIF, WebP' };
        }

        if (file.size > this.MAX_FILE_SIZE) {
            return { valid: false, error: `Kích thước file quá lớn. Tối đa ${this.MAX_FILE_SIZE / 1024 / 1024}MB` };
        }

        return { valid: true };
    }

    // Convert file to Base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Get image dimensions
    getImageDimensions(base64) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };
            img.onerror = () => {
                resolve({ width: 0, height: 0 });
            };
            img.src = base64;
        });
    }

    // Upload media
    async uploadMedia(file, metadata = {}) {
        // Validate
        const validation = this.validateFile(file);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }

        // Supabase Upload
        if (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized()) {
            try {
                const client = supabaseClient.getClient();

                // 1. Upload to Storage
                const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                // Need to ensure bucket 'images' exists
                const { data: uploadData, error: uploadError } = await client
                    .storage
                    .from('images') // Assumed bucket name
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                // 2. Get Public URL
                const { data: urlData } = client
                    .storage
                    .from('images')
                    .getPublicUrl(fileName);

                // 3. Save to Database
                const mediaItem = {
                    file_name: fileName,
                    file_url: urlData.publicUrl,
                    file_type: file.type.startsWith('image') ? 'image' : 'other',
                    file_size: file.size,
                    alt_text: metadata.alt || '',
                    caption: metadata.title || file.name.split('.')[0]
                };

                const { data, error } = await client
                    .from('media_library')
                    .insert([mediaItem])
                    .select();

                if (error) throw error;

                return { success: true, media: this.convertSupabaseToLocal(data)[0] };
            } catch (error) {
                console.error('Supabase upload error:', error);
                return { success: false, error: 'Lỗi Supabase: ' + error.message };
            }
        }

        // Local Storage Fallback
        try {
            // Convert to Base64
            const base64 = await this.fileToBase64(file);

            // Get dimensions
            const dimensions = await this.getImageDimensions(base64);

            // Create media item
            const mediaItem = {
                id: this.generateId(),
                filename: file.name,
                url: base64,
                type: file.type,
                size: file.size,
                width: dimensions.width,
                height: dimensions.height,
                uploadDate: new Date().toISOString(),
                title: metadata.title || file.name.split('.')[0],
                alt: metadata.alt || '',
                usedIn: []
            };

            // Save to storage
            // Note: calling getAllMedia() which is now async, expecting existing local storage access to be sync?
            // Wait, we can't await this.getAllMedia() if we want to keep `getAllMedia` pure async?
            // Actually, we can just read localStorage directly here to avoid async recursion logic for local fallback
            const data = localStorage.getItem(this.MEDIA_KEY);
            const media = data ? JSON.parse(data).media || [] : [];

            media.unshift(mediaItem); // Add to beginning
            this.saveMedia(media);

            return { success: true, media: mediaItem };
        } catch (error) {
            return { success: false, error: 'Lỗi khi upload ảnh: ' + error.message };
        }
    }

    // Upload multiple files
    async uploadMultiple(files, onProgress) {
        const results = [];
        for (let i = 0; i < files.length; i++) {
            const result = await this.uploadMedia(files[i]);
            results.push(result);
            if (onProgress) {
                onProgress(i + 1, files.length, result);
            }
        }
        return results;
    }

    // Get media by ID
    async getMediaById(id) {
        const media = await this.getAllMedia();
        return media.find(m => m.id === id);
    }

    // Update media metadata
    async updateMedia(id, updates) {
        if (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized()) {
            // Supabase update
            // ...
            return { success: false, error: "Chưa hỗ trợ update metadata trên Supabase" };
        }

        const media = await this.getAllMedia(); // This might convert from Supabase if mixed usage? No, keeping simple.
        // Actually, if we are in local mode, we should read local. 
        // If we are in Supabase mode, we should read Supabase.

        // Let's implement local logic specifically to avoid circular deps
        const localData = localStorage.getItem(this.MEDIA_KEY);
        if (localData) {
            const data = JSON.parse(localData);
            const list = data.media || [];
            const index = list.findIndex(m => m.id === id);

            if (index !== -1) {
                list[index] = { ...list[index], ...updates };
                this.saveMedia(list);
                return { success: true, media: list[index] };
            }
        }
        return { success: false, error: 'Không tìm thấy media' };
    }

    // Delete media
    async deleteMedia(id) {
        if (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized()) {
            try {
                const client = supabaseClient.getClient();
                // 1. Get filename to delete from storage
                const { data: item } = await client.from('media_library').select('file_name').eq('id', id).single();

                if (item) {
                    await client.storage.from('images').remove([item.file_name]);
                }

                const { error } = await client
                    .from('media_library')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                return { success: true, message: 'Đã xóa ảnh' };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }

        const localData = localStorage.getItem(this.MEDIA_KEY);
        if (localData) {
            const data = JSON.parse(localData);
            const list = data.media || [];
            const filtered = list.filter(m => m.id !== id);
            this.saveMedia(filtered);
            return { success: true, message: 'Đã xóa ảnh thành công' };
        }
        return { success: false, error: 'Không tìm thấy media' };
    }

    // Force delete (even if used)
    async forceDeleteMedia(id) {
        return this.deleteMedia(id);
    }

    // Save media to storage
    saveMedia(media) {
        localStorage.setItem(this.MEDIA_KEY, JSON.stringify({ media }));
    }

    // Search media
    async searchMedia(query) {
        // Simple client side filtering for now
        const media = await this.getAllMedia();
        const lowerQuery = query.toLowerCase();
        return media.filter(m =>
            m.filename.toLowerCase().includes(lowerQuery) ||
            m.title.toLowerCase().includes(lowerQuery) ||
            m.alt.toLowerCase().includes(lowerQuery)
        );
    }

    // Filter by type
    async filterByType(type) {
        const media = await this.getAllMedia();
        if (!type || type === 'all') return media;
        return media.filter(m => m.type.includes(type));
    }

    // Get storage info
    async getStorageInfo() {
        const media = await this.getAllMedia();
        const totalSize = media.reduce((sum, m) => sum + (m.size || 0), 0);
        const totalCount = media.length;

        // Estimate localStorage usage
        const storageUsed = new Blob([localStorage.getItem(this.MEDIA_KEY) || '']).size;
        const storageLimit = 5 * 1024 * 1024; // ~5MB typical limit

        return {
            totalCount,
            totalSize,
            storageUsed,
            storageLimit,
            percentUsed: (storageUsed / storageLimit) * 100
        };
    }

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    // ... Usage tracking not fully supported in Supabase version yet ...
    markAsUsed(mediaId, postId) { }
    removeUsage(mediaId, postId) { }
    getUnusedMedia() { return []; }
    cleanupUnused() { return { success: true, count: 0 }; }

    async exportMediaList() {
        const media = await this.getAllMedia();
        const list = media.map(m => ({
            id: m.id,
            filename: m.filename,
            url: m.url.substring(0, 100) + '...',
            uploadDate: m.uploadDate
        }));
        return list;
    }
}

// Create global instance
const mediaManager = new MediaManager();
