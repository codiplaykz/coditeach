import {
    Button,
    Container,
    Divider,
    Drawer,
    Flex,
    Input,
    NumberInput,
    Select,
    Space,
    Table,
    TagsInput,
    Text,
    Textarea,
    TextInput
} from "@mantine/core";
import {useEffect, useState} from "react";
import {IconArrowRight, IconCheck, IconCloudUpload, IconExclamationMark, IconX} from "@tabler/icons-react";
import {useForm} from "@mantine/form";
import {LanguagePicker, languagesData} from "../../components/sidebar/LanguagePicker.tsx";
import {notifications} from "@mantine/notifications";
import AdminService from "../../api/AdminService.ts";
import * as gradesData from './curriculumData.json'

interface UpdateLessonProps {
    id: string
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

interface UpdateLessonDrawerProps {
    opened: boolean,
    onClose: () => void,
    lesson: UpdateLessonProps
}

export interface Grade {
    grade: number,
    chapters: Chapter[]
}

export interface Chapter {
    queue: number,
    title: string
}

export interface UpdateLessonDto {
    id: string
    language: string
    grade: number
    chapterQueue: number
    chapter: string
    topicTitle: string
    topicQueue: number
    lessonType: string
    lessonObjectives: string
    lessonEquipment: string
    priorKnowledge: string,
    lessonStart: string
    lessonMiddle: string
    lessonEnd: string
    videoLinks: string,
    presentationLinks: string,
    linkForDoc: string
    additionalResources: string
}

export default function UpdateLessonDrawer({ opened, onClose, lesson }: UpdateLessonDrawerProps) {
    const [loading, setLoading] = useState(false)

    const lessonForm = useForm({
        initialValues: {
            language: languagesData.find(item => item.value === lesson.language),
            grade: lesson.grade ?? 0,
            chapterQueue: lesson.chapterQueue ?? 0,
            chapter: lesson.chapter ?? '',
            topicTitle: lesson.topicTitle ?? '',
            topicQueue: lesson.topicQueue ?? 0,
            lessonType: lesson.lessonType ?? '',
            lessonObjectives: lesson.lessonObjectives ?? '',
            lessonEquipment: lesson.lessonEquipment ?? [],
            priorKnowledge: lesson.priorKnowledge ?? '',
            lessonStart: lesson.lessonStart ?? '',
            lessonMiddle: lesson.lessonMiddle ?? '',
            lessonEnd: lesson.lessonEnd ?? '',
            videoLinks: lesson.videoLinks ?? [],
            presentationLinks: lesson.presentationLinks ?? [],
            linkForDoc: lesson.linkForDoc ?? '',
            additionalResources: lesson.additionalResources ?? []
        }
    })

    const { language, lessonEquipment, priorKnowledge,
        lessonObjectives, lessonType, topicQueue,
        topicTitle, chapter, grade, lessonStart,
        lessonMiddle, lessonEnd, videoLinks, presentationLinks,
        linkForDoc, chapterQueue , additionalResources} = lessonForm.values

    // @ts-ignore
    const grades: Grade[] = gradesData.grades[language.value], lessonTypes = gradesData.lessonTypes[language.value]

    useEffect(() => {
        const { grade } = lessonForm.values
        if (!grade)
        {
            lessonForm.setFieldValue('chapter', '')
            lessonForm.setFieldValue('topicQueue', 0)
        }
    }, [lessonForm.setFieldValue, lessonForm.values.grade]);

    const firstStageFinished = (grade && chapter && topicQueue) && true
    const secondStageFinished = (topicTitle && lessonType && lessonObjectives && lessonEquipment.length !== 0 && priorKnowledge) && true
    const thirdStageFinished = (lessonStart && lessonMiddle && lessonEnd) && true

    // @ts-ignore
    const gradeChapters = grades.filter(item => item.grade === +grade)[0]?.chapters.map((chapter) => {return `[${chapter.queue}] - ${chapter.title}`})

    const handleLanguageChange = (value: any) => {
        lessonForm.setFieldValue('language', value)
        if (chapter) {
            let selectedChapter = grades.find(item => item.grade === +grade)!.chapters.find((chapterItem) => chapterItem.queue === chapterQueue)
            let selectedLessonTypeIndex = lessonTypes.find((item: string) => item === lessonType)
            lessonForm.setFieldValue('chapter', selectedChapter!.title)
            lessonForm.setFieldValue('chapterQueue', selectedChapter!.queue)
            lessonForm.setFieldValue('lessonType', lessonTypes[selectedLessonTypeIndex])
        }
    }

    const updateLesson = () => {
        if (firstStageFinished && secondStageFinished && thirdStageFinished) {
            const enteredLesson: UpdateLessonDto = {
                id: lesson.id,
                language: language!.value,
                grade: +grade,
                chapterQueue,
                chapter,
                topicTitle,
                topicQueue,
                lessonType,
                lessonObjectives,
                lessonEquipment: JSON.stringify(lessonEquipment),
                priorKnowledge,
                lessonStart,
                lessonMiddle,
                lessonEnd,
                videoLinks: JSON.stringify(videoLinks),
                presentationLinks: JSON.stringify(presentationLinks),
                linkForDoc,
                additionalResources: JSON.stringify(additionalResources)
            }

            try {
                setLoading(true)
                AdminService.updateLesson(enteredLesson).then(res => {
                    console.log(res)
                    setLoading(false)
                    onClose()
                    location.reload()
                    notifications.show({
                        withCloseButton: true,
                        autoClose: 2000,
                        title: "Lesson updated!",
                        message: '',
                        color: 'green',
                        icon: <IconCheck />,
                        className: 'my-notification-class',
                        loading: false,
                    });
                })
            } catch (error) {
                setLoading(false)
                notifications.show({
                    withCloseButton: true,
                    autoClose: 2000,
                    title: "Something went wrong, try later.",
                    message: '',
                    color: 'red',
                    icon: <IconX />,
                    className: 'my-notification-class',
                    loading: false,
                });
            }
        } else {
            setLoading(false)
            notifications.show({
                withCloseButton: true,
                autoClose: 2000,
                title: "Enter all data!",
                message: '',
                color: 'yellow',
                icon: <IconExclamationMark />,
                className: 'my-notification-class',
                loading: false,
            });
        }
    }

    return (
        <>
            <Drawer position={"right"} size={'50%'} opened={opened} onClose={onClose} title={<b>Update lesson</b>}>
                <div>
                    <>
                        <Divider/>
                        <Space h={30}/>
                        <Text fw={600} pb={10} size={'14px'}>Choose lesson language</Text>
                        <LanguagePicker selected={language} setSelected={(value: any)=>{handleLanguageChange(value)}}/>
                        <Space h={30}/>
                        <Flex direction={'column'} gap={30}>
                            <Flex gap={30}>
                                {/*@ts-ignore*/}
                                <Select label={'Choose grade'} data={grades.map((item) => item.grade)} {...lessonForm.getInputProps('grade')}/>

                                <Select label={'Choose chapter'} data={gradeChapters} value={`[${chapterQueue}] - ${chapter}`} onChange={(value: string)=>{
                                    let selectedChapterQueue = +value.match(/\d+/g)![0]
                                    // @ts-ignore
                                    let selectedChapter = grades.find(item => item.grade === +grade).chapters.find((chapter) => chapter.queue === selectedChapterQueue)
                                    lessonForm.setFieldValue('chapterQueue', selectedChapter!.queue)
                                    lessonForm.setFieldValue('chapter', selectedChapter!.title)
                                }}/>

                                <NumberInput
                                    {...lessonForm.getInputProps('topicQueue')}
                                    label="Topic queue"
                                    placeholder="Enter topic queue"
                                    min={1}
                                />
                            </Flex>

                            <Flex align={'center'} gap={50}>
                                <Flex direction={'column'}>
                                    <Text c={"dimmed"}>Selected grade</Text>
                                    {grade ? <Text fw={600}>Grade {grade}</Text> : <Text fw={600}>Not selected yet</Text>}
                                </Flex>
                                <IconArrowRight/>
                                <Flex direction={'column'}>
                                    <Text c={"dimmed"}>Selected chapter</Text>
                                    {chapter ? <Text fw={600}>Chapter {chapterQueue}</Text> : <Text fw={600}>Not selected yet</Text>}
                                    {chapter && <Text fw={600} c={'blue'}>{chapter}</Text>}
                                </Flex>
                                <IconArrowRight/>
                                <Flex direction={'column'}>
                                    <Text c={"dimmed"}>Entered topic queue</Text>
                                    {topicQueue ? <Text fw={600}>Topic {topicQueue}</Text> : <Text fw={600}>Not selected yet</Text>}
                                </Flex>
                            </Flex>

                            <Container w={'100%'} px={0}>
                                <Flex gap={30} w={'100%'}>
                                    <Input.Wrapper label="Lesson topic title" w={'100%'}>
                                        <Input placeholder="Enter lesson topic title" {...lessonForm.getInputProps('topicTitle')}/>
                                    </Input.Wrapper>
                                    <Select w={'100%'} label={'Lesson type'} placeholder={'Choose lesson type'} data={lessonTypes} {...lessonForm.getInputProps('lessonType')}/>
                                </Flex>
                                <Space h={30}/>
                                <Flex gap={30} w={'100%'}>
                                    <Textarea w={'50%'} autosize label={'Lesson objectives'} placeholder={'Enter lesson objectives'} {...lessonForm.getInputProps('lessonObjectives')}/>
                                    <TagsInput
                                        w={'50%'}
                                        label="Lesson equipment"
                                        placeholder="Press Enter to submit equipment"
                                        value={lessonForm.values.lessonEquipment}
                                        // @ts-ignore
                                        onChange={(value) => {lessonForm.setFieldValue('lessonEquipment', value)}}
                                    />
                                </Flex>
                                <Space h={30}/>
                                <Textarea w={'100%'} autosize label={'Lesson prior knowledge'} placeholder={'Enter lesson prior knowledge'} {...lessonForm.getInputProps('priorKnowledge')}/>
                            </Container>

                            <Table striped highlightOnHover withTableBorder withColumnBorders>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Scheduled lesson steps</Table.Th>
                                        <Table.Th>Planned activity in the lesson</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Td style={{display: 'flex', justifyContent: 'center'}}>
                                            <div>
                                                <p>Lesson start</p>
                                                <p>0-10 minutes</p>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <Textarea autosize placeholder={'Enter lesson plan for 0-10 min'} {...lessonForm.getInputProps('lessonStart')}/>
                                        </Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Td style={{display: 'flex', justifyContent: 'center'}}>
                                            <div>
                                                <p>Middle of the lesson</p>
                                                <p>10-30 minutes</p>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <Textarea autosize placeholder={'Enter lesson plan for 10-30 min'} {...lessonForm.getInputProps('lessonMiddle')}/>
                                        </Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Td style={{display: 'flex', justifyContent: 'center'}}>
                                            <div>
                                                <p>End of the lesson</p>
                                                <p>30–40 minutes</p>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <Textarea autosize placeholder={'Enter lesson plan for 30-40 min'} {...lessonForm.getInputProps('lessonEnd')}/>
                                        </Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>

                            <Container w={'100%'} px={0}>
                                <Flex gap={30} w={'100%'}>
                                    <Flex gap={10} direction={'column'} w={'100%'}>
                                        <TagsInput
                                            w={'100%'}
                                            label="Video links"
                                            placeholder="Press Enter to add video link"
                                            // @ts-ignore
                                            onChange={(value) => {lessonForm.setFieldValue('videoLinks', value)}}
                                            {...lessonForm.getInputProps('videoLinks')}
                                        />

                                        <TagsInput
                                            w={'100%'}
                                            label="Presentation links"
                                            placeholder="Press Enter to add presentation link"
                                            // @ts-ignore
                                            onChange={(value) => {lessonForm.setFieldValue('presentationLinks', value)}}
                                            {...lessonForm.getInputProps('presentationLinks')}
                                        />

                                        <TextInput label="Document link" type={'url'} placeholder="https://example.com" {...lessonForm.getInputProps('linkForDoc')}/>

                                        <TagsInput
                                            w={'100%'}
                                            label="Additional resources"
                                            placeholder="Press Enter to add additional resource"
                                            // @ts-ignore
                                            onChange={(value) => {lessonForm.setFieldValue('additionalResources', value)}}
                                            {...lessonForm.getInputProps('additionalResources')}
                                        />
                                        {/*<Button leftSection={<IconEye/>} onClick={previewLesson} disabled={loading}>Preview lesson</Button>*/}
                                        <Button leftSection={<IconCloudUpload/>} color={'blue'} onClick={updateLesson} loading={loading} disabled={loading}>Complete and update lesson</Button>
                                    </Flex>
                                </Flex>
                            </Container>
                        </Flex>
                        <Space h={30}/>
                    </>
                </div>
            </Drawer>
        </>
    )
}