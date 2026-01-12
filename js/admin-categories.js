// ==========================================
// Admin Categories Manager
// Quản lý danh mục bài viết
// ==========================================

class CategoryManager {
    constructor() {
        this.useSupabase = false;
        this.LOCAL_KEY = 'minhphuoc_categories';
    }

    /**
     * Kiểm tra kết nối Supabase
     */
    async checkSupabaseConnection() {
        try {
            if (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized()) {
                this.useSupabase = true;
                console.log('CategoryManager: Sử dụng Supabase');
                return true;
            }
        } catch (error) {
            console.log('CategoryManager: Sử dụng localStorage');
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
     * Lấy tất cả categories
     */
    async getAllCategories() {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { data, error } = await client
                    .from('categories')
                    .select('*')
                    .order('name');

                if (error) throw error;
                return data || [];
            } catch (error) {
                console.error('Error fetching categories:', error);
                return [];
            }
        }

        // Fallback to localStorage
        return JSON.parse(localStorage.getItem(this.LOCAL_KEY) || '[]');
    }

    /**
     * Lấy categories theo parent
     */
    async getCategoriesByParent(parentId = null) {
        const all = await this.getAllCategories();
        return all.filter(cat => cat.parent_id === parentId);
    }

    /**
     * Lấy category theo ID
     */
    async getCategoryById(id) {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { data, error } = await client
                    .from('categories')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Error fetching category:', error);
                return null;
            }
        }

        const all = await this.getAllCategories();
        return all.find(cat => cat.id === id);
    }

    /**
     * Tạo category mới
     */
    async createCategory(categoryData) {
        const slug = categoryData.slug || this.generateSlug(categoryData.name);

        const newCategory = {
            name: categoryData.name,
            slug: slug,
            description: categoryData.description || '',
            parent_id: categoryData.parent_id || null,
            post_count: 0
        };

        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { data, error } = await client
                    .from('categories')
                    .insert([newCategory])
                    .select()
                    .single();

                if (error) throw error;
                return { success: true, data: data };
            } catch (error) {
                console.error('Error creating category:', error);
                return { success: false, error: error.message };
            }
        }

        // Fallback to localStorage
        newCategory.id = 'local_' + Date.now();
        newCategory.created_at = new Date().toISOString();

        const all = await this.getAllCategories();
        all.push(newCategory);
        localStorage.setItem(this.LOCAL_KEY, JSON.stringify(all));

        return { success: true, data: newCategory };
    }

    /**
     * Cập nhật category
     */
    async updateCategory(id, updateData) {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { data, error } = await client
                    .from('categories')
                    .update({
                        name: updateData.name,
                        slug: updateData.slug || this.generateSlug(updateData.name),
                        description: updateData.description,
                        parent_id: updateData.parent_id
                    })
                    .eq('id', id)
                    .select()
                    .single();

                if (error) throw error;
                return { success: true, data: data };
            } catch (error) {
                console.error('Error updating category:', error);
                return { success: false, error: error.message };
            }
        }

        // Fallback to localStorage
        const all = await this.getAllCategories();
        const index = all.findIndex(cat => cat.id === id);
        if (index !== -1) {
            all[index] = { ...all[index], ...updateData };
            localStorage.setItem(this.LOCAL_KEY, JSON.stringify(all));
            return { success: true, data: all[index] };
        }
        return { success: false, error: 'Category not found' };
    }

    /**
     * Xóa category
     */
    async deleteCategory(id) {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { error } = await client
                    .from('categories')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                return { success: true };
            } catch (error) {
                console.error('Error deleting category:', error);
                return { success: false, error: error.message };
            }
        }

        // Fallback to localStorage
        const all = await this.getAllCategories();
        const filtered = all.filter(cat => cat.id !== id);
        localStorage.setItem(this.LOCAL_KEY, JSON.stringify(filtered));
        return { success: true };
    }

    /**
     * Lấy số bài viết theo category
     */
    async getPostCount(categoryId) {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const category = await this.getCategoryById(categoryId);
                if (!category) return 0;

                const { count, error } = await client
                    .from('blog_posts')
                    .select('*', { count: 'exact', head: true })
                    .eq('category', category.name);

                if (error) throw error;
                return count || 0;
            } catch (error) {
                console.error('Error counting posts:', error);
                return 0;
            }
        }
        return 0;
    }

    /**
     * Xây dựng tree structure
     */
    async getCategoryTree() {
        const all = await this.getAllCategories();
        const rootCategories = all.filter(cat => !cat.parent_id);

        const buildTree = (parent) => {
            const children = all.filter(cat => cat.parent_id === parent.id);
            return {
                ...parent,
                children: children.map(buildTree)
            };
        };

        return rootCategories.map(buildTree);
    }
}

// Export singleton instance
const categoryManager = new CategoryManager();

// Auto-check Supabase
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            categoryManager.checkSupabaseConnection();
        }, 1000);
    });
}
