// ==========================================
// Task Manager với Supabase
// ==========================================

class TaskManager {
    constructor() {
        this.tasks = [];
        this.listeners = [];
    }

    /**
     * Lấy tất cả tasks từ Supabase
     */
    async getAllTasks() {
        try {
            const client = supabaseClient.getClient();

            const { data, error } = await client
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching tasks:', error);
                throw error;
            }

            this.tasks = data || [];
            this.notifyListeners();
            return this.tasks;
        } catch (error) {
            console.error('Error in getAllTasks:', error);
            throw error;
        }
    }

    /**
     * Lấy task theo ID
     */
    async getTaskById(id) {
        try {
            const client = supabaseClient.getClient();

            const { data, error } = await client
                .from('tasks')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching task:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error in getTaskById:', error);
            throw error;
        }
    }

    /**
     * Tạo task mới
     * @param {Object} taskData - Dữ liệu task { title, description, status, priority, due_date }
     */
    async createTask(taskData) {
        try {
            const client = supabaseClient.getClient();

            const newTask = {
                title: taskData.title,
                description: taskData.description || '',
                status: taskData.status || 'pending',
                priority: taskData.priority || 'medium',
                due_date: taskData.due_date || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data, error } = await client
                .from('tasks')
                .insert([newTask])
                .select();

            if (error) {
                console.error('Error creating task:', error);
                throw error;
            }

            // Thêm vào danh sách local
            if (data && data.length > 0) {
                this.tasks.unshift(data[0]);
                this.notifyListeners();
            }

            return data[0];
        } catch (error) {
            console.error('Error in createTask:', error);
            throw error;
        }
    }

    /**
     * Cập nhật task
     * @param {string} id - ID của task
     * @param {Object} updates - Dữ liệu cần cập nhật
     */
    async updateTask(id, updates) {
        try {
            const client = supabaseClient.getClient();

            const updateData = {
                ...updates,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await client
                .from('tasks')
                .update(updateData)
                .eq('id', id)
                .select();

            if (error) {
                console.error('Error updating task:', error);
                throw error;
            }

            // Cập nhật trong danh sách local
            const index = this.tasks.findIndex(t => t.id === id);
            if (index !== -1 && data && data.length > 0) {
                this.tasks[index] = data[0];
                this.notifyListeners();
            }

            return data[0];
        } catch (error) {
            console.error('Error in updateTask:', error);
            throw error;
        }
    }

    /**
     * Xóa task
     * @param {string} id - ID của task
     */
    async deleteTask(id) {
        try {
            const client = supabaseClient.getClient();

            const { error } = await client
                .from('tasks')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting task:', error);
                throw error;
            }

            // Xóa khỏi danh sách local
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.notifyListeners();

            return true;
        } catch (error) {
            console.error('Error in deleteTask:', error);
            throw error;
        }
    }

    /**
     * Lọc tasks theo status
     */
    async getTasksByStatus(status) {
        try {
            const client = supabaseClient.getClient();

            const { data, error } = await client
                .from('tasks')
                .select('*')
                .eq('status', status)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching tasks by status:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Error in getTasksByStatus:', error);
            throw error;
        }
    }

    /**
     * Lọc tasks theo priority
     */
    async getTasksByPriority(priority) {
        try {
            const client = supabaseClient.getClient();

            const { data, error } = await client
                .from('tasks')
                .select('*')
                .eq('priority', priority)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching tasks by priority:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Error in getTasksByPriority:', error);
            throw error;
        }
    }

    /**
     * Tìm kiếm tasks
     */
    async searchTasks(query) {
        try {
            const client = supabaseClient.getClient();

            const { data, error } = await client
                .from('tasks')
                .select('*')
                .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error searching tasks:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Error in searchTasks:', error);
            throw error;
        }
    }

    /**
     * Đăng ký listener để nhận thông báo khi tasks thay đổi
     */
    addListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * Xóa listener
     */
    removeListener(callback) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    /**
     * Thông báo cho tất cả listeners
     */
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.tasks);
            } catch (error) {
                console.error('Error in listener callback:', error);
            }
        });
    }

    /**
     * Thiết lập realtime subscription để lắng nghe thay đổi
     */
    subscribeToChanges() {
        try {
            const client = supabaseClient.getClient();

            const subscription = client
                .channel('tasks_changes')
                .on('postgres_changes',
                    { event: '*', schema: 'public', table: 'tasks' },
                    (payload) => {
                        console.log('Task changed:', payload);
                        // Reload tasks khi có thay đổi
                        this.getAllTasks();
                    }
                )
                .subscribe();

            return subscription;
        } catch (error) {
            console.error('Error subscribing to changes:', error);
            return null;
        }
    }
}

// Export singleton instance
const taskManager = new TaskManager();
