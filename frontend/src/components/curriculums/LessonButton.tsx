import {Group, Paper, Text} from "@mantine/core";
import classes from "./Styles.module.css";

interface LessonButtonProps {
    primaryText: string,
    secondaryText: string,
    categoryText: string,
    onClick?: () => void
}

export default function LessonButton({primaryText, secondaryText, categoryText, onClick}: LessonButtonProps) {
    return (
        <Paper onClick={onClick} style={{cursor: "pointer"}} className={classes.lesson_card} withBorder p="md" radius="md" key={''}>
            <Group justify="space-between">
                <Text c={'green'} fw={700} size={'xs'} className={classes.title}>
                    {categoryText}
                </Text>
            </Group>

            <Group align="flex-end" gap="xs" mt={25}>
                <Text size={'lg'} className={classes.value} fw={600}>{primaryText}</Text>
            </Group>

            <Text fz="xs" c="dimmed" mt={7} className={classes.secondary}>
                {secondaryText}
            </Text>
        </Paper>
    )
}