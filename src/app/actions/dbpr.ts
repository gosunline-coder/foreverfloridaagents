"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function verifyLicense(userId: string, licenseNumber: string) {
  try {
    if (!licenseNumber || licenseNumber.trim() === '') {
      return { success: false, error: "License number is required" };
    }

    // Step 1: Submit the search to DBPR
    // We'll mimic the form submission using application/x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('SearchType', 'LicNbr');
    params.append('LicNbr', licenseNumber);
    // These hidden fields seem to be part of their ASP state management
    params.append('hSearchType', 'LicNbr');
    params.append('hLicNbr', licenseNumber);
    params.append('hPageAction', '1');

    const res = await fetch('https://www.myfloridalicense.com/wl11.asp?mode=1&search=LicNbr', {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    });

    if (!res.ok) {
      return { success: false, error: "DBPR is currently unavailable, please try again later." };
    }

    const html = await res.text();

    // Step 2: Parse the HTML for License Status and Expiration Date
    // If there is an error message on the page
    if (html.includes('There were no records found matching the search criteria')) {
      return { success: false, error: "No records found for this license number." };
    }

    // Typical DBPR results table structure has cells for Name, License Number, License Status, Expiration Date.
    // Since we don't have a full HTML parser, we will use regex to extract the status and date.
    // Example: <td class="list">Current, Active</td>
    
    // We will extract the block of text containing the search results
    // Let's do a basic regex to find the expiration date (e.g. 09/30/2026) and status.
    let status = "Unknown";
    let expirationStr = null;

    if (html.match(/Current\s*,\s*Active/i)) status = 'Active';
    else if (html.match(/Current\s*,\s*Inactive/i)) status = 'Inactive';
    else if (html.match(/Null\s*and\s*Void/i)) status = 'Null and Void';
    else if (html.match(/Delinquent\s*,\s*Active/i)) status = 'Delinquent, Active';
    else if (html.match(/Probation/i)) status = 'Probation';

    // Regex for typical US dates MM/DD/YYYY in the HTML
    const dateRegex = /(\d{2}\/\d{2}\/\d{4})/g;
    const dates = html.match(dateRegex);
    
    if (dates && dates.length > 0) {
      // Expiration date is usually the last date or only date in the row
      expirationStr = dates[dates.length - 1]; 
    }

    const expirationDate = expirationStr ? new Date(expirationStr) : null;

    // Step 3: Update our database
    await prisma.user.update({
      where: { id: userId },
      data: {
        licenseStatus: status,
        licenseExpiration: expirationDate,
        lastVerifiedAt: new Date(),
      }
    });

    revalidatePath('/profile');
    revalidatePath('/admin');

    return { 
      success: true, 
      status, 
      expirationDate: expirationStr,
      lastVerifiedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error("Failed to verify license:", error);
    return { success: false, error: "DBPR is currently unavailable, please try again later." };
  }
}
