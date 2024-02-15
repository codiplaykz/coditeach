import {
    Avatar,
    Badge,
    Box,
    Button,
    Code,
    Divider,
    Flex,
    Grid,
    Group,
    Input,
    Loader,
    Paper,
    ScrollArea,
    Space,
    Table,
    Text,
    Title
} from "@mantine/core";
import {IconChalkboard, IconCheck, IconEdit, IconSearch, IconX} from "@tabler/icons-react";
import {TeacherButton} from "../../components/buttons/TeacherButton.tsx";
import {useEffect, useState} from "react";
import InviteTeacherModal from "../../components/modals/InviteTeacherModal.tsx";
import {TeachersResponse} from "../../api/models/teachersResponse.ts";
import TeacherService from "../../api/teacherService.ts";
import {notifications} from "@mantine/notifications";
import {useUserStore} from "../../store/user";
import {ClassroomResponse} from "../../api/models/classroomResponse.ts";
import classes from "./Teachers.module.css";
import {useTranslation} from "react-i18next";
import ChangePasswordModal from "../../components/modals/ChangePasswordModal.tsx";

export default function TeachersPage() {
    const [selectedTeacher, setSelectedTeacher] = useState<TeachersResponse>()
    const [inviteTeacherModalOpened, setInviteTeacherModalOpened] = useState(false)
    const [teachers, setTeachers] = useState<TeachersResponse[]>()
    const { user } = useUserStore()
    const [resendInviteButtonLoading, setResendInviteButtonLoading] = useState(false)
    const [teacherPassChangeModal, setTeacherPassChangeModal] = useState(false)
    const fetchTeachers = () => {
        TeacherService.getTeachers().then((res) => {
            // @ts-ignore
            setTeachers(res.data)
        })
    }
    const { t } = useTranslation()

    useEffect(()=>{
        fetchTeachers()
    }, [setTeachers])

    const renderedTeachersList = !teachers ? (
        <Box style={{display: 'flex', justifyContent: 'center', padding: '50px 0', backgroundColor: 'white'}}>
            <Loader size={24}/>
        </Box>
    ) : teachers.length === 0 ? (
        t('schoolAdminTeachersPage.noTeachersAdded')
    ) : (
        teachers.map((teacher: TeachersResponse) => {
            return (
                <TeacherButton
                    key={teacher.id}
                    onClick={()=>{setSelectedTeacher(teacher)}}
                    name={teacher.name}
                    email={teacher.email}
                />
            )
        })
    )

    const resendInvite = async (teacher: TeachersResponse) => {
        try {
            const inviteTeacherData = {
                name: teacher.name,
                email: teacher.email,
                schoolId: user!.schoolId
            }
            setResendInviteButtonLoading(true)
            await TeacherService.inviteManager(inviteTeacherData)
            notifications.show({
                id: 'success',
                withCloseButton: true,
                autoClose: 2000,
                title: "Invite sent again!",
                message: '',
                color: 'green',
                icon: <IconCheck />,
                loading: false,
            });
            fetchTeachers()
        } catch (error: any) {
            console.log(error)
            if (!error.response) {
                notifications.show({
                    id: 'error',
                    withCloseButton: true,
                    autoClose: 2000,
                    title: "Something went wrong, try later",
                    message: '',
                    color: 'red',
                    icon: <IconX />,
                    loading: false,
                });
            }
            else if (error.response.status === 400 || error.response.status === 401) {
                notifications.show({
                    id: 'error',
                    withCloseButton: true,
                    autoClose: 2000,
                    title: "Invalid credentials",
                    message: '',
                    color: 'red',
                    icon: <IconX />,
                    loading: false,
                });
            } else if (error.response.status === 500) {
                notifications.show({
                    id: 'error',
                    withCloseButton: true,
                    autoClose: 2000,
                    title: "Something went wrong, try later",
                    message: '',
                    color: 'red',
                    icon: <IconX />,
                    loading: false,
                });
            } else {
                notifications.show({
                    id: 'error',
                    withCloseButton: true,
                    autoClose: 2000,
                    title: error.response.data.message,
                    message: '',
                    color: 'red',
                    icon: <IconX />,
                    loading: false,
                });
            }
        } finally {
            setResendInviteButtonLoading(false)
        }
    }

    const rows = selectedTeacher?.classrooms.map((classroom: ClassroomResponse, index: number) => (
        <Table.Tr key={classroom.id}>
            <Table.Td>{index+1}</Table.Td>
            <Table.Td><Code c={'blue'}>{classroom.id}</Code></Table.Td>
            <Table.Td>{classroom.title}</Table.Td>
            {/*<td>*/}
            {/*    <Button color={'red'}>DELETE FROM CLASSROOM</Button>*/}
            {/*</td>*/}
        </Table.Tr>
    ));

    return (
        <>
            <ChangePasswordModal opened={teacherPassChangeModal} onClose={()=>{setTeacherPassChangeModal(false)}} userId={selectedTeacher?.id!}/>
            <InviteTeacherModal fetchTeachers={fetchTeachers} opened={inviteTeacherModalOpened} setOpened={setInviteTeacherModalOpened}/>
            <Grid gutter={30}>
                <Grid.Col span={3}>
                    <Title order={3}>{t('schoolAdminTeachersPage.teachersListTitle')}</Title>
                    <Space h={"lg"}/>
                    <Input
                        leftSection={<IconSearch />}
                        variant="default"
                        placeholder={t('schoolAdminTeachersPage.searchPlaceholder')}
                        radius="md"
                        size="lg"
                    />
                    <Space h={"lg"}/>

                    <ScrollArea h={500}>
                        {renderedTeachersList}
                    </ScrollArea>
                    <Space h={'md'}/>
                    <Button radius="md" onClick={()=> {setInviteTeacherModalOpened(true)}} style={{width: '100%'}}>
                        {t('schoolAdminTeachersPage.inviteTeacherButton')}
                    </Button>
                </Grid.Col>
                {
                    selectedTeacher && (
                        <Grid.Col span={9}>
                            <Title order={2}>{t('schoolAdminTeachersPage.teacherInfoTitle')}</Title>
                            <Space h={'xl'}/>
                            <Flex
                                mih={120}
                                gap="lg"
                                justify="flex-start"
                                align="flex-start"
                                direction="row"
                                wrap="wrap"
                            >
                                <Avatar color="blue" radius={'xl'} size={'xl'}>
                                    {selectedTeacher.name.split(' ')[0][0] + selectedTeacher.name.split(' ')[1][0]}
                                </Avatar>
                                <Flex
                                    justify="flex-start"
                                    align="flex-start"
                                    direction="column"
                                    wrap="wrap"
                                >
                                    <Text size={'xl'}>
                                        {selectedTeacher.name}
                                    </Text>
                                    <Text size={'md'}>
                                        {selectedTeacher.email}
                                    </Text>
                                    <Space h={'xl'}/>

                                    {!selectedTeacher.isVerified && (
                                        <Button loading={resendInviteButtonLoading} disabled={resendInviteButtonLoading} onClick={()=>{resendInvite(selectedTeacher)}}>{t('schoolAdminTeachersPage.resendInviteButton')}</Button>
                                    )}
                                </Flex>
                                {selectedTeacher.isVerified ? (
                                    <Badge color={'green'} size="xl">{t('schoolAdminTeachersPage.activeBadge')}</Badge>
                                ): (
                                    <Badge color={'red'} size="xl">{t('schoolAdminTeachersPage.inactiveBadge')}</Badge>
                                )}
                            </Flex>
                            <Text fw={600} size={'xl'}>{t('teachersTable.action')}</Text>
                            <Space h={'md'}/>
                            <Button leftSection={<IconEdit/>} onClick={()=>{setTeacherPassChangeModal(true)}}>
                                {t('changePasswordModal.changePasswordTitle')}
                            </Button>
                            <Space h={'md'}/>
                            <Divider/>
                            <Space h={'md'}/>
                            <Paper withBorder w={300} p="md" radius="md">
                                <Group justify="space-between">
                                    <Text size="xs" c="dimmed" className={classes.title}>
                                        {t('schoolAdminTeachersPage.enrolledClassrooms')}
                                    </Text>
                                    <IconChalkboard className={classes.icon} size="1.4rem" stroke={1.5} />
                                </Group>

                                <Group align="flex-end" gap="xs" mt={25}>
                                    <Text className={classes.value}>{selectedTeacher.classrooms.length === 0 ? '0' : selectedTeacher.classrooms.length}</Text>
                                </Group>

                                <Text fz="xs" c="dimmed" mt={7}>
                                    {t('schoolAdminTeachersPage.classroomsOfTeacher')}
                                </Text>
                            </Paper>
                            {
                                selectedTeacher.classrooms.length !== 0 && (
                                    <>
                                        <Space h={'xl'}/>
                                        <Title order={5}>{t('schoolAdminTeachersPage.classroomsTitle')}</Title>
                                        <Space h={'lg'}/>
                                        <Table horizontalSpacing="lg" verticalSpacing="md" striped highlightOnHover withColumnBorders withTableBorder>
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th>#</Table.Th>
                                                    <Table.Th>{t('schoolAdminTeachersPage.tableID')}</Table.Th>
                                                    <Table.Th>{t('schoolAdminTeachersPage.tableName')}</Table.Th>
                                                    {/*<th>Action</th>*/}
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>{rows}</Table.Tbody>
                                        </Table>
                                    </>
                                )
                            }
                        </Grid.Col>
                    )
                }
            </Grid>
        </>
    )
}