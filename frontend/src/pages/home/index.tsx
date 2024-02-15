import {Space, Title} from "@mantine/core";
import {useUserStore} from "../../store/user";
import {Stats} from "../../components/schools/schoolStats.tsx";
import {IconBadgeHd} from "@tabler/icons-react";

export function HomePage() {
    const {user} = useUserStore()

    return (
        <div>
            <Title order={2}>Home page</Title>
            <Space h={50}/>
            {
                user?.role === 'ADMIN' && (
                    <>
                        <Stats statistics={[
                            {value: 1000, title: "Students on platform", icon: IconBadgeHd},
                            {value: 1000, title: "Teachers on platform", icon: IconBadgeHd},
                            {value: 1000, title: "School admins on platform", icon: IconBadgeHd}
                        ]}/>
                        <Space h={20}/>
                        <Stats statistics={[
                            {value: 1000, title: "Classrooms created on platform", icon: IconBadgeHd},
                            {value: 1000, title: "Lessons on platform", icon: IconBadgeHd}
                        ]}/>
                    </>
                )
            }
        </div>
    )
}