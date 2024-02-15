import {Box, Flex, Grid, Input, Loader, ScrollArea, Space, Text, Title} from "@mantine/core";
import {IconSearch} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {StudentButton} from "../../components/buttons/StudentButton.tsx";
import StudentService from "../../api/studentService.ts";
import {StudentCard} from "../../components/students/studentCard.tsx";
import {useTranslation} from "react-i18next";

interface StudentResponse {
    id: string;
    name: string;
    accountId: string;
    classroomId: string;
    profile_image: string | null;
    c_id: string;
    title: string;
    code: string;
    createdAt: Date;
    managerId: string;
}

export default function StudentsPage() {
    const [selectedStudent, setSelectedStudent] = useState<StudentResponse>()
    const [students, setStudents] = useState<StudentResponse[]>()
    const { t } = useTranslation()

    useEffect(()=> {
        StudentService.getStudents().then(res => {
            setStudents(res.data)
        }).catch(error => {
            console.log(error)
        })
    },[setStudents])

    const renderedStudentsList= students?.map((student: StudentResponse) => {
        return (
            <StudentButton onClick={()=>{setSelectedStudent(student)}} id={student.id} name={student.name}/>
        )
    })
    console.log(selectedStudent)

    return (
        <>
            <Grid gutter={30}>
                <Grid.Col span={3}>
                    <Title order={3}>{t('studentsPage.studentsListTitle')}</Title>
                    <Space h={"lg"}/>
                    <Input
                        leftSection={<IconSearch />}
                        variant="default"
                        placeholder={t('studentsPage.searchPlaceholder')}
                        radius="md"
                        size="lg"
                    />
                    <Space h={"lg"}/>

                    <ScrollArea h={500}>
                        {
                            !students ? (
                                <Box style={{display: 'flex', justifyContent: 'center', padding: '50px 0', backgroundColor: 'white'}}>
                                    <Loader size={24}/>
                                </Box>
                            ) : students.length === 0 ? (
                                <Box style={{display: 'flex', justifyContent: 'center', padding: '50px 0', backgroundColor: 'white'}}>
                                    {t('studentsPage.noStudentsFound')}
                                </Box>
                            ) : (
                                renderedStudentsList
                            )
                        }
                    </ScrollArea>
                </Grid.Col>
                {
                    selectedStudent && (
                        <Grid.Col span={9}>
                            <Title order={2}>{t('studentsPage.studentInfoTitle')}</Title>
                            <Space h={'xl'}/>
                            <StudentCard id={selectedStudent.id} profileImg={selectedStudent.profile_image!} name={selectedStudent.name} accountId={selectedStudent.accountId}/>

                            <Space h={'xl'}/>
                            {/*<Button variant={'light'}>{t('studentsPage.viewProgressButton')}</Button>*/}
                            <Space h={'xl'}/>

                            <Title order={4}>{t('studentsPage.classroomTitle')}</Title>
                            <Space h={'xs'}/>

                            <Flex justify="flex-start"
                                  align="center"
                                  direction="row"
                                  gap={200}
                                  wrap="wrap"
                                  style={{backgroundColor: 'white', border: '#e1e1e1 1px solid', borderRadius: '10px', width: '400px'}}
                                  p={20}>
                                <Flex justify="flex-start"
                                      align="flex-start"
                                      direction="column"
                                      gap={10}
                                      wrap="wrap">
                                    <Text c="dimmed" size="xs">
                                        {t('studentsPage.classroomIdPrefix')} {selectedStudent.c_id}
                                    </Text>
                                    <Text size="md" fw={500}>
                                        {selectedStudent.title}
                                    </Text>
                                </Flex>
                                {/*<Button color={'red'}>{t('studentsPage.deleteFromClassroomButton')}</Button>*/}
                            </Flex>
                        </Grid.Col>
                    )
                }
            </Grid>
        </>
    )
}