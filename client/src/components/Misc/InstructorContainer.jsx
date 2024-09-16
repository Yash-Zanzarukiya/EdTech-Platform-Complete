import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Book,
    Package2,
    PlusCircle,
    Settings,
    Home,
    LineChart,
    PanelLeft,
} from 'lucide-react';
import { Button } from '../ui/button';
import { ModeToggle } from '../mode-toggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ProfileDropdown } from '..';
import { AiFillYoutube } from 'react-icons/ai';

const navItems = [
    {
        label: 'Home',
        path: 'dashboard',
        icon: <Home className="h-5 w-5" />,
    },
    {
        label: 'Analytics',
        path: 'analytics',
        icon: <LineChart className="h-5 w-5" />,
    },
    {
        label: 'Courses',
        path: 'courses',
        icon: <Book className="h-5 w-5" />,
    },
    {
        label: 'Add Course',
        path: 'add-course',
        icon: <PlusCircle className="h-5 w-5" />,
    },
    {
        label: 'Public Videos',
        path: 'videos',
        icon: <AiFillYoutube className="h-5 w-5" />,
    },
];

function InstructorContainer() {
    const [routeName, setRouteName] = useState('Instructor');

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-background">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Link
                        to={'/'}
                        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                    >
                        <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    {navItems.map((item, index) => (
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `${
                                    isActive
                                        ? 'text-accent-foreground bg-accent '
                                        : 'text-muted-foreground'
                                } flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`
                            }
                        >
                            {item.icon}
                            <span className="sr-only">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">Settings</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Settings</TooltipContent>
                    </Tooltip>
                    <ModeToggle />
                    <ProfileDropdown />
                </nav>
            </aside>
            <header className="sticky sm:hidden top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            size="icon"
                            variant="outline"
                            className="sm:hidden"
                        >
                            <PanelLeft className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="sm:max-w-xs">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link
                                href="#"
                                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                            >
                                <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                                <span className="sr-only">Acme Inc</span>
                            </Link>
                            {navItems.map((item, index) => (
                                <NavLink
                                    to={item.path}
                                    key={index}
                                    end
                                    className={({ isActive }) =>
                                        ` ${
                                            isActive
                                                ? ' text-foreground '
                                                : ' text-muted-foreground '
                                        } flex items-center gap-4 px-2.5 hover:text-foreground`
                                    }
                                >
                                    {item.icon}
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>
                <h2 className="text-lg font-bold tracking-tighter sm:text-xl md:text-2xl text-gray-900 dark:text-gray-100">
                    {routeName}
                </h2>
                <div className="ml-auto flex items-center gap-4">
                    <ModeToggle />
                    <ProfileDropdown />
                </div>
            </header>
            <div className="flex flex-col sm:gap-4 sm:pl-14">
                <Outlet context={{ setRouteName }} />
            </div>
        </div>
    );
}

export default InstructorContainer;