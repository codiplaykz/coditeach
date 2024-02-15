import {
    Box,
    Button,
    Flex,
    Grid,
    Loader,
    rem,
    ScrollArea,
    SegmentedControl,
    Space,
    Text,
    TextInput,
    Title
} from "@mantine/core";
import {IconChalkboard, IconSchool, IconSearch, IconUser, IconUsersGroup, IconUserShield} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {StudentButton} from "../../components/buttons/StudentButton.tsx";
import SchoolService from "../../api/schoolService.ts";
import CreateSchoolModal from "../../components/modals/CreateSchoolModal.tsx";
import InviteSchoolManagerModal from "../../components/modals/InviteSchoolManagerModal.tsx";
import {Stats} from "../../components/schools/schoolStats.tsx";
import {StudentsTable} from "../../components/schools/tables/StudentsTable.tsx";
import {StudentResponse} from "../../api/models/studentResponse.ts";
import {TeachersTable} from "../../components/schools/tables/TeachersTable.tsx";
import {ClassroomsTable} from "../../components/schools/tables/ClassroomsTable.tsx";
import {SchoolAdminsTable} from "../../components/schools/tables/SchoolAdminTable.tsx";
import {useTranslation} from "react-i18next";

interface ManagerResponse {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface ClassroomResponse {
    id: string;
    title: string;
    code: string;
}

export interface SchoolResponse {
    id: string;
    name: string;
    schoolAdmins: ManagerResponse[];
    teachers: ManagerResponse[];
    classrooms: ClassroomResponse[];
    students: StudentResponse[];
}

export default function SchoolsPage() {
    const [selectedSchool, setSelectedSchool] = useState<SchoolResponse>()
    const [schools, setSchools] = useState<SchoolResponse[]>()
    const [createSchoolModalOpen, setCreateSchoolModalOpen] = useState(false)
    const [inviteModalOpen, setInviteModalOpen] = useState(false)
    const [showTable, setShowTable] = useState('students')
    const { t } = useTranslation()
    const [search, setSearch] = useState('');

    const fetchSchools = () => {
        SchoolService.getSchools().then(res => {
            setSchools(res.data)
        }).catch(error => {
            console.log(error)
        })
    }

    let sortedData = schools

    if (search !== '' && schools) {
        sortedData = schools!.filter((item) =>
            {
                if (item.name.toLowerCase().includes(search)) {
                    return item
                }
            }
        );
    } else {
        sortedData = schools
    }

    useEffect(()=> {
        if (!schools) {
            fetchSchools()
        }
    }, [setSchools])

    const renderedSchoolList= sortedData?.map((school: SchoolResponse) => {
        return (
            <StudentButton key={school.id} onClick={()=>{setSelectedSchool(school)}} id={school.id} name={school.name}/>
        )
    })

    return (
        <>
            <InviteSchoolManagerModal selectedSchool={selectedSchool!}
                                      opened={inviteModalOpen} setOpened={setInviteModalOpen}/>
            <CreateSchoolModal fetchSchools={fetchSchools} opened={createSchoolModalOpen} setOpened={setCreateSchoolModalOpen}/>
            <Grid gutter={20}>
                <Grid.Col span={3}>
                    <Title order={3}>{t('admin_schools_page.schoolsList.title')}</Title>
                    <Space h={"lg"}/>
                    <TextInput
                        placeholder={t('admin_schools_page.schoolsList.searchPlaceholder')}
                        mb="md"
                        size={'lg'}
                        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                        value={search}
                        onChange={(e)=>{setSearch(e.target.value)}}
                    />
                    <Space h={"lg"}/>

                    <ScrollArea h={500}>
                        {
                            !schools ? (
                                <Box style={{display: 'flex', justifyContent: 'center', padding: '50px 0', backgroundColor: 'white'}}>
                                    <Loader size={24}/>
                                </Box>
                            ) : schools.length === 0 ? (
                                <Box style={{display: 'flex', justifyContent: 'center', padding: '50px 0', backgroundColor: 'white'}}>
                                    {t('admin_schools_page.schoolsList.noSchools')}
                                </Box>
                            ) : (
                                renderedSchoolList
                            )
                        }
                    </ScrollArea>

                    <Button radius="md" onClick={()=>{setCreateSchoolModalOpen(true)}} style={{width: '100%'}}>
                        {t('admin_schools_page.schoolsList.createSchoolButton')}
                    </Button>
                </Grid.Col>
                {
                    selectedSchool && (
                        <Grid.Col span={9}>
                            <Title order={2}>{t('admin_schools_page.schoolInfo.title')}</Title>
                            <Space h={'xl'}/>
                            <Flex justify="flex-start"
                                  align="flex-start"
                                  direction="column"
                                  gap={10}
                                  wrap="wrap" style={{backgroundColor: 'white', padding: '10px 20px', borderRadius: '10px', border: "1px solid #e5e5e5"}}>
                                <Text size={'xl'}>
                                    {selectedSchool.name}
                                </Text>
                                <Text size={'xs'} c={'gray'}>
                                    ID: {selectedSchool.id}
                                </Text>
                            </Flex>
                            <Space h={'xl'}/>

                            <Stats statistics={[
                                { title: t('admin_schools_page.schoolInfo.stats.students'), value: selectedSchool.students.length, icon: IconUser },
                                { title: t('admin_schools_page.schoolInfo.stats.teachers'), value: selectedSchool.teachers.length, icon: IconUsersGroup },
                                { title: t('admin_schools_page.schoolInfo.stats.classrooms'), value: selectedSchool.classrooms.length, icon: IconChalkboard },
                                { title: t('admin_schools_page.schoolInfo.stats.schoolAdmins'), value: selectedSchool.schoolAdmins.length, icon: IconUserShield },
                            ]}/>
                            <Space h={'xl'}/>
                            <Flex gap={20}>
                                <Button color={'green'}
                                        leftSection={<IconSchool/>}
                                        onClick={()=>{setInviteModalOpen(true)}}>
                                    {t('admin_schools_page.schoolInfo.createSchoolManagerButton')}
                                </Button>
                            </Flex>
                            <Space h={'xl'}/>
                            <SegmentedControl
                                value={showTable}
                                onChange={setShowTable}
                                data={[
                                    { label: t('admin_schools_page.schoolInfo.segmentedControl.students'), value: 'students' },
                                    { label: t('admin_schools_page.schoolInfo.segmentedControl.teachers'), value: 'teachers' },
                                    { label: t('admin_schools_page.schoolInfo.segmentedControl.classrooms'), value: 'classrooms' },
                                    { label: t('admin_schools_page.schoolInfo.segmentedControl.schoolAdmins'), value: 'schoolAdmins' },
                                ]}
                            />
                            <Space h={'md'}/>

                            { showTable === 'students' && (<StudentsTable data={selectedSchool.students}/>)}
                            { showTable === 'teachers' && (<TeachersTable data={selectedSchool.teachers}/>)}
                            { showTable === 'classrooms' && (<ClassroomsTable data={selectedSchool.classrooms}/>)}
                            { showTable === 'schoolAdmins' && (<SchoolAdminsTable data={selectedSchool.schoolAdmins}/>)}

                            <Space h={'md'}/>
                        </Grid.Col>
                    )
                }
            </Grid>
        </>
    )
}