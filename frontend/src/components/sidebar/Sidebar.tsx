import {useState} from 'react';
import {Code, Group} from '@mantine/core';
import {
    IconBooks, IconHome,
    IconLogout,
    IconSchool,
    IconShieldLock,
    IconUser,
    IconUserCheck,
    IconUsersGroup,
    IconUserShield, IconWorld,
} from '@tabler/icons-react';
import classes from './NavbarSimple.module.css';
import {Logout, useUserStore} from "../../store/user";
import logo from '../../assets/img/coditeach_logo.svg'
import {useNavigate} from "react-router-dom";
import ChangeLanguageModal from "../modals/ChangeLanguageModal.tsx";
import {useTranslation} from "react-i18next";

const school_admin_links = [
    { label: 'home', link: '/home',icon: IconHome},
    { label: 'teachers', link: '/teachers',icon: IconUserCheck},
    { label: 'students', link: '/students',icon: IconSchool },
    { label: 'classrooms', link: '/classrooms',icon: IconUsersGroup },
    // { label: 'Courses', link: '/courses',icon: IconCertificate },
    { label: 'curriculums', link: '/curriculums',icon: IconBooks },
    // { label: 'Homeworks', link: '/homeworks',icon: IconBook },
];

const teacher_links = [
    { label: 'home', link: '/home',icon: IconHome},
    { label: 'classrooms', link: '/classrooms',icon: IconUsersGroup },
    { label: 'curriculums', link: '/curriculums',icon: IconBooks },
]

const admin_links = [
    { label: 'home', link: '/home',icon: IconHome},
    { label: 'managers', link: '/managers',icon: IconUserShield},
    { label: 'managerVerifications', link: '/manager_verifications',icon: IconShieldLock},
    { label: 'schools', link: '/schools',icon: IconUserCheck},
    { label: 'students', link: '/admin_students',icon: IconSchool},
    { label: 'curriculums', link: '/curriculums',icon: IconBooks },
]

export function Sidebar() {
    const [active, setActive] = useState('');
    let links = []
    const { user } = useUserStore()
    const navigate = useNavigate()
    const [showChangeLanguageModal , setShowChangeLanguageModal] = useState(false)
    const { t } = useTranslation()

    if (user?.role === 'SCHOOL_ADMIN') {
        links = school_admin_links
    } else if (user?.role === 'ADMIN') {
        links = admin_links
    } else{
        links = teacher_links
    }

    const renderedLinks = links.map((item: any) => (
        <span
            className={classes.link}
            data-active={item.label === active || undefined}
            key={item.label}
            onClick={() => {
                // event.preventDefault();
                navigate(item.link)
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            {/*@ts-ignore*/}
            <span>{t(`sidebar.${item.label}`)}</span>
        </span>
    ));

    function openChangeLanguageModal() {
        setShowChangeLanguageModal(true)
    }

    return (
        <nav className={classes.navbar}>
            <ChangeLanguageModal opened={showChangeLanguageModal} setOpened={setShowChangeLanguageModal}/>
            <div className={classes.navbarMain}>
                <Group className={classes.header} justify="space-between">
                    <img src={logo} alt={"logotype"} width={150}/>
                    <Code fw={700}>v2.0.1</Code>
                </Group>
                {renderedLinks}
            </div>

            <div className={classes.footer}>
                <span className={classes.link} onClick={openChangeLanguageModal}>
                    <IconWorld className={classes.linkIcon} stroke={1.5} />
                    <span>{t('sidebar.changeLanguage')}</span>
                </span>

                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconUser className={classes.linkIcon} stroke={1.5} />
                    <span>{t('sidebar.profile')}</span>
                </a>

                <span className={classes.link} onClick={Logout}>
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>{t('sidebar.logout')}</span>
                </span>
            </div>
        </nav>
    );
}