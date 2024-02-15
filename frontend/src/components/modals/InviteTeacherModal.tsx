import {useForm} from "@mantine/form";
import {Alert, Box, Button, Modal, Space, TextInput} from "@mantine/core";
import {useState} from "react";
import TeacherService from "../../api/teacherService.ts";
import {useUserStore} from "../../store/user";
import {IconAlertCircle, IconCheck} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";
import {useTranslation} from "react-i18next";

interface InviteTeacherModalProps {
    fetchTeachers: Function,
    opened: boolean,
    setOpened: Function
}

export default function InviteTeacherModal({opened, setOpened, fetchTeachers}: InviteTeacherModalProps) {
    const inviteTeacherForm = useForm({
        initialValues: {
            email: '',
            name: '',
            surname: '',
        }
    })
    const { t } = useTranslation()
    const [errorMsg, setErrorMsg] = useState('')
    const { user } = useUserStore()
    const [loading, setLoading] = useState(false)
    const sendInvite = async () => {
        if (inviteTeacherForm.values.email.length === 0 || inviteTeacherForm.values.name.length === 0) {
            inviteTeacherForm.setErrors({
                email: inviteTeacherForm.values.email.length === 0 ? 'Enter the data' : '',
                name: inviteTeacherForm.values.name.length === 0 ? 'Enter the data' : '',
                surname: inviteTeacherForm.values.surname.length === 0 ? 'Enter the data' : ''
            })
        } else {
            try {
                const inviteTeacherData = {
                    name: `${inviteTeacherForm.values.name} ${inviteTeacherForm.values.surname}`,
                    email: inviteTeacherForm.values.email,
                    schoolId: user!.schoolId
                }
                setLoading(true)
                await TeacherService.inviteManager(inviteTeacherData)
                notifications.show({
                    id: 'success',
                    withCloseButton: true,
                    autoClose: 2000,
                    title: "Invite sent!",
                    message: '',
                    color: 'green',
                    icon: <IconCheck />,
                    loading: false,
                });
                closeInviteTeacherModal()
                fetchTeachers()
                inviteTeacherForm.reset()
                setErrorMsg('')
            } catch (error: any) {
                console.log(error)
                if (!error.response) {
                    setErrorMsg('Something went wrong, try later')
                }
                else if (error.response.status === 400 || error.response.status === 401) {
                    setErrorMsg('Invalid credentials')
                } else if (error.response.status === 500) {
                    setErrorMsg('Something went wrong, try later')
                } else {
                    setErrorMsg(error.response.data.message)
                }
            } finally {
                setLoading(false)
            }
        }
    }

    const closeInviteTeacherModal = () => {
        setOpened(false)
    }

    return (
        <>
            <Modal opened={opened} onClose={() => {closeInviteTeacherModal()}} title={<span style={{fontWeight: 'bold', fontSize: '20px'}}>{t('inviteTeacherModal.createTeacherAccount')}</span>} centered>
                <Alert hidden={!errorMsg} icon={<IconAlertCircle/>} title={t('inviteTeacherModal.errorTitle')} radius={"md"} variant={"outline"} color="red">
                    {errorMsg}
                </Alert>
                <Space h={10}/>
                <TextInput
                    data-autofocus
                    placeholder={t('inviteTeacherModal.enterName')}
                    label={t('inviteTeacherModal.nameLabel')}
                    { ...inviteTeacherForm.getInputProps('name') }
                    withAsterisk
                />
                <Space h={10}></Space>
                <TextInput
                    data-autofocus
                    placeholder={t('inviteTeacherModal.enterSurname')}
                    label={t('inviteTeacherModal.surnameLabel')}
                    { ...inviteTeacherForm.getInputProps('surname') }
                    withAsterisk
                />
                <Space h={10}></Space>
                <TextInput
                    data-autofocus
                    placeholder={t('inviteTeacherModal.enterEmail')}
                    label={t('inviteTeacherModal.emailLabel')}
                    { ...inviteTeacherForm.getInputProps('email') }
                    withAsterisk
                />
                <Space h={'md'}/>
                <Button loading={loading} disabled={loading} radius="md" onClick={sendInvite} style={{width: '100%'}}>
                    {t('inviteTeacherModal.sendInviteButton')}
                </Button>
                <Space h={'md'}/>

                <Box>
                    <b>{t('inviteTeacherModal.attention')}</b>
                    <Space h={"xs"}/>
                    {t('inviteTeacherModal.informationText')}
                </Box>

            </Modal>

        </>
    )
}