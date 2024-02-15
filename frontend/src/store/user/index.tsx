import {create} from "zustand";
import {persist} from "zustand/middleware";
import AuthService from "../../api/authService.ts";

export const useUserStore = create<UserState>()(
    persist(
        // @ts-ignore
        set => ({
            user: null,
            accessToken: '',
            language: 'us',
            curriculum_language: '',
        }),
        {
            name: 'user-storage',
        },
    ),
);

export const getLanguage = () => {
    return useUserStore.getState().language
}

export const SetLanguage = (selectedLanguage: string) => {
    useUserStore.setState({language: selectedLanguage})
}

export const SetCurriculumLanguage = (selectedLanguage: string) => {
    useUserStore.setState({curriculum_language: selectedLanguage})
}

export const LoginWithEmail = async (email: string, password: string): Promise<Verify> => {
    const result = {
        isVerified: false,
        accessToken: '',
        userData: {
            id: '',
            email: '',
            name: '',
            role: '',
            schoolId: '',
            profile_image: '',
        }
    }
    try {
        const {status, data: {userData, isVerified, accessToken}} = await AuthService.login(email, password)
        if (status !== 201) {
            console.log(`ERROR STATUS ${status}`)
        }

        if (isVerified) {
            useUserStore.setState({user: userData, accessToken: accessToken})
        }

        result.accessToken = accessToken
        result.isVerified = isVerified
        result.userData = userData
    } catch (error: any) {
        if (!error.response) {
            throw new Error('Something went wrong, try later')
        } else if (error.response.status === 400 || error.response.status === 401) {
            if (error.response.data.message[0] === 'Your account is not verified') {
                throw new Error('Your account is not verified')
            } else {
                throw new Error('Invalid credentials')
            }
        } else if (error.response.status === 500) {
            throw new Error('Something went wrong, try later')
        }
    }
    return result
}

export const Logout = () => {
    useUserStore.setState({user: null, accessToken: ''})
}