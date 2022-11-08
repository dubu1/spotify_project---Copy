import React from 'react';
import { Box, Flex, Button, SearchField, SideNavigation } from 'gestalt';
import 'gestalt/dist/gestalt.css';



export function Sidebar() {
    const rows = []
    for (let index = 0; index < 20; index++) {
        rows.push(
            <SideNavigation.TopItem
                href="#"
                onClick={({ event }) => event.preventDefault()}
                label={index}
            />
            )      
    }

    return (
            <SideNavigation accessibilityLabel="Correct length example">
                <SideNavigation.TopItem
                    href="#"
                    onClick={({ event }) => event.preventDefault()}
                    label="Public profile"
                />
                <SideNavigation.TopItem
                    href="#"
                    onClick={({ event }) => event.preventDefault()}
                    label="Personal information"
                />
                <SideNavigation.TopItem
                    href="#"
                    onClick={({ event }) => event.preventDefault()}
                    label="Account management"
                />
                <SideNavigation.TopItem
                    href="#"
                    onClick={({ event }) => event.preventDefault()}
                    label="Tune your home feed"
                />

                
                {rows}
            </SideNavigation>

    );
}
