interface User {
    name: string;
    age: number;
    email?: string; // Optional property
}

interface LoginPayload {
    username: string;
    password: string;
}

export {LoginPayload};


