import 'dotenv/config';
import { initApp } from './app.js';
const PORT = Number(process.env.PORT || 3000);
async function start() {
    const app = await initApp();
    app.listen(PORT, () => {
        console.log(`API listening on http://localhost:${PORT}`);
        console.log(`Docs at http://localhost:${PORT}/docs`);
    });
}
start().catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map