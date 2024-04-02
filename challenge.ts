import * as fs from "fs";
import * as csv from "fast-csv";
import { scrapeJobs, scrapeYCProfiles } from "./scraper/yc-scraper";
import { JobData, responseData, YCCompanyData } from "./interface/interfaces";
import { CSV_INPUT_PATH, JSON_OUTPUT_PATH } from "./resources";

/**
 * Processes the company list by scraping YC profiles and associated job listings.
 */
export async function processCompanyList() {
    // Array to hold company data
    const companies: { name: string; url: string }[] = [];

    // Reading the CSV file in a stream
    fs.createReadStream(CSV_INPUT_PATH)
        .pipe(csv.parse({ headers: true })) // Creating a pipe to directly connect the stream to CSV parser
        .on("data", (response: responseData) => {
            // Pushing each parsed data to the variable created above
            companies.push({
                name: response["Company Name"],
                url: response["YC URL"],
            });
        })
        .on("end", async () => {
            // Extracting URLs from company data
            const urls: string[] = companies.map((obj) => obj.url);

            // Scraping YC profiles
            const scrapedData: YCCompanyData[] = await scrapeYCProfiles(urls);

            // Generating URLs for job listings
            const jobUrls: string[] = urls.map((obj) => obj + "/jobs");

            // Scraping job listings
            const jobs: { [key: string]: JobData[] }[] = await scrapeJobs(jobUrls);

            // Matching jobs with corresponding companies
            scrapedData.forEach((company) => {
                const companyUrl = company.url + "/jobs";
                const matchingJobs = jobs.find((job) => job.hasOwnProperty(companyUrl));
                if (matchingJobs) {
                    company.jobs = matchingJobs[companyUrl];
                }
            });

            try {
                fs.mkdirSync("out");
            } catch (err) {
                // 'out' directory already exists
            }

            // Writing scraped data to a JSON file in the 'out' folder
            fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(scrapedData, null, 2));
        });
}
