import {Group, Paper, Text} from "@mantine/core";
import classes from "./Styles.module.css";

export interface BasicCardButtonProps {
    primaryText: string,
    secondaryText: string,
    categoryText: string,
    onClick?: () => void
}

export default function BasicCardButton({primaryText, secondaryText, categoryText, onClick}: BasicCardButtonProps) {
    return (
        <Paper onClick={onClick} style={{cursor: "pointer"}} className={classes.card} withBorder p="md" radius="md" key={''}>
            <Group justify="space-between">
                <Text c={'dimmed'} size={'xs'} className={classes.title}>
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