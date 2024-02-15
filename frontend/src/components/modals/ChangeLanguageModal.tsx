import {Flex, Grid, Modal, Text} from "@mantine/core";
import ReactCountryFlag from "react-country-flag";
import {useTranslation} from "react-i18next";
import {languages} from "./ChangeCurriculumLanguageModal.tsx";
import {SetLanguage} from "../../store/user";

interface ChangeLanguageModalProps {
    opened: boolean,
    setOpened: Function
}

export default function ChangeLanguageModal({opened, setOpened}: ChangeLanguageModalProps) {
    const { t, i18n } = useTranslation()
    const closeModal = () => {
        setOpened(false)
    }

    const setLanguage = (countryCode: string) => {
        (
            async() => {
                await i18n.changeLanguage(countryCode)
                SetLanguage(countryCode)
                window.location.reload()
            }
        )()
    }

    const renderedFlags = languages.map((languageItem: any, index: number) => {
        return (
            <Grid.Col span={2} key={`${index}-language-change`}>
                <Flex key={`curriculum-language-selector-${index}`}
                      onClick={()=>{setLanguage(languageItem.countryCode)}}
                      align={'center'} gap={20}
                      style={{cursor: 'pointer', border: `solid ${i18n.language === languageItem.countryCode ? '#1971C2 2px' : '#e1e1e1 1px'}`, borderRadius: '10px', padding: '10px 20px'}}>
                    <ReactCountryFlag style={{fontSize: '2em'}} countryCode={languageItem.flag}/>
                    <Text fw={500}>{t(`change_language_modal.languages.${languageItem.label}`)}</Text>
                </Flex>
            </Grid.Col>
        )
    })

    return (
        <>
            <Modal opened={opened} onClose={() => {closeModal()}} title={<span style={{fontWeight: 'bold', fontSize: '20px'}}>{t('change_language_modal.title')}</span>} centered>
                <Grid w={'100%'} grow>
                    {renderedFlags}
                </Grid>
            </Modal>
        </>
    )
}