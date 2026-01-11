// Media Management System
// Handle image uploads and media library

class MediaManager {
    constructor() {
        this.MEDIA_KEY = 'minhphuoc_media_library';
        this.MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        this.ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    }

    // Get all media items
    getAllMedia() {
        const data = localStorage.getItem(this.MEDIA_KEY);
        if (!data) return [];
        try {
            return JSON.parse(data).media || [];
        } catch (e) {
            return [];
        }
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

    // Upload media (convert to Base64 and store)
    async uploadMedia(file, metadata = {}) {
        // Validate
        const validation = this.validateFile(file);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }

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
            const media = this.getAllMedia();
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
    getMediaById(id) {
        const media = this.getAllMedia();
        return media.find(m => m.id === id);
    }

    // Update media metadata
    updateMedia(id, updates) {
        const media = this.getAllMedia();
        const index = media.findIndex(m => m.id === id);

        if (index === -1) {
            return { success: false, error: 'Không tìm thấy media' };
        }

        media[index] = { ...media[index], ...updates };
        this.saveMedia(media);

        return { success: true, media: media[index] };
    }

    // Delete media
    deleteMedia(id) {
        const media = this.getAllMedia();
        const item = media.find(m => m.id === id);

        if (!item) {
            return { success: false, error: 'Không tìm thấy media' };
        }

        // Check if media is being used
        if (item.usedIn && item.usedIn.length > 0) {
            return {
                success: false,
                error: `Ảnh đang được sử dụng trong ${item.usedIn.length} bài viết. Vui lòng xóa khỏi bài viết trước.`,
                warning: true
            };
        }

        const filtered = media.filter(m => m.id !== id);
        this.saveMedia(filtered);

        return { success: true, message: 'Đã xóa ảnh thành công' };
    }

    // Force delete (even if used)
    forceDeleteMedia(id) {
        const media = this.getAllMedia();
        const filtered = media.filter(m => m.id !== id);
        this.saveMedia(filtered);
        return { success: true, message: 'Đã xóa ảnh' };
    }

    // Save media to storage
    saveMedia(media) {
        localStorage.setItem(this.MEDIA_KEY, JSON.stringify({ media }));
    }

    // Search media
    searchMedia(query) {
        const media = this.getAllMedia();
        const lowerQuery = query.toLowerCase();
        return media.filter(m =>
            m.filename.toLowerCase().includes(lowerQuery) ||
            m.title.toLowerCase().includes(lowerQuery) ||
            m.alt.toLowerCase().includes(lowerQuery)
        );
    }

    // Filter by type
    filterByType(type) {
        const media = this.getAllMedia();
        if (!type || type === 'all') return media;
        return media.filter(m => m.type.includes(type));
    }

    // Get storage info
    getStorageInfo() {
        const media = this.getAllMedia();
        const totalSize = media.reduce((sum, m) => sum + m.size, 0);
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

    // Mark media as used in post
    markAsUsed(mediaId, postId) {
        const media = this.getAllMedia();
        const item = media.find(m => m.id === mediaId);
        if (item) {
            if (!item.usedIn) item.usedIn = [];
            if (!item.usedIn.includes(postId)) {
                item.usedIn.push(postId);
                this.saveMedia(media);
            }
        }
    }

    // Remove usage tracking
    removeUsage(mediaId, postId) {
        const media = this.getAllMedia();
        const item = media.find(m => m.id === mediaId);
        if (item && item.usedIn) {
            item.usedIn = item.usedIn.filter(id => id !== postId);
            this.saveMedia(media);
        }
    }

    // Get unused media
    getUnusedMedia() {
        const media = this.getAllMedia();
        return media.filter(m => !m.usedIn || m.usedIn.length === 0);
    }

    // Clean up unused media (with confirmation)
    cleanupUnused() {
        const unused = this.getUnusedMedia();
        unused.forEach(m => this.deleteMedia(m.id));
        return { success: true, count: unused.length };
    }

    // Export media list (URLs only)
    exportMediaList() {
        const media = this.getAllMedia();
        const list = media.map(m => ({
            id: m.id,
            filename: m.filename,
            url: m.url.substring(0, 100) + '...', // Truncate Base64 for readability
            uploadDate: m.uploadDate
        }));
        return list;
    }
}

// Create global instance
const mediaManager = new MediaManager();
