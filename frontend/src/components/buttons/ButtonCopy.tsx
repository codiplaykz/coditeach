import { Button, rem, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconCopy, IconCheck } from '@tabler/icons-react';

interface ButtonCopyProps {
    copyText: string,
    buttonTitle: string,
    tooltipText: string,
}

export function ButtonCopy({copyText, buttonTitle, tooltipText}: ButtonCopyProps) {
    const clipboard = useClipboard();
    return (
        <Tooltip
            label={tooltipText}
            offset={5}
            position="top"
            radius="xl"
            transitionProps={{ duration: 100, transition: 'slide-down' }}
            opened={clipboard.copied}
        >
            <Button
                variant="light"
                rightSection={
                    clipboard.copied ? (
                        <IconCheck style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                    ) : (
                        <IconCopy style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                    )
                }
                radius="xl"
                size="md"
                styles={{
                    root: { paddingRight: rem(14), height: rem(48) },
                    section: { marginLeft: rem(22) },
                }}
                onClick={() => clipboard.copy(copyText)}
            >
                {buttonTitle}
            </Button>
        </Tooltip>
    );
}