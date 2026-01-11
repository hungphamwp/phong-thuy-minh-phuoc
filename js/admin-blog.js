// Blog Management System
// Handle CRUD operations for blog posts

class BlogManager {
    constructor() {
        this.POSTS_KEY = 'minhphuoc_blog_posts';
        this.initSamplePosts();
    }

    // Initialize with sample posts if none exist
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
    getAllPosts() {
        const data = localStorage.getItem(this.POSTS_KEY);
        if (!data) return [];
        return JSON.parse(data).posts || [];
    }

    // Get published posts only
    getPublishedPosts() {
        return this.getAllPosts().filter(post => post.status === 'published');
    }

    // Get posts by category
    getPostsByCategory(category) {
        if (category === 'Tất Cả') return this.getPublishedPosts();
        return this.getPublishedPosts().filter(post => post.category === category);
    }

    // Get single post by ID
    getPostById(id) {
        const posts = this.getAllPosts();
        return posts.find(post => post.id === id);
    }

    // Get post by slug
    getPostBySlug(slug) {
        const posts = this.getAllPosts();
        return posts.find(post => post.slug === slug);
    }

    // Create new post
    createPost(postData) {
        const posts = this.getAllPosts();

        const newPost = {
            id: this.generateId(),
            title: postData.title,
            slug: postData.slug || this.generateSlug(postData.title),
            excerpt: postData.excerpt || '',
            content: postData.content || '',
            featuredImage: postData.featuredImage || '',
            category: postData.category || 'Phong Thủy',
            author: postData.author || auth.getSession()?.name || 'Admin',
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

    // Update post
    updatePost(id, postData) {
        const posts = this.getAllPosts();
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

    // Delete post
    deletePost(id) {
        const posts = this.getAllPosts();
        const filteredPosts = posts.filter(post => post.id !== id);

        if (posts.length === filteredPosts.length) {
            return { success: false, message: 'Không tìm thấy bài viết' };
        }

        this.savePosts(filteredPosts);
        return { success: true, message: 'Đã xóa bài viết' };
    }

    // Save posts to localStorage
    savePosts(posts) {
        localStorage.setItem(this.POSTS_KEY, JSON.stringify({ posts }));
    }

    // Increment view count
    incrementViews(id) {
        const posts = this.getAllPosts();
        const post = posts.find(p => p.id === id);
        if (post) {
            post.views = (post.views || 0) + 1;
            this.savePosts(posts);
        }
    }

    // Get statistics
    getStatistics() {
        const posts = this.getAllPosts();
        return {
            total: posts.length,
            published: posts.filter(p => p.status === 'published').length,
            draft: posts.filter(p => p.status === 'draft').length,
            totalViews: posts.reduce((sum, p) => sum + (p.views || 0), 0)
        };
    }

    // Search posts
    searchPosts(query) {
        const posts = this.getAllPosts();
        const lowerQuery = query.toLowerCase();
        return posts.filter(post =>
            post.title.toLowerCase().includes(lowerQuery) ||
            post.excerpt.toLowerCase().includes(lowerQuery) ||
            post.category.toLowerCase().includes(lowerQuery) ||
            post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
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
