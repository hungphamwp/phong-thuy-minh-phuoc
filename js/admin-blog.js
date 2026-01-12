// Blog Management System
// Handle CRUD operations for blog posts with Supabase

class BlogManager {
    constructor() {
        this.useSupabase = false;
        this.POSTS_KEY = 'minhphuoc_blog_posts';
        // Don't check Supabase in constructor - will be called explicitly after Supabase init
    }

    // Check if Supabase is available
    async checkSupabaseConnection() {
        try {
            if (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized()) {
                this.useSupabase = true;
                console.log('BlogManager: Sử dụng Supabase');
                // Migrate localStorage data to Supabase if exists
                await this.migrateToSupabase();
            } else {
                console.log('BlogManager: Sử dụng localStorage (Supabase chưa kết nối)');
                this.initSamplePosts();
            }
        } catch (error) {
            console.log('BlogManager: Sử dụng localStorage (lỗi kết nối Supabase)');
            this.initSamplePosts();
        }
    }

    // Migrate existing localStorage data to Supabase
    async migrateToSupabase(force = false) {
        try {
            const localData = localStorage.getItem(this.POSTS_KEY);
            if (!localData) return { success: false, message: 'Không có dữ liệu local để đồng bộ' };

            const { posts } = JSON.parse(localData);
            if (!posts || posts.length === 0) return { success: false, message: 'Danh sách bài viết rỗng' };

            const client = supabaseClient.getClient();

            // Nếu không ép buộc, kiểm tra xem DB đã có dữ liệu chưa
            if (!force) {
                const { data: existingPosts } = await client
                    .from('blog_posts')
                    .select('id')
                    .limit(1);

                if (existingPosts && existingPosts.length > 0) {
                    console.log('Supabase đã có dữ liệu, bỏ qua tự động migrate.');
                    return { success: true, message: 'Đã có dữ liệu trên Supabase' };
                }
            }

            console.log(`Đang đồng bộ ${posts.length} bài viết lên Supabase...`);
            let count = 0;

            for (const post of posts) {
                try {
                    // Kiểm tra xem slug này đã tồn tại chưa để tránh lỗi UNIQUE constraint
                    const { data: duplicate } = await client
                        .from('blog_posts')
                        .select('id')
                        .eq('slug', post.slug || this.generateSlug(post.title))
                        .maybeSingle();

                    if (!duplicate) {
                        await this.createPost(post, true);
                        count++;
                    }
                } catch (err) {
                    console.warn(`Bỏ qua bài viết lỗi hoặc trùng: ${post.title}`);
                }
            }

            console.log(`Đã đồng bộ xong ${count} bài viết!`);
            return { success: true, message: `Đã đồng bộ thành công ${count}/${posts.length} bài viết.` };
        } catch (error) {
            console.error('Lỗi khi migrate:', error);
            return { success: false, message: error.message };
        }
    }

    // Initialize with sample posts if none exist (localStorage only)
    initSamplePosts() {
        if (!localStorage.getItem(this.POSTS_KEY)) {
            const samplePosts = {
                posts: [
                    {
                        id: this.generateId(),
                        title: 'Tổng Quan Phong Thủy Nhà Ở Năm 2025 - Những Điều Cần Biết',
                        slug: 'tong-quan-phong-thuy-nha-o-nam-2025',
                        excerpt: 'Năm 2025 Ất Tỵ đang đến gần, đây là thời điểm tốt để nhìn lại và điều chỉnh phong thủy nhà ở. Bài viết này sẽ tổng hợp những xu hướng phong thủy mới, các hướng nhà tốt xấu và những lưu ý quan trọng giúp bạn chuẩn bị cho năm mới...',
                        content: '<p>Năm 2025 Ất Tỵ đang đến gần, đây là thời điểm tốt để nhìn lại và điều chỉnh phong thủy nhà ở. Bài viết này sẽ tổng hợp những xu hướng phong thủy mới, các hướng nhà tốt xấu và những lưu ý quan trọng giúp bạn chuẩn bị cho năm mới.</p><h2>Năm Ất Tỵ 2025 - Năm Của Rắn</h2><p>Năm 2025 là năm Ất Tỵ, mệnh Phật Đăng Hỏa (lửa đèn Phật). Đây là năm có nhiều biến động nhưng cũng mang đến cơ hội lớn cho những ai biết nắm bắt.</p>',
                        featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=400&fit=crop',
                        category: 'Phong Thủy',
                        author: 'Thầy Minh Phước',
                        publishDate: '2024-12-19',
                        status: 'published',
                        views: 2345,
                        tags: ['phong thủy', 'năm 2025', 'nhà ở'],
                        featured: true
                    },
                    {
                        id: this.generateId(),
                        title: 'Dự Đoán Tử Vi 12 Con Giáp Năm Ất Tỵ 2025',
                        slug: 'du-doan-tu-vi-12-con-giap-nam-at-ty-2025',
                        excerpt: 'Năm Ất Tỵ 2025 sẽ mang đến những thay đổi lớn cho từng con giáp. Cùng xem vận trình của bạn trong năm mới...',
                        content: '<p>Năm Ất Tỵ 2025 sẽ mang đến những thay đổi lớn cho từng con giáp. Cùng xem vận trình của bạn trong năm mới.</p>',
                        featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
                        category: 'Tử Vi',
                        author: 'Admin',
                        publishDate: '2024-12-18',
                        status: 'published',
                        views: 1523,
                        tags: ['tử vi', 'con giáp', '2025'],
                        featured: false
                    }
                ]
            };
            localStorage.setItem(this.POSTS_KEY, JSON.stringify(samplePosts));
        }
    }

