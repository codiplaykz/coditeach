import {CloseButton, Grid, Group, rem, Text} from '@mantine/core';
import {IconPhoto, IconUpload, IconVideo, IconX} from '@tabler/icons-react';
import {Dropzone, DropzoneProps, FileWithPath} from '@mantine/dropzone';
import {useState} from "react";
import AdminService from "../../api/AdminService.ts";

function getFileSizeInMB(file: any) {
    const fileSizeInBytes = file.size;
    return fileSizeInBytes / 1000000;
}

// function cropString(str, maxLength) {
//     if (str.length <= maxLength) {
//         return str;
//     }
//     return str.slice(0, maxLength - 3) + '...';
// }

export function DropzoneCustom(props: Partial<DropzoneProps>) {
    const [uploadedFile, setUploadedFile] = useState<FileWithPath>()

    const acceptFile = (file: any) => {
        console.log('accepted files', file)
        setUploadedFile(file[0])

        const form = new FormData()
        form.append('file', file[0])

        AdminService.createCurriculum(form).then(res => {
            console.log(res)
        })
    }

    return (
        <>
            {
                uploadedFile ? (
                    <>
                        <Grid align={'center'} justify={'space-between'} style={{border: '#e5e5e5 1px solid', borderRadius: '10px'}} px={15} py={10}>
                            <Grid.Col span={1} style={{display: 'flex', alignItems: 'center'}}>
                                <IconVideo width={24}/>
                            </Grid.Col>
                            <Grid.Col span={8} style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                {uploadedFile.name}
                            </Grid.Col>
                            <Grid.Col span={2} style={{fontWeight: '600'}}>
                                {Math.round(getFileSizeInMB(uploadedFile))} MB
                            </Grid.Col>
                            <Grid.Col span={1} style={{display: 'flex', alignItems: 'center', justifyContent: 'end', cursor: 'pointer'}}>
                                <CloseButton onClick={()=>{setUploadedFile(undefined)}}/>
                            </Grid.Col>
                        </Grid>
                    </>
                ) : (

                    <Dropzone
                        onDrop={acceptFile}
                        onReject={(files) => console.log('rejected files', files)}
                        // maxSize={3 * 1024 ** 2}
                        // accept={IMAGE_MIME_TYPE}
                        {...props}
                    >
                        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                            <Dropzone.Accept>
                                <IconUpload
                                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                                    stroke={1.5}
                                />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX
                                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                                    stroke={1.5}
                                />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <IconPhoto
                                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                                    stroke={1.5}
                                />
                            </Dropzone.Idle>

                            <div>
                                <Text size="xl" inline>
                                    Drag file here or click to select files
                                </Text>
                                <Text size="sm" c="dimmed" inline mt={7}>
                                    Attach file here
                                </Text>
                            </div>
                        </Group>
                    </Dropzone>
                )
            }
        </>
    );
}