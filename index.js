import puppeteer from "puppeteer";
import fs from "fs/promises";

/**
 * Scrapes data from the Colombia Fintech website and saves it to a JSON file.
 * @returns {Promise<void>} A Promise that resolves when the scraping and saving process is complete.
 */
async function scrapeColombiaFintechData() {
    const browser = await puppeteer.launch({ headless: false, slowMo: 300 });
    const page = await browser.newPage();

    try {
        // Navigate to the Colombia Fintech website
        await page.goto('https://www.colombiafintech.co/fintechs');
        // Wait for all fintech elements to be loaded
        await page.waitForSelector('div.fcompany_info');

        // Extract data from each fintech element
        const colombiaFintechData = await page.evaluate(() => {
            const fintechElements = document.querySelectorAll('div.fcompany_info');
            const data = [];

            fintechElements.forEach(fintech => {
                const nameFintech = fintech.querySelector('p.info_name').innerText.trim();
                const sector = fintech.querySelector('p.info_sector').innerText.trim();
                const linkWebsite = fintech.querySelector('a').getAttribute('href'); // Extraer el href del enlace
                const city = fintech.querySelector('p.info_item').innerText.trim();
                const profileUrl = fintech.querySelector('a.info_profile')?.href;

                data.push({ nameFintech, sector, linkWebsite, city, profileUrl });
            });

            return data;
        });

        // Loop through each fintech to fetch profile details
        for (const fintech of colombiaFintechData) {
            if (fintech.profileUrl) {
                const profilePage = await browser.newPage();
                await profilePage.goto(fintech.profileUrl);

                // Wait for profile data to be loaded
                await profilePage.waitForSelector('div.profile-body');

                // Extract profile details
                const profileData = await profilePage.evaluate(() => {
                    const profileContent = document.querySelector('div.profile-body');
                    const description = (profileContent?.querySelector('p')?.innerText || "Description not available").trim();
                    const memberPosition = (profileContent?.querySelector('p.member-position')?.innerText || "").trim();
                    const memberName = (profileContent?.querySelector('p.member-name')?.innerText || "").trim();

                    return { description, memberPosition, memberName };
                });

                Object.assign(fintech, profileData); // Merge profile data into fintech object

                // Close the profile page after extracting data
                await profilePage.close();
            }
        }

        // Save the scraped data to a JSON file
        const fileName = 'colombia_fintech_data.json';
        const jsonData = JSON.stringify(colombiaFintechData, null, 2);
        await fs.writeFile(fileName, jsonData);
        console.log(`Data saved to ${fileName}`);
    } catch (error) {
        console.error('Error scraping data:', error);
    } finally {
        // Close the browser after scraping is complete
        await browser.close();
    }
}

// Start the scraping process
scrapeColombiaFintechData();
