/**
 * User Authentication UI Logic
 * Handles modal display, form submissions, and header updates
 */

const authModalHTML = `
<!-- Login/Register Modal -->
<div id="authModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 10000; align-items: center; justify-content: center; padding: 20px 0;">
    <div style="background: white; border-radius: 20px; width: 90%; max-width: 480px; position: relative; box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3); max-height: calc(100vh - 40px); overflow-y: auto; overflow-x: hidden;">
        <button onclick="closeAuthModal()" style="position: absolute; top: 20px; right: 20px; background: #ffa500; border: none; font-size: 1.3rem; cursor: pointer; color: white; z-index: 100; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-weight: bold;">
            ✕
        </button>

        <!-- Login Form -->
        <div id="loginForm" style="padding: 50px 40px;">
            <h2 style="text-align: center; margin-bottom: 35px; font-size: 2rem; color: #333; font-weight: 700;">ĐĂNG NHẬP</h2>

            <form id="modalLoginForm">
                <div class="form-message" id="modalLoginMessage" style="margin-bottom: 15px; padding: 10px; border-radius: 6px; display: none;"></div>

                <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #666;">
                        <i class="fas fa-envelope" style="color: #e74c3c;"></i>
                        <span style="font-weight: 500;">Email</span>
                    </div>
                    <input type="email" id="modalLoginEmail" required style="width: 100%; padding: 14px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 1rem; box-sizing: border-box;" placeholder="Nhập email của bạn">
                </div>

                <div style="margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #666;">
                        <i class="fas fa-lock" style="color: #e74c3c;"></i>
                        <span style="font-weight: 500;">Mật khẩu</span>
                    </div>
                    <div style="position: relative;">
                        <input type="password" id="modalLoginPassword" required style="width: 100%; padding: 14px; padding-right: 45px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 1rem; box-sizing: border-box;" placeholder="Nhập mật khẩu">
                        <button type="button" onclick="toggleModalPassword('modalLoginPassword')" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #999;">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 0.9rem; color: #666;">
                        <input type="checkbox" style="cursor: pointer;">
                        <span>Ghi nhớ đăng nhập</span>
                    </label>
                    <a href="#" onclick="switchToForgotPassword(); return false;" style="color: #e74c3c; font-size: 0.9rem; text-decoration: none;">Quên mật khẩu?</a>
                </div>

                <button type="submit" style="width: 100%; padding: 15px; background: #e74c3c; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 700; cursor: pointer; margin-bottom: 20px; transition: all 0.3s; box-sizing: border-box;">
                    <i class="fas fa-sign-in-alt"></i> Đăng Nhập
                </button>

                <div style="text-align: center; margin-bottom: 20px; color: #999; font-size: 0.95rem;">Hoặc</div>

                <button type="button" style="width: 100%; padding: 13px; background: white; color: #333; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px; transition: all 0.2s; box-sizing: border-box;">
                    <i class="fab fa-google" style="font-size: 1.2rem; color: #db4437;"></i>
                    ĐĂNG NHẬP VỚI GOOGLE
                </button>

                <button type="button" style="width: 100%; padding: 13px; background: white; color: #333; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 25px; transition: all 0.2s; box-sizing: border-box;">
                    <i class="fab fa-facebook" style="font-size: 1.2rem; color: #1877f2;"></i>
                    ĐĂNG NHẬP VỚI FACEBOOK
                </button>

                <div style="text-align: center; color: #666; font-size: 0.95rem;">
                    Chưa có tài khoản?
                    <a href="#" onclick="switchToRegister(); return false;" style="color: #ffa500; font-weight: 700; text-decoration: none;">ĐĂNG KÝ NGAY</a>
                </div>

                <div style="text-align: center; margin-top: 12px;">
                    <a href="#" onclick="switchToForgotPassword(); return false;" style="color: #ffa500; font-size: 0.9rem; text-decoration: none; font-weight: 600;">QUÊN MẬT KHẨU?</a>
                </div>
            </form>
        </div>

        <!-- Register Form -->
        <div id="registerForm" style="padding: 50px 40px 30px 40px; display: none;">
            <h2 style="text-align: center; margin-bottom: 35px; font-size: 2rem; color: #333; font-weight: 700;">ĐĂNG KÝ</h2>

            <form id="modalRegisterForm">
                <div class="form-message" id="modalRegisterMessage" style="margin-bottom: 15px; padding: 10px; border-radius: 6px; display: none;"></div>

                <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #666;">
                        <i class="fas fa-user" style="color: #e74c3c;"></i>
                        <span style="font-weight: 500;">Họ tên</span>
                    </div>
                    <input type="text" id="modalRegisterName" required style="width: 100%; padding: 14px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 1rem; box-sizing: border-box;" placeholder="Nhập họ và tên">
                </div>

                <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #666;">
                        <i class="fas fa-envelope" style="color: #e74c3c;"></i>
                        <span style="font-weight: 500;">Email</span>
                    </div>
                    <input type="email" id="modalRegisterEmail" required style="width: 100%; padding: 14px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 1rem; box-sizing: border-box;" placeholder="Nhập email của bạn">
                </div>

                <div style="margin-bottom: 25px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #666;">
                        <i class="fas fa-lock" style="color: #e74c3c;"></i>
                        <span style="font-weight: 500;">Mật khẩu</span>
                    </div>
                    <div style="position: relative;">
                        <input type="password" id="modalRegisterPassword" required minlength="6" style="width: 100%; padding: 14px; padding-right: 45px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 1rem; box-sizing: border-box;" placeholder="Nhập mật khẩu">
                        <button type="button" onclick="toggleModalPassword('modalRegisterPassword')" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #999;">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>

                <button type="submit" style="width: 100%; padding: 15px; background: #e74c3c; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 700; cursor: pointer; margin-bottom: 20px; transition: all 0.3s; box-sizing: border-box;">
                    <i class="fas fa-user-plus"></i> Đăng Ký
                </button>

                <div style="text-align: center; margin-bottom: 20px; color: #999; font-size: 0.95rem;">Hoặc</div>

                <button type="button" style="width: 100%; padding: 13px; background: white; color: #333; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px; transition: all 0.2s; box-sizing: border-box;">
                    <i class="fab fa-google" style="font-size: 1.2rem; color: #db4437;"></i>
                    ĐĂNG KÝ VỚI GOOGLE
                </button>

                <button type="button" style="width: 100%; padding: 13px; background: white; color: #333; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 25px; transition: all 0.2s; box-sizing: border-box;">
                    <i class="fab fa-facebook" style="font-size: 1.2rem; color: #1877f2;"></i>
                    ĐĂNG KÝ VỚI FACEBOOK
                </button>

                <div style="text-align: center; color: #666; font-size: 0.95rem;">
                    Đã có tài khoản?
                    <a href="#" onclick="switchToLogin(); return false;" style="color: #ffa500; font-weight: 700; text-decoration: none;">ĐĂNG NHẬP</a>
                </div>
            </form>
        </div>

        <!-- Forgot Password Form -->
        <div id="forgotPasswordForm" style="padding: 50px 40px 30px 40px; display: none;">
            <h2 style="text-align: center; margin-bottom: 20px; font-size: 2rem; color: #333; font-weight: 700;">QUÊN MẬT KHẨU</h2>
            <p style="text-align: center; color: #666; margin-bottom: 30px; font-size: 0.9rem;">Nhập email của bạn, chúng tôi sẽ gửi mật khẩu tạm thời về email</p>

            <form id="modalForgotPasswordForm">
                <div class="form-message" id="modalForgotPasswordMessage" style="margin-bottom: 15px; padding: 10px; border-radius: 6px; display: none;"></div>

                <div style="margin-bottom: 25px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #666;">
                        <i class="fas fa-envelope" style="color: #e74c3c;"></i>
                        <span style="font-weight: 500;">Email đã đăng ký</span>
                    </div>
                    <input type="email" id="modalForgotPasswordEmail" required style="width: 100%; padding: 14px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 1rem; box-sizing: border-box;" placeholder="Nhập email của bạn">
                </div>

                <button type="submit" style="width: 100%; padding: 15px; background: #e74c3c; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 700; cursor: pointer; margin-bottom: 20px; transition: all 0.3s; box-sizing: border-box;">
                    <i class="fas fa-paper-plane"></i> Gửi Mật Khẩu Mới
                </button>

                <div style="text-align: center; color: #666; font-size: 0.95rem;">
                    Nhớ mật khẩu?
                    <a href="#" onclick="switchToLogin(); return false;" style="color: #ffa500; font-weight: 700; text-decoration: none;">ĐĂNG NHẬP</a>
                </div>
            </form>
        </div>
    </div>
</div>
`;

