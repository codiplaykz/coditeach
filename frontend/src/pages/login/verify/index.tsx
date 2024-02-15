import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import TeacherService from "../../../api/teacherService.ts";
import {ErrorPage} from "../../errors";
import {Alert, Button, Container, Loader, Paper, PasswordInput, Title} from "@mantine/core";
import {IconAlertCircle, IconCheck} from "@tabler/icons-react";
import {useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import {TeachersResponse} from "../../../api/models/teachersResponse.ts";

export default function VerifyPage() {
    const [errorMsg, setErrorMsg] = useState('')
    const { verificationCode } = useParams()
    const [isCodeValid, setIsCodeValid] = useState<boolean>()
    const [error, setError] = useState<string>('')
    const [manager, setManager] = useState<TeachersResponse>()
    const verificationForm = useForm({
        initialValues: {
            password: '',
            repeatPassword: ''
        }
    })
    const navigate = useNavigate()
    useEffect(()=> {
        if (isCodeValid === undefined) {
            TeacherService.checkVerification(verificationCode!).then(res => {
                setManager(res.data)
                setIsCodeValid(true)
            }).catch((error) => {
                if (error.response.status === 403) {
                    if (error.response.data.message === 'Already verified') {
                        window.location.href = '/login'
                    }
                    if (error.response.data.message === 'Verification code not found') {
                        setError('verification not found')
                    } else if (error.response.data.message === 'Verification code expired') {
                        setError('verification expired')
                    }
                }
            })
        }
    }, [setIsCodeValid, setManager])

    const completeVerification = () => {
        let password = verificationForm.values.password
        let repeatPassword = verificationForm.values.repeatPassword
        if (password.length === 0 || repeatPassword.length === 0) {
            verificationForm.setErrors({
                password: password.length === 0 ? 'Enter password' : '',
                repeatPassword: repeatPassword.length === 0 ? 'Enter password' : ''
            })
        }
        else if (password !== repeatPassword) {
            setErrorMsg('Entered passwords different')
        } else {
            setErrorMsg('')
            const data = {
                id: manager?.id,
                password: password,
                verificationCode: verificationCode
            }
            TeacherService.completeVerification(data).then(res => {
                if (res.status === 201) {
                    notifications.show({
                        id: 'success-login',
                        withCloseButton: true,
                        autoClose: 2000,
                        title: "Verification completed successfully",
                        message: '',
                        color: 'green',
                        icon: <IconCheck />,
                        className: 'my-notification-class',
                        loading: false,
                    });
                }
                setTimeout(()=>{
                    navigate('/login')
                }, 1000)
            }).catch(error => {
                console.log(error)
            })
        }
        // if ()
    }

    if (!manager && !error) {
        return <Loader size={48} style={{margin: "30% 50%"}}/>
    }

    if (error === 'verification expired') {
        return <ErrorPage errorCode={403} errorTitle={"Expired verification link"} errorDescription={"To complete account verification, ask school admin to resend invite link"} buttonLink={"/login"} buttonText={"Go to login page"}/>
    } else if (error === 'verification not found') {
        return <ErrorPage errorCode={404} errorTitle={"Something is not right..."}
                          errorDescription={"Page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to another URL. If you think this is an error contact support."}
                          buttonLink={"/login"} buttonText={"Go to login page"}/>
    }

    return (
        <>
            <Container size={420} my={200}>
                <Title
                    style={{textAlign: 'center'}}
                    order={3}
                >
                    Complete verification and account creation.
                </Title>

                <Paper withBorder shadow="md" p={30} radius="md">
                    <Alert hidden={!errorMsg} icon={<IconAlertCircle/>} title={'Error'} radius={"md"} variant={"outline"} color="red">
                        {errorMsg}
                    </Alert>
                    <PasswordInput {...verificationForm.getInputProps('password')} label="Password" placeholder="Your password" required mt="md" />
                    <PasswordInput {...verificationForm.getInputProps('repeatPassword')} label="Repeat password" placeholder="Your password" required mt="md" />
                    <Button fullWidth mt="xl" onClick={completeVerification}>
                        Complete
                    </Button>
                </Paper>
            </Container>
        </>
    )
}