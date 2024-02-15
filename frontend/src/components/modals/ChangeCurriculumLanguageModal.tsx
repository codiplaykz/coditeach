import {Button, Flex, Grid, Modal, Text} from "@mantine/core";
import ReactCountryFlag from "react-country-flag";
import {IconCheck} from "@tabler/icons-react";
import {SetCurriculumLanguage, useUserStore} from "../../store/user";
import {useTranslation} from "react-i18next";

interface ChangeCurriculumLanguageModalProps {
    opened: boolean,
    setOpened: Function
}

export const languages = [
    {
        label: 'kazakh',
        countryCode: 'kz',
        flag: 'kz'
    },
    {
        label: 'russian',
        countryCode: 'ru',
        flag: 'ru'
    },
    {
        label: 'english',
        countryCode: 'us',
        flag: 'us'
    },
    {
        label: 'uzbek',
        countryCode: 'uz',
        flag: 'uz'
    },
    {
        label: 'azerbaijani',
        countryCode: 'az',
        flag: 'az'
    },
]

export default function ChangeCurriculumLanguageModal({opened, setOpened}: ChangeCurriculumLanguageModalProps) {
    const { curriculum_language } = useUserStore()
    const { t } = useTranslation()
    const closeModal = () => {
        // setOpened(false)
    }

    const confirmModal = () => {
        setOpened(false)
    }

    const setLanguage = (countryCode: string) => {
        SetCurriculumLanguage(countryCode)
    }

    const renderedFlags = languages.map((languageItem: any, index: number) => {
        return (
            <Grid.Col span={2}>
                <Flex key={`curriculum-language-selector-${index}`}
                      onClick={()=>{setLanguage(languageItem.countryCode)}}
                      align={'center'} gap={20}
                      style={{cursor: 'pointer', border: `solid ${curriculum_language === languageItem.countryCode ? '#1971C2 2px' : '#e1e1e1 1px'}`, borderRadius: '10px', padding: '10px 20px'}}>
                    <ReactCountryFlag style={{fontSize: '2em'}} countryCode={languageItem.flag}/>
                    <Text fw={500}>{t(`change_language_modal.languages.${languageItem.label}`)}</Text>
                </Flex>
            </Grid.Col>
        )
    })

    return (
        <>
            <Modal withCloseButton={false} opened={opened} onClose={() => {closeModal()}} title={<span style={{fontWeight: 'bold', fontSize: '20px'}}>{t('change_language_modal.title')}</span>} centered>
                <Grid w={'100%'} grow>
                    {renderedFlags}
                </Grid>
                <Button onClick={confirmModal} disabled={curriculum_language === ''} mt={20} color={'green'} radius={'md'} w={'100%'} leftSection={<IconCheck/>}>{t('change_language_modal.confirm')}</Button>
            </Modal>
        </>
    )
}