// Inject Modal into Body
function injectAuthModal() {
    if (!document.getElementById('authModal')) {
        const div = document.createElement('div');
        div.innerHTML = authModalHTML;
        document.body.appendChild(div.firstElementChild);
    }
}

// Global function to handle user logout from header
function handleUserLogoutGlobal() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        userAuth.logout();
        window.location.reload();
    }
}

// Check and update header based on login status
function updateHeaderAuthButtons() {
    const guestButtons = document.getElementById('guestButtons');
    const userButtons = document.getElementById('userButtons');
    const userNameDisplay = document.getElementById('userNameDisplay');

    // Also try to find mobile menu button if exists
    const mobileAuthLink = document.querySelector('.mobile-nav-list .btn-contact-mobile');

    if (userAuth.isLoggedIn()) {
        const session = userAuth.getSession();

        // Update Desktop Header
        if (guestButtons) guestButtons.style.display = 'none';
        if (userButtons) {
            userButtons.style.display = 'flex';
            if (userNameDisplay && session) {
                userNameDisplay.textContent = session.fullName || session.name || 'Người dùng';
            }
        }

        // Setup dropdown toggle
        const dropdownBtn = document.getElementById('userDropdownBtn');
        const dropdownMenu = document.getElementById('userDropdownMenu');

        if (dropdownBtn && dropdownMenu) {
            dropdownBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
            });

            document.addEventListener('click', function () {
                dropdownMenu.style.display = 'none';
            });

            // Hover effects for dropdown items
            dropdownMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('mouseenter', function () {
                    this.style.background = '#f5f5f5';
                });
                link.addEventListener('mouseleave', function () {
                    this.style.background = 'transparent';
                });
            });
        }

        // Update Mobile Menu
        if (mobileAuthLink) {
            mobileAuthLink.innerHTML = `<i class="fas fa-sign-out-alt"></i> Đăng Xuất (${session.fullName || session.name})`;
            mobileAuthLink.href = "#";
            mobileAuthLink.onclick = function (e) {
                e.preventDefault();
                handleUserLogoutGlobal();
            };
        }
    } else {
        // Update Desktop Header
        if (guestButtons) guestButtons.style.display = 'flex';
        if (userButtons) userButtons.style.display = 'none';

        // Update Mobile Menu
        if (mobileAuthLink) {
            mobileAuthLink.innerHTML = '<i class="fas fa-user-circle"></i> Đăng Nhập';
            mobileAuthLink.href = "#";
            mobileAuthLink.onclick = function (e) {
                e.preventDefault();
                showLoginModal();
            };
        }
    }
}

