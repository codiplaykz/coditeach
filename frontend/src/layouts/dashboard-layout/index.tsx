import {AppShell} from "@mantine/core";
import {Outlet} from "react-router-dom";
import {Sidebar} from "../../components/sidebar/Sidebar.tsx";

export default function DashboardLayout() {
    return (
        <AppShell
            padding="md"
            navbar={{ width: 300, breakpoint: 'sm'}}
        >
            <AppShell.Navbar><Sidebar/></AppShell.Navbar>
            <AppShell.Main><Outlet/></AppShell.Main>
        </AppShell>
    )
}