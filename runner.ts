// import { processCompanyList } from "./challenge";

// /**
//  * This is the entry point for the challenge.
//  * This will run your code.
//  */
// await processCompanyList();
// console.log("✅ Done!");


// Import the function
const { processCompanyList } = require('./challenge');

// Define an async function to use await
async function main() {
    try {
        // Call the async function
        await processCompanyList();
        console.log("✅ Done!");
    } catch (error) {
        // Handle any errors
        console.error('An error occurred:', error);
    }
}

// Call the async function
main();