// Modal Authentication Functions
function showLoginModal() {
    const modal = document.getElementById('authModal');
    const loginDiv = document.querySelector('#authModal #loginForm');
    const registerDiv = document.querySelector('#authModal #registerForm');

    if (modal) modal.style.display = 'flex';
    if (loginDiv) loginDiv.style.display = 'block';
    if (registerDiv) registerDiv.style.display = 'none';
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    // Clear form messages
    const loginMsg = document.getElementById('modalLoginMessage');
    const registerMsg = document.getElementById('modalRegisterMessage');
    if (loginMsg) loginMsg.textContent = '';
    if (registerMsg) registerMsg.textContent = '';
}

function switchToRegister() {
    const loginDiv = document.querySelector('#authModal #loginForm');
    const registerDiv = document.querySelector('#authModal #registerForm');
    if (loginDiv) loginDiv.style.display = 'none';
    if (registerDiv) registerDiv.style.display = 'block';
}

function switchToLogin() {
    const loginDiv = document.querySelector('#authModal #loginForm');
    const registerDiv = document.querySelector('#authModal #registerForm');
    const forgotDiv = document.querySelector('#authModal #forgotPasswordForm');
    if (registerDiv) registerDiv.style.display = 'none';
    if (forgotDiv) forgotDiv.style.display = 'none';
    if (loginDiv) loginDiv.style.display = 'block';
}

function switchToForgotPassword() {
    const loginDiv = document.querySelector('#authModal #loginForm');
    const registerDiv = document.querySelector('#authModal #registerForm');
    const forgotDiv = document.querySelector('#authModal #forgotPasswordForm');
    if (loginDiv) loginDiv.style.display = 'none';
    if (registerDiv) registerDiv.style.display = 'none';
    if (forgotDiv) forgotDiv.style.display = 'block';
}

