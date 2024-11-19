'use client';

import {
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import { useUser } from "@/hooks/useUser"

export default function TextareaDemo() {
    const { user } = useUser();
    return <ResizablePanelGroup direction="horizontal">
                <ResizablePanel> Cookie-user: <pre>{JSON.stringify(user, undefined, 4)}</pre> </ResizablePanel>
            </ResizablePanelGroup>
}