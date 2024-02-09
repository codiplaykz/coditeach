import {useForm} from "@mantine/form";
import {Alert, Button, Modal, Space, TextInput} from "@mantine/core";
import {useState} from "react";
import {IconAlertCircle, IconCheck} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";
import SchoolService from "../../api/schoolService.ts";
import {useTranslation} from "react-i18next";
import CustomSelect from "../schools/CustomSelect.tsx";

interface CreateSchoolModalProps {
    fetchSchools: Function,
    opened: boolean,
    setOpened: Function
}

export default function CreateSchoolModal({opened, setOpened, fetchSchools}: CreateSchoolModalProps) {
    const countries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia",
        "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
        "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
        "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad",
        "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus",
        "Czech Republic (Czechia)", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica",
        "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
        "Eswatini (fmr. 'Swaziland')", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany",
        "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras",
        "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan",
        "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
        "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives",
        "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
        "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal",
        "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia (formerly Macedonia)",
        "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru",
        "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
        "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
        "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
        "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
        "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
        "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
        "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ];
    const createSchoolForm = useForm({
        initialValues: {
            name: '',
            country: '',
            city: ''
        }
    })
    const { t } = useTranslation()
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const {name, country, city} = createSchoolForm.values

    const createSchool = async () => {
        if (name.length === 0 || country.length === 0 || city.length === 0) {
            setErrorMsg('Enter all data')
        } else {
            try {
                const createSchoolData = {
                    name, country, city
                }
                setLoading(true)
                await SchoolService.createSchool(createSchoolData)
                notifications.show({
                    id: 'success',
                    withCloseButton: true,
                    autoClose: 2000,
                    title: "School created!",
                    message: '',
                    color: 'green',
                    icon: <IconCheck />,
                    loading: false,
                });
                closeCreateSchoolModal()
                fetchSchools()
                createSchoolForm.reset()
                setErrorMsg('')
            } catch (error: any) {
                console.log(error)
                if (!error.response) {
                    setErrorMsg('Something went wrong, try later')
                }
                else if (error.response.status === 400 || error.response.status === 401) {
                    setErrorMsg('Invalid credentials')
                } else if (error.response.status === 500) {
                    setErrorMsg('Something went wrong, try later')
                } else {
                    setErrorMsg(error.response.data.message)
                }
            } finally {
                setLoading(false)
            }
        }
    }

    const closeCreateSchoolModal = () => {
        setOpened(false)
    }

    return (
        <>
            <Modal
                opened={opened}
                onClose={() => { closeCreateSchoolModal() }}
                title={<span style={{ fontWeight: 'bold', fontSize: '20px' }}>{t('createSchoolModal.title')}</span>}
                centered
            >
                <Alert
                    hidden={!errorMsg}
                    icon={<IconAlertCircle/>}
                    title={t('createSchoolModal.errorTitle')}
                    radius={"md"}
                    variant={"outline"}
                    color="red"
                >
                    {errorMsg}
                </Alert>
                <Space h={10}/>
                <TextInput
                    data-autofocus
                    placeholder={t('createSchoolModal.namePlaceholder')}
                    label={t('createSchoolModal.nameLabel')}
                    { ...createSchoolForm.getInputProps('name') }
                    withAsterisk
                />
                <Space h={'md'}/>
                <CustomSelect label={t('createSchoolModal.countryLabel')}
                              placeholder={t('createSchoolModal.countryPlaceholder')}
                              value={createSchoolForm.values.country}
                              setValue={(value: string)=>{createSchoolForm.setValues({country: value})}}
                              options={countries}/>
                <Space h={'md'}/>
                <TextInput
                    data-autofocus
                    placeholder={t('createSchoolModal.cityPlaceholder')}
                    label={t('createSchoolModal.cityLabel')}
                    { ...createSchoolForm.getInputProps('city') }
                    withAsterisk
                />
                <Space h={'md'}/>

                <Button
                    loading={loading}
                    disabled={loading}
                    radius="md"
                    onClick={createSchool}
                    style={{ width: '100%' }}
                >
                    {t('createSchoolModal.createButton')}
                </Button>
            </Modal>
        </>
    )
}