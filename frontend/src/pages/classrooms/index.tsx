import {Box, Button, Flex, Grid, Loader, Paper, rem, ScrollArea, Space, Text, TextInput, Title} from "@mantine/core";
import {IconCheck, IconFileSpreadsheet, IconPencil, IconSearch, IconTrash, IconUsers, IconX} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {ClassroomButton} from "../../components/buttons/ClassroomButton.tsx";
import ClassroomService from "../../api/classroomService.ts";
import CreateClassroomModal from "../../components/classrooms/createClassroomModal.tsx";
import {ClassroomResponse} from "../../api/models/classroomResponse.ts";
import GenerateStudentsModal from "../../components/classrooms/generateStudentsModal.tsx";
import {ButtonCopy} from "../../components/buttons/ButtonCopy.tsx";
import {StudentsTable} from "../../components/schoolAdmin/StudentsTable.tsx";
import {useTranslation} from "react-i18next";
import {openConfirmModal} from "@mantine/modals";
import {notifications} from "@mantine/notifications";
import ImportStudentsListDrawer from "./ImportStudentsListDrawer.tsx";

export default function ClassroomsPage() {
    const [createClassroomModalOpen, setCreateClassroomModalOpen] = useState(false)
    const [selectedClassroom, setSelectedClassroom] = useState<ClassroomResponse | undefined>()
    const [classrooms, setClassrooms] = useState<ClassroomResponse[]>()
    const [generateAccsModalOpen, setGenerateAccsModalOpen] = useState(false)
    const { t } = useTranslation()
    const [search, setSearch] = useState('')
    let sortedData: ClassroomResponse[] = []
    const [importStudentsDrawerOpened, setImportStudentsDrawerOpened] = useState(false)

    const fetchClassrooms = () => {
        ClassroomService.getClassrooms().then(res => {
            console.log(res.data)
            setClassrooms(res.data)
        }).catch(error => {
            console.log(error)
        })
    };

    const deleteClassroom = (code: string) => {
        openConfirmModal({
            title: <Title order={5}>{t('classroomsPage.deleteConfirmModalTitle')}</Title>,
            children: (
                <Box>
                    <b>{t('classroomsPage.deleteConfirmModalAttention')}</b>
                    <Space h={"xs"}/>
                    {t('classroomsPage.deleteConfirmModalDescription')}
                </Box>
            ),
            labels: {confirm: t('classroomsPage.deleteConfirmModalOk'), cancel: t('classroomsPage.deleteConfirmModalCancel')},
            onConfirm: () => {
                ClassroomService.deleteClassroom(code).then(res => {
                    console.log(res)
                    notifications.show({
                        id: 'success-login',
                        withCloseButton: true,
                        autoClose: 2000,
                        title: "Deleted!",
                        message: '',
                        color: 'green',
                        icon: <IconCheck />,
                        className: 'my-notification-class',
                        loading: false,
                    });
                    setTimeout(()=> {
                        window.location.reload()
                    }, 2000)
                }).catch(err => {
                    console.log(err)
                    notifications.show({
                        id: 'error-delete',
                        withCloseButton: true,
                        autoClose: 2000,
                        title: "Something went wrong, try later!",
                        message: '',
                        color: 'red',
                        icon: <IconX />,
                        className: 'my-notification-class',
                        loading: false,
                    });
                })
            }
        })
    }

    useEffect(()=>{
        if (!classrooms) {
            fetchClassrooms()
        }
    }, [setClassrooms])

    const openCreateClassroomModal = () => {
        setCreateClassroomModalOpen(true)
    }

    const closeImportStudentsDrawer = () => {
        setImportStudentsDrawerOpened(false)
    }

    const openImportStudentsDrawer = () => {
        setImportStudentsDrawerOpened(true)
    }

    if (classrooms) {
        if (search !== '') {
            sortedData = classrooms.filter((item: ClassroomResponse) =>
                {
                    if (item.title.toLowerCase().includes(search) || item.code.toLowerCase().includes(search)) {
                        return item
                    }
                }
            );
        } else {
            sortedData = classrooms
        }
    }

    const renderedClassroomsList = classrooms ? classrooms.length === 0 ? (
        <Box style={{display: 'flex', justifyContent: 'center', padding: '50px 0', backgroundColor: 'white'}}>
            {t('classroomsPage.notFound')}
        </Box>
    ) : (
            sortedData.map((classroom: ClassroomResponse) => {
                return (
                    <ClassroomButton
                        key={classroom.id}
                        onClick={()=>{setSelectedClassroom(classroom)}}
                        name={classroom.title}
                        createdAt={new Date(Date.parse(classroom.createdAt)).toLocaleDateString()}
                    />
                )
            })
        ) : (
        <Box style={{display: 'flex', justifyContent: 'center', padding: '50px 0', backgroundColor: 'white'}}>
            <Loader size={24}/>
        </Box>
    )

    return (
        <>
            <GenerateStudentsModal fetchClassrooms={fetchClassrooms}
                                   opened={generateAccsModalOpen}
                                   setOpened={setGenerateAccsModalOpen}/>
            <CreateClassroomModal opened={createClassroomModalOpen} setOpened={setCreateClassroomModalOpen} fetchClassrooms={fetchClassrooms}/>

            <Grid gutter={30}>
                <Grid.Col span={3}>
                    <Title order={3}>{t('classroomsPage.classroomsListTitle')}</Title>
                    <Space h={"lg"}/>

                    <TextInput
                        placeholder={t('classroomsPage.searchClassroomPlaceholder')}
                        mb="md"
                        size={'lg'}
                        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                        value={search}
                        onChange={(e)=>{setSearch(e.target.value)}}
                    />

                    <ScrollArea h={500}>
                        {renderedClassroomsList}
                    </ScrollArea>
                    <Space h={'md'}/>
                    <Button radius="md" onClick={openCreateClassroomModal} style={{width: '100%'}}>
                        {t('classroomsPage.createClassroomButton')}
                    </Button>
                    <Space h={'md'}/>
                </Grid.Col>
                {
                    selectedClassroom && (
                            <Grid.Col span={9}>
                                <ImportStudentsListDrawer   classroomId={selectedClassroom?.id}
                                                            fetchClassrooms={fetchClassrooms}
                                                            opened={importStudentsDrawerOpened}
                                                            onClose={closeImportStudentsDrawer}/>
                                <Title order={2}>{t('classroomsPage.classroomInfoTitle')}</Title>
                                <Space h={'xl'}/>
                                <Flex justify="flex-start"
                                      align="flex-start"
                                      direction="row"
                                      gap={40}
                                      wrap="wrap">
                                    <Text size={'xl'}>
                                        {selectedClassroom.title}
                                    </Text>
                                    <Flex justify="flex-start"
                                          align="flex-start"
                                          direction="row"
                                          gap={10}
                                          wrap="wrap">
                                        <Button size={'xs'} leftSection={<IconPencil/>}>{t('classroomsPage.editButton')}</Button>
                                        <Button size={'xs'} onClick={()=>{deleteClassroom(selectedClassroom?.code)}} color={'red'} leftSection={<IconTrash/>}>{t('classroomsPage.deleteButton')}</Button>
                                    </Flex>
                                </Flex>
                                <Space h={'xl'}/>
                                <Flex justify="flex-start"
                                      align="flex-start"
                                      direction="row"
                                      gap={30}
                                      wrap="wrap">
                                    <Paper withBorder px={30} radius={'xl'} py={'sm'}>
                                        <Flex justify="flex-start"
                                              align="center"
                                              direction="row"
                                              gap={20}
                                              wrap="wrap">
                                            <IconUsers size={16}/>
                                            {selectedClassroom.students.length} {t('classroomsPage.studentsText')}
                                        </Flex>
                                    </Paper>

                                    <ButtonCopy copyText={selectedClassroom.code} buttonTitle={selectedClassroom.code} tooltipText={t('classroomsPage.codeCopiedTooltip')}/>
                                </Flex>
                                <Space h={'xl'}/>
                                <Space h={'md'}/>
                                <Title order={4}>
                                    {t('classroomsPage.studentsInClassroomTitle')}
                                </Title>
                                <Space h={'lg'}/>

                                <Button mb={'md'} onClick={openImportStudentsDrawer} color={'green'} leftSection={<IconFileSpreadsheet/>}>
                                    Import students list using excel
                                </Button>
                                <StudentsTable data={selectedClassroom.students} fetchStudents={fetchClassrooms}/>
                                <Space h={30}/>
                                {/*<Button color={"green"} onClick={()=>{setGenerateAccsModalOpen(true)}} leftSection={<IconPlus/>}>{t('classroomsPage.generateAccountsButton')}</Button>*/}
                            </Grid.Col>
                        )
                }
            </Grid>
        </>
    )
}