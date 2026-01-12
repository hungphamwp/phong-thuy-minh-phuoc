// ==========================================
// Consultation Handler - Form Liên Hệ
// Lưu yêu cầu tư vấn vào Supabase
// ==========================================

class ConsultationHandler {
    constructor() {
        this.useSupabase = false;
        this.LOCAL_KEY = 'minhphuoc_consultations';
    }

    /**
     * Kiểm tra kết nối Supabase
     */
    async checkSupabaseConnection() {
        try {
            if (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized()) {
                this.useSupabase = true;
                console.log('ConsultationHandler: Sử dụng Supabase');
                return true;
            } else {
                console.log('ConsultationHandler: Sử dụng localStorage (Supabase chưa kết nối)');
                return false;
            }
        } catch (error) {
            console.log('ConsultationHandler: Sử dụng localStorage (lỗi kết nối Supabase)');
            return false;
        }
    }

    /**
     * Map service type từ form sang database
     */
    mapServiceType(service) {
        const map = {
            'tuvi': 'tu_vi',
            'ngaytot': 'xem_ngay',
            'phongthuynha': 'phong_thuy',
            'phongthuyvanphong': 'phong_thuy',
            'tuvan': 'other'
        };
        return map[service] || 'other';
    }

    /**
     * Gửi yêu cầu tư vấn
     * @param {Object} formData - Dữ liệu form
     * @returns {Object} - Kết quả { success: boolean, message: string }
     */
    async submitConsultation(formData) {
        // Validate dữ liệu bắt buộc
        if (!formData.name || !formData.phone) {
            return { success: false, message: 'Vui lòng nhập họ tên và số điện thoại!' };
        }

        // Chuẩn bị dữ liệu
        const consultationData = {
            full_name: formData.name,
            email: formData.email || '',
            phone: formData.phone,
            service_type: this.mapServiceType(formData.service),
            subject: this.getSubjectFromService(formData.service),
            message: formData.message || '',
            status: 'pending',
            priority: 'medium',
            created_at: new Date().toISOString()
        };

        // Thử lưu vào Supabase
        if (this.useSupabase || (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized())) {
            try {
                const client = supabaseClient.getClient();

                const { data, error } = await client
                    .from('consultations')
                    .insert([consultationData])
                    .select();

                if (error) {
                    console.error('Lỗi Supabase:', error);
                    // Fallback to localStorage
                    return this.saveToLocalStorage(consultationData);
                }

                console.log('Đã lưu yêu cầu tư vấn:', data);
                return {
                    success: true,
                    message: 'Cảm ơn bạn đã gửi yêu cầu! Chúng tôi sẽ liên hệ lại trong vòng 24 giờ.',
                    data: data[0]
                };
            } catch (error) {
                console.error('Lỗi kết nối Supabase:', error);
                return this.saveToLocalStorage(consultationData);
            }
        }

        // Fallback to localStorage
        return this.saveToLocalStorage(consultationData);
    }

    /**
     * Lưu vào localStorage nếu không kết nối được Supabase
     */
    saveToLocalStorage(data) {
        try {
            const existing = JSON.parse(localStorage.getItem(this.LOCAL_KEY) || '[]');
            data.id = 'local_' + Date.now();
            existing.push(data);
            localStorage.setItem(this.LOCAL_KEY, JSON.stringify(existing));

            console.log('Đã lưu yêu cầu vào localStorage:', data);
            return {
                success: true,
                message: 'Cảm ơn bạn đã gửi yêu cầu! Chúng tôi sẽ liên hệ lại trong vòng 24 giờ.',
                data: data
            };
        } catch (error) {
            console.error('Lỗi lưu localStorage:', error);
            return {
                success: false,
                message: 'Có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua hotline 0888.08.1050'
            };
        }
    }

    /**
     * Tạo subject từ loại dịch vụ
     */
    getSubjectFromService(service) {
        const subjects = {
            'tuvi': 'Yêu cầu Lập Lá Tử Vi',
            'ngaytot': 'Yêu cầu Xem Ngày Tốt Xấu',
            'phongthuynha': 'Yêu cầu Tư Vấn Phong Thủy Nhà Ở',
            'phongthuyvanphong': 'Yêu cầu Tư Vấn Phong Thủy Văn Phòng',
            'tuvan': 'Yêu cầu Tư Vấn Khác'
        };
        return subjects[service] || 'Yêu cầu tư vấn từ website';
    }

    /**
     * Lấy tất cả yêu cầu tư vấn (dành cho admin)
     */
    async getAllConsultations() {
        if (this.useSupabase || (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized())) {
            try {
                const client = supabaseClient.getClient();

                const { data, error } = await client
                    .from('consultations')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                return data || [];
            } catch (error) {
                console.error('Lỗi lấy consultations:', error);
                return [];
            }
        }

        // Fallback to localStorage
        return JSON.parse(localStorage.getItem(this.LOCAL_KEY) || '[]');
    }

    /**
     * Cập nhật trạng thái yêu cầu (dành cho admin)
     */
    async updateConsultationStatus(id, status, response = null) {
        if (this.useSupabase || (typeof supabaseClient !== 'undefined' && supabaseClient.isInitialized())) {
            try {
                const client = supabaseClient.getClient();

                const updateData = { status: status };
                if (response) {
                    updateData.response = response;
                    updateData.responded_at = new Date().toISOString();
                }

                const { data, error } = await client
                    .from('consultations')
                    .update(updateData)
                    .eq('id', id)
                    .select();

                if (error) throw error;
                return { success: true, data: data[0] };
            } catch (error) {
                console.error('Lỗi cập nhật consultation:', error);
                return { success: false, message: error.message };
            }
        }

        return { success: false, message: 'Supabase chưa kết nối' };
    }
}

// Export singleton instance
const consultationHandler = new ConsultationHandler();

// Auto-check Supabase connection when available
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for Supabase to initialize
        setTimeout(() => {
            consultationHandler.checkSupabaseConnection();
        }, 1000);
    });
}
