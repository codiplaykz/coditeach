import {useState} from 'react';
import {Box, Button, Drawer, FileInput, Flex, LoadingOverlay, Text, TextInput} from '@mantine/core';
import * as XLSX from 'xlsx';
import {IconCheck, IconEraser, IconFileDownload, IconX} from "@tabler/icons-react";
import StudentService from "../../api/studentService.ts";
import {notifications} from "@mantine/notifications";
import { saveAs } from 'file-saver';
import {useTranslation} from "react-i18next";

interface ImportStudentsListDrawerProps {
    opened: boolean;
    onClose: () => void;
    classroomId: string;
    fetchClassrooms: Function;
}

interface StudentData {
    name: string;
    accountId: string;
    password: string;
    classroomId: string;
}

function generateLogin(): string {
    const length = 10;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let login = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        login += characters.charAt(randomIndex);
    }

    return login;
}

export default function ImportStudentsListDrawer({ opened, onClose, classroomId, fetchClassrooms }: ImportStudentsListDrawerProps) {
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [students, setStudents] = useState<StudentData[]>([]);
    const [downloadData, setDownloadData] = useState<object[]>([]);
    const [loading, setLoading] = useState(false)
    const [isCreated, setIsCreated] = useState(false)
    const { t } = useTranslation()

    const transliterate = (text: string) => {
        const cyrillicToLatinMap = {
            'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
            'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
            'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
            'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
            'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch',
            'Ш': 'Sh', 'Щ': 'Shch', 'Ы': 'Y', 'Э': 'E', 'Ю': 'Yu',
            'Я': 'Ya', 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g',
            'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z',
            'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
            'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's',
            'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
            'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ы': 'y', 'э': 'e',
            'ю': 'yu', 'я': 'ya', 'ъ': '', 'ь': ''
        };
        // @ts-ignore
        return text.split('').map(char => cyrillicToLatinMap[char]).join('');
    };

    const generateNickname = (values: string[]) => {
        if (values.length < 2) return 'InvalidName';

        const transliteratedFirst = transliterate(values[0]);
        const transliteratedSecond = transliterate(values[1]);
        const login = generateLogin()

        if (!transliteratedFirst || !transliteratedSecond) {
            return login
        }
        const sixDigitNumber = Math.floor(100000 + Math.random() * 900000);

        return `${transliteratedFirst}${transliteratedSecond}${sixDigitNumber}`;
    };

    const generatePassword = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const handleFileChange = (file: File | null) => {
        if (file) {
            setExcelFile(file);
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet);

                const downloadData: object[] = []

                const newStudents = data.map((student: any) => {
                    const values = Object.values(student).map(String);
                    const concatenatedName = values.join(' ');
                    const accountId = generateNickname(values);
                    const password = generatePassword();
                    downloadData.push({
                        ...student, ID: accountId, Password: password
                    })
                    return { name: concatenatedName, accountId,password, classroomId};
                });

                setDownloadData(downloadData)
                setStudents(newStudents);
            };
            reader.readAsBinaryString(file);
        }
    };

    const createStudentAccounts = () => {
        setLoading(true)
        StudentService.createStudents(students).then(res=>{
            setIsCreated(true)
            console.log(res)
            notifications.show({
                withCloseButton: true,
                autoClose: 2000,
                title: t('importStudentsDrawer.successMsg'),
                message: '',
                color: 'green',
                icon: <IconCheck />,
                loading: false,
            });
        }).catch(err => {
            console.log('ERROR', err)
            notifications.show({
                withCloseButton: true,
                autoClose: 2000,
                title: t('importStudentsDrawer.errorMsg'),
                message: '',
                color: 'red',
                icon: <IconX />,
            });
        }).finally(()=>{
            setLoading(false)
            fetchClassrooms()
        })
    }

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(downloadData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

        // Generate buffer
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Create a Blob and trigger the download
        const data = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        saveAs(data, 'students-data.xlsx');
        window.location.reload()
    };

    return (
        <>
            <Drawer title={<Text fw={600} size={'xl'}>{t('importStudentsDrawer.title')}</Text>}
                    opened={opened} onClose={onClose} size={'50%'}>
                <LoadingOverlay visible={loading}/>
                {
                    isCreated ? (
                        <Box my={20}>
                            <Text>{t('importStudentsDrawer.downloadTitle')}</Text>
                            <Button color={'green'}
                                    leftSection={<IconFileDownload/>}
                                    onClick={downloadExcel}
                                    my={10}>{t('importStudentsDrawer.buttonTitle')}</Button>
                        </Box>
                        ) : (
                        <>
                            <FileInput
                                value={excelFile} onChange={handleFileChange}
                                variant="filled"
                                label={t('importStudentsDrawer.fileInputLabel')}
                                withAsterisk
                                description={t('importStudentsDrawer.fileInputDesc')}
                                placeholder={t('importStudentsDrawer.fileInputPlaceholder')}
                            />

                            {
                                excelFile ? (
                                    <Flex gap={20}>
                                        <Button my={10} color={'red'} leftSection={<IconEraser/>}
                                                onClick={()=>{setExcelFile(null); setStudents([])}}>
                                            {t('importStudentsDrawer.clearAllButtonTitle')}
                                        </Button>

                                        <Button w={'100%'} my={10} color={'green'} leftSection={<IconCheck/>}
                                                onClick={createStudentAccounts}>
                                            {t('importStudentsDrawer.createButtonTitle')}
                                        </Button>
                                    </Flex>
                                ) : ''
                            }

                            {students.map((student, index) => (
                                <Flex my={20} gap={20} w={'100%'} key={index}>
                                    <TextInput w={'100%'} value={student.name} readOnly label={`#${index + 1} ${t('importStudentsDrawer.studentNameInputLabel')} `} />
                                    <TextInput w={'100%'} value={student.accountId} readOnly label={`#${index + 1} ${t('importStudentsDrawer.studentIDInputLabel')}`} />
                                    <TextInput w={'100%'} value={student.password} readOnly label={`#${index + 1} ${t('importStudentsDrawer.studentPassInputLabel')}`} />
                                </Flex>
                            ))}
                        </>
                    )
                }
            </Drawer>
        </>
    );
}
