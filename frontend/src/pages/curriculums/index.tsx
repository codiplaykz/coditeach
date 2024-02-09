import {
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
    Drawer,
    Flex,
    Grid,
    Group,
    Loader,
    LoadingOverlay,
    SimpleGrid,
    Space,
    Switch,
    Text,
    Title
} from "@mantine/core";
import {useEffect, useState} from "react";
import {CurriculumButton} from "../../components/buttons/CurriculumButton.tsx";
import {
    IconArrowLeft,
    IconArrowRight,
    IconCheck,
    IconExclamationMark,
    IconHandFinger,
    IconPlus,
    IconSearch,
    IconTrash
} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import CreateLessonDrawer, {Chapter, Grade} from "./createLessonDrawer.tsx";
import {useUserStore} from "../../store/user";
import AdminService from "../../api/AdminService.ts";
import BasicCardButton from "../../components/curriculums/BasicCardButton.tsx";
import LessonPage from "../../components/curriculums/LessonPage.tsx";
import LessonButton from "../../components/curriculums/LessonButton.tsx";
import {notifications} from "@mantine/notifications";
import ChangeCurriculumLanguageModal from "../../components/modals/ChangeCurriculumLanguageModal.tsx";
import {useTranslation} from "react-i18next";
import LockedCardButton from "../../components/curriculums/LockedCardButton.tsx";
import * as gradesData from './curriculumData.json'

export function getOrdinal(number: number) {
    const suffixes = ["th", "st", "nd", "rd"];
    const lastTwoDigits = number % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
        return number + "th";
    }

    const lastDigit = number % 10;
    const suffix = (lastDigit >= 1 && lastDigit <= 3) ? suffixes[lastDigit] : suffixes[0];
    return number + suffix;
}

interface LessonResponse {
    id: string;
    language: string;
    grade: number;
    chapterQueue: number;
    chapter: string;
    topicTitle: string;
    topicQueue: number;
    lessonType: string;
    lessonObjectives: string;
    lessonEquipment: string;
    priorKnowledge: string
    lessonStart: string;
    lessonMiddle: string;
    lessonEnd: string;
    videoLinks: string;
    presentationLinks: string;
    linkForDoc: string;
    additionalResources: string;
}
interface Topic {
    title: string;
    topicQueue: number;
    items: LessonResponse[];
}

interface LanguageResponse {
    topics: Topic[];
}

interface ChapterResponse {
    [language: string]: LanguageResponse;
}

interface GradeResponse {
    [chapter: string]: ChapterResponse;
}

interface OrganizedData {
    [grade: number]: GradeResponse;
}

function retrieveObjectByGradeAndChapter(data: any, grade: number, chapter: number) {
    // Check if the grade exists in the data
    if (data[grade]) {
        // Check if the chapter exists for the given grade
        if (data[grade][chapter]) {
            return data[grade][chapter];
        }
    }
    return null; // Return null if the grade and chapter combination does not exist
}

