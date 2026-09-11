import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    createEmptyProject,
    getProjects,
    setActiveProject,
} from '@/blockly/projects';
import HomeHeader from './components/HomeHeader';
import HomeHero from './components/HomeHero';
import ProjectsSection from './components/ProjectsSection';
import CreateProjectDialog from '../CreateProjectDialog';
import HomeFooter from './components/HomeFooter';



interface Project {
    id: string;
    name: string;
    updatedAt: number;
}

export default function Home() {

    const [projects, setProjects] =
        useState<Project[]>(getProjects());

    const [createProjectOpen, setCreateProjectOpen] =
        useState(false);

    const navigate = useNavigate();

    /*
     * ================================
     * PROJECT
     * ================================
     */

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProjects(getProjects());

        const handleStorage = () => {
            setProjects(getProjects());
        };

        window.addEventListener(
            'storage',
            handleStorage
        );

        return () => {
            window.removeEventListener(
                'storage',
                handleStorage
            );
        };

    }, []);

    /*
     * ================================
     * CREATE PROJECT
     * ================================
     */

    const handleCreateProject = () => {
        setCreateProjectOpen(true);
    };

    const handleCreate = (name: string) => {

        try {

            createEmptyProject(name);

            setProjects(getProjects());

            navigate('/editor-blockly');

        } catch (err) {

            console.error(
                'Failed to create project',
                err
            );

            alert(
                'Tạo project thất bại.'
            );
        }
    };

    /*
     * ================================
     * OPEN PROJECT
     * ================================
     */

    const handleOpenProject = (
        projectId: string
    ) => {

        try {

            setActiveProject(projectId);

            navigate(
                '/editor-blockly'
            );

        } catch (err) {

            console.error(
                'Failed to open project',
                err
            );

            alert(
                'Không thể mở project.'
            );
        }
    };

    /*
     * ================================
     * RENDER
     * ================================
     */

    return (
        <div className="
            h-screen
            bg-[#FFFFFF]
            flex
            flex-col
            overflow-hidden
        ">

            {/* Header */}
            <HomeHeader />

            {/* Main */}
            <main className="
                flex-1
                flex
                flex-col
                overflow-hidden
            ">

                {/* Hero */}
                <HomeHero
                    onStart={handleCreateProject}
                />

                {/* Projects */}
                <ProjectsSection
                    projects={projects}
                    onCreate={handleCreateProject}
                    onOpen={handleOpenProject}
                />

            </main>

            {/* Footer */}
            <HomeFooter />

            {/* Create dialog */}
            <CreateProjectDialog
                open={createProjectOpen}
                onOpenChange={
                    setCreateProjectOpen
                }
                onCreate={handleCreate}
            />

        </div>
    );
}