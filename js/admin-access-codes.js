/**
 * Admin Access Codes Management
 * Handle CRUD operations for premium access codes using Supabase
 */

const accessCodeManager = {
    tableName: 'access_codes',

    /**
     * Initialize the manager
     */
    async init() {
        if (window.supabaseInitPromise) {
            await window.supabaseInitPromise;
        }
        this.loadCodes();
    },

    /**
     * Load all codes from database
     */
    async loadCodes() {
        const tableBody = document.getElementById('codeTableBody');

        try {
            const client = supabaseClient.getClient();
            const { data, error } = await client
                .from(this.tableName)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!data || data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #666;">Chưa có mã truy cập nào</td></tr>';
                return;
            }

            tableBody.innerHTML = data.map(item => `
                <tr>
                    <td><span class="code-badge">${item.code}</span></td>
                    <td>${item.description || '<span style="color: #999;">Không có mô tả</span>'}</td>
                    <td>
                        <span class="status-badge ${item.is_active ? 'status-active' : 'status-inactive'}">
                            ${item.is_active ? 'Đang hoạt động' : 'Đã khóa'}
                        </span>
                    </td>
                    <td>${new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                        <div class="action-btns">
                            <button class="btn-icon btn-toggle" onclick="accessCodeManager.toggleStatus('${item.id}', ${item.is_active})" title="Đổi trạng thái">
                                <i class="fas ${item.is_active ? 'fa-lock' : 'fa-lock-open'}"></i>
                            </button>
                            <button class="btn-icon btn-delete" onclick="accessCodeManager.deleteCode('${item.id}', '${item.code}')" title="Xóa mã">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Error loading codes:', error);
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #dc3545;">Lỗi: ${error.message}</td></tr>`;
        }
    },

    /**
     * Add new access code
     */
    async createCode(code, description) {
        try {
            const client = supabaseClient.getClient();
            const { error } = await client
                .from(this.tableName)
                .insert([{
                    code: code.trim().toUpperCase(),
                    description: description.trim()
                }]);

            if (error) {
                if (error.code === '23505') throw new Error('Mã này đã tồn tại trong hệ thống');
                throw error;
            }

            return { success: true };
        } catch (error) {
            console.error('Error creating code:', error);
            return { success: false, message: error.message };
        }
    },

    /**
     * Toggle active status
     */
    async toggleStatus(id, currentStatus) {
        try {
            const client = supabaseClient.getClient();
            const { error } = await client
                .from(this.tableName)
                .update({ is_active: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            this.loadCodes();
        } catch (error) {
            alert('Lỗi khi đổi trạng thái: ' + error.message);
        }
    },

    /**
     * Delete an access code
     */
    async deleteCode(id, code) {
        if (!confirm(`Bạn có chắc muốn xóa mã [${code}]? Hành động này không thể hoàn tác.`)) {
            return;
        }

        try {
            const client = supabaseClient.getClient();
            const { error } = await client
                .from(this.tableName)
                .delete()
                .eq('id', id);

            if (error) throw error;
            this.loadCodes();
        } catch (error) {
            alert('Lỗi khi xóa mã: ' + error.message);
        }
    }
};

// Global functions for UI elements
function openCreateModal() {
    document.getElementById('codeModal').classList.add('active');
    document.getElementById('codeForm').reset();
    document.getElementById('inputCode').focus();
}

function closeModal() {
    document.getElementById('codeModal').classList.remove('active');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    accessCodeManager.init();

    const codeForm = document.getElementById('codeForm');
    if (codeForm) {
        codeForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btnSave = document.getElementById('btnSave');
            const codeInput = document.getElementById('inputCode');
            const descInput = document.getElementById('inputDesc');

            const originalText = btnSave.innerHTML;
            btnSave.disabled = true;
            btnSave.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';

            const result = await accessCodeManager.createCode(codeInput.value, descInput.value);

            btnSave.disabled = false;
            btnSave.innerHTML = originalText;

            if (result.success) {
                closeModal();
                accessCodeManager.loadCodes();
            } else {
                alert(result.message);
            }
        });
    }

    // Close modal on outside click
    window.onclick = function (event) {
        const modal = document.getElementById('codeModal');
        if (event.target == modal) {
            closeModal();
        }
    };
});
