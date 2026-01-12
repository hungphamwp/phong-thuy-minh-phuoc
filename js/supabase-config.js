// Biến toàn cục để các script khác có thể await việc khởi tạo Supabase
window.supabaseInitPromise = (async () => {
    if (typeof supabaseClient === 'undefined') {
        return false;
    }

    // Ưu tiên 1: Lấy từ config cứng trong supabase-client.js
    let url = supabaseClient.CONFIG?.URL;
    let key = supabaseClient.CONFIG?.KEY;

    // Ưu tiên 2: Nếu không có config cứng, lấy từ localStorage (dành cho Admin thiết lập)
    if (!url || !key) {
        url = localStorage.getItem('supabaseUrl');
        key = localStorage.getItem('supabaseKey');
    }

    if (url && key) {
        if (!supabaseClient.isInitialized()) {
            console.log('Khởi tạo Supabase...');
            const success = await supabaseClient.initialize(url, key);

            if (success) {
                if (typeof blogManager !== 'undefined') {
                    await blogManager.checkSupabaseConnection();
                }
                if (typeof userAuth !== 'undefined') {
                    await userAuth.checkSupabaseConnection();
                }
                return true;
            }
        } else {
            return true;
        }
    } else {
        console.log('Supabase chưa được cấu hình. Sử dụng dữ liệu local.');
    }
    return false;
})();

document.addEventListener('DOMContentLoaded', () => {
    // Kích hoạt promise khi DOM sẵn sàng
    window.supabaseInitPromise.then(connected => {
        if (connected) {
            console.log('Supabase đã sẵn sàng phục vụ website.');
        }
    });
});
