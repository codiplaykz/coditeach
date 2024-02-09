import {Box, Button, LoadingOverlay, Modal, PasswordInput, Text} from "@mantine/core";
import PasswordStrengthChecker from "../admin/PasswordChecker.tsx";
import {notifications} from "@mantine/notifications";
import {IconCheck, IconX} from "@tabler/icons-react";
import AuthService from "../../api/authService.ts";
import {useState} from "react";
import {useForm} from "@mantine/form";
import {useTranslation} from "react-i18next";

interface ChangePasswordModalProps {
    opened: boolean,
    onClose: () => void,
    userId: string,
    isStudent?: boolean
}

export function checkPassForRules(password: string) {
    return (
        /\d/.test(password) &&                 // Check for at least one digit
        /[a-z]/.test(password) &&             // Check for at least one lowercase letter
        /[A-Z]/.test(password) &&             // Check for at least one uppercase letter
        /[\W_]/.test(password) &&             // Check for at least one special character
        password.length >= 8                  // Check for minimum length of 8 characters
    );
}

export default function ChangePasswordModal({ opened, onClose, userId, isStudent }: ChangePasswordModalProps) {
    const [modalLoading, setModalLoading] = useState(false)
    const {t} = useTranslation()
    const changePassForm = useForm({
        initialValues: {
            pass: '',
            repeatPass: '',
        }
    })

    const {pass, repeatPass} = changePassForm.values
    const confirmChange = () => {
        if (pass === '' || repeatPass === '') {
            notifications.show({
                withCloseButton: true,
                autoClose: 2000,
                title: t('changePasswordModal.enterPassError'),
                message: '',
                color: 'red',
                icon: <IconX />,
            });
        } else if (pass !== repeatPass) {
            notifications.show({
                withCloseButton: true,
                autoClose: 2000,
                title: t('changePasswordModal.passDifferentError'),
                message: '',
                color: 'red',
                icon: <IconX />,
            });
        } else if (!checkPassForRules(pass)) {
            notifications.show({
                withCloseButton: true,
                autoClose: 2000,
                title: t('changePasswordModal.passIsWeak'),
                message: '',
                color: 'red',
                icon: <IconX />,
            });
        } else  {
            let data = {
                id: userId,
                password: pass,
                isStudent: isStudent
            }
            setModalLoading(true)
            AuthService.changePass(data).then(res => {
                console.log(res)
                notifications.show({
                    withCloseButton: true,
                    autoClose: 2000,
                    title: t('changePasswordModal.successMessage'),
                    message: '',
                    color: 'green',
                    icon: <IconCheck />,
                });
                changePassForm.reset()
                onClose()
            }).catch(err => {
                console.log('ERROR: ', err)
                notifications.show({
                    withCloseButton: true,
                    autoClose: 2000,
                    title: t('changePasswordModal.serverError'),
                    message: '',
                    color: 'yellow',
                    icon: <IconX />,
                });
            }).finally(() => {
                setModalLoading(false)
            })
        }
    }

    return (
        <Modal opened={opened} title={<Text fw={600} size={'xl'}>{t('changePasswordModal.changePasswordTitle')}</Text>}
               onClose={onClose}>
            <LoadingOverlay visible={modalLoading}/>
            <PasswordStrengthChecker password={pass}/>
            <Box mt={20}>
                <PasswordInput label={t('changePasswordModal.passInputLabel')} placeholder={t('changePasswordModal.passPlaceholder')} required {...changePassForm.getInputProps('pass')}/>
                <PasswordInput label={t('changePasswordModal.repeatPassInputLabel')} placeholder={t('changePasswordModal.repeatPassPlaceholder')} required mt="md" {...changePassForm.getInputProps('repeatPass')}/>
                <Button onClick={confirmChange} color={"green"} mt={'md'} w={'100%'}>{t('changePasswordModal.confirmButton')}</Button>
            </Box>
        </Modal>
    )
}