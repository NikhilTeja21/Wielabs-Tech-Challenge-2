import * as cheerio from "cheerio";
import { YCCompanyData, JobData, FounderData } from "../interface/interfaces";
// Chat-GPT
/**
 * Extracts company data from the provided Cheerio instance.
 * @param $ The Cheerio instance representing the HTML document.
 * @returns A promise that resolves with the extracted YCCompanyData.
 */
export async function extractCompanyData($: cheerio.CheerioAPI): Promise<YCCompanyData> {
    return new Promise(async (resolve, reject) => {
        // Select the YC company card
        const card = $(".ycdc-card");
        
        // Extract information from the card
        const name = card.find("div").eq(0).text();
        const founded = card.find("span").eq(1).text();
        const teamSize = card.find("span").eq(3).text();
        const location = card.find("span").eq(5).text();
        const founders = extractFounders($);

        let launchLink: string = "";

        // Find the launch link
        const sections = $("section");
        for (let i = 0; i < sections.length; i++) {
            const header = sections.eq(i).find("h3").eq(0).text();
            if (header === "Company Launches") {
                const link = "https://www.ycombinator.com" + sections.eq(i).find("a").eq(0).attr("href");
                launchLink = link;
                break;
            }
        }

        // Resolve with the extracted company data
        resolve({
            name: name,
            founded: founded,
            teamSize: parseInt(teamSize),
            location: location,
            founders: founders,
            launchPosts: { link: launchLink },
        });
    });
}
// Chat-GPT
/**
 * Extracts job data from the provided Cheerio instance.
 * @param $ The Cheerio instance representing the HTML document.
 * @returns A promise that resolves with an array of JobData.
 */
export function extractJobs($: cheerio.CheerioAPI): Promise<JobData[]> {
    return new Promise((resolve, reject) => {
        const sections = $("section");
        const jobs: JobData[] = [];

        // Check if there are job sections
        if (sections.length !== 0) {
            // Select the job card
            const jobCard = sections.eq(0).find("div").eq(0).find(".flex-grow.space-y-5");

            // Extract job information from the card
            const role = $(jobCard).find(".ycdc-with-link-color");
            role.each((index, element) => {
                const role = $(element).find("a").text();
                const location = $(element).parent().find(".list-item").first().text();
                jobs.push({
                    role: role,
                    location: location,
                });
            });
        }

        // Resolve with the extracted job data
        resolve(jobs);
    });
}

/**
 * Extracts founder data from the provided Cheerio instance.
 * @param $ The Cheerio instance representing the HTML document.
 * @returns An array of FounderData containing founder information.
 */
function extractFounders($: cheerio.CheerioAPI): FounderData[] {
    const founderCard = $(".leading-snug");
    const founders: FounderData[] = [];

    // Iterate over each founder card
    founderCard.each((index, element) => {
        const name = $(element).find(".font-bold").text();
        const founder: FounderData = { name: name };
        const links = $(element).find(".mt-1.space-x-2");

        // Extract links associated with the founder
        links.find("a").each((index, element) => {
            const title = $(element).attr("title");
            const href = $(element).attr("href");
            if (title && href) {
                const linkName = title.split(" ")[0];
                founder[linkName] = href;
            }
        });
        
        // Push the founder data to the array
        founders.push(founder);
    });

    return founders;
}
