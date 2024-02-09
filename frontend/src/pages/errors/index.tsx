import {Button, Container, Group, Title} from '@mantine/core';
import classes from './ErrorPage.module.css';
import {useNavigate} from "react-router-dom";

interface ErrorPageProps {
    errorCode: number,
    errorTitle: string,
    errorDescription: string,
    buttonLink: string,
    buttonText: string
}

export function ErrorPage({errorCode, errorTitle, errorDescription, buttonText, buttonLink}: ErrorPageProps) {
    const navigate = useNavigate()

    const redirect = () => {
        navigate(buttonLink)
    }

    return (
        <div className={classes.root}>
            <Container>
                <div className={classes.label}>{errorCode}</div>
                <Title className={classes.title}>{errorTitle}</Title>
                <p className={classes.description}>
                    {errorDescription}
                </p>
                <Group justify="center">
                    <Button variant="white" size="md" onClick={redirect}>
                        {buttonText}
                    </Button>
                </Group>
            </Container>
        </div>
    );
}