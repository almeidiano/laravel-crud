import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import Footer from "@/Components/Footer";
import {Navbar} from "@/Components/Navbar";
import { Toaster } from "@/Components/ui/toaster"

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render([<Navbar />, <Toaster />, <App {...props} />, <Footer/>]);
    },
    progress: {
        color: '#4B5563',
    },
});
