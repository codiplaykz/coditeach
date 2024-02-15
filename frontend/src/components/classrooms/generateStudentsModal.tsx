import {Alert, Box, Button, Modal, Space, Textarea} from "@mantine/core";
import {useState} from "react";
import {IconAlertCircle} from "@tabler/icons-react";

interface GenerateStudentsModalProps {
    opened: boolean,
    setOpened: Function,
    fetchClassrooms: Function
}

export default function GenerateStudentsModal({opened, setOpened, fetchClassrooms}: GenerateStudentsModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const generateClassrooms = () => {
        try {
            setLoading(true)
        } catch (error) {
            setError('Error')
        } finally {
            setLoading(false)
            fetchClassrooms()
        }
    }

    // const handleTextareaChange = (e: ChangeEvent) => {
    //     console.log(e)
    //
    // }

    const handleEnterClick = (e: any) => {
        if (e.key === 'Enter') {

        }
    }

    const closeModal = () => {
        setOpened(false)
    }

    return (
        <Modal opened={opened} title={<span style={{fontSize: '20px', fontWeight: 'bold'}}>Generate student accounts</span>} onClose={() => {(closeModal())}} centered>

            <Alert hidden={!error} icon={<IconAlertCircle/>} title={'Error'} radius={"md"} variant={"outline"} color="red">
                {error}
            </Alert>

            <Box>
                <b>Attention</b>
                <Space h={"xs"}/>
                Enter name and surname line by line in textarea below, and click button below to generate accounts.
            </Box>
            <Space h={"xs"}/>
            <Textarea label={"Names for each account"} autosize onKeyPress={(e) => {handleEnterClick(e)}}/>
            <Space h={'md'}/>
            <Button onClick={generateClassrooms} loading={loading} disabled={loading} radius="md" style={{width: '100%'}}>
                Generate accounts
            </Button>
        </Modal>
    )
}