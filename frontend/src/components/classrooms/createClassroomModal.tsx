import {Alert, Button, LoadingOverlay, Modal, Select, Space, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import ClassroomService from "../../api/classroomService.ts";
import {IconAlertCircle, IconCheck} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";
import TeacherService from "../../api/teacherService.ts";
import {TeachersResponse} from "../../api/models/teachersResponse.ts";
import {useUserStore} from "../../store/user";
import {useTranslation} from "react-i18next";

interface CreateClassroomModalProps {
    opened: boolean,
    setOpened: Function,
    fetchClassrooms: Function
}

export default function CreateClassroomModal({opened, setOpened, fetchClassrooms}: CreateClassroomModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [selectedTeacher, setSelectedTeacher] = useState<string>('')
    const classroomForm = useForm({
        initialValues: {
            title: ''
        }
    })
    const [schoolTeachers, setSchoolTeachers] = useState<TeachersResponse[]>()
    const { user } = useUserStore()
    const { t } = useTranslation()
    useEffect(() => {
        TeacherService.getTeachers().then((res) => {
            setSchoolTeachers(res.data)
        })
    }, [setSchoolTeachers]);

    const sendData = (data: {title: string}) => {
        ClassroomService.createClassroom(data).then(res => {
            if (res.data) {
                notifications.show({
                    id: 'success-create-classroom',
                    withCloseButton: true,
                    autoClose: 2000,
                    title: "Classroom created successfully!",
                    message: '',
                    color: 'green',
                    icon: <IconCheck />,
                    className: 'my-notification-class',
                    loading: false,
                });
                closeModal()
                fetchClassrooms()
            }
            setLoading(false)
            classroomForm.reset()
        }).catch(error => {
            console.log(error)
            setError('Something went wrong, try later.')
        })
    }

    const createClassroom = () => {
        if (user?.role !== 'TEACHER') {
            if (classroomForm.values.title === '' || selectedTeacher === '') {
                setError('Enter all values')
            } else {
                try {
                    setLoading(true)
                    const data = {
                        title: classroomForm.values.title,
                        managerId: selectedTeacher
                    }
                    sendData(data)
                    setSelectedTeacher('')
                } catch (error) {
                    setError('Something went wrong, try later.')
                }
            }
        } else {
            if (classroomForm.values.title === '') {
                setError('Enter all values')
            } else {
                try {
                    setLoading(true)
                    const data = {
                        title: classroomForm.values.title
                    }
                    sendData(data)
                } catch (error) {
                    setError('Something went wrong, try later.')
                }
            }
        }
    }

    const closeModal = () => {
        setOpened(false)
    }

    return (
        <Modal opened={opened} title={<span style={{fontSize: '20px', fontWeight: 'bold'}}>{t('createClassroomModal.title')}</span>} onClose={() => {(closeModal())}} centered>
            <LoadingOverlay visible={loading}/>
            <Alert hidden={!error} icon={<IconAlertCircle/>} title={t('createClassroomModal.errorTitle')} radius={"md"} variant={"outline"} color="red">
                {error}
            </Alert>
            {/*<Space h={20}/>*/}
            <TextInput
                data-autofocus
                placeholder={t('createClassroomModal.classroomTitlePlaceholder')}
                label={t('createClassroomModal.classroomTitleLabel')}
                withAsterisk
                {...classroomForm.getInputProps('title')}
            />
            <Space h={'md'}/>
            {
                user?.role !== 'TEACHER' && (
                    <>
                        <Select
                            label={t('createClassroomModal.selectTeacherLabel')}
                            placeholder={t('createClassroomModal.assignTeacherPlaceholder')}
                            value={selectedTeacher}
                            onChange={(value:string)=>{setSelectedTeacher(value)}}
                            data={schoolTeachers?.map(item => ({label: item.name, value: item.id}))}
                        />
                        <Space h={'md'}/>
                    </>
                )
            }
            <Button onClick={createClassroom} loading={loading} disabled={loading} radius="md" style={{width: '100%'}}>
                {t('createClassroomModal.createClassroomButton')}
            </Button>
            <Space h={'md'}/>
        </Modal>

    )
}