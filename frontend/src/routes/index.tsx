import {Route, Routes} from "react-router-dom";
import {Login} from "../pages/login";
import DashboardLayout from "../layouts/dashboard-layout";
import {HomePage} from "../pages/home";
import ProtectedRoute from "../components/ProtectedRoute.tsx";
import TeachersPage from "../pages/teachers";
import StudentsPage from "../pages/students/students.tsx";
import ClassroomsPage from "../pages/classrooms";
import CoursesPage from "../pages/courses";
import CurriculumsPage from "../pages/curriculums";
import VerifyPage from "../pages/login/verify";
import SchoolsPage from "../pages/schools";
import ManagersPage from "../pages/managers";
import ManagerVerificationPage from "../pages/managerVerification";
import AdminStudentsPage from "../pages/students/adminStudents.tsx";
import {ErrorPage} from "../pages/errors";
import '@mantine/notifications/styles.css';
import {Notifications} from "@mantine/notifications";

export default function Root() {
    return (
        <>
            <Notifications position={'top-center'}/>
            <Routes>
                <Route path={'/verify/:verificationCode'} element={<VerifyPage/>}/>
                <Route path={'/login' } element={<Login/>}/>
                <Route path={'/'} element={(
                    <ProtectedRoute roles={['TEACHER', 'SCHOOL_ADMIN', 'ADMIN']}>
                        <DashboardLayout/>
                    </ProtectedRoute>
                )}>
                    <Route path={'/home'} element={<HomePage/>}/>
                    <Route path={'/students'} element={<StudentsPage/>}/>
                    <Route path={'/classrooms'} element={<ClassroomsPage/>}/>
                    <Route path={'/courses'} element={<CoursesPage/>}/>
                    <Route path={'/curriculums'} element={<CurriculumsPage/>}/>
                    {/*<Route path={'/homeworks'} element={<HomeworksPage/>}/>*/}
                </Route>
                <Route path={'/'} element={(
                    <ProtectedRoute roles={['SCHOOL_ADMIN', 'ADMIN']}>
                        <DashboardLayout/>
                    </ProtectedRoute>
                )}>
                    <Route path={'/teachers'} element={<TeachersPage/>}/>\
                </Route>
                <Route path={'/'} element={(
                    <ProtectedRoute roles={['ADMIN']}>
                        <DashboardLayout/>
                    </ProtectedRoute>
                )}>
                    <Route path={'/schools'} element={<SchoolsPage/>}/>
                    <Route path={'/admin_students'} element={<AdminStudentsPage/>}/>
                    <Route path={'/managers'} element={<ManagersPage/>}/>
                    <Route path={'/manager_verifications'} element={<ManagerVerificationPage/>}/>
                </Route>
                <Route path={'*'} element={<ErrorPage errorCode={404} errorTitle={"Nothing to see here"} errorDescription={"Page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to another URL. If you think this is an error contact support."} buttonLink={"/"} buttonText={"Go back home"}/>}/>
            </Routes>
        </>
    )
}