import puppeteer from "puppeteer";
import fs from "fs";

async function scrapeColombiaFintechData() {
    const browser = await puppeteer.launch({ headless: false, slowMo: 300 });
    const page = await browser.newPage();

    try {
        await page.goto('https://www.colombiafintech.co/fintechs');

        const colombiaFintechData = await page.evaluate(() => {
            const fintechElements = document.querySelectorAll('.fcompany_info');

            return Array.from(fintechElements).map(fintech => ({
                nameFintech: fintech.querySelector('p.info_name').innerText.trim(),
                sector: fintech.querySelector('p.info_sector').innerText.trim(),
                linkWebSitie: fintech.querySelector('a').innerText.trim(),
                city: fintech.querySelector('p.info_item').innerText.trim(),
                // Description unavailable from current element, needs separate fetch
            }));
        });

        // Loop through each fintech and fetch profile details (if needed)
        for (const fintech of colombiaFintechData) {
            const profileUrl = fintech.querySelector('a.info_profile').href;
            if (profileUrl) {
                const profilePage = await browser.newPage();
                await profilePage.goto(profileUrl);

                const profileData = await profilePage.evaluate(() => {
                    const profileContent = document.querySelector('div.profile-body');
                    return {
                        description: profileContent?.querySelector('p')?.innerText?.trim(),
                        memberPosition: profileContent?.querySelector('p.member-position')?.innerText?.trim(),
                        membername: profileContent?.querySelector('p.member-name')?.innerText?.trim(),
                    };
                });

                fintech.description = profileData.description;
            }
        }

        // Save the scraped data to a JSON file
        const fileName = 'colombia_fintech_data.json';
        const jsonData = JSON.stringify(colombiaFintechData, null, 2); // Format with indentation
        await fs.promises.writeFile(fileName, jsonData);
        console.log(`Data saved to ${fileName}`);
    } catch (error) {
        console.error('Error scraping data:', error);
    } finally {
        await browser.close();
    }
}

scrapeColombiaFintechData();
