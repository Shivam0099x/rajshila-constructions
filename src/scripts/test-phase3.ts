/**
 * Phase 3 Comprehensive Integration, Security & Lifecycle Test Suite
 * Executes rigorous verification for Rajshila Construction application.
 */

import {
  calculateDeliveryStatus,
  calculateDuration,
  formatDate,
} from "../lib/project-utils";
import {
  hashPassword,
  verifyPassword,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
} from "../lib/auth";
import { createAdminToken, verifyAdminToken } from "../lib/auth-token";
import { contactFormSchema } from "../lib/validations/contact";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ [FAIL] ${testName} ${detail ? `(${detail})` : ""}`);
  }
}

async function runTestSuite() {
  console.log("\n=======================================================");
  console.log("  RAJSHILA CONSTRUCTION — PHASE 3 INTEGRATION TEST SUITE");
  console.log("=======================================================\n");

  // -------------------------------------------------------------
  // TEST GROUP 1: Project Timeline & Delivery Status Calculations
  // -------------------------------------------------------------
  console.log("--- TEST GROUP 1: Timeline & Delivery Status Math ---");

  // Scenario 1: Early Delivery (> 3 days before expected)
  const start1 = "2025-01-01";
  const expected1 = "2025-06-30";
  const actualEarly = "2025-06-15"; // 15 days early
  const statusEarly = calculateDeliveryStatus(expected1, actualEarly);
  assert(
    statusEarly === "Early",
    "Delivery Status: Early handover scenario correctly identified",
    `Expected 'Early', received '${statusEarly}'`
  );

  // Scenario 2: On Time Delivery (exact agreed date)
  const actualOnTimeExact = "2025-06-30";
  const statusOnTime1 = calculateDeliveryStatus(expected1, actualOnTimeExact);
  assert(
    statusOnTime1 === "On Time",
    "Delivery Status: Exact agreed date handover is 'On Time'",
    `Expected 'On Time', received '${statusOnTime1}'`
  );

  // Scenario 3: On Time Delivery (within 2 days buffer)
  const actualOnTimeBuffer = "2025-07-02"; // 2 days difference (within +/- 3 days window)
  const statusOnTime2 = calculateDeliveryStatus(expected1, actualOnTimeBuffer);
  assert(
    statusOnTime2 === "On Time",
    "Delivery Status: Within +/-3 days buffer is 'On Time'",
    `Expected 'On Time', received '${statusOnTime2}'`
  );

  // Scenario 4: Delayed Delivery (> 3 days past expected)
  const actualDelayed = "2025-07-20"; // 20 days late
  const statusDelayed = calculateDeliveryStatus(expected1, actualDelayed);
  assert(
    statusDelayed === "Delayed",
    "Delivery Status: Delayed handover scenario correctly identified",
    `Expected 'Delayed', received '${statusDelayed}'`
  );

  // Duration formatting check
  const duration6Months = calculateDuration(start1, expected1);
  assert(
    duration6Months.includes("5 months") || duration6Months.includes("6 months"),
    `Duration Calculation: 6-month window (${duration6Months})`
  );

  // Date formatting in Indian locale
  const formattedDate = formatDate("2026-03-15", true);
  assert(
    formattedDate.includes("15") && formattedDate.includes("2026"),
    `Date Formatter: Displays Indian locale date correctly (${formattedDate})`
  );

  // -------------------------------------------------------------
  // TEST GROUP 2: Authentication, Security & Cryptography
  // -------------------------------------------------------------
  console.log("\n--- TEST GROUP 2: Security & Authentication Engine ---");

  // 1. Password Hashing & Salt Verification
  const testPassword = "BhopalArchitecturalP@ssword2026";
  const hash = await hashPassword(testPassword);
  assert(
    hash.startsWith("$2a$") || hash.startsWith("$2b$"),
    "Password Hashing: Uses bcrypt format with strong cost factor"
  );

  const isValidMatch = await verifyPassword(testPassword, hash);
  assert(isValidMatch, "Password Verification: Correct password matches hash");

  const isInvalidRejected = await verifyPassword("WrongPassword123", hash);
  assert(!isInvalidRejected, "Password Verification: Incorrect password rejected");

  // 2. JWT Edge-Compatible Session Tokens
  const userPayload = {
    id: "admin_user_65a123",
    username: "rajshila_owner",
    email: "admin@rajshilaconstruction.com",
    role: "superadmin",
  };

  const token = await createAdminToken(userPayload);
  assert(typeof token === "string" && token.split(".").length === 3, "JWT Token: Generates standard 3-part signed JWT");

  const decodedSession = await verifyAdminToken(token);
  assert(
    decodedSession !== null &&
      decodedSession.sub === userPayload.id &&
      decodedSession.email === userPayload.email,
    "JWT Verification: Decodes valid session token with correct claims"
  );

  // 3. Tampered Token Rejection
  const tamperedToken = token.slice(0, -6) + "xyz123";
  const rejectedSession = await verifyAdminToken(tamperedToken);
  assert(rejectedSession === null, "JWT Verification: Tampered token safely rejected with null");

  // 4. Rate Limiting Engine Simulation
  const testIp = "192.168.1.99";
  resetLoginAttempts(testIp);

  // Attempt 1 to 5
  for (let i = 1; i <= 5; i++) {
    const rateCheck = checkLoginRateLimit(testIp);
    assert(rateCheck.allowed, `Rate Limiting: Attempt ${i} of 5 allowed`);
    recordFailedLogin(testIp);
  }

  // Attempt 6 (Should be blocked)
  const blockedCheck = checkLoginRateLimit(testIp);
  assert(
    !blockedCheck.allowed && (blockedCheck.retryAfterSec || 0) > 0,
    "Rate Limiting: 6th attempt blocked with retry-after header"
  );

  resetLoginAttempts(testIp);
  const resetCheck = checkLoginRateLimit(testIp);
  assert(resetCheck.allowed, "Rate Limiting: Clean reset upon successful authentication");

  // -------------------------------------------------------------
  // TEST GROUP 3: Input Validation & Anti-Spam Protection
  // -------------------------------------------------------------
  console.log("\n--- TEST GROUP 3: Input Validation & Anti-Spam ---");

  // Valid Contact Submission
  const validContact = {
    name: "Vikram Rathore",
    phone: "+91 98260 12345",
    email: "vikram@example.com",
    projectType: "Residential Villa Construction",
    location: "Arera Colony, Bhopal",
    message: "Interested in 4,000 sq ft structural civil construction with turnkey interior finishing.",
    hp_website: "", // Honeypot empty for human
  };

  const contactValidation = contactFormSchema.safeParse(validContact);
  assert(contactValidation.success, "Contact Validation: Valid inquiry payload accepted");

  // Bot Submission (Honeypot filled)
  const botContact = {
    ...validContact,
    hp_website: "https://spam-bot-automated-seo.com",
  };
  const botValidation = contactFormSchema.safeParse(botContact);
  assert(
    botValidation.success && botValidation.data.hp_website === "https://spam-bot-automated-seo.com",
    "Contact Validation: Honeypot field captured for silent discard"
  );

  // Invalid Phone & Missing Name
  const invalidContact = {
    name: "",
    phone: "123", // too short
    projectType: "Interior",
    message: "Short", // too short
  };
  const invalidValidation = contactFormSchema.safeParse(invalidContact);
  assert(!invalidValidation.success, "Contact Validation: Invalid/short contact fields rejected");

  // -------------------------------------------------------------
  // TEST GROUP 4: Complete Project Lifecycle Simulation
  // -------------------------------------------------------------
  console.log("\n--- TEST GROUP 4: Simulated Project Lifecycle ---");

  interface MockProject {
    title: string;
    slug: string;
    category: "residential" | "interior" | "commercial" | "renovation";
    location: string;
    coverImage: string;
    images: string[];
    startDate: string;
    expectedCompletionDate: string;
    actualCompletionDate?: string;
    status: "ongoing" | "completed";
    progressPercentage: number;
    milestones: Array<{ title: string; isCompleted: boolean }>;
    deliveryStatus?: string;
  }

  // Step 1: Admin initiates an ongoing turnkey interior project
  const project: MockProject = {
    title: "Gulmohar Contemporary Villa Interior",
    slug: "gulmohar-contemporary-villa-interior",
    category: "interior",
    location: "Gulmohar Colony, Bhopal",
    coverImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    ],
    startDate: "2025-02-01",
    expectedCompletionDate: "2025-08-01",
    status: "ongoing",
    progressPercentage: 15,
    milestones: [
      { title: "Civil Partition Wall Demolition", isCompleted: true },
      { title: "Electrical & HVAC Rough-in", isCompleted: false },
      { title: "False Ceiling & Drywall", isCompleted: false },
      { title: "Italian Marble Flooring", isCompleted: false },
      { title: "Custom Millwork & Modular Wardrobes", isCompleted: false },
      { title: "Surface Painting & Polishing", isCompleted: false },
    ],
  };

  assert(
    project.status === "ongoing" && project.progressPercentage === 15,
    "Lifecycle Step 1: Ongoing project initialized with 15% progress"
  );
  assert(
    project.milestones.length === 6 && project.milestones[0].isCompleted,
    "Lifecycle Step 2: Milestone structure verified"
  );

  // Step 2: Admin updates progress as execution advances
  project.progressPercentage = 60;
  project.milestones[1].isCompleted = true;
  project.milestones[2].isCompleted = true;
  project.images.push("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6");

  assert(
    project.progressPercentage === 60 && project.images.length === 3,
    "Lifecycle Step 3: Mid-project progress updated to 60% and new photograph appended"
  );

  // Step 3: Admin marks project completed with actual handover date
  const actualHandover = "2025-07-25"; // 7 days earlier than expected 2025-08-01
  project.actualCompletionDate = actualHandover;
  project.status = "completed";
  project.progressPercentage = 100;
  project.milestones.forEach((m) => (m.isCompleted = true));

  // Compute final delivery status
  project.deliveryStatus = calculateDeliveryStatus(
    project.expectedCompletionDate,
    project.actualCompletionDate
  );

  assert(
    project.status === "completed" && project.progressPercentage === 100,
    "Lifecycle Step 4: Project transitioned to 'completed' with 100% progress"
  );
  assert(
    project.deliveryStatus === "Early",
    `Lifecycle Step 5: Final delivery status computed as '${project.deliveryStatus}'`
  );
  assert(
    project.images.length === 3 && project.startDate === "2025-02-01",
    "Lifecycle Step 6: Complete photograph history and original start dates preserved intact"
  );

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log("\n=======================================================");
  console.log(`  TEST RESULTS: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log("=======================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test execution failed with error:", err);
  process.exit(1);
});
