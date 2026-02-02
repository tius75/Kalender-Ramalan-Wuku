export const USERS_DATABASE = {
    'user1': 'pass1',
    'user2': 'rahasia2024', // hasil deobfuscate
    'user3': 'wetonJawa',
    'admin': 'superadmin123'
};

export function login(username, password) {
    if (USERS_DATABASE[username] === password) {
        localStorage.setItem('currentUser', username);
        return { success: true, user: username };
    }
    return { success: false, message: "Username atau Password salah!" };
}

export function logout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}


