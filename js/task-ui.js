// ==========================================
// Task UI Controller
// ==========================================

class TaskUI {
    constructor() {
        this.taskListContainer = null;
        this.addTaskForm = null;
        this.filterButtons = null;
        this.currentFilter = 'all';
    }

    /**
     * Khởi tạo UI
     */
    init() {
        this.taskListContainer = document.getElementById('taskList');
        this.addTaskForm = document.getElementById('addTaskForm');
        this.filterButtons = document.querySelectorAll('.filter-btn');

        if (!this.taskListContainer) {
            console.error('Task list container not found');
            return;
        }

        // Setup event listeners
        this.setupEventListeners();

        // Load tasks
        this.loadTasks();

        // Subscribe to task changes
        taskManager.addListener((tasks) => {
            this.renderTasks(tasks);
        });

        // Setup realtime subscription
        taskManager.subscribeToChanges();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Form submit
        if (this.addTaskForm) {
            this.addTaskForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleAddTask();
            });
        }

        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentFilter = btn.dataset.filter;
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadTasks();
            });
        });
    }

    /**
     * Load tasks từ database
     */
    async loadTasks() {
        try {
            this.showLoading();

            let tasks;
            if (this.currentFilter === 'all') {
                tasks = await taskManager.getAllTasks();
            } else {
                tasks = await taskManager.getTasksByStatus(this.currentFilter);
            }

            this.renderTasks(tasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.showError('Không thể tải danh sách tasks. Vui lòng thử lại.');
        }
    }

    /**
     * Hiển thị tasks
     */
    renderTasks(tasks) {
        if (!this.taskListContainer) return;

        this.hideLoading();

        if (!tasks || tasks.length === 0) {
            this.taskListContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tasks"></i>
                    <p>Chưa có task nào</p>
                </div>
            `;
            return;
        }

        this.taskListContainer.innerHTML = tasks.map(task => this.renderTaskCard(task)).join('');

        // Attach event listeners to task cards
        this.attachTaskEventListeners();
    }

    /**
     * Render một task card
     */
    renderTaskCard(task) {
        const priorityClass = `priority-${task.priority || 'medium'}`;
        const statusClass = `status-${task.status || 'pending'}`;
        const statusText = this.getStatusText(task.status);
        const priorityText = this.getPriorityText(task.priority);

        const dueDate = task.due_date
            ? new Date(task.due_date).toLocaleDateString('vi-VN')
            : '';

        return `
            <div class="task-card ${statusClass} ${priorityClass}" data-task-id="${task.id}">
                <div class="task-header">
                    <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
                    <div class="task-actions">
                        <button class="btn-icon edit-task" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-task" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>

                ${task.description ? `
                    <p class="task-description">${this.escapeHtml(task.description)}</p>
                ` : ''}

                <div class="task-meta">
                    <span class="task-status">
                        <i class="fas fa-circle"></i>
                        ${statusText}
                    </span>
                    <span class="task-priority">
                        <i class="fas fa-flag"></i>
                        ${priorityText}
                    </span>
                    ${dueDate ? `
                        <span class="task-due-date">
                            <i class="fas fa-calendar"></i>
                            ${dueDate}
                        </span>
                    ` : ''}
                </div>

                <div class="task-footer">
                    <select class="status-select" data-task-id="${task.id}">
                        <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
                        <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>Đang làm</option>
                        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Hoàn thành</option>
                        <option value="cancelled" ${task.status === 'cancelled' ? 'selected' : ''}>Hủy</option>
                    </select>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners cho task cards
     */
    attachTaskEventListeners() {
        // Edit buttons
        document.querySelectorAll('.edit-task').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.task-card');
                const taskId = card.dataset.taskId;
                this.handleEditTask(taskId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-task').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.task-card');
                const taskId = card.dataset.taskId;
                this.handleDeleteTask(taskId);
            });
        });

        // Status selects
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', async (e) => {
                const taskId = e.target.dataset.taskId;
                const newStatus = e.target.value;
                await this.handleStatusChange(taskId, newStatus);
            });
        });
    }

    /**
     * Xử lý thêm task mới
     */
    async handleAddTask() {
        const formData = new FormData(this.addTaskForm);
        const taskData = {
            title: formData.get('title'),
            description: formData.get('description'),
            status: formData.get('status') || 'pending',
            priority: formData.get('priority') || 'medium',
            due_date: formData.get('due_date') || null
        };

        if (!taskData.title || taskData.title.trim() === '') {
            this.showError('Vui lòng nhập tiêu đề task');
            return;
        }

        try {
            await taskManager.createTask(taskData);
            this.addTaskForm.reset();
            this.showSuccess('Đã thêm task thành công!');
        } catch (error) {
            console.error('Error adding task:', error);
            this.showError('Không thể thêm task. Vui lòng thử lại.');
        }
    }

    /**
     * Xử lý chỉnh sửa task
     */
    async handleEditTask(taskId) {
        try {
            const task = await taskManager.getTaskById(taskId);

            // Điền dữ liệu vào form
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description || '';
            document.getElementById('taskStatus').value = task.status;
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskDueDate').value = task.due_date || '';

            // Thay đổi form thành edit mode
            this.addTaskForm.dataset.editMode = 'true';
            this.addTaskForm.dataset.editTaskId = taskId;

            const submitBtn = this.addTaskForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Cập nhật Task';

            // Scroll to form
            this.addTaskForm.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error loading task for edit:', error);
            this.showError('Không thể tải thông tin task.');
        }
    }

    /**
     * Xử lý xóa task
     */
    async handleDeleteTask(taskId) {
        if (!confirm('Bạn có chắc muốn xóa task này?')) {
            return;
        }

        try {
            await taskManager.deleteTask(taskId);
            this.showSuccess('Đã xóa task thành công!');
        } catch (error) {
            console.error('Error deleting task:', error);
            this.showError('Không thể xóa task. Vui lòng thử lại.');
        }
    }

    /**
     * Xử lý thay đổi status
     */
    async handleStatusChange(taskId, newStatus) {
        try {
            await taskManager.updateTask(taskId, { status: newStatus });
            this.showSuccess('Đã cập nhật trạng thái!');
        } catch (error) {
            console.error('Error updating status:', error);
            this.showError('Không thể cập nhật trạng thái.');
            // Reload để reset về trạng thái cũ
            this.loadTasks();
        }
    }

    /**
     * Utility methods
     */
    getStatusText(status) {
        const statusMap = {
            'pending': 'Chờ xử lý',
            'in_progress': 'Đang làm',
            'completed': 'Hoàn thành',
            'cancelled': 'Đã hủy'
        };
        return statusMap[status] || status;
    }

    getPriorityText(priority) {
        const priorityMap = {
            'low': 'Thấp',
            'medium': 'Trung bình',
            'high': 'Cao'
        };
        return priorityMap[priority] || priority;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading() {
        if (this.taskListContainer) {
            this.taskListContainer.innerHTML = `
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Đang tải...</p>
                </div>
            `;
        }
    }

    hideLoading() {
        // Loading will be replaced by renderTasks
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Tạo notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Hiện notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Ẩn và xóa notification sau 3 giây
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Export singleton instance
const taskUI = new TaskUI();
