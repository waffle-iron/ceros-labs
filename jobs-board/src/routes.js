import VueRouter from 'vue-router';

import App from './components/App.vue'
import JobBoard from './components/JobBoard.vue';
import Job from './components/Job.vue';
import NotFound from './components/NotFound.vue';

const routes = [
    {
        path: '/',
        component: App,

        children: [
            {
                name: 'job-board',
                path: '/',
                component: JobBoard
            },
            {
                name: 'job',
                path: '/job/:id',
                component: Job
            },
            {
                name: '404',
                path: '/ohps',
                component: NotFound
            }
        ]
    },

    {
        path: '/*',
        redirect: {
            name: '404'
        }
    }
];

const scrollBehavior = () => {
    return {
        x: 0,
        y: 0
    };
};

export default new VueRouter({
    routes,
    scrollBehavior
});