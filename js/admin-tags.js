// ==========================================
// Admin Tags Manager
// Quản lý tags bài viết
// ==========================================

class TagManager {
    constructor() {
        this.useSupabase = false;
        this.LOCAL_KEY = 'minhphuoc_tags';
    }

    /**
     * Kiểm tra kết nối Supabase
     */
    async checkSupabaseConnection() {
        try {
            if (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized()) {
                this.useSupabase = true;
                console.log('TagManager: Sử dụng Supabase');
                return true;
            }
        } catch (error) {
            console.log('TagManager: Sử dụng localStorage');
        }
        return false;
    }

    /**
     * Tạo slug từ tên
     */
    generateSlug(name) {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    /**
     * Lấy tất cả tags
     */
    async getAllTags() {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { data, error } = await client
                    .from('tags')
                    .select('*')
                    .order('name');

                if (error) throw error;
                return data || [];
            } catch (error) {
                console.error('Error fetching tags:', error);
                return [];
            }
        }

        return JSON.parse(localStorage.getItem(this.LOCAL_KEY) || '[]');
    }

    /**
     * Lấy tag theo ID
     */
    async getTagById(id) {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { data, error } = await client
                    .from('tags')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Error fetching tag:', error);
                return null;
            }
        }

        const all = await this.getAllTags();
        return all.find(tag => tag.id === id);
    }

    /**
     * Tạo tag mới
     */
    async createTag(tagData) {
        const slug = tagData.slug || this.generateSlug(tagData.name);

        const newTag = {
            name: tagData.name,
            slug: slug,
            post_count: 0
        };

        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { data, error } = await client
                    .from('tags')
                    .insert([newTag])
                    .select()
                    .single();

                if (error) throw error;
                return { success: true, data: data };
            } catch (error) {
                console.error('Error creating tag:', error);
                return { success: false, error: error.message };
            }
        }

        // Fallback to localStorage
        newTag.id = 'local_' + Date.now();
        newTag.created_at = new Date().toISOString();

        const all = await this.getAllTags();
        all.push(newTag);
        localStorage.setItem(this.LOCAL_KEY, JSON.stringify(all));

        return { success: true, data: newTag };
    }

    /**
     * Tạo nhiều tags cùng lúc
     */
    async createMultipleTags(names) {
        const results = [];
        for (const name of names) {
            const trimmedName = name.trim();
            if (trimmedName) {
                const result = await this.createTag({ name: trimmedName });
                results.push(result);
            }
        }
        return results;
    }

    /**
     * Cập nhật tag
     */
    async updateTag(id, updateData) {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { data, error } = await client
                    .from('tags')
                    .update({
                        name: updateData.name,
                        slug: updateData.slug || this.generateSlug(updateData.name)
                    })
                    .eq('id', id)
                    .select()
                    .single();

                if (error) throw error;
                return { success: true, data: data };
            } catch (error) {
                console.error('Error updating tag:', error);
                return { success: false, error: error.message };
            }
        }

        // Fallback to localStorage
        const all = await this.getAllTags();
        const index = all.findIndex(tag => tag.id === id);
        if (index !== -1) {
            all[index] = { ...all[index], ...updateData };
            localStorage.setItem(this.LOCAL_KEY, JSON.stringify(all));
            return { success: true, data: all[index] };
        }
        return { success: false, error: 'Tag not found' };
    }

    /**
     * Xóa tag
     */
    async deleteTag(id) {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();

                // Also delete from post_tags
                await client.from('post_tags').delete().eq('tag_id', id);

                const { error } = await client
                    .from('tags')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                return { success: true };
            } catch (error) {
                console.error('Error deleting tag:', error);
                return { success: false, error: error.message };
            }
        }

        // Fallback to localStorage
        const all = await this.getAllTags();
        const filtered = all.filter(tag => tag.id !== id);
        localStorage.setItem(this.LOCAL_KEY, JSON.stringify(filtered));
        return { success: true };
    }

    /**
     * Tìm kiếm tags
     */
    async searchTags(query) {
        const all = await this.getAllTags();
        const lowerQuery = query.toLowerCase();
        return all.filter(tag =>
            tag.name.toLowerCase().includes(lowerQuery) ||
            tag.slug.includes(lowerQuery)
        );
    }

    /**
     * Lấy tags phổ biến (có nhiều bài viết nhất)
     */
    async getPopularTags(limit = 10) {
        const all = await this.getAllTags();
        return all
            .sort((a, b) => (b.post_count || 0) - (a.post_count || 0))
            .slice(0, limit);
    }
}

// Export singleton instance
const tagManager = new TagManager();

// Auto-check Supabase
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            tagManager.checkSupabaseConnection();
        }, 1000);
    });
}