    // Generate unique ID
    generateId() {
        return 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Generate slug from title
    generateSlug(title) {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    // Get all posts
    async getAllPosts() {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { data, error } = await client
                    .from('blog_posts')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                return this.convertSupabaseToLocal(data || []);
            } catch (error) {
                console.error('Lỗi lấy posts từ Supabase:', error);
                return [];
            }
        } else {
            const data = localStorage.getItem(this.POSTS_KEY);
            if (!data) return [];
            return JSON.parse(data).posts || [];
        }
    }

    // Get published posts only
    async getPublishedPosts() {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { data, error } = await client
                    .from('blog_posts')
                    .select('*')
                    .eq('status', 'published')
                    .order('published_at', { ascending: false });

                if (error) throw error;
                return this.convertSupabaseToLocal(data || []);
            } catch (error) {
                console.error('Lỗi lấy published posts:', error);
                return [];
            }
        } else {
            const posts = await this.getAllPosts();
            return posts.filter(post => post.status === 'published');
        }
    }

    // Get posts by category
    async getPostsByCategory(category) {
        if (category === 'Tất Cả') return await this.getPublishedPosts();

        const posts = await this.getPublishedPosts();
        return posts.filter(post => post.category === category);
    }

    // Get single post by ID
    async getPostById(id) {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { data, error } = await client
                    .from('blog_posts')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                return this.convertSupabaseToLocal([data])[0];
            } catch (error) {
                console.error('Lỗi lấy post by ID:', error);
                return null;
            }
        } else {
            const posts = await this.getAllPosts();
            return posts.find(post => post.id === id);
        }
    }

    // Get post by slug
    async getPostBySlug(slug) {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const { data, error } = await client
                    .from('blog_posts')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (error) throw error;
                return this.convertSupabaseToLocal([data])[0];
            } catch (error) {
                console.error('Lỗi lấy post by slug:', error);
                return null;
            }
        } else {
            const posts = await this.getAllPosts();
            return posts.find(post => post.slug === slug);
        }
    }

    // Convert Supabase format to local format
    convertSupabaseToLocal(posts) {
        return posts.map(post => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || '',
            content: post.content || '',
            featuredImage: post.featured_image || '',
            category: this.mapCategory(post.category),
            author: post.author_id || 'Admin',
            publishDate: post.published_at ? post.published_at.split('T')[0] : new Date().toISOString().split('T')[0],
            status: post.status,
            views: post.view_count || 0,
            tags: post.tags || [],
            featured: post.featured || false,
            createdAt: post.created_at,
            updatedAt: post.updated_at
        }));
    }

    // Convert local format to Supabase format
    convertLocalToSupabase(post) {
        return {
            title: post.title,
            slug: post.slug || this.generateSlug(post.title),
            excerpt: post.excerpt || '',
            content: post.content || '',
            featured_image: post.featuredImage || '',
            category: this.mapCategoryToSupabase(post.category),
            status: post.status || 'draft',
            tags: post.tags || [],
            published_at: post.status === 'published' ? new Date().toISOString() : null
        };
    }

    // Map category names
    mapCategory(category) {
        const map = {
            'scholarship': 'Quỹ Khuyến Học',
            'fengshui': 'Phong Thủy',
            'astrology': 'Tử Vi',
            'news': 'Tin Tức',
            'other': 'Khác'
        };
        return map[category] || category;
    }

    mapCategoryToSupabase(category) {
        const map = {
            'Quỹ Khuyến Học': 'scholarship',
            'Phong Thủy': 'fengshui',
            'Tử Vi': 'astrology',
            'Tin Tức': 'news',
            'Khác': 'other'
        };
        return map[category] || 'other';
    }

    // Create new post
    async createPost(postData, isMigration = false) {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const supabaseData = this.convertLocalToSupabase(postData);

                const { data, error } = await client
                    .from('blog_posts')
                    .insert([supabaseData])
                    .select();

                if (error) throw error;

                console.log('Đã tạo bài viết thành công:', data[0].title);
                return this.convertSupabaseToLocal(data)[0];
            } catch (error) {
                console.error('Lỗi tạo post:', error);
                throw error;
            }
        } else {
            const posts = await this.getAllPosts();

            const newPost = {
                id: this.generateId(),
                title: postData.title,
                slug: postData.slug || this.generateSlug(postData.title),
                excerpt: postData.excerpt || '',
                content: postData.content || '',
                featuredImage: postData.featuredImage || '',
                category: postData.category || 'Phong Thủy',
                author: postData.author || 'Admin',
                publishDate: postData.publishDate || new Date().toISOString().split('T')[0],
                status: postData.status || 'draft',
                views: 0,
                tags: postData.tags || [],
                featured: postData.featured || false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            posts.push(newPost);
            this.savePosts(posts);
            return newPost;
        }
    }

    // Update post
    async updatePost(id, postData) {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();
                const supabaseData = this.convertLocalToSupabase(postData);

                const { data, error } = await client
                    .from('blog_posts')
                    .update(supabaseData)
                    .eq('id', id)
                    .select();

                if (error) throw error;

                console.log('Đã cập nhật bài viết thành công');
                return { success: true, post: this.convertSupabaseToLocal(data)[0] };
            } catch (error) {
                console.error('Lỗi update post:', error);
                return { success: false, message: error.message };
            }
        } else {
            const posts = await this.getAllPosts();
            const index = posts.findIndex(post => post.id === id);

            if (index === -1) {
                return { success: false, message: 'Không tìm thấy bài viết' };
            }

            posts[index] = {
                ...posts[index],
                ...postData,
                updatedAt: new Date().toISOString()
            };

            this.savePosts(posts);
            return { success: true, post: posts[index] };
        }
    }

    // Delete post
    async deletePost(id) {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();

                const { error } = await client
                    .from('blog_posts')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                console.log('Đã xóa bài viết thành công');
                return { success: true, message: 'Đã xóa bài viết' };
            } catch (error) {
                console.error('Lỗi xóa post:', error);
                return { success: false, message: error.message };
            }
        } else {
            const posts = await this.getAllPosts();
            const filteredPosts = posts.filter(post => post.id !== id);

            if (posts.length === filteredPosts.length) {
                return { success: false, message: 'Không tìm thấy bài viết' };
            }

            this.savePosts(filteredPosts);
            return { success: true, message: 'Đã xóa bài viết' };
        }
    }

    // Save posts to localStorage
    savePosts(posts) {
        localStorage.setItem(this.POSTS_KEY, JSON.stringify({ posts }));
    }

    // Increment view count
    async incrementViews(id) {
        if (this.useSupabase) {
            try {
                const client = supabaseClient.getClient();

                // Get current view count
                const { data: post } = await client
                    .from('blog_posts')
                    .select('view_count')
                    .eq('id', id)
                    .single();

                if (post) {
                    await client
                        .from('blog_posts')
                        .update({ view_count: (post.view_count || 0) + 1 })
                        .eq('id', id);
                }
            } catch (error) {
                console.error('Lỗi tăng view count:', error);
            }
        } else {
            const posts = await this.getAllPosts();
            const post = posts.find(p => p.id === id);
            if (post) {
                post.views = (post.views || 0) + 1;
                this.savePosts(posts);
            }
        }
    }

    // Get statistics
    async getStatistics() {
        const posts = await this.getAllPosts();
        return {
            total: posts.length,
            published: posts.filter(p => p.status === 'published').length,
            draft: posts.filter(p => p.status === 'draft').length,
            totalViews: posts.reduce((sum, p) => sum + (p.views || 0), 0)
        };
    }

    // Search posts
    async searchPosts(query) {
        const posts = await this.getAllPosts();
        const lowerQuery = query.toLowerCase();
        return posts.filter(post =>
            post.title.toLowerCase().includes(lowerQuery) ||
            post.excerpt.toLowerCase().includes(lowerQuery) ||
            post.category.toLowerCase().includes(lowerQuery) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
        );
    }

    // Export all posts as JSON
    exportPosts() {
        const posts = this.getAllPosts();
        const dataStr = JSON.stringify({ posts }, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `blog-posts-${Date.now()}.json`;
        link.click();
    }

    // Import posts from JSON
    importPosts(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.posts && Array.isArray(data.posts)) {
                localStorage.setItem(this.POSTS_KEY, JSON.stringify(data));
                return { success: true, message: 'Import thành công' };
            }
            return { success: false, message: 'Định dạng JSON không hợp lệ' };
        } catch (e) {
            return { success: false, message: 'Lỗi: ' + e.message };
        }
    }
}

// Create global instance
const blogManager = new BlogManager();
