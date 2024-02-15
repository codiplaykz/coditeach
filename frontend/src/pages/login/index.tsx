import {Alert, Button, Container, LoadingOverlay, Paper, PasswordInput, Space, TextInput, Title,} from '@mantine/core';
import {useForm} from "@mantine/form";
import {useState} from "react";
import {notifications} from "@mantine/notifications";
import {IconAlertCircle, IconCheck} from "@tabler/icons-react";
import {LoginWithEmail} from "../../store/user";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

export function Login() {
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const loginForm = useForm({
        initialValues: {
            email: '',
            password: '',
        },
    });
    const navigate = useNavigate()
    const { t } = useTranslation()
    const submit = async () => {
        if (loginForm.values.password.length === 0 || loginForm.values.email.length === 0) {
            loginForm.setErrors({
                email: loginForm.values.email.length === 0 ? 'Enter the data' : '',
                password: loginForm.values.password.length === 0 ? 'Enter the data' : ''
            })
        } else {
            setLoading(true)
            try {
                const {isVerified, accessToken, userData} = await LoginWithEmail(loginForm.values.email, loginForm.values.password)
                console.log(isVerified, accessToken, userData)
                if (isVerified) {
                    setErrorMsg('')
                    notifications.show({
                        id: 'success-login',
                        withCloseButton: true,
                        autoClose: 2000,
                        title: "Successful login",
                        message: '',
                        color: 'green',
                        icon: <IconCheck />,
                        className: 'my-notification-class',
                        loading: false,
                    });
                    setTimeout(()=>{
                        navigate('/home')
                    }, 1000)
                }
            } catch (error: any) {
                setErrorMsg(error.message)
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <Container size={420} my={40}>
            <Title style={{textAlign: 'center'}}>
                {t('loginPage.welcomeBack')}
            </Title>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <LoadingOverlay visible={loading}/>
                <Alert hidden={!errorMsg} icon={<IconAlertCircle/>} title={t('loginPage.error')} radius={"md"} variant={"outline"} color="red">
                    {errorMsg}
                </Alert>
                <Space h={"md"}/>
                <TextInput label={t('loginPage.emailLabel')} placeholder={t('loginPage.emailPlaceholder')} required {...loginForm.getInputProps('email')} />
                <PasswordInput label={t('loginPage.passwordLabel')} placeholder={t('loginPage.passwordPlaceholder')} required mt="md" {...loginForm.getInputProps('password')}/>
                <Button color={'#3ca1ff'} fullWidth mt="xl" loading={loading} disabled={loading} onClick={submit}>
                    {t('loginPage.signIn')}
                </Button>
            </Paper>
        </Container>
    );
}