import {useForm} from "@mantine/form";
import {Alert, Button, Card, Flex, Modal, PasswordInput, Radio, Space, Switch, Text, TextInput} from "@mantine/core";
import {useState} from "react";
import {IconAlertCircle, IconCheck} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";
import {SchoolResponse} from "../../pages/schools";
import AdminService from "../../api/AdminService.ts";
import {useTranslation} from "react-i18next";

function generatePassword(length: number, options: { numbers: boolean; upperCase: boolean; specialChars: boolean; }): string {
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+{}:"<>?|[];\',./`~';

    let characters = lowerCaseChars;
    if (options.numbers) characters += numberChars;
    if (options.upperCase) characters += upperCaseChars;
    if (options.specialChars) characters += specialChars;

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    return password;
}

interface InviteManagerModalProps {
    opened: boolean,
    setOpened: Function,
    selectedSchool: SchoolResponse,
}

export default function InviteSchoolManagerModal({opened, setOpened, selectedSchool}: InviteManagerModalProps) {
    const inviteManagerForm = useForm({
        initialValues: {
            email: '',
            fullName: '',
            password: ''
        }
    })
    const { t } = useTranslation()
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const [createWithPass, setCreateWithPass] = useState(false);
    const [managerType, setManagerType] = useState('TEACHER')

    const {email, fullName, password} = inviteManagerForm.values

    const createAccount = async () => {
        if (email.length === 0 || fullName.length === 0 || (createWithPass && password.length === 0)) {
            inviteManagerForm.setErrors({
                email: email.length === 0 ? t('inviteSchoolManagerModal.enterDataError') : '',
                fullName: fullName.length === 0 ? t('inviteSchoolManagerModal.enterDataError') : '',
                password: password.length === 0 ? t('inviteSchoolManagerModal.enterDataError') : '',
            })
        } else {
            try {
                const inviteSchoolManagerData = createWithPass ? {
                        name: fullName,
                        email: email,
                        school: selectedSchool.id,
                        password: password,
                        role: managerType,
                    } : {
                        name: fullName,
                        email: email,
                        school: selectedSchool.id,
                        role: managerType
                }
                setLoading(true)
                await AdminService.inviteSchoolManager(inviteSchoolManagerData)
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
                closeInviteManagerModal()
                inviteManagerForm.reset()
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
    const closeInviteManagerModal = () => {
        setOpened(false)
    }

    const onClickGeneratePassword = () => {
        inviteManagerForm.setValues({password: generatePassword(8, {numbers: true, upperCase: true, specialChars: true})})
    }

    return (
        <>
            <Modal
                opened={opened}
                onClose={() => { closeInviteManagerModal() }}
                title={<span style={{ fontWeight: 'bold', fontSize: '20px' }}>{t('inviteSchoolManagerModal.title')}</span>}
                centered
            >
                <Alert
                    hidden={!errorMsg}
                    icon={<IconAlertCircle/>}
                    title={t('inviteSchoolManagerModal.errorTitle')}
                    radius={"md"}
                    variant={"outline"}
                    color="red"
                >
                    {errorMsg}
                </Alert>
                <Space h={10}/>
                <Card mb={20} padding="sm" radius="md" withBorder>
                    <Radio.Group
                        value={managerType}
                        onChange={setManagerType}
                        name="managerType"
                        label={t('inviteSchoolManagerModal.managerTypeLabel')}
                        description={t('inviteSchoolManagerModal.managerTypeDesc')}
                        withAsterisk
                    >
                        <Flex my={10} gap={20}>
                            <Radio value="TEACHER" label={t('inviteSchoolManagerModal.teacherTypeLabel')} />
                            <Radio value="SCHOOL_ADMIN" label={t('inviteSchoolManagerModal.schoolAdminTypeLabel')} />
                        </Flex>
                    </Radio.Group>
                </Card>
                <Space h={10}/>
                <TextInput
                    data-autofocus
                    placeholder={t('inviteSchoolManagerModal.fullNamePlaceholder')}
                    label={t('inviteSchoolManagerModal.fullNameLabel')}
                    {...inviteManagerForm.getInputProps('fullName')}
                    withAsterisk
                />
                <Space h={10}/>
                <TextInput
                    placeholder={t('inviteSchoolManagerModal.emailPlaceholder')}
                    label={t('inviteSchoolManagerModal.emailLabel')}
                    {...inviteManagerForm.getInputProps('email')}
                    withAsterisk
                />
                <Space h={10}/>
                <Switch
                    checked={createWithPass}
                    label={t('inviteSchoolManagerModal.passwordSwitchLabel')}
                    onChange={(event) => setCreateWithPass(event.currentTarget.checked)}
                />
                <Space h={'md'}/>
                {
                    createWithPass && (
                        <>
                            <PasswordInput
                                placeholder={t('inviteSchoolManagerModal.passwordPlaceholder')}
                                label={t('inviteSchoolManagerModal.passwordLabel')}
                                {...inviteManagerForm.getInputProps('password')}
                                withAsterisk
                            />
                            <Text mt={5} style={{cursor: 'pointer'}}
                                  td={'underline'} onClick={onClickGeneratePassword}
                                  size={'sm'} c={'blue'}>
                                {t('inviteSchoolManagerModal.generatePassButton')}
                            </Text>
                            <Space h={'md'}/>
                        </>
                    )
                }
                <Button
                    loading={loading}
                    disabled={loading}
                    radius="md"
                    onClick={createAccount}
                    style={{ width: '100%' }}
                >
                    {t('inviteSchoolManagerModal.createManagerButton')}
                </Button>
                <Space h={'md'}/>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <b>{t('inviteSchoolManagerModal.attention')}</b>
                    <Space h={"xs"}/>
                    <Text size="sm" c="dimmed">
                        {t('inviteSchoolManagerModal.authorizationInfo')}
                    </Text>
                </Card>
            </Modal>
        </>
    )
}