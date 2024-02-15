type User = {
    id: string;
    email: string;
    name: string;
    role: string;
    schoolId: string;
    profile_image: string;
};

type UserState = {
    user: User | null;
    accessToken: string;
    language: string;
    curriculum_language: string;
};

type Verify = {
    isVerified: boolean;
    accessToken: string;
    userData: User
}