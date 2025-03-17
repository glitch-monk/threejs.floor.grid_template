import World from './World.js';

async function init() {
    try {
        console.log('Creating World...');
        window.world = await World.create();
        console.log('World initialized successfully');
    } catch (error) {
        console.error('Failed to initialize World:', error);
        document.body.innerHTML = `<div style="text-align: center; margin-top: 20px;">Error initializing 3D world: ${error.message}</div>`;
    }
}

init();
