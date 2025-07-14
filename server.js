import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/fetch', async (req, res) => {
    const { url, component } = req.body;

    const pageSize = 500;
    let currentPage = 1;
    let allIssues = [];
    let totalIssues = 0;

    try {
        while (true) {
            const fullUrl = `${url}api/issues/search?components=${component}&p=${currentPage}&ps=${pageSize}&s=SEVERITY`;
            const response = await fetch(fullUrl);
            const data = await response.json();

            if (currentPage === 1) {
                totalIssues = data.total;
            }

            allIssues = allIssues.concat(data.issues);

            // kalo issuenya >= total, break
            if (allIssues.length >= totalIssues) {
                break;
            }

            currentPage++;
        }

        res.json({
            total: totalIssues,
            issues: allIssues
        });

    } catch (e) {
        res.status(500).json({ error: 'Gagal fetch data dari SonarQube', details: e.toString() });
    }
});

app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});