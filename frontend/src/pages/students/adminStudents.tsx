import {Avatar, Box, Flex, Grid, Loader, ScrollArea, Space, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import AdminService from "../../api/AdminService.ts";
import {StudentsTable} from "../../components/admin/StudentsTable.tsx";
import {useTranslation} from "react-i18next";

interface Student {
    id: string;
    name: string;
    accountId: string;
    classroomId: string;
    schoolId: string;
    schoolName: string;
    profile_image: string;
}

export default function AdminStudentsPage() {
    const [students, setStudents] = useState<Student[]>();
    const { t } = useTranslation()
    const fetchStudents = () => {
        AdminService.getAllStudents().then(res => {
            console.log(res.data);
            setStudents(res.data);
        }).catch(error => {
            console.log(error);
        })
    }

    useEffect(() => {
        if (!students) {
            fetchStudents();
        }
    }, [setStudents]);

    return (
        <>
            <Grid gutter={5}>
                <Grid.Col span={12}>
                    <Flex gap={20} align={'center'}>
                        <Title order={3}>{t('adminStudentsPage.studentsListTitle')}</Title>
                        <Avatar color={'green'}>{students?.length ? students.length : '0'}</Avatar>
                    </Flex>
                    <Space h={"lg"}/>

                    <ScrollArea h={1000}>
                        {
                            !students ? (
                                <Box style={{display: 'flex', justifyContent: 'center', padding: '50px 0', backgroundColor: 'white'}}>
                                    <Loader size={24}/>
                                </Box>
                            ) : students.length === 0 ? (
                                <Box style={{display: 'flex', justifyContent: 'center', padding: '50px 0', backgroundColor: 'white'}}>
                                    {t('adminStudentsPage.noStudents')}
                                </Box>
                            ) : (
                                <StudentsTable data={students} fetchStudents={fetchStudents}/>
                            )
                        }
                    </ScrollArea>
                </Grid.Col>
            </Grid>
        </>
    )
}
