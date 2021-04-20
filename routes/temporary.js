// INDEX seed data guest route
router.get('/index', (req, res) => {
    // if (req.session.userId) {
    //     res.render('index', {
    //         isLoggedIn: true,
    //     });
    // } else {
        res.render('index', {
            seedData: [
                {
                    url:
                        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.5xXdmr-fIdI0sTMxOxMj5QAAAA%26pid%3DApi&f=1',
                    name: 'Snake Plant',
                    description:
                        "some text",
                    petsafe: 'Moderate Risk',
                    origin: 'West Africa',
                },
                {
                    url:
                        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi1.wp.com%2Fwww.worldtopupdates.com%2Fwp-content%2Fuploads%2F2017%2F08%2Fimage-result-for-peace-lily.jpeg%3Fresize%3D1060%252C1378&f=1&nofb=1',
                    name: 'Peace Lily',
                    description:
                        "some text",
                    petsafe: 'No',
                    origin: 'The rainforests of Central and South America',
                },
                {
                    url:
                        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbalconygardenweb-lhnfx0beomqvnhspx.netdna-ssl.com%2Fwp-content%2Fuploads%2F2018%2F11%2Fspider-plant-indoors.jpg&f=1&nofb=1',
                    name: 'Spider Plant',
                    description:
                        "some text",
                    petsafe: 'Yes',
                    origin:
                        'Tropical and Southern Africa, but has become naturalized in other parts of the world, including western Australia.',
                },
            ],
        });
});
