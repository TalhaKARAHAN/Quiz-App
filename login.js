document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Email ve şifre değerlerini alalım
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    // Mock kullanıcılar
    const mockUsers = [
        { email: 'student@example.com', password: '123456', role: 'student' },
        { email: 'teacher@example.com', password: '123456', role: 'teacher' }
    ];

    // Kullanıcıyı bulalım
    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (user) {
        if (user.role === 'student') {
            window.location.href = 'student_panel.html';
        } else if (user.role === 'teacher') {
            window.location.href = 'teacher_panel.html';
        }
    } else {
        alert('Invalid email or password');
    }
});