export default function CurriculumsPage() {
    const { t, i18n} = useTranslation()
    const [showLessonDrawer, {open, close}] = useDisclosure(false)
    const {user, curriculum_language} = useUserStore()
    const [lessons, setLessons] = useState<OrganizedData>()
    const [selectedGrade, setSelectedGrade] = useState<Grade>()
    const [selectedChapter, setSelectedChapter] = useState<Chapter>()
    const [selectedLesson, setSelectedLesson] = useState<LessonResponse>()
    const [deleteMode, setDeleteMode] = useState(false)
    const [deleteList, setDeleteList] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [curriculumLanguageModalShow, setCurriculumLanguageModalShow] = useState(curriculum_language === '')

    const fetchLessons = async () => {
        return AdminService.getLessons().then(res => {
            let organizedData: OrganizedData = {};

            res.data.forEach((item: LessonResponse) => {
                const { grade, chapterQueue, topicTitle, topicQueue, videoLinks, presentationLinks, lessonEquipment, additionalResources, language } = item;

                if (!organizedData[grade]) {
                    organizedData[grade] = {};
                }

                if (!organizedData[grade][chapterQueue]) {
                    organizedData[grade][chapterQueue] = {};
                }

                if (!organizedData[grade][chapterQueue][language]) {
                    organizedData[grade][chapterQueue][language] = {
                        topics: [],
                    };
                }

                let topic = organizedData[grade][chapterQueue][language].topics.find((t) => t.title === topicTitle);

                if (!topic) {
                    topic = {
                        title: topicTitle,
                        topicQueue: topicQueue,
                        items: [],
                    };
                    organizedData[grade][chapterQueue][language].topics.push(topic);
                }

                item.videoLinks = JSON.parse(videoLinks);
                item.presentationLinks = JSON.parse(presentationLinks);
                item.lessonEquipment = JSON.parse(lessonEquipment);
                item.additionalResources = JSON.parse(additionalResources);

                topic.items.push(item);
            });

            for (const grade in organizedData) {
                for (const chapter in organizedData[grade]) {
                    for (const lang in organizedData[grade][chapter]) {
                        organizedData[grade][chapter][lang].topics.sort((a, b) => a.topicQueue - b.topicQueue);
                    }
                }
            }

            return organizedData;

        })
    }

    useEffect(()=> {
        (
            async () => {
                setLessons(await fetchLessons())
            }
        )()
    }, [setLessons, t, i18n.language])

    // @ts-ignore
    const renderedGrades = gradesData.grades[i18n.language].map((grade: Grade, index: number) => {
        return (
            <div key={`${i18n.language}`+index+'-grade-sidebar-item'}>
                {index === 0 && (
                    <>
                        <Container style={{backgroundColor: 'white', textAlign: 'center'}} py={10}>
                            <Title order={3}>{t('curriculumsPage.basicLevel')}</Title>
                        </Container>
                        <Divider/>
                    </>
                )}
                {index === 4 && (
                    <>
                        <Container style={{backgroundColor: 'white', textAlign: 'center'}} py={10}>
                            <Title order={3}>{t('curriculumsPage.averageLevel')}</Title>
                        </Container>
                        <Divider/>
                    </>
                )}
                {index === 7 && (
                    <>
                        <Container style={{backgroundColor: 'white', textAlign: 'center'}} py={10}>
                            <Title order={3}>{t('curriculumsPage.advancedLevel')}</Title>
                        </Container>
                        <Divider/>
                    </>
                )}
                {index === 9 && (
                    <>
                        <Container style={{backgroundColor: 'white', textAlign: 'center'}} py={10}>
                            <Title order={3}>{t('curriculumsPage.difficultLevel')}</Title>
                        </Container>
                        <Divider/>
                    </>
                )}
                <CurriculumButton onClick={()=>{setSelectedLesson(undefined); setSelectedChapter(undefined); setSelectedGrade(grade)}}
                                  chapters={grade.chapters.length}
                                  name={`${grade.grade} ${t('curriculumsPage.grade')}`}/>
            </div>
        )
    })

    if (!lessons) {
        return (
            <Box style={{display: 'flex', justifyContent: 'center', padding: '30% 0', backgroundColor: 'white'}}>
                <Loader size={40}/>
            </Box>
        )
    }

    const renderedGradeChapters = selectedGrade?.chapters.map((chapter) => {
        let topicsLength = 0
        let chapterInformation = lessons[selectedGrade?.grade][chapter.queue]

        if (chapterInformation) {
            if (chapterInformation[curriculum_language]) {
                topicsLength = chapterInformation[curriculum_language].topics.length
            }
        }

        if (topicsLength == 0 && user?.role !== 'ADMIN') {
            return (
                <LockedCardButton key={`${i18n.language}-chapter-[${chapter.title}]`}
                                 onClick={()=>{setSelectedChapter(chapter)}}
                                 primaryText={chapter.title} secondaryText={`${t('curriculumsPage.locked_title')}`}
                                 categoryText={`${t('curriculumsPage.chapter')} ${chapter.queue}`}/>
            )
        } else {
            return (
                <BasicCardButton key={`${i18n.language}-chapter-[${chapter.title}]`}
                                 onClick={()=>{setSelectedChapter(chapter)}}
                                 primaryText={chapter.title} secondaryText={`${topicsLength} ${t('curriculumsPage.topics')}`}
                                 categoryText={`${t('curriculumsPage.chapter')} ${chapter.queue}`}/>
            )
        }

    })

    let retrievedTopics:ChapterResponse
    let renderedTopics

    const addInDeleteList = (id: string) => {
        const index = deleteList.indexOf(id);

        let newDeleteList = [];

        if (index === -1) {
            newDeleteList = [...deleteList, id];
        } else {
            newDeleteList = deleteList.filter((_item, itemIndex) => itemIndex !== index);
        }

        setDeleteList(newDeleteList);
    }

    if (selectedGrade && selectedChapter) {
        retrievedTopics = retrieveObjectByGradeAndChapter(lessons, selectedGrade?.grade!, selectedChapter?.queue!)

        if (retrievedTopics && retrievedTopics[curriculum_language]) {
            renderedTopics = retrievedTopics[curriculum_language]?.topics.map(topic => {
                if (deleteMode) {
                    return (
                        <Container key={topic.items[0].id} style={{border: '#e8e8e8 1px solid', borderRadius: '10px'}} px={20} py={15} w={'100%'}>
                            <Flex gap={30} align={'center'}>
                                <Checkbox defaultChecked={deleteList.indexOf(topic.items[0].id) !== -1}
                                          size={"xl"} onClick={() => {addInDeleteList(topic.items[0].id)}}/>
                                <div>
                                    <Text fw={600} size={'xs'} c={'green'}>{t('curriculumsPage.topic').toUpperCase()} {topic.topicQueue}</Text>
                                    <Space h={20}/>
                                    <Text fw={600} size={'lg'}>{topic.title}</Text>
                                </div>
                            </Flex>
                        </Container>
                    )
                } else {
                    return (
                        <LessonButton onClick={()=>{setSelectedLesson(topic.items[0])}}
                                      key={`${topic.topicQueue}-${topic.title}`}
                                      primaryText={topic.title}
                                      secondaryText={t('curriculumsPage.lessonButtonClickText')}
                                      categoryText={`${t('curriculumsPage.topic').toUpperCase()} ${topic.topicQueue}`}/>
                    )
                }
            })
        } else {
            renderedTopics = []
        }
    }

    const deleteTopics = () => {
        try {
            setLoading(true)
            AdminService.deleteLessons(deleteList).then(res => {
                (
                    async () => {
                        setDeleteList([])
                        setLessons(await fetchLessons())
                        setLoading(false)
                    }
                )()
                notifications.show({
                    id: 'success-delete-lessons',
                    withCloseButton: true,
                    autoClose: 2000,
                    title: "Successfully deleted lessons!",
                    message: '',
                    color: 'green',
                    icon: <IconCheck />,
                    className: 'my-notification-class',
                    loading: false,
                });
                console.log(res)
            })
        }
        catch (error) {
            setLoading(false)
            notifications.show({
                id: 'error-delete-lessons',
                withCloseButton: true,
                autoClose: 2000,
                title: "Something went wrong, try later!",
                message: '',
                color: 'red',
                icon: <IconExclamationMark />,
                className: 'my-notification-class',
                loading: false,
            });
            console.log(error)
        }
    };

    return (
        <>
            <ChangeCurriculumLanguageModal opened={curriculumLanguageModalShow} setOpened={setCurriculumLanguageModalShow}/>
            <Drawer size={'100%'} opened={!!selectedLesson} onClose={()=>{setSelectedLesson(undefined)}}>
                {
                    selectedLesson && (
                        <LessonPage id={selectedLesson.id} language={selectedLesson!.language}
                                    priorKnowledge={selectedLesson!.priorKnowledge}
                                    grade={selectedLesson!.grade} chapterQueue={selectedLesson!.chapterQueue}
                                    chapter={selectedLesson!.chapter} topicTitle={selectedLesson!.topicTitle}
                                    topicQueue={selectedLesson!.topicQueue} lessonType={selectedLesson!.lessonType}
                                    // @ts-ignore
                                    lessonObjectives={selectedLesson!.lessonObjectives} lessonEquipment={selectedLesson!.lessonEquipment}
                                    lessonStart={selectedLesson!.lessonStart} lessonMiddle={selectedLesson!.lessonMiddle}
                                    lessonEnd={selectedLesson!.lessonEnd}
                                    // @ts-ignore
                                    linkForDoc={selectedLesson!.linkForDoc} additionalResources={selectedLesson!.additionalResources} presentationLinks={selectedLesson!.presentationLinks} videoLinks={selectedLesson!.videoLinks}/>
                    )
                }
            </Drawer>
            <CreateLessonDrawer fetchLessons={fetchLessons} opened={showLessonDrawer} onClose={close}/>
            <Grid gutter={30}>
                <Grid.Col span={3}>
                    <Title order={3}>Curriculums list</Title>
                    <Button onClick={()=>{setCurriculumLanguageModalShow(true)}}
                            variant={'outline'} color={'gray'} mt={20} w={'100%'} >{t('curriculumsPage.changeLanguageButton')}</Button>
                    {user?.role === 'ADMIN' && (
                        <>
                            <Space h={"lg"}/>
                            <Button onClick={open} variant={'outline'} style={{width: '100%'}} leftSection={<IconPlus/>} color={'green'}>{t('curriculumsPage.addNewLessonButton')}</Button>
                        </>
                    )}
                    <Space h={"lg"}/>
                    {renderedGrades}
                    <Space h={'md'}/>
                </Grid.Col>
                {
                    selectedChapter ? (
                        <Grid.Col span={9}>
                            <LoadingOverlay visible={loading}/>
                            <Flex align={'center'} gap={30}>
                                <Title style={{cursor: 'pointer'}} order={2} c={'blue'}>{selectedGrade!.grade} {t('curriculumsPage.grade')}</Title>
                                <IconArrowRight/>
                                <Flex direction={'column'}>
                                    <Text c={'blue'}>{selectedChapter!.queue} {t('curriculumsPage.chapter')}</Text>
                                    <Title order={2}>{selectedChapter.title}</Title>
                                </Flex>
                            </Flex>
                            <Space h={20}/>
                            <Button onClick={()=>{setSelectedChapter(undefined)}} leftSection={<IconArrowLeft/>} variant={'outline'}>{t('curriculumsPage.goBackButton')}</Button>
                            <Flex gap={30} align={'center'}>
                                {
                                    user?.role === 'ADMIN' && (
                                        <Box style={{margin: '20px 0', border: '#dcdcdc 1px solid', width: '300px', padding: '10px', borderRadius: '100px'}}>
                                            <Switch onChange={() => {setDeleteMode(!deleteMode)}}
                                                    size="xl" color={'red'} onLabel="ON" offLabel="OFF" label={t('curriculumsPage.deleteMode')}/>
                                        </Box>
                                    )
                                }
                                {
                                    deleteList.length !== 0 && (
                                        <Button loading={loading} disabled={loading} radius={'100'} onClick={()=>{deleteTopics()}}
                                                leftSection={<IconTrash />} color={'red'}>{t('curriculumsPage.deleteSelected', {count: deleteList.length})}</Button>
                                    )
                                }
                            </Flex>
                            {/*@ts-ignore*/}
                            { renderedTopics.length !== 0 ? (
                                    <Group gap={30}>
                                        {renderedTopics}
                                    </Group>
                                ) : (
                                <Flex style={{border: '1px solid #858585', borderRadius: '10px'}} align='center' direction={'column'} justify={'center'} h={'50vh'} gap={30}>
                                    <IconSearch size={50}/>
                                    <Text fw={700}>{t('curriculumsPage.noTopics')}</Text>
                                </Flex>
                            )}
                        </Grid.Col>
                    ) : selectedGrade ? (
                        <Grid.Col span={9}>
                            <Title order={1} c={'blue'}>{selectedGrade.grade} {t('curriculumsPage.grade')}</Title>
                            <Space h={50}/>
                            <SimpleGrid cols={2}>
                                {renderedGradeChapters}
                            </SimpleGrid>
                        </Grid.Col>
                    ) : (
                        <Grid.Col span={9}>
                            <Flex align={'center'} direction={'column'} gap={30} justify={'center'} h={'100vh'}>
                                <IconHandFinger size={50}/>
                                <Title order={3} fw={500}>
                                    {t('curriculumsPage.selectToView')}
                                </Title>
                            </Flex>
                        </Grid.Col>
                    )
                }
            </Grid>
        </>
    )
}