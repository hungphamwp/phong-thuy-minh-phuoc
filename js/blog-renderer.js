// Blog Renderer for Frontend
// Renders blog posts from localStorage on the public website

class BlogRenderer {
    constructor() {
        this.postsPerPage = 9;
        this.currentPage = 1;
        this.currentCategory = 'Tất Cả';
    }

    // Get blog manager instance
    getBlogManager() {
        if (typeof blogManager !== 'undefined') {
            return blogManager;
        }
        // Fallback if blogManager not loaded
        const POSTS_KEY = 'minhphuoc_blog_posts';
        const data = localStorage.getItem(POSTS_KEY);
        if (!data) return { posts: [] };
        return JSON.parse(data);
    }

    // Get published posts
    async getPublishedPosts() {
        if (typeof blogManager !== 'undefined') {
            return await blogManager.getPublishedPosts();
        }
        // Fallback
        const data = this.getBlogManager();
        return (data.posts || []).filter(post => post.status === 'published');
    }

    // Get posts by category
    async getPostsByCategory(category) {
        const posts = await this.getPublishedPosts();
        if (category === 'Tất Cả') return posts;
        return posts.filter(post => post.category === category);
    }

    // Render blog posts on tin-tuc.html
    async renderBlogGrid(category = 'Tất Cả', page = 1) {
        this.currentCategory = category;
        this.currentPage = page;

        const allPosts = await this.getPostsByCategory(category);

        // Sort by date (newest first)
        allPosts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

        // Pagination
        const startIndex = (page - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const posts = allPosts.slice(startIndex, endIndex);

        const blogGrid = document.querySelector('.blog-grid-page');
        if (!blogGrid) return;

        // Clear existing content
        blogGrid.innerHTML = '';

        if (posts.length === 0) {
            blogGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #6c757d;">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Chưa có bài viết nào trong danh mục này</p>
                </div>
            `;
            return;
        }

        // Render posts
        posts.forEach((post, index) => {
            const isFeatured = index === 0 && page === 1 && category === 'Tất Cả' && post.featured;
            const articleClass = isFeatured ? 'blog-card featured-post' : 'blog-card';

            const formattedDate = new Date(post.publishDate).toLocaleDateString('vi-VN');

            const article = document.createElement('article');
            article.className = articleClass;
            article.innerHTML = `
                <div class="blog-image">
                    <img src="${post.featuredImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=400&fit=crop'}" 
                         alt="${post.title}">
                    <span class="blog-category">${post.category}</span>
                    ${isFeatured ? '<span class="featured-badge">Nổi Bật</span>' : ''}
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                        <span><i class="fas fa-user"></i> ${post.author}</span>
                        ${post.views ? `<span><i class="fas fa-eye"></i> ${post.views.toLocaleString()} lượt xem</span>` : ''}
                    </div>
                    <h${isFeatured ? '2' : '3'} class="blog-title">${post.title}</h${isFeatured ? '2' : '3'}>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <a href="post-detail.html?id=${post.id}" class="blog-link">Đọc tiếp <i class="fas fa-arrow-right"></i></a>
                </div>
            `;
            blogGrid.appendChild(article);
        });

        // Render pagination
        this.renderPagination(allPosts.length);
    }

    // Render pagination
    renderPagination(totalPosts) {
        const totalPages = Math.ceil(totalPosts / this.postsPerPage);
        const paginationDiv = document.querySelector('.pagination');

        if (!paginationDiv || totalPages <= 1) {
            if (paginationDiv) paginationDiv.style.display = 'none';
            return;
        }

        paginationDiv.style.display = 'flex';
        paginationDiv.innerHTML = '';

        // Previous button
        if (this.currentPage > 1) {
            const prevLink = document.createElement('a');
            prevLink.href = '#';
            prevLink.className = 'page-link';
            prevLink.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevLink.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.renderBlogGrid(this.currentCategory, this.currentPage - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            paginationDiv.appendChild(prevLink);
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                const pageLink = document.createElement('a');
                pageLink.href = '#';
                pageLink.className = i === this.currentPage ? 'page-link active' : 'page-link';
                pageLink.textContent = i;
                pageLink.addEventListener('click', async (e) => {
                    e.preventDefault();
                    await this.renderBlogGrid(this.currentCategory, i);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                paginationDiv.appendChild(pageLink);
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                const dots = document.createElement('span');
                dots.className = 'page-dots';
                dots.textContent = '...';
                paginationDiv.appendChild(dots);
            }
        }

        // Next button
        if (this.currentPage < totalPages) {
            const nextLink = document.createElement('a');
            nextLink.href = '#';
            nextLink.className = 'page-link next';
            nextLink.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextLink.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.renderBlogGrid(this.currentCategory, this.currentPage + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            paginationDiv.appendChild(nextLink);
        }
    }

    // Setup category filter
    setupCategoryFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', async function () {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const category = this.textContent;
                await blogRenderer.renderBlogGrid(category, 1);
            });
        });
    }

    // Render single post detail
    async renderPostDetail(postId) {
        let post;
        if (typeof blogManager !== 'undefined') {
            post = await blogManager.getPostById(postId);
            // Increment views
            await blogManager.incrementViews(postId);
        } else {
            // Fallback
            const data = this.getBlogManager();
            post = (data.posts || []).find(p => p.id === postId);
        }

        if (!post) {
            return null;
        }

        return post;
    }

    // Initialize blog renderer
    async init() {
        // Check if we're on tin-tuc.html
        const blogGrid = document.querySelector('.blog-grid-page');
        if (blogGrid) {
            await this.renderBlogGrid('Tất Cả', 1);
            this.setupCategoryFilter();
        }
    }
}

// Create global instance
const blogRenderer = new BlogRenderer();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => blogRenderer.init());
} else {
    blogRenderer.init();
}
