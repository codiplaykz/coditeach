import {Accordion, Badge, Container, Flex, Grid, ScrollArea, Space, Title} from "@mantine/core";
import {useState} from "react";
import {CourseButton} from "../../components/buttons/CourseButton.tsx";
import {IconVideo} from "@tabler/icons-react";

interface LessonResponse {
    id: number,
    title: string,
    videoUrl: string
}

interface TopicResponse {
    id: number,
    title: string,
    lessons: LessonResponse[]
}

interface ChapterResponse {
    id: number,
    title: string,
    topics: TopicResponse[]
}

interface CourseResponse {
    id: number,
    title: string,
    hours: number,
    chapters: ChapterResponse[]
}

const mockCoursesData = [
    {
        id: 1,
        title: 'Arduino Course',
        hours: 42,
        chapters: [
            // Chapter 1
            {
                id: 101,
                title: 'Getting Started',
                topics: [
                    {
                        id: 1001,
                        title: 'Introduction to Arduino',
                        lessons: [
                            {
                                id: 10001,
                                title: 'What is Arduino?',
                                videoUrl: 'https://example.com/arduino-intro'
                            },
                            {
                                id: 1010102,
                                title: 'Setting Up Your Arduino',
                                videoUrl: 'https://example.com/arduino/getting-started/setting-up'
                            },
                            {
                                id: 1010103,
                                title: 'Understanding the Arduino IDE',
                                videoUrl: 'https://example.com/arduino/getting-started/arduino-ide'
                            },
                            {
                                id: 1010104,
                                title: 'Your First Arduino Program',
                                videoUrl: 'https://example.com/arduino/getting-started/first-program'
                            },
                            {
                                id: 1010105,
                                title: 'Reading from a Sensor',
                                videoUrl: 'https://example.com/arduino/getting-started/sensor-reading'
                            },
                            {
                                id: 1010106,
                                title: 'Writing to an LED',
                                videoUrl: 'https://example.com/arduino/getting-started/writing-led'
                            },
                            {
                                id: 1010107,
                                title: 'Debugging Tips',
                                videoUrl: 'https://example.com/arduino/getting-started/debugging'
                            },
                            {
                                id: 1010108,
                                title: 'Understanding GPIO',
                                videoUrl: 'https://example.com/arduino/getting-started/gpio'
                            },
                            {
                                id: 1010109,
                                title: 'Working with Libraries',
                                videoUrl: 'https://example.com/arduino/getting-started/libraries'
                            },
                            {
                                id: 1010110,
                                title: 'Arduino Project Ideas',
                                videoUrl: 'https://example.com/arduino/getting-started/project-ideas'
                            }
                        ]
                    }
                ]
            },
            // Chapter 2
            {
                id: 102,
                title: 'Basic Programming',
                topics: [
                    {
                        id: 1002,
                        title: 'Arduino Syntax',
                        lessons: [
                            {
                                id: 10002,
                                title: 'Loops in Arduino',
                                videoUrl: 'https://example.com/arduino-loops'
                            }
                        ]
                    }
                ]
            },
            // Chapter 3
            {
                id: 103,
                title: 'Sensors and Inputs',
                topics: [
                    {
                        id: 1003,
                        title: 'Using Sensors',
                        lessons: [
                            {
                                id: 10003,
                                title: 'Temperature Sensors',
                                videoUrl: 'https://example.com/arduino-temperature-sensors'
                            }
                        ]
                    }
                ]
            },
            // Chapter 4
            {
                id: 104,
                title: 'Final Project',
                topics: [
                    {
                        id: 1004,
                        title: 'Creating a Weather Station',
                        lessons: [
                            {
                                id: 10004,
                                title: 'Assembling the Project',
                                videoUrl: 'https://example.com/arduino-final-project'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        title: 'Python Course',
        hours: 51,
        chapters: [
            // Chapter 1
            {
                id: 201,
                title: 'Python Basics',
                topics: [
                    {
                        id: 2001,
                        title: 'Python Syntax',
                        lessons: [
                            {
                                id: 20001,
                                title: 'Introduction to Python',
                                videoUrl: 'https://example.com/python-intro'
                            }
                        ]
                    }
                ]
            },
            // Chapter 2
            {
                id: 202,
                title: 'Data Structures',
                topics: [
                    {
                        id: 2002,
                        title: 'Lists and Dictionaries',
                        lessons: [
                            {
                                id: 20002,
                                title: 'Working with Lists',
                                videoUrl: 'https://example.com/python-lists'
                            }
                        ]
                    }
                ]
            },
            // Chapter 3
            {
                id: 203,
                title: 'Web Development',
                topics: [
                    {
                        id: 2003,
                        title: 'Flask Basics',
                        lessons: [
                            {
                                id: 20003,
                                title: 'Introduction to Flask',
                                videoUrl: 'https://example.com/python-flask'
                            }
                        ]
                    }
                ]
            },
            // Chapter 4
            {
                id: 204,
                title: 'Advanced Topics',
                topics: [
                    {
                        id: 2004,
                        title: 'Asynchronous Programming',
                        lessons: [
                            {
                                id: 20004,
                                title: 'Intro to Async',
                                videoUrl: 'https://example.com/python-async'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        title: 'C++ Course',
        hours: 39,
        chapters: [
            // Chapter 1
            {
                id: 301,
                title: 'C++ Fundamentals',
                topics: [
                    {
                        id: 3001,
                        title: 'Basic Syntax',
                        lessons: [
                            {
                                id: 30001,
                                title: 'C++ Hello World',
                                videoUrl: 'https://example.com/cpp-helloworld'
                            }
                        ]
                    }
                ]
            },
            // Chapter 2
            {
                id: 302,
                title: 'Object-Oriented Programming',
                topics: [
                    {
                        id: 3002,
                        title: 'Classes and Objects',
                        lessons: [
                            {
                                id: 30002,
                                title: 'Defining Classes',
                                videoUrl: 'https://example.com/cpp-classes'
                            }
                        ]
                    }
                ]
            },
            // Chapter 3
            {
                id: 303,
                title: 'STL Basics',
                topics: [
                    {
                        id: 3003,
                        title: 'Vectors and Maps',
                        lessons: [
                            {
                                id: 30003,
                                title: 'Introduction to Vectors',
                                videoUrl: 'https://example.com/cpp-vectors'
                            }
                        ]
                    }
                ]
            },
            // Chapter 4
            {
                id: 304,
                title: 'Advanced C++',
                topics: [
                    {
                        id: 3004,
                        title: 'Memory Management',
                        lessons: [
                            {
                                id: 30004,
                                title: 'Understanding Pointers',
                                videoUrl: 'https://example.com/cpp-pointers'
                            }
                        ]
                    }
                ]
            }
        ]
    }
];


export default function CoursesPage() {
    const [selectedCourse, setSelectedCourse] = useState<CourseResponse>()

    const renderedCourses = mockCoursesData.map((course: CourseResponse) => {
        return (
            <CourseButton onClick={()=>{setSelectedCourse(course)}} hours={course.hours} name={course.title}/>
        )
    })

    const renderedSelectedCourse = selectedCourse?.chapters.map((chapter: ChapterResponse, index: number) => {
        const renderedTopics = chapter.topics.map((topic: TopicResponse, index:number) => {
            const renderedLesson = topic.lessons.map((lesson: LessonResponse) => {
                return (
                    <>
                        <Container style={{border: '1px solid lightgray', borderRadius: '5px', cursor: 'pointer'}}>
                            <Grid py={10} px={15} align={'center'}>
                                <Grid.Col span={5}>
                                    <Flex direction={'row'} gap={20}>
                                        <IconVideo/> {lesson.title}
                                    </Flex>
                                </Grid.Col>
                                <Grid.Col span={5}>
                                    <Badge>Watch lesson</Badge>
                                </Grid.Col>
                            </Grid>
                        </Container>
                        <Space h={'md'}/>
                    </>
                )
            })
            return (
                <Accordion variant="separated" radius="xs" defaultValue="customization">
                    <Accordion.Item value="customization">
                        <Accordion.Control><b>TOPIC {index+1} | </b>{topic.title}</Accordion.Control>
                        <Accordion.Panel>{renderedLesson}</Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            )
        })
        return (
            <>
                <Accordion variant="separated" radius="xs" defaultValue="customization">
                    <Accordion.Item value="customization">
                        <Accordion.Control><b>CHAPTER {index+1} |</b> {chapter.title}</Accordion.Control>
                        <Accordion.Panel>{renderedTopics}</Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
                <Space h={'xl'}/>
            </>
        )
    })

    return (
        <>
            <Grid gutter={5}>
                <Grid.Col span={3}>
                    <Title order={3}>Courses list</Title>
                    <Space h={"lg"}/>

                    <ScrollArea h={500}>
                        {renderedCourses}
                    </ScrollArea>
                    <Space h={'md'}/>
                    <Space h={'md'}/>
                </Grid.Col>
                {
                    selectedCourse && (
                        <Grid.Col span={9} style={{backgroundColor: "white"}}>
                            <Title order={2}>{selectedCourse.title}</Title>
                            <Space h={'xl'}/>
                            <Space h={'xl'}/>
                            {renderedSelectedCourse}
                        </Grid.Col>
                    )
                }
            </Grid>
        </>
    )
}