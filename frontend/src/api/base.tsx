import axios from "axios";
import {Logout} from "../store/user";
import {modals} from "@mantine/modals";
import {Text} from "@mantine/core";

export const api = {
    school_admin: {
        teachers: {
            get: 'manager/get'
        }
    },
    manager: {
        change_pass: 'auth/manager/change_pass',
        login: 'auth/manager/sign_in',
        invite: 'manager/invite',
        create_account: 'manager/create',
        get: 'manager/get',
        check: 'manager/check',
        complete: 'manager/complete'
    },
    classroom: {
        get: 'classroom',
        create: 'classroom',
        delete: 'classroom/delete'
    },
    student: {
        get: 'student',
        create_many: 'student/create/many',
        change_pass: 'auth/student/change_pass',
    },
    schools: {
        get: 'school',
        create: 'school/create'
    },
    admin: {
        managers: {
            delete: 'manager/delete',
            get: 'manager/get_all',
            verification: {
                get: 'manager/verification/get',
                delete: 'manager/verifications/delete'
            }
        },
        students: {
            get: 'student/get/all',
            delete: 'student/delete'
        },
        curriculums: {
            test: '/classroom/test',
            lesson: {
                create: '/lesson',
                update: '/lesson/update',
                get: '/lesson',
                delete: '/lesson/delete'
            }
        }
    }
}

export const apiService = axios.create({
    // baseURL: 'http://localhost:3000',
    baseURL: 'https://api.v2.coditeach.kz',
    withCredentials: true,
});

apiService.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user-storage')!)
    let token = ""
    if (user) {
        token = user.state.accessToken
    }
    config.headers.Authorization = `Bearer ${token}`
    return config
})

apiService.interceptors.response.use((config) => {
    return config
}, (error) => {
    console.log(error)
    if (!error.request.responseURL.includes('sign_in') && error.response.status === 401) {
        console.log('UNAUTHORIZED')
        modals.open({
            title: <Text fw={600}>Session timeout</Text>,
            children: (
                <>
                    <Text>Oops! Your session has timed out. For your safety, you will be automatically logged out in 5 seconds. Please log back in to continue where you left off.</Text>
                </>
            )
        })
        setTimeout(()=>{
            Logout()
        }, 5000)
    }
    return Promise.reject(error)
})

