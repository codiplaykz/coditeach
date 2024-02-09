import {MantineProvider} from '@mantine/core';
import Root from "./routes";
import {BrowserRouter} from "react-router-dom";
import '@mantine/core/styles.css';
import '@mantine/ds/styles.css';
import '@mantine/dropzone/styles.css';
import {ModalsProvider} from "@mantine/modals";
import './components/i18n';

export default function App() {
    return (
        <MantineProvider>
            <ModalsProvider>
                <BrowserRouter>
                    <Root/>
                </BrowserRouter>
            </ModalsProvider>
        </MantineProvider>
    );
}