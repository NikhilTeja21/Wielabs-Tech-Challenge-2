import { CheerioCrawler } from "crawlee";
import { extractCompanyData, extractJobs } from "../extractor/yc-data-extractor";
import { YCCompanyData, JobData } from "../interface/interfaces";

/**
 * [Youtube link]: https://youtu.be/MrQ6xQx6-y4?si=ZvMuDQ2d51UtUx7d
 */

/**
 * Scrapes YC company profiles from the provided URLs.
 * @param urls An array of URLs to scrape.
 * @returns A promise that resolves with an array of YCCompanyData objects.
 */
export async function scrapeYCProfiles(urls: string[]): Promise<YCCompanyData[]> {
    // Array to hold scraped data
    const scrapedData: YCCompanyData[] = [];

    // Configure the crawler
    const crawler = new CheerioCrawler({
        requestHandler: async ({ response, $ }) => {
            // Function call to handle the extraction logic
            const companyData = await extractCompanyData($);
            scrapedData.push({ ...companyData, url: response.url });
        },

        // Handle failed requests
        failedRequestHandler({ request }) {
            console.log(request.url, "failed");
        },
    });

    // Start the crawler
    await crawler.run(urls);

    return scrapedData;
}

/**
 * Scrapes job listings from the provided URLs.
 * @param urls An array of URLs to scrape.
 * @returns A promise that resolves with an array of objects containing job data.
 */
export async function scrapeJobs(urls: string[]): Promise<{ [key: string]: JobData[] }[]> {
    // Array to hold scraped data
    let scrapedData: { [key: string]: JobData[] }[] = [];

    // Configure the crawler
    const crawler = new CheerioCrawler({
        requestHandler: async ({ response, $ }) => {
            // Function call to handle the extraction logic
            const jobData = await extractJobs($);
            const data: { [key: string]: JobData[] } = {};
            data[response.url] = jobData;
            scrapedData.push(data);
        },

        // Handle failed requests
        failedRequestHandler({ request }) {
            console.log(request.url, "failed");
        },
    });

    // Start the crawler
    await crawler.run(urls);

    return scrapedData;
}
