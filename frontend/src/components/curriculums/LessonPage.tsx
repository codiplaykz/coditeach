import {
    Anchor,
    Badge,
    Breadcrumbs,
    Button,
    Container,
    Divider,
    Flex,
    Grid,
    List,
    Modal,
    Space,
    Table,
    Text,
    Title
} from "@mantine/core";
import {IconEdit, IconFileDownload, IconVideo} from "@tabler/icons-react";
import {useState} from "react";
import {useUserStore} from "../../store/user";
import UpdateLessonDrawer from "../../pages/curriculums/updateLessonDrawer.tsx";
import {useTranslation} from "react-i18next";

function extractVideoID(url: string) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}

interface LessonPageProps {
    id?: string
    language: string
    grade: number
    chapterQueue: number
    chapter: string
    topicTitle: string
    topicQueue: number
    lessonType: string
    lessonObjectives: string
    lessonEquipment: string[]
    priorKnowledge: string,
    lessonStart: string
    lessonMiddle: string
    lessonEnd: string
    videoLinks: string[],
    presentationLinks: string[],
    linkForDoc: string
    additionalResources: string[]
}

export default function LessonPage({   id, language, chapterQueue, topicQueue,
                                       grade, chapter, topicTitle,
                                       lessonType, lessonObjectives, lessonEquipment,
                                       priorKnowledge, lessonStart, lessonMiddle,
                                       lessonEnd, videoLinks, presentationLinks, linkForDoc,
                                       additionalResources}: LessonPageProps) {
    const [videoModalOpened, setVideoModalOpened] = useState(false)
    const [selectedVideoLink, setSelectedVideoLink] = useState('')
    const {user} = useUserStore()
    const [showUpdateLessonDrawer, setShowUpdateLessonDrawer] = useState(false)
    const { t } = useTranslation()

    const openVideoModal = () => {
        setVideoModalOpened(true)
    }

    const closeVideoModal = () => {
        setVideoModalOpened(false)
    }
    const items = [
        { title: `${grade} ${t('curriculumsPage.grade')}`, href: '/curriculums' },
        { title: `${chapter}`, href: '/curriculums' },
        { title: `${topicTitle}`, href: '/curriculums' },
    ].map((item, index) => (
        <Anchor href={item.href} key={index+'-anchor'}>
            <Text size={'xl'}>
                {item.title}
            </Text>
        </Anchor>
    ));

    const openUpdateLessonDrawer = () => {
        setShowUpdateLessonDrawer(true)
    };

    const closeUpdateLessonDrawer = () => {
        setShowUpdateLessonDrawer(false)
    }

    return (
        <>
            <UpdateLessonDrawer opened={showUpdateLessonDrawer} onClose={closeUpdateLessonDrawer} lesson={
                {
                    id: id!,
                    language,
                    grade,
                    chapterQueue,
                    chapter,
                    topicTitle,
                    topicQueue,
                    lessonType,
                    lessonObjectives,
                    lessonEquipment,
                    priorKnowledge,
                    lessonStart,
                    lessonMiddle,
                    lessonEnd,
                    videoLinks,
                    presentationLinks,
                    linkForDoc,
                    additionalResources
                }
            }/>
            <Modal title={<Title order={4}>{topicTitle}</Title>} opened={videoModalOpened} onClose={()=>{closeVideoModal()}} size={'70%'}>
                <Space h={'xl'}/>
                <Flex justify={'center'}>
                    <iframe width={'1000'} height="700" src={`https://www.youtube.com/embed/${extractVideoID(selectedVideoLink)}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                </Flex>
            </Modal>
            <Container style={{backgroundColor: "white"}}>
                <Breadcrumbs separator="→" mt="xs">{items}</Breadcrumbs>
                <Space h={20}></Space>
                <Flex gap={30}>
                    <Title order={2}>{t('lessonPage.title')}</Title>
                    {user?.role === 'ADMIN' && (
                        <Button onClick={openUpdateLessonDrawer} variant={'outline'} leftSection={<IconEdit/>} color={'blue'} radius={'100'}>{t('lessonPage.editLesson')}</Button>
                    )}
                </Flex>
                <Space h={'xl'}/>
                {videoLinks?.length !== 0 && (
                    <>
                        <Title order={5}>{t('lessonPage.lessonVideos')}</Title>
                        <Space h={10}/>
                    </>
                )}
                <Flex gap={20}>
                    {
                        videoLinks ? videoLinks?.map((videoLink: string, index: number) => {
                            return (
                                <Button leftSection={<IconVideo/>}
                                        color={'green'}
                                        onClick={()=>{openVideoModal(); setSelectedVideoLink(videoLink)}}>
                                    {t('lessonPage.watchVideoButton', { text: index+1 })}
                                </Button>
                            )
                        }) : (
                            t('lessonPage.lessonVideoNotAdded')
                        )
                    }
                </Flex>
                <Space h={30}/>
                {presentationLinks?.length !== 0 && (
                    <>
                        <Title order={5}>{t('lessonPage.lessonPresentations')}</Title>
                        <Space h={10}/>
                    </>
                )}
                <Flex gap={20}>
                    {
                        presentationLinks ? presentationLinks?.map((presentationLink: string, index: number) => {
                            return (
                                <Button leftSection={<IconFileDownload/>}
                                        onClick={()=>{window.open(presentationLink, '_blank')}}>
                                    {t('lessonPage.downloadPresentationButton', { text: index+1 })}
                                </Button>
                            )
                        }) : (
                            t('lessonPage.lessonPresentationNotAdded')
                        )
                    }
                </Flex>
                <Space h={30}/>
                <Title order={5}>{t('lessonPage.documentFormatLabel')}</Title>
                <Space h={10}/>
                <Flex gap={20}>
                    {linkForDoc ? (
                        <Button leftSection={<IconFileDownload/>} onClick={()=>{window.open(linkForDoc, '_blank')}}>Download file</Button>
                    ) : (
                        t('lessonPage.documentLinkNotAdded')
                    )}
                </Flex>
                <Space h={'xl'}/>
                <Flex gap={20} direction={'column'}>
                    <Divider/>
                    <Grid align={'center'}>
                        <Grid.Col span={3}>
                            <Badge variant={'outline'} size={"lg"} radius={'xs'}>{t('lessonPage.topic')}</Badge>
                        </Grid.Col>
                        <Grid.Col span={8}>
                            {topicTitle}
                        </Grid.Col>
                    </Grid>
                    <Divider/>
                    <Grid align={'center'}>
                        <Grid.Col span={3}>
                            <Badge variant={'outline'} size={"lg"} radius={'xs'}>{t('lessonPage.type')}</Badge>
                        </Grid.Col>
                        <Grid.Col span={8}>
                            {lessonType}
                        </Grid.Col>
                    </Grid>
                    <Divider/>
                    <Grid align={'center'}>
                        <Grid.Col span={3}>
                            <Badge variant={'outline'} size={"lg"} radius={'xs'}>{t('lessonPage.objectives')}</Badge>
                        </Grid.Col>
                        <Grid.Col span={8} style={{whiteSpace: 'pre-line'}}>
                            {lessonObjectives}
                        </Grid.Col>
                    </Grid>
                    <Divider/>
                    <Grid align={'center'}>
                        <Grid.Col span={3}>
                            <Badge variant={'outline'} size={"lg"} radius={'xs'}>{t('lessonPage.equipment')}</Badge>
                        </Grid.Col>
                        <Grid.Col span={8}>
                            <Flex gap={10}>
                                {lessonEquipment.map((item: string) => {
                                    return (
                                        <Badge radius={'md'} color={'green'}>{item}</Badge>
                                    )
                                })}
                            </Flex>
                        </Grid.Col>
                    </Grid>
                    <Divider/>
                    <Grid align={'center'}>
                        <Grid.Col span={3}>
                            <Badge variant={'outline'} size={"lg"} radius={'xs'}>{t('lessonPage.priorKnowledge')}</Badge>
                        </Grid.Col>
                        <Grid.Col span={8} style={{whiteSpace: 'pre-line'}}>
                            {priorKnowledge}
                        </Grid.Col>
                    </Grid>
                    <Divider/>
                </Flex>
                <Space h={'xl'}/>
                <Space h={'xl'}/>
                <Title order={2}>{t('lessonPage.duringClasses')}</Title>
                <Space h={'xl'}/>
                <Table withTableBorder striped highlightOnHover withColumnBorders horizontalSpacing="xl" verticalSpacing="md">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t('lessonPage.scheduledLessonSteps')}</Table.Th>
                            <Table.Th>{t('lessonPage.plannedActivity')}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>
                                <p>
                                    {t('lessonPage.begin')}
                                </p>
                                <p>
                                    {t('lessonPage.beginTime')}
                                </p>
                            </Table.Td>
                            <Table.Td style={{whiteSpace: 'pre-line'}}>
                                {lessonStart}
                            </Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>
                                <p>
                                    {t('lessonPage.middle')}
                                </p>
                                <p>
                                    {t('lessonPage.middleTime')}
                                </p>
                            </Table.Td>
                            <Table.Td style={{whiteSpace: 'pre-line'}}>
                                {lessonMiddle}
                            </Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>
                                <p>
                                    {t('lessonPage.end')}
                                </p>
                                <p>
                                    {t('lessonPage.endTime')}
                                </p>
                            </Table.Td>
                            <Table.Td style={{whiteSpace: 'pre-line'}}>
                                {lessonEnd}
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
                <Title order={3} my={20}>{t('lessonPage.additionalResources')}</Title>
                <List>
                    {
                        additionalResources.map((link) => {
                            return (
                                <List.Item>
                                    <a href={link} target={'_blank'}>{link}</a>
                                </List.Item>
                            )
                        })
                    }
                </List>
            </Container>

        </>
    )
}