function toggleModalPassword(inputId) {
    const input = document.getElementById(inputId);
    const button = event.target.closest('button');
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Generate random password
function generateRandomPassword(length = 8) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

// Google Login Handler
function handleGoogleLogin() {
    alert('Tính năng đăng nhập Google sẽ được tích hợp sớm!\n\nGoogle OAuth đang được cấu hình...');
}

// Facebook Login Handler
function handleFacebookLogin() {
    alert('Tính năng đăng nhập Facebook sẽ được tích hợp sớm!\n\nFacebook Login đang được cấu hình...');
}

// Initialize everything on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // 1. Inject Modal
    injectAuthModal();

    // 2. Update Header
    updateHeaderAuthButtons();

    // 3. Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init({
            publicKey: "5pTQVeZr-lDL0FJG3",
        });
    }

    // 4. Add Event Listeners for Modal

    // Close modal when clicking outside
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeAuthModal();
            }
        });
    }

    // Modal Login Form Handler
    const loginForm = document.getElementById('modalLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            const email = document.getElementById('modalLoginEmail').value.trim();
            const password = document.getElementById('modalLoginPassword').value;
            const messageDiv = document.getElementById('modalLoginMessage');

            // Clear previous message
            messageDiv.textContent = '';
            messageDiv.className = 'auth-message';
            messageDiv.style.display = 'none';

            // Validate inputs
            if (!email) {
                messageDiv.textContent = 'Vui lòng nhập email!';
                messageDiv.style.display = 'block';
                messageDiv.style.padding = '10px';
                messageDiv.style.background = '#fee';
                messageDiv.style.color = '#c33';
                messageDiv.style.borderRadius = '6px';
                return;
            }

            if (!password) {
                messageDiv.textContent = 'Vui lòng nhập mật khẩu!';
                messageDiv.style.display = 'block';
                messageDiv.style.padding = '10px';
                messageDiv.style.background = '#fee';
                messageDiv.style.color = '#c33';
                messageDiv.style.borderRadius = '6px';
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';

            // Attempt login
            // Attempt login
            try {
                const result = await userAuth.login(email, password);

                if (result.success) {
                    messageDiv.textContent = 'Đăng nhập thành công! Đang tải lại trang...';
                    messageDiv.style.display = 'block';
                    messageDiv.style.padding = '10px';
                    messageDiv.style.background = '#efe';
                    messageDiv.style.color = '#2a2';
                    messageDiv.style.borderRadius = '6px';

                    // Reload page to update UI
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    // Re-enable button on error
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;

                    messageDiv.textContent = result.message;
                    messageDiv.style.display = 'block';
                    messageDiv.style.padding = '10px';
                    messageDiv.style.background = '#fee';
                    messageDiv.style.color = '#c33';
                    messageDiv.style.borderRadius = '6px';
                }
            } catch (error) {
                console.error('Login error:', error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                messageDiv.textContent = 'Lỗi đăng nhập: ' + error.message;
                messageDiv.style.display = 'block';
                messageDiv.style.background = '#fee';
                messageDiv.style.color = '#c33';
            }
        });
    }

    // Modal Register Form Handler
    const registerForm = document.getElementById('modalRegisterForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            const fullName = document.getElementById('modalRegisterName').value.trim();
            const email = document.getElementById('modalRegisterEmail').value.trim();
            const password = document.getElementById('modalRegisterPassword').value;
            const messageDiv = document.getElementById('modalRegisterMessage');

            // Clear previous message
            messageDiv.textContent = '';
            messageDiv.className = 'auth-message';
            messageDiv.style.display = 'none';

            // Validate inputs
            if (!fullName) {
                messageDiv.textContent = 'Vui lòng nhập họ tên!';
                messageDiv.style.display = 'block';
                messageDiv.style.padding = '10px';
                messageDiv.style.background = '#fee';
                messageDiv.style.color = '#c33';
                messageDiv.style.borderRadius = '6px';
                return;
            }

            if (!email) {
                messageDiv.textContent = 'Vui lòng nhập email!';
                messageDiv.style.display = 'block';
                messageDiv.style.padding = '10px';
                messageDiv.style.background = '#fee';
                messageDiv.style.color = '#c33';
                messageDiv.style.borderRadius = '6px';
                return;
            }

            // Validate password length
            if (password.length < 6) {
                messageDiv.textContent = 'Mật khẩu phải có ít nhất 6 ký tự!';
                messageDiv.style.display = 'block';
                messageDiv.style.padding = '10px';
                messageDiv.style.background = '#fee';
                messageDiv.style.color = '#c33';
                messageDiv.style.borderRadius = '6px';
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';

            // Attempt registration (phone is optional, set to empty string)
            // Attempt registration (phone is optional, set to empty string)
            try {
                const result = await userAuth.register(email, password, fullName, '');

                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                if (result.success) {
                    messageDiv.textContent = 'Đăng ký thành công! Chuyển sang đăng nhập...';
                    messageDiv.style.display = 'block';
                    messageDiv.style.padding = '10px';
                    messageDiv.style.background = '#efe';
                    messageDiv.style.color = '#2a2';
                    messageDiv.style.borderRadius = '6px';

                    // Switch to login form after 1.5 seconds
                    setTimeout(() => {
                        switchToLogin();
                        // Pre-fill email in login form
                        document.getElementById('modalLoginEmail').value = email;
                        messageDiv.style.display = 'none';
                    }, 1500);
                } else {
                    messageDiv.textContent = result.message;
                    messageDiv.style.display = 'block';
                    messageDiv.style.padding = '10px';
                    messageDiv.style.background = '#fee';
                    messageDiv.style.color = '#c33';
                    messageDiv.style.borderRadius = '6px';
                }
            } catch (error) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                messageDiv.textContent = 'Lỗi đăng ký: ' + error.message;
                messageDiv.style.display = 'block';
                messageDiv.style.background = '#fee';
                messageDiv.style.color = '#c33';
            }
        });
    }

    // Modal Forgot Password Form Handler
    const forgotPasswordForm = document.getElementById('modalForgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            const email = document.getElementById('modalForgotPasswordEmail').value.trim();
            const messageDiv = document.getElementById('modalForgotPasswordMessage');

            // Clear previous message
            messageDiv.textContent = '';
            messageDiv.style.display = 'none';

            // Validate email
            if (!email) {
                messageDiv.textContent = 'Vui lòng nhập email!';
                messageDiv.style.display = 'block';
                messageDiv.style.padding = '10px';
                messageDiv.style.background = '#fee';
                messageDiv.style.color = '#c33';
                messageDiv.style.borderRadius = '6px';
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi email...';

            // Check if email exists and send reset email
            const users = JSON.parse(localStorage.getItem('minhphuoc_users') || '[]');
            const userIndex = users.findIndex(u => u.email === email);

            if (userIndex === -1) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                messageDiv.textContent = 'Email không tồn tại trong hệ thống!';
                messageDiv.style.display = 'block';
                messageDiv.style.padding = '10px';
                messageDiv.style.background = '#fee';
                messageDiv.style.color = '#c33';
                messageDiv.style.borderRadius = '6px';
                return;
            }

            // Generate new temporary password
            const newPassword = generateRandomPassword(10);

            // Update password in localStorage
            users[userIndex].password = newPassword;
            localStorage.setItem('minhphuoc_users', JSON.stringify(users));

            // Send email using EmailJS
            const templateParams = {
                to_email: email,
                to_name: users[userIndex].fullName || 'Khách hàng',
                new_password: newPassword,
                website_name: 'Minh Phước Feng Shui'
            };

            emailjs.send('service_h7qkyv5', 'template_lul2c8e', templateParams)
                .then(function (response) {
                    console.log('Email sent successfully!', response.status, response.text);

                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;

                    messageDiv.textContent = 'Mật khẩu mới đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!';
                    messageDiv.style.display = 'block';
                    messageDiv.style.padding = '10px';
                    messageDiv.style.background = '#efe';
                    messageDiv.style.color = '#2a2';
                    messageDiv.style.borderRadius = '6px';

                    // Clear form
                    document.getElementById('modalForgotPasswordEmail').value = '';

                    // Show success message for 3 seconds then switch to login
                    setTimeout(() => {
                        switchToLogin();
                        document.getElementById('modalLoginEmail').value = email;
                        messageDiv.style.display = 'none';
                    }, 3000);
                }, function (error) {
                    console.error('Email send failed:', error);

                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;

                    messageDiv.textContent = 'Lỗi khi gửi email. Vui lòng thử lại sau! (Lỗi: ' + error.text + ')';
                    messageDiv.style.display = 'block';
                    messageDiv.style.padding = '10px';
                    messageDiv.style.background = '#fee';
                    messageDiv.style.color = '#c33';
                    messageDiv.style.borderRadius = '6px';
                });
        });
    }

    // Social Login Buttons
    const googleButtons = document.querySelectorAll('#authModal button:not([type="submit"]):not([type="button"][onclick])');
    googleButtons.forEach(button => {
        if (button.textContent.includes('GOOGLE')) {
            button.addEventListener('click', handleGoogleLogin);
        } else if (button.textContent.includes('FACEBOOK')) {
            button.addEventListener('click', handleFacebookLogin);
        }
    });

    // Handle premium link hover effects
    const premiumLink = document.querySelector('a[href="tim-ngay-tot-premium.html"]');
    if (premiumLink) {
        premiumLink.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.6)';
        });
        premiumLink.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.4)';
        });
    }
});
